import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import { getDb } from "../db";
import { activities } from "../../drizzle/schema";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@lashonhara.co.il",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("activities router - E2E", () => {
  let testActivityId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [activity] = await db
      .insert(activities)
      .values({
        title: "Test Activity E2E",
        slug: `test-activity-e2e-${Date.now()}`,
        description: "Test activity for E2E tests",
        shortDescription: "Short description",
        type: "workshop",
        date: new Date("2025-12-31"),
        location: "Tel Aviv",
        participantCount: 50,
        isPublished: true,
        isFeatured: false,
      })
      .$returningId();

    testActivityId = activity.id;
  });

  describe("Public endpoints", () => {
    it("should list published activities", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activities.list({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it("should filter activities by type", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activities.list({
        page: 1,
        limit: 10,
        type: "workshop",
      });

      expect(result.items.every((item) => item.type === "workshop")).toBe(true);
    });

    it("should get featured activities", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activities.list({
        page: 1,
        limit: 10,
        featured: true,
      });

      expect(result.items.every((item) => item.isFeatured)).toBe(true);
    });

    it("should get activity by slug", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Get the activity we created in beforeAll
      const activityById = await caller.activities.getById({ id: testActivityId });
      
      const activity = await caller.activities.getBySlug({
        slug: activityById!.slug,
      });

      expect(activity).toBeDefined();
      expect(activity?.id).toBe(testActivityId);
      expect(activity?.title).toBe("Test Activity E2E");
    });

    it("should get activity by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const activity = await caller.activities.getById({ id: testActivityId });

      expect(activity).toBeDefined();
      expect(activity?.id).toBe(testActivityId);
    });
  });

  describe("Admin endpoints", () => {
    it("should create new activity (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const newActivity = await caller.activities.create({
        title: "New Test Activity",
        slug: `new-test-activity-${Date.now()}`,
        description: "Created by admin",
        type: "campaign",
        date: new Date("2026-01-15"),
        location: "Jerusalem",
        isPublished: true,
      });

      expect(newActivity).toHaveProperty("id");
      expect(newActivity.title).toBe("New Test Activity");
      expect(newActivity.type).toBe("campaign");
    });

    it("should update activity (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const updated = await caller.activities.update({
        id: testActivityId,
        title: "Updated Test Activity",
        participantCount: 100,
      });

      expect(updated.title).toBe("Updated Test Activity");
      expect(updated.participantCount).toBe(100);
    });

    it("should delete activity (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [toDelete] = await db
        .insert(activities)
        .values({
          title: "Activity to Delete",
          slug: `activity-to-delete-${Date.now()}`,
          description: "Will be deleted",
          type: "event",
          isPublished: true,
        })
        .$returningId();

      await caller.activities.delete({ id: toDelete.id });

      const deleted = await caller.activities.getById({ id: toDelete.id });
      expect(deleted).toBeNull();
    });
  });

  describe("Activity types", () => {
    it("should support all activity types", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const types = [
        "distribution",
        "workshop",
        "exhibition",
        "campaign",
        "event",
        "school_program",
      ] as const;

      for (const type of types) {
        const result = await caller.activities.list({
          page: 1,
          limit: 10,
          type,
        });

        // Should not throw error
        expect(result).toHaveProperty("items");
      }
    });
  });

  describe("Date filtering", () => {
    it("should filter upcoming activities", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activities.list({
        page: 1,
        limit: 50,
      });

      const now = new Date();
      const upcomingActivities = result.items.filter(
        (activity) => activity.date && new Date(activity.date) > now
      );

      expect(upcomingActivities.length).toBeGreaterThan(0);
    });
  });
});
