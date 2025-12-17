import { 
  int, mysqlEnum, mysqlTable, text, timestamp, 
  varchar, boolean, json, index, uniqueIndex, decimal
} from "drizzle-orm/mysql-core";

// ========== USERS ==========
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 15 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("idx_users_email").on(table.email),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========== COMMITMENTS ==========
export const commitments = mysqlTable("commitments", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  receiveUpdates: boolean("receiveUpdates").default(false).notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  source: varchar("source", { length: 50 }).default("website"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
}, (table) => ({
  emailIdx: index("idx_commitments_email").on(table.email),
  createdAtIdx: index("idx_commitments_created").on(table.createdAt),
}));

export type Commitment = typeof commitments.$inferSelect;
export type InsertCommitment = typeof commitments.$inferInsert;

// ========== SUBSCRIBERS ==========
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  status: mysqlEnum("status", ["pending", "active", "unsubscribed"])
    .default("pending").notNull(),
  confirmToken: varchar("confirmToken", { length: 64 }),
  unsubscribeToken: varchar("unsubscribeToken", { length: 64 }).notNull(),
  source: varchar("source", { length: 50 }).default("website"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
  unsubscribedAt: timestamp("unsubscribedAt"),
}, (table) => ({
  statusIdx: index("idx_subscribers_status").on(table.status),
}));

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

// ========== DONATIONS ==========
export const donations = mysqlTable("donations", {
  id: int("id").autoincrement().primaryKey(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 100 }).unique(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 100 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 100 }),
  amount: int("amount").notNull(), // בשקלים (אגורות)
  currency: varchar("currency", { length: 3 }).default("ILS").notNull(),
  frequency: mysqlEnum("frequency", ["one_time", "monthly"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed", "refunded", "cancelled"])
    .default("pending").notNull(),
  donorName: varchar("donorName", { length: 100 }),
  donorEmail: varchar("donorEmail", { length: 320 }),
  donorPhone: varchar("donorPhone", { length: 15 }),
  dedicatedTo: text("dedicatedTo"),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  receiptUrl: text("receiptUrl"),
  receiptNumber: varchar("receiptNumber", { length: 50 }),
  notes: text("notes"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  refundedAt: timestamp("refundedAt"),
}, (table) => ({
  statusIdx: index("idx_donations_status").on(table.status),
  createdAtIdx: index("idx_donations_created").on(table.createdAt),
  emailIdx: index("idx_donations_email").on(table.donorEmail),
}));

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;

// ========== CONTACT MESSAGES ==========
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high"]).default("normal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
  readBy: int("readBy").references(() => users.id),
  repliedAt: timestamp("repliedAt"),
}, (table) => ({
  isReadIdx: index("idx_contact_is_read").on(table.isRead),
  createdAtIdx: index("idx_contact_created").on(table.createdAt),
}));

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

// ========== PARTNERSHIPS ==========
export const partnerships = mysqlTable("partnerships", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["ambassador", "financial", "school", "inspiration"])
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  organization: varchar("organization", { length: 200 }),
  role: varchar("role", { length: 100 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "reviewing", "approved", "rejected", "contacted"])
    .default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  handledBy: int("handledBy").references(() => users.id),
  handledAt: timestamp("handledAt"),
}, (table) => ({
  typeStatusIdx: index("idx_partnerships_type_status").on(table.type, table.status),
  createdAtIdx: index("idx_partnerships_created").on(table.createdAt),
}));

export type Partnership = typeof partnerships.$inferSelect;
export type InsertPartnership = typeof partnerships.$inferInsert;

// ========== GALLERY ITEMS ==========
export const galleryItems = mysqlTable("gallery_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  category: mysqlEnum("category", ["ambassadors", "events", "schools", "partners", "campaigns", "workshops"])
    .notNull(),
  personName: varchar("personName", { length: 100 }),
  personRole: varchar("personRole", { length: 100 }),
  eventDate: timestamp("eventDate"),
  location: varchar("location", { length: 200 }),
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").references(() => users.id),
}, (table) => ({
  categoryPublishedIdx: index("idx_gallery_category_published").on(table.category, table.isPublished),
  sortOrderIdx: index("idx_gallery_sort").on(table.sortOrder),
  featuredIdx: index("idx_gallery_featured").on(table.isFeatured),
}));

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;

// ========== ACTIVITIES ==========
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description").notNull(),
  shortDescription: varchar("shortDescription", { length: 300 }),
  type: mysqlEnum("type", ["distribution", "workshop", "exhibition", "campaign", "event", "school_program"])
    .notNull(),
  imageUrl: text("imageUrl"),
  galleryImages: json("galleryImages"), // string[]
  date: timestamp("date"),
  endDate: timestamp("endDate"),
  location: varchar("location", { length: 200 }),
  participantCount: int("participantCount"),
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdBy: int("createdBy").references(() => users.id),
}, (table) => ({
  typePublishedIdx: index("idx_activities_type_published").on(table.type, table.isPublished),
  dateIdx: index("idx_activities_date").on(table.date),
  slugIdx: uniqueIndex("idx_activities_slug").on(table.slug),
}));

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

// ========== CONTENT (CMS) ==========
export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  section: varchar("section", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }),
  subtitle: varchar("subtitle", { length: 300 }),
  content: text("content"),
  imageUrl: text("imageUrl"),
  buttonText: varchar("buttonText", { length: 50 }),
  buttonUrl: varchar("buttonUrl", { length: 500 }),
  metadata: json("metadata"),
  isPublished: boolean("isPublished").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  updatedBy: int("updatedBy").references(() => users.id),
}, (table) => ({
  sectionIdx: index("idx_content_section").on(table.section),
  keyIdx: uniqueIndex("idx_content_key").on(table.key),
}));

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

// ========== EMAIL LOGS ==========
export const emailLogs = mysqlTable("email_logs", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", [
    "commitment_confirmation", 
    "newsletter", 
    "donation_receipt", 
    "contact_notification",
    "partnership_notification"
  ]).notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed", "bounced"])
    .default("pending").notNull(),
  sendgridMessageId: varchar("sendgridMessageId", { length: 100 }),
  errorMessage: text("errorMessage"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
}, (table) => ({
  typeStatusIdx: index("idx_email_type_status").on(table.type, table.status),
  createdAtIdx: index("idx_email_created").on(table.createdAt),
}));

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

// ========== RAG SYSTEM TABLES ==========

// Chofetz Chaim Content - הלכות לשון הרע (RAG chunks)
export const chofetzChaimContent = mysqlTable("chofetz_chaim_content", {
  id: int("id").autoincrement().primaryKey(),
  section: mysqlEnum("section", ["lashon_hara", "rechilut"]).notNull(),
  klal: varchar("klal", { length: 10 }).notNull(), // Hebrew letter (א, ב, ג...)
  seif: varchar("seif", { length: 10 }).notNull(), // Hebrew letter (א, ב, ג...)
  chunkIndex: int("chunk_index").notNull().default(0),
  content: text("content").notNull(), // Clean Hebrew text chunk
  embedding: json("embedding"), // Vector embedding for semantic search
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  sectionKlalIdx: index("idx_cc_section_klal").on(table.section, table.klal),
}));

export type ChofetzChaimContent = typeof chofetzChaimContent.$inferSelect;
export type InsertChofetzChaimContent = typeof chofetzChaimContent.$inferInsert;

// Chofetz Chaim Commentary - פירושים
export const chofetzChaimCommentary = mysqlTable("chofetz_chaim_commentary", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull().references(() => chofetzChaimContent.id),
  commentaryType: mysqlEnum("commentaryType", [
    "beer_mayim_chaim", 
    "mekor_hachaim", 
    "hagahot",
    "modern_explanation"
  ]).notNull(),
  hebrewText: text("hebrewText").notNull(),
  englishTranslation: text("englishTranslation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  contentIdIdx: index("idx_commentary_content").on(table.contentId),
  typeIdx: index("idx_commentary_type").on(table.commentaryType),
}));

export type ChofetzChaimCommentary = typeof chofetzChaimCommentary.$inferSelect;
export type InsertChofetzChaimCommentary = typeof chofetzChaimCommentary.$inferInsert;

// RAG Conversations - שיחות עם המערכת
export const ragConversations = mysqlTable("rag_conversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId").references(() => users.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sources: json("sources"), // array of content IDs
  feedback: mysqlEnum("feedback", ["helpful", "not_helpful"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  sessionIdx: index("idx_rag_session").on(table.sessionId),
  userIdx: index("idx_rag_user").on(table.userId),
}));

export type RagConversation = typeof ragConversations.$inferSelect;
export type InsertRagConversation = typeof ragConversations.$inferInsert;

// Chofetz Chaim Topics - נושאים לסיווג
export const chofetzChaimTopics = mysqlTable("chofetz_chaim_topics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  hebrewName: varchar("hebrewName", { length: 100 }).notNull(),
  description: text("description"),
  parentId: int("parentId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  parentIdx: index("idx_topics_parent").on(table.parentId),
}));

export type ChofetzChaimTopic = typeof chofetzChaimTopics.$inferSelect;
export type InsertChofetzChaimTopic = typeof chofetzChaimTopics.$inferInsert;

// ========== PRODUCT CATEGORIES ==========
export const productCategories = mysqlTable("product_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  parentId: int("parentId"), // For nested categories
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  productCount: int("productCount").default(0).notNull(), // Cached count
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("idx_product_categories_slug").on(table.slug),
  activeIdx: index("idx_product_categories_active").on(table.isActive),
}));

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

// ========== PRODUCTS (SHOP) ==========
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  sku: varchar("sku", { length: 100 }),
  barcode: varchar("barcode", { length: 100 }),
  categoryId: int("categoryId").references(() => productCategories.id),
  images: json("images").notNull(), // Array of image URLs
  stockQuantity: int("stockQuantity").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(5).notNull(),
  weight: decimal("weight", { precision: 10, scale: 2 }), // in kg
  dimensions: varchar("dimensions", { length: 100 }), // e.g., "10x20x5 cm"
  isPublished: boolean("isPublished").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  tags: text("tags"), // comma-separated
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  categoryIdx: index("idx_products_category").on(table.categoryId),
  skuIdx: index("idx_products_sku").on(table.sku),
  publishedIdx: index("idx_products_published").on(table.isPublished),
}));

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ========== ORDERS ==========
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  shippingAddress: text("shippingAddress").notNull(),
  shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
  shippingZip: varchar("shippingZip", { length: 20 }).notNull(),
  billingAddress: text("billingAddress"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  shippedAt: timestamp("shippedAt"),
  deliveredAt: timestamp("deliveredAt"),
}, (table) => ({
  orderNumberIdx: uniqueIndex("idx_orders_number").on(table.orderNumber),
  emailIdx: index("idx_orders_email").on(table.customerEmail),
  statusIdx: index("idx_orders_status").on(table.status),
  createdAtIdx: index("idx_orders_created").on(table.createdAt),
}));

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ========== ORDER ITEMS ==========
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  orderIdx: index("idx_order_items_order").on(table.orderId),
  productIdx: index("idx_order_items_product").on(table.productId),
}));

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;
