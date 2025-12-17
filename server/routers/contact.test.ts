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

describe("contact router - E2E", () => {
  describe("Public endpoints", () => {
    it("should submit contact message", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        phone: "050-1234567",
        subject: "Test Subject",
        message: "This is a test message for E2E testing",
      });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("id");
      expect(typeof result.id).toBe("number");
    });

    it("should validate email format", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.contact.submit({
          name: "Test User",
          email: "invalid-email",
          subject: "Test",
          message: "Test message",
        })
      ).rejects.toThrow();
    });

    it("should require all mandatory fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.contact.submit({
          name: "",
          email: "test@example.com",
          subject: "Test",
          message: "Test message",
        })
      ).rejects.toThrow();
    });
  });

  describe("Admin endpoints", () => {
    it("should list contact messages (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("should filter unread messages", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        page: 1,
        limit: 10,
        unreadOnly: true,
      });

      expect(result.items.every((msg) => !msg.isRead)).toBe(true);
    });

    it("should mark message as read (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // First create a message
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);

      const created = await publicCaller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        subject: "Mark as Read Test",
        message: "This message will be marked as read",
      });

      // Then mark it as read
      const updated = await caller.contact.markAsRead({ id: created.id });

      expect(updated.isRead).toBe(true);
      expect(updated.readAt).toBeDefined();
    });

    it("should archive message (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create a message
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);

      const created = await publicCaller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        subject: "Archive Test",
        message: "This message will be archived",
      });

      // Archive it
      const archived = await caller.contact.archive({ id: created.id });

      expect(archived.isArchived).toBe(true);
    });

    it("should get unread count (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const count = await caller.contact.getUnreadCount();

      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Priority levels", () => {
    it("should support different priority levels", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const priorities = ["low", "normal", "high"] as const;

      for (const priority of priorities) {
        const result = await caller.contact.submit({
          name: "Test User",
          email: "test@example.com",
          subject: `${priority} priority test`,
          message: "Test message",
          priority,
        });

        expect(result.success).toBe(true);
      }
    });
  });
});
