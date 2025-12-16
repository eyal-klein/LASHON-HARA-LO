# נספח: מערכת מכירות (E-commerce) - מפרט מלא

**גרסה**: 1.0  
**תאריך**: דצמבר 2024  
**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM

---

## תוכן עניינים

1. [סקירת המערכת](#1-סקירת-המערכת)
2. [קטלוג מוצרים](#2-קטלוג-מוצרים)
3. [עגלת קניות](#3-עגלת-קניות)
4. [תהליך Checkout](#4-תהליך-checkout)
5. [ניהול הזמנות](#5-ניהול-הזמנות)
6. [ניהול מלאי](#6-ניהול-מלאי)
7. [משלוחים](#7-משלוחים)
8. [קופונים והנחות](#8-קופונים-והנחות)
9. [אזור לקוח](#9-אזור-לקוח)
10. [סיטונאות](#10-סיטונאות)
11. [סכמת בסיס נתונים](#11-סכמת-בסיס-נתונים)
12. [API Endpoints](#12-api-endpoints)

---

## 1. סקירת המערכת

### 1.1 מטרה

מערכת מכירות מלאה המאפשרת מכירת מוצרי העמותה (צמידים, חולצות, אביזרים) באופן מקוון, כולל ניהול מלאי, הזמנות, משלוחים וקופונים.

### 1.2 יכולות עיקריות

| יכולת | תיאור |
|-------|-------|
| קטלוג מוצרים | ניהול מוצרים עם קטגוריות, וריאציות, תמונות |
| עגלת קניות | עגלה מתמשכת עם שמירה ב-LocalStorage/DB |
| Checkout | תהליך רכישה עם Stripe |
| הזמנות | ניהול מלא של הזמנות וסטטוסים |
| מלאי | מעקב מלאי אוטומטי |
| משלוחים | חישוב עלות משלוח, משלוח חינם מעל 100₪ |
| קופונים | קודי הנחה באחוזים או סכום קבוע |
| אזור לקוח | היסטוריית הזמנות, פרופיל, מועדפים |
| סיטונאות | הזמנות גדולות במחירים מיוחדים |

---

## 2. קטלוג מוצרים

### 2.1 קטגוריות מוצרים

| קטגוריה | Slug | תיאור |
|---------|------|-------|
| צמידי סיליקון | silicone-bracelets | צמידים עם הסלוגן |
| טבעות סיליקון | silicone-rings | טבעות עם המסר |
| טבעות זהב/כסף | gold-silver-rings | צמידים יוקרתיים |
| מוצרי ספורט | sports | מימיות, סופגי זיעה |
| מוצרים מיוחדים | special | חולצות, שעונים, כרזות |
| מחזיקי מפתחות | keychains | מחזיקים עם הלוגו |

### 2.2 מבנה מוצר

```typescript
interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  categoryId: number;
  images: ProductImage[];
  variants: ProductVariant[];
  stock: number;
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_backorder';
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  name: string; // e.g., "אדום", "M", "זהב"
  attributeType: 'color' | 'size' | 'material';
  price?: number; // Override if different
  stock: number;
  image?: string;
}

interface ProductImage {
  id: number;
  productId: number;
  url: string;
  alt: string;
  position: number;
  isMain: boolean;
}
```

### 2.3 מוצרים לדוגמה (מהאתר הקיים)

| מוצר | מחיר | קטגוריה |
|------|------|---------|
| מימיית מתכת גדולה – אדום | 30.00 ₪ | מוצרי ספורט |
| מחזיק כרטיסי אשראי לפלאפון – שחור | 7.00 ₪ | מוצרים מיוחדים |
| צמיד בד אופנתי בעבודת יד – צבע בז' | 69.00 ₪ | צמידי סיליקון |
| כרזת סלוגן במסגרת זהב | 10.00 ₪ | מוצרים מיוחדים |
| חולצה "מאיירים לפורים" | 45.00 ₪ | מוצרים מיוחדים |
| שעון קיר – מחוגים | 30.00 ₪ | מוצרים מיוחדים |
| סופגי זיעה לזרוע | 10.00 ₪ | מוצרי ספורט |
| צמיד זהב / כסף | 69.00 ₪ | טבעות זהב/כסף |

---

## 3. עגלת קניות

### 3.1 מבנה עגלה

```typescript
interface Cart {
  id: string; // UUID
  userId?: number; // null for guests
  items: CartItem[];
  couponCode?: string;
  discount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // 7 days for guests
}

interface CartItem {
  id: number;
  cartId: string;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  total: number;
}
```

### 3.2 פונקציונליות

| פעולה | תיאור |
|-------|-------|
| הוספה לעגלה | הוספת מוצר עם כמות |
| עדכון כמות | שינוי כמות פריט |
| הסרה מעגלה | מחיקת פריט |
| החלת קופון | הזנת קוד הנחה |
| חישוב משלוח | לפי סכום הזמנה |
| שמירת עגלה | LocalStorage + DB למשתמשים רשומים |
| מיזוג עגלות | בעת התחברות |

### 3.3 Mini Cart

רכיב עגלה מוקטן בכותרת האתר המציג:
- מספר פריטים
- סכום כולל
- תצוגה מהירה של פריטים
- קישור לעגלה מלאה
- קישור ל-Checkout

---

## 4. תהליך Checkout

### 4.1 שלבי Checkout

| שלב | תיאור | שדות |
|-----|-------|------|
| 1. פרטי משלוח | כתובת למשלוח | שם, טלפון, כתובת, עיר, מיקוד |
| 2. שיטת משלוח | בחירת משלוח | נקודת איסוף / משלוח עד הבית |
| 3. תשלום | פרטי כרטיס | Stripe Elements |
| 4. אישור | סיכום הזמנה | פרטים + אישור |

### 4.2 מבנה הזמנה

```typescript
interface Order {
  id: number;
  orderNumber: string; // LH-2024-00001
  userId?: number;
  status: OrderStatus;
  
  // Customer Info
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Shipping
  shippingMethod: 'pickup' | 'delivery';
  shippingAddress?: Address;
  pickupPoint?: string;
  shippingCost: number;
  
  // Payment
  paymentMethod: 'stripe';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripePaymentIntentId: string;
  
  // Totals
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  
  // Items
  items: OrderItem[];
  
  // Tracking
  trackingNumber?: string;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

type OrderStatus = 
  | 'pending'      // ממתין לתשלום
  | 'processing'   // בטיפול
  | 'shipped'      // נשלח
  | 'delivered'    // נמסר
  | 'cancelled'    // בוטל
  | 'refunded';    // הוחזר

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string; // default: 'IL'
}
```

### 4.3 אינטגרציית Stripe

```typescript
// Server-side: Create Payment Intent
const createPaymentIntent = async (orderId: number, amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to agorot
    currency: 'ils',
    metadata: { orderId: orderId.toString() },
    automatic_payment_methods: { enabled: true },
  });
  return paymentIntent.client_secret;
};

// Webhook: Handle payment confirmation
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  if (event.type === 'payment_intent.succeeded') {
    const orderId = event.data.object.metadata.orderId;
    await updateOrderStatus(orderId, 'processing');
    await sendOrderConfirmationEmail(orderId);
    await updateInventory(orderId);
  }
});
```

---

## 5. ניהול הזמנות

### 5.1 דשבורד הזמנות (Admin)

| תצוגה | תיאור |
|-------|-------|
| רשימת הזמנות | טבלה עם סינון וחיפוש |
| פרטי הזמנה | צפייה מלאה בהזמנה |
| עדכון סטטוס | שינוי סטטוס + שליחת אימייל |
| הדפסת תעודת משלוח | PDF |
| ייצוא | CSV/Excel |

### 5.2 סטטוסים ואימיילים

| סטטוס | אימייל ללקוח |
|-------|-------------|
| pending | - |
| processing | "ההזמנה התקבלה" |
| shipped | "ההזמנה נשלחה" + מספר מעקב |
| delivered | "ההזמנה נמסרה" |
| cancelled | "ההזמנה בוטלה" |
| refunded | "בוצע החזר כספי" |

### 5.3 פעולות על הזמנה

| פעולה | תיאור |
|-------|-------|
| צפייה | פרטי הזמנה מלאים |
| עדכון סטטוס | שינוי סטטוס |
| הוספת מספר מעקב | tracking number |
| הוספת הערה | הערה פנימית |
| ביטול | ביטול הזמנה |
| החזר כספי | Refund דרך Stripe |
| שליחת אימייל | שליחה ידנית |
| הדפסה | תעודת משלוח |

---

## 6. ניהול מלאי

### 6.1 מבנה מלאי

```typescript
interface InventoryItem {
  id: number;
  productId: number;
  variantId?: number;
  sku: string;
  quantity: number;
  reservedQuantity: number; // In carts
  availableQuantity: number; // quantity - reserved
  lowStockThreshold: number;
  updatedAt: Date;
}

interface InventoryLog {
  id: number;
  productId: number;
  variantId?: number;
  type: 'sale' | 'restock' | 'adjustment' | 'return';
  quantity: number; // positive or negative
  previousQuantity: number;
  newQuantity: number;
  orderId?: number;
  notes?: string;
  createdBy: number;
  createdAt: Date;
}
```

### 6.2 פונקציונליות

| פעולה | תיאור |
|-------|-------|
| עדכון מלאי אוטומטי | בעת הזמנה |
| התראת מלאי נמוך | אימייל למנהל |
| היסטוריית מלאי | לוג שינויים |
| ייבוא/ייצוא | CSV |
| הזמנה מספק | רשימת מוצרים להזמנה |

---

## 7. משלוחים

### 7.1 שיטות משלוח

| שיטה | מחיר | תנאי |
|------|------|------|
| נקודת איסוף | חינם | מעל 100₪ |
| נקודת איסוף | 15₪ | מתחת ל-100₪ |
| משלוח עד הבית | 25₪ | כל הזמנה |
| משלוח עד הבית | חינם | מעל 200₪ |

### 7.2 חישוב משלוח

```typescript
const calculateShipping = (subtotal: number, method: 'pickup' | 'delivery'): number => {
  if (method === 'pickup') {
    return subtotal >= 100 ? 0 : 15;
  } else {
    return subtotal >= 200 ? 0 : 25;
  }
};
```

### 7.3 נקודות איסוף

אינטגרציה עם שירותי נקודות איסוף בישראל (Box, Hfd, חנויות נוחות).

---

## 8. קופונים והנחות

### 8.1 מבנה קופון

```typescript
interface Coupon {
  id: number;
  code: string; // e.g., "WELCOME10"
  type: 'percentage' | 'fixed';
  value: number; // 10 for 10% or 10₪
  minOrderAmount?: number;
  maxDiscount?: number; // For percentage
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom: Date;
  validUntil: Date;
  applicableCategories?: number[]; // null = all
  applicableProducts?: number[]; // null = all
  excludesSaleItems: boolean;
  status: 'active' | 'expired' | 'disabled';
  createdAt: Date;
}

interface CouponUsage {
  id: number;
  couponId: number;
  orderId: number;
  userId?: number;
  discount: number;
  usedAt: Date;
}
```

### 8.2 סוגי קופונים

| סוג | דוגמה | תיאור |
|-----|-------|-------|
| אחוז הנחה | WELCOME10 | 10% הנחה |
| סכום קבוע | SAVE20 | 20₪ הנחה |
| משלוח חינם | FREESHIP | משלוח חינם |
| קטגוריה | BRACELETS15 | 15% על צמידים |
| מוצר ספציפי | TSHIRT50 | 50% על חולצה |

---

## 9. אזור לקוח

### 9.1 דפי אזור אישי

| דף | תיאור |
|----|-------|
| דשבורד | סיכום חשבון |
| הזמנות | היסטוריית הזמנות |
| פרטי הזמנה | צפייה בהזמנה ספציפית |
| פרופיל | עריכת פרטים אישיים |
| כתובות | ניהול כתובות משלוח |
| מועדפים | מוצרים שמורים |

### 9.2 מבנה לקוח

```typescript
interface Customer {
  id: number;
  userId: number; // Link to users table
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: CustomerAddress[];
  defaultAddressId?: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerAddress {
  id: number;
  customerId: number;
  label: string; // "בית", "עבודה"
  street: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}
```

---

## 10. סיטונאות

### 10.1 הזמנות סיטונאיות

| תכונה | תיאור |
|-------|-------|
| כמות מינימום | 50 יחידות |
| הנחת כמות | 20-40% לפי כמות |
| מוצרים מותאמים | לוגו/טקסט מותאם |
| טופס בקשה | פרטי הזמנה + יצירת קשר |

### 10.2 מבנה בקשת סיטונאות

```typescript
interface WholesaleRequest {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  products: WholesaleProduct[];
  eventType?: string; // "בר מצווה", "אירוע חברה"
  eventDate?: Date;
  customization?: string; // בקשות מיוחדות
  status: 'pending' | 'quoted' | 'approved' | 'rejected';
  quotedPrice?: number;
  notes?: string;
  createdAt: Date;
}

interface WholesaleProduct {
  productId: number;
  quantity: number;
  customText?: string;
}
```

---

## 11. סכמת בסיס נתונים

### 11.1 טבלאות E-commerce

```sql
-- Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  parentId INT REFERENCES categories(id),
  position INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  shortDescription VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  salePrice DECIMAL(10,2),
  categoryId INT REFERENCES categories(id),
  stock INT DEFAULT 0,
  stockStatus ENUM('in_stock', 'out_of_stock', 'on_backorder') DEFAULT 'in_stock',
  weight DECIMAL(10,2),
  length DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  featured BOOLEAN DEFAULT FALSE,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Images
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  alt VARCHAR(200),
  position INT DEFAULT 0,
  isMain BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants
CREATE TABLE product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  attributeType ENUM('color', 'size', 'material') NOT NULL,
  price DECIMAL(10,2),
  stock INT DEFAULT 0,
  image VARCHAR(500),
  position INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderNumber VARCHAR(20) UNIQUE NOT NULL,
  userId INT REFERENCES users(id),
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
  customerName VARCHAR(100) NOT NULL,
  customerEmail VARCHAR(320) NOT NULL,
  customerPhone VARCHAR(20) NOT NULL,
  shippingMethod ENUM('pickup', 'delivery') NOT NULL,
  shippingStreet VARCHAR(200),
  shippingCity VARCHAR(100),
  shippingZipCode VARCHAR(10),
  pickupPoint VARCHAR(200),
  shippingCost DECIMAL(10,2) DEFAULT 0,
  paymentMethod VARCHAR(50) DEFAULT 'stripe',
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  stripePaymentIntentId VARCHAR(100),
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  couponCode VARCHAR(50),
  trackingNumber VARCHAR(100),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  paidAt TIMESTAMP,
  shippedAt TIMESTAMP,
  deliveredAt TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderId INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  productId INT NOT NULL REFERENCES products(id),
  variantId INT REFERENCES product_variants(id),
  productName VARCHAR(200) NOT NULL,
  variantName VARCHAR(100),
  sku VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts
CREATE TABLE carts (
  id VARCHAR(36) PRIMARY KEY,
  userId INT REFERENCES users(id),
  couponCode VARCHAR(50),
  discount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  shippingCost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP
);

-- Cart Items
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cartId VARCHAR(36) NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  productId INT NOT NULL REFERENCES products(id),
  variantId INT REFERENCES product_variants(id),
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minOrderAmount DECIMAL(10,2),
  maxDiscount DECIMAL(10,2),
  usageLimit INT,
  usageCount INT DEFAULT 0,
  perUserLimit INT,
  validFrom TIMESTAMP NOT NULL,
  validUntil TIMESTAMP NOT NULL,
  excludesSaleItems BOOLEAN DEFAULT FALSE,
  status ENUM('active', 'expired', 'disabled') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupon Usage
CREATE TABLE coupon_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  couponId INT NOT NULL REFERENCES coupons(id),
  orderId INT NOT NULL REFERENCES orders(id),
  userId INT REFERENCES users(id),
  discount DECIMAL(10,2) NOT NULL,
  usedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Log
CREATE TABLE inventory_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  productId INT NOT NULL REFERENCES products(id),
  variantId INT REFERENCES product_variants(id),
  type ENUM('sale', 'restock', 'adjustment', 'return') NOT NULL,
  quantity INT NOT NULL,
  previousQuantity INT NOT NULL,
  newQuantity INT NOT NULL,
  orderId INT REFERENCES orders(id),
  notes TEXT,
  createdBy INT REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer Addresses
CREATE TABLE customer_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  street VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  zipCode VARCHAR(10),
  isDefault BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  productId INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (userId, productId)
);

-- Wholesale Requests
CREATE TABLE wholesale_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  companyName VARCHAR(200),
  contactName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  eventType VARCHAR(100),
  eventDate DATE,
  customization TEXT,
  status ENUM('pending', 'quoted', 'approved', 'rejected') DEFAULT 'pending',
  quotedPrice DECIMAL(10,2),
  notes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Wholesale Request Items
CREATE TABLE wholesale_request_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requestId INT NOT NULL REFERENCES wholesale_requests(id) ON DELETE CASCADE,
  productId INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  customText VARCHAR(200),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 12. API Endpoints

### 12.1 Products API

| Method | Endpoint | תיאור | Auth |
|--------|----------|-------|------|
| GET | /api/trpc/products.list | רשימת מוצרים | Public |
| GET | /api/trpc/products.getBySlug | מוצר לפי slug | Public |
| GET | /api/trpc/products.getByCategory | מוצרים לפי קטגוריה | Public |
| GET | /api/trpc/products.search | חיפוש מוצרים | Public |
| GET | /api/trpc/products.featured | מוצרים מומלצים | Public |
| POST | /api/trpc/products.create | יצירת מוצר | Admin |
| PUT | /api/trpc/products.update | עדכון מוצר | Admin |
| DELETE | /api/trpc/products.delete | מחיקת מוצר | Admin |

### 12.2 Cart API

| Method | Endpoint | תיאור | Auth |
|--------|----------|-------|------|
| GET | /api/trpc/cart.get | קבלת עגלה | Public |
| POST | /api/trpc/cart.addItem | הוספה לעגלה | Public |
| PUT | /api/trpc/cart.updateItem | עדכון כמות | Public |
| DELETE | /api/trpc/cart.removeItem | הסרה מעגלה | Public |
| POST | /api/trpc/cart.applyCoupon | החלת קופון | Public |
| DELETE | /api/trpc/cart.removeCoupon | הסרת קופון | Public |
| POST | /api/trpc/cart.clear | ריקון עגלה | Public |

### 12.3 Orders API

| Method | Endpoint | תיאור | Auth |
|--------|----------|-------|------|
| POST | /api/trpc/orders.create | יצירת הזמנה | Public |
| GET | /api/trpc/orders.getByNumber | הזמנה לפי מספר | User |
| GET | /api/trpc/orders.myOrders | ההזמנות שלי | User |
| GET | /api/trpc/orders.list | רשימת הזמנות | Admin |
| PUT | /api/trpc/orders.updateStatus | עדכון סטטוס | Admin |
| POST | /api/trpc/orders.refund | החזר כספי | Admin |

### 12.4 Checkout API

| Method | Endpoint | תיאור | Auth |
|--------|----------|-------|------|
| POST | /api/trpc/checkout.createPaymentIntent | יצירת Payment Intent | Public |
| POST | /api/trpc/checkout.confirmPayment | אישור תשלום | Public |
| GET | /api/trpc/checkout.calculateShipping | חישוב משלוח | Public |

### 12.5 Admin API

| Method | Endpoint | תיאור | Auth |
|--------|----------|-------|------|
| GET | /api/trpc/admin.dashboard | נתוני דשבורד | Admin |
| GET | /api/trpc/admin.salesReport | דוח מכירות | Admin |
| GET | /api/trpc/admin.inventoryReport | דוח מלאי | Admin |
| POST | /api/trpc/admin.updateInventory | עדכון מלאי | Admin |
| GET | /api/trpc/admin.exportOrders | ייצוא הזמנות | Admin |

---

## 13. דפי Frontend

### 13.1 דפי חנות

| דף | Route | תיאור |
|----|-------|-------|
| חנות ראשית | /shop | רשימת מוצרים + סינון |
| קטגוריה | /shop/category/:slug | מוצרים בקטגוריה |
| מוצר | /shop/product/:slug | דף מוצר בודד |
| עגלה | /cart | עגלת קניות |
| Checkout | /checkout | תהליך רכישה |
| אישור הזמנה | /order-confirmation/:id | אישור לאחר רכישה |
| סיטונאות | /wholesale | טופס הזמנה סיטונאית |

### 13.2 דפי אזור אישי

| דף | Route | תיאור |
|----|-------|-------|
| דשבורד | /account | סיכום חשבון |
| הזמנות | /account/orders | היסטוריית הזמנות |
| פרטי הזמנה | /account/orders/:id | צפייה בהזמנה |
| פרופיל | /account/profile | עריכת פרטים |
| כתובות | /account/addresses | ניהול כתובות |
| מועדפים | /account/wishlist | מוצרים שמורים |

### 13.3 דפי Admin

| דף | Route | תיאור |
|----|-------|-------|
| דשבורד | /admin | סיכום כללי |
| מוצרים | /admin/products | ניהול מוצרים |
| הזמנות | /admin/orders | ניהול הזמנות |
| קופונים | /admin/coupons | ניהול קופונים |
| מלאי | /admin/inventory | ניהול מלאי |
| סיטונאות | /admin/wholesale | בקשות סיטונאות |
| דוחות | /admin/reports | דוחות מכירות |

---

*מסמך זה הוא נספח למפרט הטכני הראשי ומפרט את מערכת המכירות המלאה.*
