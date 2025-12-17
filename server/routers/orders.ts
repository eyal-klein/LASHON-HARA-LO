import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { orders, orderItems, products } from "../../drizzle/schema";
import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";

const OrderItemInput = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

const OrderInput = z.object({
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(20),
  shippingAddress: z.string(),
  shippingCity: z.string().max(100),
  shippingZip: z.string().max(20),
  billingAddress: z.string().optional(),
  items: z.array(OrderItemInput).min(1),
  notes: z.string().optional(),
});

export const ordersRouter = router({
  // Public: Create order
  create: publicProcedure
    .input(OrderInput)
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Calculate totals
      const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingCost = subtotal > 200 ? 0 : 30; // Free shipping over 200 ILS
      const total = subtotal + shippingCost;

      // Create order
      const result = await db.insert(orders).values({
        orderNumber: `ORD-${Date.now()}`,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        shippingCity: input.shippingCity,
        shippingZip: input.shippingZip,
        billingAddress: input.billingAddress || input.shippingAddress,
        subtotal,
        shippingCost,
        total,
        status: "pending",
        paymentStatus: "pending",
        notes: input.notes,
      });

      const orderId = result[0].insertId;

      // Create order items
      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        });

        // Update product stock
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (product) {
          await db
            .update(products)
            .set({
              stockQuantity: Math.max(0, product.stockQuantity - item.quantity),
            })
            .where(eq(products.id, item.productId));
        }
      }

      return {
        orderId,
        orderNumber: `ORD-${Date.now()}`,
        success: true,
      };
    }),

  // Public: Get order by number
  getByNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, input.orderNumber));

      if (!order) {
        return null;
      }

      // Get order items
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          productName: products.name,
          quantity: orderItems.quantity,
          price: orderItems.price,
          subtotal: orderItems.subtotal,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      return {
        ...order,
        items,
      };
    }),

  // Admin: List all orders
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { items: [], total: 0, page: 1, limit: 20 };
      }

      const { page, limit, status, paymentStatus, startDate, endDate } = input;
      const offset = (page - 1) * limit;

      let conditions = [];
      if (status) {
        conditions.push(eq(orders.status, status));
      }
      if (paymentStatus) {
        conditions.push(eq(orders.paymentStatus, paymentStatus));
      }
      if (startDate) {
        conditions.push(gte(orders.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(orders.createdAt, new Date(endDate)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, totalResult] = await Promise.all([
        db
          .select()
          .from(orders)
          .where(whereClause)
          .orderBy(desc(orders.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(orders).where(whereClause),
      ]);

      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    }),

  // Admin: Get order details
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));

      if (!order) {
        return null;
      }

      // Get order items with product details
      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          productName: products.name,
          quantity: orderItems.quantity,
          price: orderItems.price,
          subtotal: orderItems.subtotal,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      return {
        ...order,
        items,
      };
    }),

  // Admin: Update order status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
        trackingNumber: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const updateData: any = {
        status: input.status,
        updatedAt: new Date(),
      };

      if (input.trackingNumber) {
        updateData.trackingNumber = input.trackingNumber;
      }

      if (input.status === "shipped") {
        updateData.shippedAt = new Date();
      } else if (input.status === "delivered") {
        updateData.deliveredAt = new Date();
      }

      await db
        .update(orders)
        .set(updateData)
        .where(eq(orders.id, input.id));

      const [updated] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));

      return updated;
    }),

  // Admin: Update payment status
  updatePaymentStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      await db
        .update(orders)
        .set({
          paymentStatus: input.paymentStatus,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, input.id));

      const [updated] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));

      return updated;
    }),

  // Admin: Get order statistics
  getStats: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
        };
      }

      const { startDate, endDate } = input;

      let conditions = [];
      if (startDate) {
        conditions.push(gte(orders.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(orders.createdAt, new Date(endDate)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [stats] = await db
        .select({
          totalOrders: count(),
          totalRevenue: sql<number>`COALESCE(SUM(${orders.total}), 0)`,
          averageOrderValue: sql<number>`COALESCE(AVG(${orders.total}), 0)`,
          pendingOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'pending' THEN 1 ELSE 0 END)`,
          processingOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'processing' THEN 1 ELSE 0 END)`,
          shippedOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'shipped' THEN 1 ELSE 0 END)`,
          deliveredOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'delivered' THEN 1 ELSE 0 END)`,
          cancelledOrders: sql<number>`SUM(CASE WHEN ${orders.status} = 'cancelled' THEN 1 ELSE 0 END)`,
        })
        .from(orders)
        .where(whereClause);

      return {
        totalOrders: Number(stats?.totalOrders || 0),
        totalRevenue: Number(stats?.totalRevenue || 0),
        averageOrderValue: Number(stats?.averageOrderValue || 0),
        pendingOrders: Number(stats?.pendingOrders || 0),
        processingOrders: Number(stats?.processingOrders || 0),
        shippedOrders: Number(stats?.shippedOrders || 0),
        deliveredOrders: Number(stats?.deliveredOrders || 0),
        cancelledOrders: Number(stats?.cancelledOrders || 0),
      };
    }),

  // Admin: Export orders
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
      if (!db) return "";

      const { startDate, endDate } = input;

      let conditions = [];
      if (startDate) {
        conditions.push(gte(orders.createdAt, new Date(startDate)));
      }
      if (endDate) {
        conditions.push(lte(orders.createdAt, new Date(endDate)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(orders)
        .where(whereClause)
        .orderBy(desc(orders.createdAt));

      const headers = [
        "מספר הזמנה",
        "תאריך",
        "לקוח",
        "אימייל",
        "טלפון",
        "סכום",
        "סטטוס",
        "סטטוס תשלום",
      ];

      const rows = items.map((item) => [
        item.orderNumber,
        item.createdAt?.toISOString().split("T")[0] || "",
        item.customerName,
        item.customerEmail,
        item.customerPhone,
        item.total,
        item.status,
        item.paymentStatus,
      ]);

      return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    }),
});
