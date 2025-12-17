import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { donations } from "../../drizzle/schema";
import { eq, and, gte, lte, desc, sql, count } from "drizzle-orm";

// Mock Stripe - will be replaced with real Stripe when keys are provided
const mockStripe = {
  async createPaymentIntent(amount: number, currency: string) {
    return {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      status: "requires_payment_method",
    };
  },
  
  async confirmPayment(paymentIntentId: string) {
    return {
      id: paymentIntentId,
      status: "succeeded",
      amount: 100,
      currency: "ILS",
    };
  },
  
  async createSubscription(customerId: string, priceId: string) {
    return {
      id: `sub_mock_${Date.now()}`,
      client_secret: `sub_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      status: "active",
    };
  },
  
  async refund(paymentIntentId: string, amount?: number) {
    return {
      id: `re_mock_${Date.now()}`,
      status: "succeeded",
      amount: amount || 0,
    };
  },
};

// Input schemas
const DonationInput = z.object({
  amount: z.number().min(10, "סכום מינימלי 10 ש\"ח").max(100000),
  currency: z.enum(["ILS", "USD", "EUR"]).default("ILS"),
  frequency: z.enum(["one_time", "monthly"]),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  donorPhone: z.string().optional(),
  dedicatedTo: z.string().max(200).optional(),
  isAnonymous: z.boolean().default(false),
});

const SubscriptionInput = z.object({
  amount: z.number().min(10).max(100000),
  currency: z.enum(["ILS", "USD", "EUR"]).default("ILS"),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
});

const PaginationInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

const DateRangeInput = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const donationsRouter = router({
  // Create payment intent for one-time or first payment
  createPaymentIntent: publicProcedure
    .input(DonationInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Mock Stripe payment intent
      const paymentIntent = await mockStripe.createPaymentIntent(
        input.amount * 100, // Convert to cents
        input.currency
      );

      // Create pending donation record
      const result = await db.insert(donations).values({
        amount: input.amount,
        currency: input.currency,
        frequency: input.frequency,
        donorName: input.isAnonymous ? "תורם אנונימי" : input.donorName,
        donorEmail: input.donorEmail,
        donorPhone: input.donorPhone,
        dedicatedTo: input.dedicatedTo,
        isAnonymous: input.isAnonymous,
        paymentIntentId: paymentIntent.id,
        status: "pending",
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        donationId: result[0].insertId,
      };
    }),

  // Confirm payment after Stripe confirmation
  confirmPayment: publicProcedure
    .input(z.object({ paymentIntentId: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Mock Stripe confirmation
      const payment = await mockStripe.confirmPayment(input.paymentIntentId);

      // Update donation status
      await db
        .update(donations)
        .set({
          status: "completed",
          paidAt: new Date(),
        })
        .where(eq(donations.paymentIntentId, input.paymentIntentId));

      // Return updated donation
      const [donation] = await db
        .select()
        .from(donations)
        .where(eq(donations.paymentIntentId, input.paymentIntentId));

      return donation;
    }),

  // Create subscription for monthly donations
  createSubscription: publicProcedure
    .input(SubscriptionInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Mock Stripe subscription
      const subscription = await mockStripe.createSubscription(
        `cus_mock_${Date.now()}`,
        `price_mock_${input.amount}`
      );

      // Create donation record
      const result = await db.insert(donations).values({
        amount: input.amount,
        currency: input.currency,
        frequency: "monthly",
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        subscriptionId: subscription.id,
        status: "completed",
        paidAt: new Date(),
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.client_secret,
        donationId: result[0].insertId,
      };
    }),

  // List donations (Admin only)
  list: protectedProcedure
    .input(PaginationInput.merge(DateRangeInput))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { items: [], total: 0, page: 1, limit: 20 };
      }

      const { page, limit, startDate, endDate } = input;
      const offset = (page - 1) * limit;

      let conditions = [];
      if (startDate) {
        conditions.push(gte(donations.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(donations.createdAt, new Date(endDate)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(donations)
          .where(whereClause)
          .orderBy(desc(donations.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: count() })
          .from(donations)
          .where(whereClause),
      ]);

      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Get donation statistics (Admin only)
  getStats: protectedProcedure
    .input(DateRangeInput.optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalAmount: 0,
          totalDonations: 0,
          averageAmount: 0,
          oneTimeDonations: 0,
          monthlyDonations: 0,
        };
      }

      const { startDate, endDate } = input || {};

      let conditions = [eq(donations.status, "completed")];
      if (startDate) {
        conditions.push(gte(donations.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(donations.createdAt, new Date(endDate)));
      }

      const whereClause = and(...conditions);

      const [stats] = await db
        .select({
          totalAmount: sql<number>`COALESCE(SUM(${donations.amount}), 0)`,
          totalDonations: count(),
          averageAmount: sql<number>`COALESCE(AVG(${donations.amount}), 0)`,
          oneTimeDonations: sql<number>`SUM(CASE WHEN ${donations.frequency} = 'one_time' THEN 1 ELSE 0 END)`,
          monthlyDonations: sql<number>`SUM(CASE WHEN ${donations.frequency} = 'monthly' THEN 1 ELSE 0 END)`,
        })
        .from(donations)
        .where(whereClause);

      return {
        totalAmount: Number(stats?.totalAmount || 0),
        totalDonations: Number(stats?.totalDonations || 0),
        averageAmount: Number(stats?.averageAmount || 0),
        oneTimeDonations: Number(stats?.oneTimeDonations || 0),
        monthlyDonations: Number(stats?.monthlyDonations || 0),
      };
    }),

  // Refund donation (Admin only)
  refund: protectedProcedure
    .input(
      z.object({
        donationId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Get donation
      const [donation] = await db
        .select()
        .from(donations)
        .where(eq(donations.id, input.donationId));

      if (!donation) {
        throw new Error("Donation not found");
      }

      if (donation.status !== "completed") {
        throw new Error("Can only refund completed donations");
      }

      // Mock Stripe refund
      if (donation.paymentIntentId) {
        await mockStripe.refund(donation.paymentIntentId, donation.amount * 100);
      }

      // Update donation
      await db
        .update(donations)
        .set({
          status: "refunded",
          refundReason: input.reason,
          refundedAt: new Date(),
        })
        .where(eq(donations.id, input.donationId));

      // Return updated donation
      const [updated] = await db
        .select()
        .from(donations)
        .where(eq(donations.id, input.donationId));

      return updated;
    }),

  // Export donations to CSV (Admin only)
  export: protectedProcedure
    .input(
      z.object({
        format: z.enum(["csv", "xlsx"]),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return "";
      }

      const { startDate, endDate } = input;

      let conditions = [];
      if (startDate) {
        conditions.push(gte(donations.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(donations.createdAt, new Date(endDate)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(donations)
        .where(whereClause)
        .orderBy(desc(donations.createdAt));

      // Convert to CSV
      const headers = [
        "ID",
        "תאריך",
        "סכום",
        "מטבע",
        "תדירות",
        "שם תורם",
        "אימייל",
        "טלפון",
        "הקדשה",
        "סטטוס",
      ];

      const rows = items.map((item) => [
        item.id,
        item.createdAt?.toISOString().split("T")[0] || "",
        item.amount,
        item.currency,
        item.frequency === "one_time" ? "חד פעמי" : "חודשי",
        item.donorName || "",
        item.donorEmail || "",
        item.donorPhone || "",
        item.dedicatedTo || "",
        item.status === "completed" ? "הושלם" : item.status === "pending" ? "ממתין" : "הוחזר",
      ]);

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

      return csv;
    }),
});
