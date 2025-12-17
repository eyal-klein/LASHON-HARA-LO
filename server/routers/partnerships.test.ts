import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

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

describe("partnerships router - E2E", () => {
  describe("Public endpoints", () => {
    it("should submit partnership request", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.partnerships.submit({
        type: "ambassador",
        name: "Test Partner",
        email: "partner@example.com",
        phone: "050-9876543",
        organization: "Test Organization",
        role: "CEO",
        message: "I would like to become an ambassador",
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("id");
    });

    it("should support all partnership types", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const types = [
        "ambassador",
        "financial",
        "school",
        "inspiration",
      ] as const;

      for (const type of types) {
        const result = await caller.partnerships.submit({
          type,
          name: `Test ${type} Partner`,
          email: `${type}@example.com`,
          phone: "050-1234567",
          message: `Partnership request for ${type}`,
        });

        expect(result.success).toBe(true);
      }
    });

    it("should validate email format", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.partnerships.submit({
          type: "ambassador",
          name: "Test Partner",
          email: "invalid-email",
          phone: "050-1234567",
          message: "Test message",
        })
      ).rejects.toThrow();
    });
  });

  describe("Admin endpoints", () => {
    it("should list partnership requests (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.partnerships.list({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("should filter by partnership type", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.partnerships.list({
        page: 1,
        limit: 10,
        type: "ambassador",
      });

      expect(result.items.every((p) => p.type === "ambassador")).toBe(true);
    });

    it("should filter by status", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.partnerships.list({
        page: 1,
        limit: 10,
        status: "pending",
      });

      expect(result.items.every((p) => p.status === "pending")).toBe(true);
    });

    it("should update partnership status (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a partnership request
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);

      const created = await publicCaller.partnerships.submit({
        type: "financial",
        name: "Test Financial Partner",
        email: "financial@example.com",
        phone: "050-1234567",
        message: "Financial partnership request",
      });

      // Update status
      const updated = await caller.partnerships.updateStatus({
        id: created.id,
        status: "approved",
        notes: "Approved by admin",
      });

      expect(updated.status).toBe("approved");
      expect(updated.notes).toBe("Approved by admin");
    });

    it("should get pending count (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const count = await caller.partnerships.getPendingCount();

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Status workflow", () => {
    it("should support full status workflow", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create partnership
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);

      const created = await publicCaller.partnerships.submit({
        type: "school",
        name: "Test School",
        email: "school@example.com",
        phone: "050-1234567",
        message: "School partnership request",
      });

      // Workflow: pending → reviewing → approved
      const statuses = ["reviewing", "approved"] as const;

      for (const status of statuses) {
        const updated = await caller.partnerships.updateStatus({
          id: created.id,
          status,
        });

        expect(updated.status).toBe(status);
      }
    });
  });
});
