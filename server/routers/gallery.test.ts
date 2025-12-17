import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import { getDb } from "../db";
import { galleryItems } from "../../drizzle/schema";

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

describe("gallery router - E2E", () => {
  let testGalleryItemId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const [item] = await db
      .insert(galleryItems)
      .values({
        title: "Test Gallery Item",
        description: "Test description for E2E",
        imageUrl: "https://example.com/gallery/test-image.jpg",
        category: "campaigns",
        isPublished: true,
        isFeatured: false,
        sortOrder: 999,
      })
      .$returningId();

    testGalleryItemId = item.id;
  });

  describe("Public endpoints", () => {
    it("should list published gallery items", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gallery.list({
        page: 1,
        limit: 10,
      });

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it("should filter gallery by category", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gallery.list({
        page: 1,
        limit: 10,
        category: "campaigns",
      });

      expect(result.items.every((item) => item.category === "campaigns")).toBe(
        true
      );
    });

    it("should get featured gallery items", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gallery.list({
        page: 1,
        limit: 10,
        featured: true,
      });

      expect(result.items.every((item) => item.isFeatured)).toBe(true);
    });

    it("should get gallery item by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const item = await caller.gallery.getById({ id: testGalleryItemId });

      expect(item).toBeDefined();
      expect(item?.id).toBe(testGalleryItemId);
      expect(item?.title).toBe("Test Gallery Item");
    });
  });

  describe("Admin endpoints", () => {
    it("should create new gallery item (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const newItem = await caller.gallery.create({
        title: "New Gallery Item",
        description: "Created by admin",
        imageUrl: "https://example.com/gallery/new-test.jpg",
        category: "events",
        isPublished: true,
        isFeatured: false,
      });

      expect(newItem).toHaveProperty("id");
      expect(newItem.title).toBe("New Gallery Item");
      expect(newItem.category).toBe("events");
    });

    it("should update gallery item (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const updated = await caller.gallery.update({
        id: testGalleryItemId,
        title: "Updated Gallery Item",
        isFeatured: true,
      });

      expect(updated.title).toBe("Updated Gallery Item");
      expect(updated.isFeatured).toBe(true);
    });

    it("should delete gallery item (admin only)", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [toDelete] = await db
        .insert(galleryItems)
        .values({
          title: "Item to Delete",
          description: "Will be deleted",
          imageUrl: "https://example.com/gallery/delete-test.jpg",
          category: "campaigns",
          isPublished: true,
        })
        .$returningId();

      await caller.gallery.delete({ id: toDelete.id });

      const deleted = await caller.gallery.getById({ id: toDelete.id });
      expect(deleted).toBeNull();
    });
  });

  describe("Gallery categories", () => {
    it("should list all available categories", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gallery.list({
        page: 1,
        limit: 50,
      });

      const categories = [
        ...new Set(result.items.map((item) => item.category)),
      ];
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe("Sorting and ordering", () => {
    it("should respect sortOrder field", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.gallery.list({
        page: 1,
        limit: 50,
      });

      // Check if items are sorted (lower sortOrder first)
      if (result.items && result.items.length > 1) {
        for (let i = 0; i < result.items.length - 1; i++) {
          expect(result.items[i]!.sortOrder).toBeLessThanOrEqual(
            result.items[i + 1]!.sortOrder
          );
        }
      }
    });
  });
});
