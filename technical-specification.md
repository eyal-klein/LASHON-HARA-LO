# מפרט טכני מלא - אתר "לשון הרע לא מדבר אליי" V2

**גרסה**: 2.0  
**תאריך**: דצמבר 2024  
**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM

---

## תוכן עניינים

1. [סקירה כללית](#1-סקירה-כללית)
2. [ארכיטקטורת המערכת](#2-ארכיטקטורת-המערכת)
3. [Frontend - צד לקוח](#3-frontend---צד-לקוח)
4. [Backend - צד שרת](#4-backend---צד-שרת)
5. [Database - בסיס נתונים](#5-database---בסיס-נתונים)
6. [GCP Deployment](#6-gcp-deployment)
7. [אינטגרציות חיצוניות](#7-אינטגרציות-חיצוניות)
8. [אבטחה](#8-אבטחה)
9. [ביצועים ומדרגיות](#9-ביצועים-ומדרגיות)
10. [מערכת RAG - חפץ חיים](#10-מערכת-rag---חפץ-חיים)
11. [נספחים](#11-נספחים)

---

## 1. סקירה כללית

### 1.1 מטרת המערכת

אתר V2 לעמותת "לשון הרע לא מדבר אליי" הוא פלטפורמה דיגיטלית מודרנית המיועדת לקידום תרבות שיח חיובית בחברה הישראלית. המערכת תחליף את האתר הקיים המבוסס על WordPress/Elementor בפתרון מהיר, מאובטח וקל לתחזוקה, תוך שימוש בטכנולוגיות החדשניות ביותר לשנת 2024/2025.

### 1.2 יעדים עיקריים

המערכת נועדה לספק חוויית משתמש מודרנית ומהירה, לאפשר ניהול תוכן פשוט ללא ידע טכני, לתמוך באיסוף התחייבויות ומנויים לניוזלטר, לאפשר קבלת תרומות באופן מאובטח, ולספק גלריה דינמית של שגרירים ופעילויות.

### 1.3 קהל יעד

| קהל | תיאור | צרכים עיקריים |
|-----|-------|---------------|
| **מבקרים** | אזרחים המעוניינים להצטרף למהפכה | מידע, הרשמה, תרומה |
| **שגרירים** | מתנדבים פעילים | הרשמה, עדכונים, גלריה |
| **בתי ספר** | מוסדות חינוך | תוכניות חינוכיות, יצירת קשר |
| **תורמים** | תומכים כספיים | תרומה מאובטחת, קבלות |
| **מנהלים** | צוות העמותה | ניהול תוכן, CMS |

---

## 2. ארכיטקטורת המערכת

### 2.1 סטאק טכנולוגי - הכי עדכני ל-2024/2025

| שכבה | טכנולוגיה | גרסה | תאריך שחרור | תיאור |
|------|-----------|------|-------------|-------|
| **Frontend** | React | 19.0.0 | דצמבר 2024 | הגרסה החדשה ביותר עם Actions, Server Components |
| **Frontend** | TypeScript | 5.7 | נובמבר 2024 | Type Safety מתקדם |
| **Frontend** | TailwindCSS | 4.0 | ינואר 2025 | CSS Framework חדשני עם Oxide Engine |
| **Frontend** | Vite | 6.0 | נובמבר 2024 | Build Tool מהיר במיוחד |
| **Backend** | Node.js | 22.12.0 LTS | דצמבר 2024 | Jod LTS - תמיכה עד 2027 |
| **Backend** | Express | 5.0 | 2024 | Web Framework מעודכן |
| **Backend** | tRPC | 11.x | 2024 | Type-safe API |
| **Backend** | Hono | 4.x | 2024 | אלטרנטיבה מהירה ל-Express (אופציונלי) |
| **Database** | Cloud SQL (MySQL 8.4) | 8.4 | 2024 | Managed MySQL on GCP |
| **Database** | AlloyDB | - | 2024 | PostgreSQL-compatible, 4x faster (אופציה) |
| **ORM** | Drizzle | 0.44.x | 2024 | Type-safe ORM מודרני |
| **Cloud** | Google Cloud Platform | - | 2024 | תשתית ענן מובילה |

### 2.2 תרשים ארכיטקטורה - GCP Native

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS                                       │
│                    (Desktop / Mobile / Tablet)                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Google Cloud CDN                                    │
│              (Global Edge Caching, Brotli Compression)                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               Google Cloud Global Load Balancer                         │
│        (HTTPS Termination, Managed SSL, DDoS Protection)                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│      Cloud Run (Gen 2)          │   │    Cloud Storage                │
│   (Serverless Containers)       │   │   (Object Storage)              │
│                                 │   │                                 │
│  ┌───────────────────────────┐  │   │  ┌───────────────────────────┐  │
│  │   React 19 Frontend       │  │   │  │   User Uploads            │  │
│  │   (Vite 6 Build)          │  │   │  │   Gallery Images          │  │
│  │   TailwindCSS 4.0         │  │   │  │   Activity Photos         │  │
│  └───────────────────────────┘  │   │  │   Static Assets           │  │
│                                 │   │  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │   │                                 │
│  │   Node.js 22 LTS          │  │   │  Features:                      │
│  │   Express 5 / Hono 4      │  │   │  • Autoclass storage            │
│  │   tRPC 11                 │  │   │  • Signed URLs                  │
│  └───────────────────────────┘  │   │  • CDN Integration              │
│                                 │   │                                 │
│  Features:                      │   └─────────────────────────────────┘
│  • Auto-scaling 0-1000         │
│  • Cold start < 100ms          │
│  • CPU always allocated        │
│  • VPC Connector               │
└─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Cloud SQL (MySQL 8.4)                           │
│                    (Managed Database with HA)                           │
│                                                                         │
│  Features:                                                              │
│  • High Availability (Regional)                                         │
│  • Automatic backups                                                    │
│  • Point-in-time recovery                                               │
│  • Private IP (VPC)                                                     │
│  • Read replicas (optional)                                             │
└─────────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      GCP Managed Services                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Secret    │  │   Cloud     │  │   Cloud     │  │   Cloud     │    │
│  │   Manager   │  │   Armor     │  │   Logging   │  │   Monitoring│    │
│  │  (Secrets)  │  │  (WAF/DDoS) │  │  (Logs)     │  │  (Metrics)  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Cloud     │  │   Cloud     │  │   Pub/Sub   │  │   Cloud     │    │
│  │   Tasks     │  │   Scheduler │  │  (Events)   │  │   Build     │    │
│  │  (Queues)   │  │  (Cron)     │  │             │  │  (CI/CD)    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      External Services                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Stripe    │  │   SendGrid  │  │   Google    │  │   Google    │    │
│  │  Payments   │  │   Email     │  │   OAuth     │  │  Analytics  │    │
│  │             │  │   (or SES)  │  │             │  │     4       │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 השוואת טכנולוגיות - למה בחרנו בסטאק הזה

| קטגוריה | בחירה שלנו | אלטרנטיבות | סיבת הבחירה |
|---------|-----------|------------|-------------|
| **Frontend Framework** | React 19 | Next.js 15, Vue 3, Svelte 5 | הכי נפוץ, אקוסיסטם עשיר, React 19 Actions |
| **CSS Framework** | TailwindCSS 4.0 | CSS Modules, Styled Components | Oxide Engine מהיר 10x, utility-first |
| **Build Tool** | Vite 6 | Webpack 5, Turbopack | HMR מיידי, build מהיר |
| **Backend Runtime** | Node.js 22 LTS | Deno 2, Bun 1.1 | יציבות, תמיכה ארוכת טווח, GCP native |
| **API Layer** | tRPC 11 | GraphQL, REST | Type-safety מלא, zero overhead |
| **Database** | Cloud SQL MySQL 8.4 | AlloyDB, Firestore, Spanner | מחיר, פשטות, SQL סטנדרטי |
| **ORM** | Drizzle | Prisma, TypeORM | ביצועים, type-safety, SQL-like |
| **Cloud Provider** | GCP | AWS, Azure | מחיר, Cloud Run, Israel region |

---

## 3. Frontend - צד לקוח

### 3.1 React 19 - תכונות חדשות בשימוש

```typescript
// React 19 Actions - טיפול בטפסים
async function submitCommitment(formData: FormData) {
  'use server';
  const name = formData.get('name');
  const email = formData.get('email');
  await db.commitments.create({ name, email });
}

// React 19 useOptimistic - עדכון אופטימיסטי
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, pending: true }]
);

// React 19 use() - קריאת promises
function CommitmentCount() {
  const count = use(fetchCommitmentCount());
  return <span>{count} התחייבויות</span>;
}
```

### 3.2 TailwindCSS 4.0 - תכונות חדשות

```css
/* index.css - TailwindCSS 4.0 with Oxide Engine */
@import "tailwindcss";

@theme {
  /* Brand Colors - OKLCH format (TailwindCSS 4 requirement) */
  --color-primary: oklch(0.55 0.25 25);        /* #ED0913 */
  --color-primary-dark: oklch(0.45 0.22 25);   /* #C50710 */
  --color-primary-light: oklch(0.65 0.25 25);  /* #FF3B3B */
  
  /* Semantic Colors */
  --color-background: oklch(1 0 0);            /* White */
  --color-foreground: oklch(0.15 0.02 260);    /* Dark blue-gray */
  --color-muted: oklch(0.95 0.01 260);         /* Light gray */
  
  /* Typography */
  --font-family-sans: 'Rubik', 'Almoni Neue', system-ui, sans-serif;
  --font-family-display: 'Almoni Neue', 'Rubik', sans-serif;
  
  /* Spacing Scale */
  --spacing-section: 6rem;
  --spacing-card: 1.5rem;
  
  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-card-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

/* Container customization */
@utility container {
  margin-inline: auto;
  padding-inline: 1rem;
  max-width: 80rem;
}
```

### 3.3 מבנה תיקיות

```
client/
├── public/                    # קבצים סטטיים
│   ├── favicon.ico
│   ├── logo.svg
│   ├── fonts/                # פונטים מקומיים
│   │   ├── almoni-neue.woff2
│   │   └── rubik.woff2
│   └── robots.txt
├── src/
│   ├── components/            # רכיבים משותפים
│   │   ├── ui/               # רכיבי shadcn/ui (40+)
│   │   ├── layout/           # Header, Footer, Navigation
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── PageLayout.tsx
│   │   ├── forms/            # טפסים משותפים
│   │   │   ├── CommitmentForm.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── DonationForm.tsx
│   │   │   └── PartnershipForm.tsx
│   │   └── sections/         # סקשנים לדפים
│   │       ├── HeroSection.tsx
│   │       ├── WhatIsLashonHara.tsx
│   │       ├── PartnershipCards.tsx
│   │       ├── GandhiQuote.tsx
│   │       ├── ActivitiesGrid.tsx
│   │       └── AmbassadorsGallery.tsx
│   ├── pages/                # דפי האתר
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Activities.tsx
│   │   ├── Gallery.tsx
│   │   ├── Contact.tsx
│   │   ├── Donate.tsx
│   │   └── admin/            # דפי ניהול
│   │       ├── Dashboard.tsx
│   │       ├── ContentManager.tsx
│   │       ├── GalleryManager.tsx
│   │       └── CommitmentsView.tsx
│   ├── hooks/                # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useCommitments.ts
│   │   └── useGallery.ts
│   ├── contexts/             # React Contexts
│   │   └── ThemeContext.tsx
│   ├── lib/                  # Utilities
│   │   ├── trpc.ts          # tRPC Client
│   │   ├── utils.ts
│   │   └── validations.ts   # Zod schemas
│   ├── App.tsx              # נתיבים ראשיים
│   ├── main.tsx             # Entry Point
│   └── index.css            # Global CSS (TailwindCSS 4)
└── index.html
```

### 3.4 דפים ונתיבים

| דף | נתיב | תיאור | Auth נדרש |
|----|------|-------|-----------|
| Home | `/` | דף הבית | לא |
| About | `/about` | אודות העמותה | לא |
| Activities | `/activities` | הפעילות שלנו | לא |
| Gallery | `/gallery` | גלריית תמונות | לא |
| Contact | `/contact` | צור קשר | לא |
| Donate | `/donate` | תרומה (Stripe) | לא |
| Shop | `/shop` | חנות (קישור חיצוני) | לא |
| Admin Dashboard | `/admin` | לוח בקרה | Admin |
| Admin Content | `/admin/content` | ניהול תוכן CMS | Admin |
| Admin Gallery | `/admin/gallery` | ניהול גלריה | Admin |
| Admin Commitments | `/admin/commitments` | צפייה בהתחייבויות | Admin |
| Admin Donations | `/admin/donations` | צפייה בתרומות | Admin |
| Admin Newsletter | `/admin/newsletter` | ניהול ניוזלטר | Admin |

---

## 4. Backend - צד שרת

### 4.1 Node.js 22 LTS - תכונות חדשות

```typescript
// Native ESM support - require(esm) enabled by default
import { serve } from './server.js';

// Native fetch API (no node-fetch needed)
const response = await fetch('https://api.stripe.com/v1/charges');

// Native WebSocket support
import { WebSocketServer } from 'ws';

// Built-in test runner
import { test, describe } from 'node:test';

// Permission model (experimental)
// node --experimental-permission --allow-fs-read=./data app.js
```

### 4.2 מבנה תיקיות

```
server/
├── _core/                     # תשתית (לא לערוך)
│   ├── context.ts            # tRPC Context
│   ├── cookies.ts            # Cookie handling
│   ├── env.ts                # Environment variables
│   ├── index.ts              # Server entry
│   ├── trpc.ts               # tRPC setup
│   └── middleware/           # Express middleware
│       ├── auth.ts
│       ├── rateLimit.ts
│       └── security.ts
├── routers/                   # tRPC Routers
│   ├── auth.ts               # Authentication
│   ├── commitments.ts        # התחייבויות
│   ├── content.ts            # ניהול תוכן CMS
│   ├── contact.ts            # יצירת קשר
│   ├── donations.ts          # תרומות Stripe
│   ├── gallery.ts            # גלריה
│   ├── newsletter.ts         # ניוזלטר
│   └── partnerships.ts       # שותפויות
├── services/                  # Business Logic
│   ├── email.service.ts      # SendGrid integration
│   ├── stripe.service.ts     # Stripe integration
│   └── storage.service.ts    # Cloud Storage
├── db.ts                      # Database queries
├── routers.ts                 # Main router
├── storage.ts                 # Storage helpers
└── tests/                     # Unit tests
    ├── commitments.test.ts
    ├── donations.test.ts
    └── auth.test.ts
```

### 4.3 tRPC API Endpoints

#### 4.3.1 Auth Router

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `auth.me` | Query | - | `User \| null` | Public |
| `auth.logout` | Mutation | - | `{ success: boolean }` | Public |
| `auth.isAdmin` | Query | - | `boolean` | Protected |

#### 4.3.2 Commitments Router

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `commitments.create` | Mutation | `CreateCommitmentInput` | `Commitment` | Public |
| `commitments.list` | Query | `PaginationInput` | `{ items: Commitment[], total: number }` | Admin |
| `commitments.getStats` | Query | - | `CommitmentStats` | Admin |
| `commitments.export` | Query | `{ format: 'csv' \| 'xlsx' }` | `string` | Admin |
| `commitments.delete` | Mutation | `{ id: number }` | `{ success: boolean }` | Admin |

```typescript
// Input Schema with Zod
const CreateCommitmentInput = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים').max(100),
  phone: z.string().regex(/^0[0-9]{8,9}$/, 'מספר טלפון לא תקין'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  receiveUpdates: z.boolean().default(false),
});
```

#### 4.3.3 Donations Router (Stripe)

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `donations.createPaymentIntent` | Mutation | `DonationInput` | `{ clientSecret: string, paymentIntentId: string }` | Public |
| `donations.confirmPayment` | Mutation | `{ paymentIntentId: string }` | `Donation` | Public |
| `donations.createSubscription` | Mutation | `SubscriptionInput` | `{ subscriptionId: string, clientSecret: string }` | Public |
| `donations.list` | Query | `PaginationInput & DateRange` | `{ items: Donation[], total: number }` | Admin |
| `donations.getStats` | Query | `DateRange` | `DonationStats` | Admin |
| `donations.refund` | Mutation | `{ donationId: number, reason?: string }` | `Donation` | Admin |

```typescript
// Donation Input Schema
const DonationInput = z.object({
  amount: z.number().min(10, 'סכום מינימלי 10 ש"ח').max(100000),
  currency: z.enum(['ILS', 'USD', 'EUR']).default('ILS'),
  frequency: z.enum(['one_time', 'monthly']),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  donorPhone: z.string().optional(),
  dedicatedTo: z.string().max(200).optional(),
  isAnonymous: z.boolean().default(false),
});
```

#### 4.3.4 Gallery Router

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `gallery.list` | Query | `GalleryFilters` | `GalleryItem[]` | Public |
| `gallery.getById` | Query | `{ id: number }` | `GalleryItem` | Public |
| `gallery.create` | Mutation | `CreateGalleryInput` | `GalleryItem` | Admin |
| `gallery.update` | Mutation | `UpdateGalleryInput` | `GalleryItem` | Admin |
| `gallery.delete` | Mutation | `{ id: number }` | `{ success: boolean }` | Admin |
| `gallery.reorder` | Mutation | `{ items: { id: number, order: number }[] }` | `{ success: boolean }` | Admin |
| `gallery.uploadImage` | Mutation | `{ file: File, category: string }` | `{ url: string, thumbnailUrl: string }` | Admin |

#### 4.3.5 Content Router (CMS)

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `content.get` | Query | `{ key: string }` | `ContentItem` | Public |
| `content.getBySection` | Query | `{ section: string }` | `ContentItem[]` | Public |
| `content.update` | Mutation | `UpdateContentInput` | `ContentItem` | Admin |
| `content.uploadImage` | Mutation | `UploadInput` | `{ url: string }` | Admin |
| `content.listSections` | Query | - | `string[]` | Admin |

#### 4.3.6 Newsletter Router

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `newsletter.subscribe` | Mutation | `{ email: string, source?: string }` | `{ success: boolean, message: string }` | Public |
| `newsletter.unsubscribe` | Mutation | `{ token: string }` | `{ success: boolean }` | Public |
| `newsletter.confirmSubscription` | Mutation | `{ token: string }` | `{ success: boolean }` | Public |
| `newsletter.list` | Query | `PaginationInput & StatusFilter` | `{ items: Subscriber[], total: number }` | Admin |
| `newsletter.sendCampaign` | Mutation | `CampaignInput` | `{ sent: number, failed: number }` | Admin |
| `newsletter.getStats` | Query | - | `NewsletterStats` | Admin |

#### 4.3.7 Partnerships Router

| Procedure | Type | Input | Output | Auth |
|-----------|------|-------|--------|------|
| `partnerships.apply` | Mutation | `PartnershipApplication` | `Partnership` | Public |
| `partnerships.list` | Query | `PartnershipFilters` | `{ items: Partnership[], total: number }` | Admin |
| `partnerships.updateStatus` | Mutation | `{ id: number, status: PartnershipStatus, notes?: string }` | `Partnership` | Admin |
| `partnerships.getStats` | Query | - | `PartnershipStats` | Admin |

---

## 5. Database - בסיס נתונים

### 5.1 Cloud SQL Configuration

| הגדרה | Development | Production |
|-------|-------------|------------|
| **Instance Type** | db-f1-micro | db-n1-standard-2 |
| **vCPUs** | Shared | 2 |
| **Memory** | 614 MB | 7.5 GB |
| **Storage** | 10 GB SSD | 100 GB SSD |
| **High Availability** | No | Yes (Regional) |
| **Backups** | Daily | Continuous |
| **Point-in-time Recovery** | No | Yes (7 days) |
| **Private IP** | No | Yes (VPC) |
| **Region** | me-west1 (Tel Aviv) | me-west1 (Tel Aviv) |

### 5.2 סכמת טבלאות (Drizzle Schema)

```typescript
// drizzle/schema.ts

import { 
  int, mysqlEnum, mysqlTable, text, timestamp, 
  varchar, boolean, json, index, uniqueIndex
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

// ========== EMAIL LOGS ==========
export const emailLogs = mysqlTable("email_logs", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", [
    "commitment_confirmation", 
    "newsletter", 
    "donation_receipt", 
    "contact_notification",
    "partnership_notification",
    "welcome_email"
  ]).notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  recipientName: varchar("recipientName", { length: 100 }),
  subject: varchar("subject", { length: 200 }).notNull(),
  templateId: varchar("templateId", { length: 100 }),
  status: mysqlEnum("status", ["pending", "sent", "delivered", "failed", "bounced", "opened", "clicked"])
    .default("pending").notNull(),
  sendgridMessageId: varchar("sendgridMessageId", { length: 100 }),
  errorMessage: text("errorMessage"),
  metadata: json("metadata"),
  sentAt: timestamp("sentAt"),
  openedAt: timestamp("openedAt"),
  clickedAt: timestamp("clickedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  typeStatusIdx: index("idx_email_type_status").on(table.type, table.status),
  recipientIdx: index("idx_email_recipient").on(table.recipientEmail),
  createdAtIdx: index("idx_email_created").on(table.createdAt),
}));

// ========== AUDIT LOG ==========
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  action: varchar("action", { length: 50 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId"),
  oldValue: json("oldValue"),
  newValue: json("newValue"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_audit_user").on(table.userId),
  entityIdx: index("idx_audit_entity").on(table.entityType, table.entityId),
  createdAtIdx: index("idx_audit_created").on(table.createdAt),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Commitment = typeof commitments.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Partnership = typeof partnerships.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type Content = typeof content.$inferSelect;
export type EmailLog = typeof emailLogs.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
```

### 5.3 תרשים ERD

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA (11 Tables)                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │  commitments    │       │   donations     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ openId (UQ)     │       │ name            │       │ stripePaymentId │
│ name            │       │ phone           │       │ amount          │
│ email           │       │ email           │       │ currency        │
│ phone           │       │ receiveUpdates  │       │ frequency       │
│ role            │       │ source          │       │ status          │
│ avatarUrl       │       │ createdAt       │       │ donorName       │
│ createdAt       │       └─────────────────┘       │ donorEmail      │
│ updatedAt       │                                 │ isAnonymous     │
│ lastSignedIn    │                                 │ createdAt       │
└────────┬────────┘                                 └─────────────────┘
         │
         │ references
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   subscribers   │       │ contact_messages│       │  partnerships   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ email (UQ)      │       │ name            │       │ type            │
│ name            │       │ email           │       │ name            │
│ status          │       │ phone           │       │ email           │
│ confirmToken    │       │ subject         │       │ phone           │
│ unsubscribeToken│       │ message         │       │ organization    │
│ source          │       │ isRead          │       │ status          │
│ createdAt       │       │ priority        │       │ handledBy (FK)  │
│ confirmedAt     │       │ readBy (FK)     │       │ createdAt       │
└─────────────────┘       │ createdAt       │       └─────────────────┘
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  gallery_items  │       │   activities    │       │    content      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ title           │       │ title           │       │ key (UQ)        │
│ description     │       │ slug (UQ)       │       │ section         │
│ imageUrl        │       │ description     │       │ title           │
│ thumbnailUrl    │       │ type            │       │ subtitle        │
│ category        │       │ imageUrl        │       │ content         │
│ personName      │       │ date            │       │ imageUrl        │
│ isPublished     │       │ location        │       │ buttonText      │
│ isFeatured      │       │ isPublished     │       │ buttonUrl       │
│ sortOrder       │       │ isFeatured      │       │ isPublished     │
│ createdBy (FK)  │       │ createdBy (FK)  │       │ updatedBy (FK)  │
│ createdAt       │       │ createdAt       │       │ updatedAt       │
└─────────────────┘       └─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│   email_logs    │       │   audit_log     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ type            │       │ userId (FK)     │
│ recipientEmail  │       │ action          │
│ subject         │       │ entityType      │
│ templateId      │       │ entityId        │
│ status          │       │ oldValue        │
│ sendgridMsgId   │       │ newValue        │
│ errorMessage    │       │ ipAddress       │
│ sentAt          │       │ createdAt       │
│ createdAt       │       └─────────────────┘
└─────────────────┘
```

---

## 6. GCP Deployment

### 6.1 שירותי GCP בשימוש

| שירות | תיאור | שימוש בפרויקט |
|-------|-------|---------------|
| **Cloud Run** | Serverless containers | Application hosting |
| **Cloud SQL** | Managed MySQL | Primary database |
| **Cloud Storage** | Object storage | Images, uploads, static files |
| **Cloud CDN** | Content delivery | Global caching |
| **Cloud Load Balancing** | Global LB | HTTPS, SSL, routing |
| **Cloud Armor** | WAF & DDoS | Security protection |
| **Secret Manager** | Secrets storage | API keys, credentials |
| **Cloud Logging** | Centralized logs | Application logs |
| **Cloud Monitoring** | Metrics & alerts | Performance monitoring |
| **Cloud Build** | CI/CD | Automated deployments |
| **Cloud Tasks** | Task queues | Email sending, async jobs |
| **Cloud Scheduler** | Cron jobs | Scheduled tasks |
| **Pub/Sub** | Event messaging | Webhooks, notifications |
| **Artifact Registry** | Container registry | Docker images |

### 6.2 Cloud Run Configuration

```yaml
# service.yaml - Cloud Run service configuration
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: lashonhara-v2
  labels:
    cloud.googleapis.com/location: me-west1
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "0"
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
        run.googleapis.com/startup-cpu-boost: "true"
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      serviceAccountName: lashonhara-v2-sa@PROJECT_ID.iam.gserviceaccount.com
      containers:
        - image: me-west1-docker.pkg.dev/PROJECT_ID/lashonhara/app:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "2"
              memory: "2Gi"
          env:
            - name: NODE_ENV
              value: "production"
            - name: GCP_PROJECT
              value: "PROJECT_ID"
          envFrom:
            - secretRef:
                name: lashonhara-secrets
          startupProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 0
            periodSeconds: 1
            failureThreshold: 30
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            periodSeconds: 10
```

### 6.3 Cloud Build CI/CD

```yaml
# cloudbuild.yaml
steps:
  # Install dependencies and run tests
  - name: 'node:22-alpine'
    entrypoint: 'sh'
    args:
      - '-c'
      - |
        npm install -g pnpm
        pnpm install --frozen-lockfile
        pnpm test
        pnpm build

  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app:$COMMIT_SHA'
      - '-t'
      - 'me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app:latest'
      - '--cache-from'
      - 'me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app:latest'
      - '.'

  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '--all-tags'
      - 'me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: 'gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'lashonhara-v2'
      - '--image=me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app:$COMMIT_SHA'
      - '--region=me-west1'
      - '--platform=managed'
      - '--allow-unauthenticated'
      - '--memory=2Gi'
      - '--cpu=2'
      - '--min-instances=0'
      - '--max-instances=100'
      - '--concurrency=80'
      - '--cpu-boost'
      - '--execution-environment=gen2'
      - '--set-secrets=DATABASE_URL=DATABASE_URL:latest,STRIPE_SECRET_KEY=STRIPE_SECRET_KEY:latest,SENDGRID_API_KEY=SENDGRID_API_KEY:latest'

  # Run database migrations
  - name: 'node:22-alpine'
    entrypoint: 'sh'
    args:
      - '-c'
      - |
        npm install -g pnpm
        pnpm install --frozen-lockfile
        pnpm db:push
    secretEnv: ['DATABASE_URL']

availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/DATABASE_URL/versions/latest
      env: 'DATABASE_URL'

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: 'E2_HIGHCPU_8'

images:
  - 'me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app:$COMMIT_SHA'
  - 'me-west1-docker.pkg.dev/$PROJECT_ID/lashonhara/app:latest'

timeout: '1200s'
```

### 6.4 Dockerfile (Multi-stage, Optimized)

```dockerfile
# Dockerfile
# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN pnpm build

# Stage 3: Production
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Copy built assets
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/package.json ./

USER appuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["node", "dist/index.js"]
```

### 6.5 Infrastructure as Code (Terraform)

```hcl
# main.tf - GCP Infrastructure

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud SQL Instance
resource "google_sql_database_instance" "main" {
  name             = "lashonhara-db"
  database_version = "MYSQL_8_0"
  region           = var.region

  settings {
    tier              = var.environment == "production" ? "db-n1-standard-2" : "db-f1-micro"
    availability_type = var.environment == "production" ? "REGIONAL" : "ZONAL"
    disk_size         = var.environment == "production" ? 100 : 10
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      binary_log_enabled             = var.environment == "production"
      point_in_time_recovery_enabled = var.environment == "production"
      start_time                     = "03:00"
      backup_retention_settings {
        retained_backups = 7
      }
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }
  }

  deletion_protection = var.environment == "production"
}

# Cloud Storage Bucket
resource "google_storage_bucket" "uploads" {
  name          = "${var.project_id}-uploads"
  location      = var.region
  force_destroy = var.environment != "production"

  uniform_bucket_level_access = true

  cors {
    origin          = ["https://lashonhara.co.il"]
    method          = ["GET", "HEAD", "PUT", "POST"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}

# Cloud Run Service
resource "google_cloud_run_v2_service" "app" {
  name     = "lashonhara-v2"
  location = var.region

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 100
    }

    containers {
      image = "me-west1-docker.pkg.dev/${var.project_id}/lashonhara/app:latest"

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      dynamic "env" {
        for_each = var.secrets
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Cloud Armor Security Policy
resource "google_compute_security_policy" "policy" {
  name = "lashonhara-security-policy"

  rule {
    action   = "deny(403)"
    priority = "1000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-stable')"
      }
    }
    description = "XSS protection"
  }

  rule {
    action   = "deny(403)"
    priority = "1001"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-stable')"
      }
    }
    description = "SQL injection protection"
  }

  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }
}
```

### 6.6 עלויות משוערות (GCP)

| שירות | Development | Production | הערות |
|-------|-------------|------------|-------|
| **Cloud Run** | $0 | ~$20/month | Free tier: 2M requests |
| **Cloud SQL** | ~$10/month | ~$70/month | db-f1-micro vs db-n1-standard-2 |
| **Cloud Storage** | ~$1/month | ~$5/month | 50GB estimated |
| **Cloud CDN** | ~$1/month | ~$10/month | Based on traffic |
| **Load Balancer** | ~$18/month | ~$18/month | Fixed cost |
| **Cloud Armor** | $0 | ~$5/month | Basic protection |
| **Secret Manager** | ~$0.10/month | ~$0.10/month | 10 secrets |
| **Cloud Build** | $0 | ~$5/month | Free tier: 120 min/day |
| **Logging & Monitoring** | $0 | ~$10/month | Based on volume |
| **Networking** | ~$5/month | ~$15/month | Egress, VPC |
| **סה"כ** | **~$35/month** | **~$160/month** | |

---

## 7. אינטגרציות חיצוניות

### 7.1 Stripe (תשלומים)

```typescript
// server/services/stripe.service.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Latest API version
  typescript: true,
});

export const stripeService = {
  async createPaymentIntent(amount: number, currency: string = 'ILS', metadata?: Record<string, string>) {
    return stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to agorot/cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        source: 'lashonhara-website',
        ...metadata,
      },
    });
  },

  async createCustomer(email: string, name?: string) {
    return stripe.customers.create({
      email,
      name,
      metadata: { source: 'lashonhara-website' },
    });
  },

  async createSubscription(customerId: string, priceId: string) {
    return stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
  },

  async cancelSubscription(subscriptionId: string) {
    return stripe.subscriptions.cancel(subscriptionId);
  },

  async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    return stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason as Stripe.RefundCreateParams.Reason,
    });
  },

  async handleWebhook(payload: Buffer, signature: string) {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  },
};
```

### 7.2 SendGrid (אימיילים)

```typescript
// server/services/email.service.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM_EMAIL = 'noreply@lashonhara.co.il';
const FROM_NAME = 'לשון הרע לא מדבר אליי';

export const emailService = {
  async sendCommitmentConfirmation(to: string, name: string) {
    return sgMail.send({
      to,
      from: { email: FROM_EMAIL, name: FROM_NAME },
      templateId: 'd-commitment-confirmation-template',
      dynamicTemplateData: { 
        name,
        date: new Date().toLocaleDateString('he-IL'),
      },
    });
  },

  async sendDonationReceipt(to: string, data: {
    name: string;
    amount: number;
    currency: string;
    receiptNumber: string;
    date: string;
  }) {
    return sgMail.send({
      to,
      from: { email: 'donations@lashonhara.co.il', name: FROM_NAME },
      templateId: 'd-donation-receipt-template',
      dynamicTemplateData: data,
    });
  },

  async sendNewsletter(subscribers: Array<{ email: string; name?: string }>, content: {
    subject: string;
    preheader: string;
    body: string;
    ctaText?: string;
    ctaUrl?: string;
  }) {
    const personalizations = subscribers.map(sub => ({
      to: sub.email,
      dynamicTemplateData: {
        name: sub.name || 'חבר/ה יקר/ה',
        ...content,
        unsubscribeUrl: `https://lashonhara.co.il/unsubscribe?email=${encodeURIComponent(sub.email)}`,
      },
    }));

    return sgMail.send({
      personalizations,
      from: { email: 'newsletter@lashonhara.co.il', name: FROM_NAME },
      templateId: 'd-newsletter-template',
    });
  },

  async sendContactNotification(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    return sgMail.send({
      to: 'contact@lashonhara.co.il',
      from: { email: FROM_EMAIL, name: FROM_NAME },
      replyTo: data.email,
      subject: `פנייה חדשה: ${data.subject}`,
      templateId: 'd-contact-notification-template',
      dynamicTemplateData: data,
    });
  },
};
```

### 7.3 Cloud Storage (אחסון קבצים)

```typescript
// server/services/storage.service.ts
import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

const storage = new Storage();
const bucket = storage.bucket(process.env.GCS_BUCKET!);

export const storageService = {
  async uploadImage(
    file: Buffer,
    originalName: string,
    contentType: string,
    category: string = 'uploads'
  ): Promise<{ url: string; thumbnailUrl: string; key: string }> {
    const ext = originalName.split('.').pop() || 'jpg';
    const key = `${category}/${nanoid()}.${ext}`;
    const thumbnailKey = `${category}/thumbnails/${nanoid()}.webp`;

    // Upload original
    const blob = bucket.file(key);
    await blob.save(file, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Create and upload thumbnail
    const thumbnail = await sharp(file)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    const thumbnailBlob = bucket.file(thumbnailKey);
    await thumbnailBlob.save(thumbnail, {
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const baseUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET}`;
    
    return {
      url: `${baseUrl}/${key}`,
      thumbnailUrl: `${baseUrl}/${thumbnailKey}`,
      key,
    };
  },

  async deleteImage(key: string): Promise<void> {
    await bucket.file(key).delete();
    
    // Try to delete thumbnail too
    const thumbnailKey = key.replace(/\/([^/]+)$/, '/thumbnails/$1').replace(/\.[^.]+$/, '.webp');
    try {
      await bucket.file(thumbnailKey).delete();
    } catch (e) {
      // Thumbnail might not exist
    }
  },

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const [url] = await bucket.file(key).getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });
    return url;
  },
};
```

---

## 8. אבטחה

### 8.1 שכבות אבטחה

| שכבה | הגנה | מימוש |
|------|------|-------|
| **Network** | DDoS, WAF | Cloud Armor |
| **Transport** | HTTPS, TLS 1.3 | Cloud Load Balancer |
| **Application** | XSS, CSRF, SQLi | Security middleware |
| **Authentication** | OAuth 2.0, JWT | Google OAuth |
| **Authorization** | RBAC | Role-based access |
| **Data** | Encryption at rest | Cloud SQL, Cloud Storage |
| **Secrets** | Secure storage | Secret Manager |
| **Audit** | Logging | Cloud Logging, Audit table |

### 8.2 Security Headers

```typescript
// server/_core/middleware/security.ts
import helmet from 'helmet';

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://js.stripe.com",
        "https://www.googletagmanager.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://storage.googleapis.com",
        "https://*.stripe.com",
      ],
      frameSrc: [
        "https://js.stripe.com",
        "https://hooks.stripe.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://*.google-analytics.com",
      ],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
```

### 8.3 Rate Limiting

```typescript
// server/_core/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Strict limit for form submissions
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 submissions per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
});

// Very strict limit for donations
export const donationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 donation attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment attempts, please try again later.' },
});
```

---

## 9. ביצועים ומדרגיות

### 9.1 יעדי ביצועים (Core Web Vitals)

| מדד | יעד | כלי מדידה |
|-----|-----|-----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Lighthouse, PageSpeed |
| **INP** (Interaction to Next Paint) | < 200ms | Lighthouse, PageSpeed |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Lighthouse, PageSpeed |
| **TTFB** (Time to First Byte) | < 600ms | WebPageTest |
| **FCP** (First Contentful Paint) | < 1.8s | Lighthouse |
| **Bundle Size** (JS) | < 150KB gzip | Vite build |
| **Bundle Size** (CSS) | < 30KB gzip | Vite build |

### 9.2 אופטימיזציות

| אופטימיזציה | מימוש | השפעה |
|-------------|-------|-------|
| **Code Splitting** | React.lazy, dynamic imports | -40% initial bundle |
| **Tree Shaking** | Vite + ESM | -30% bundle size |
| **Image Optimization** | WebP, responsive, lazy load | -60% image size |
| **Font Optimization** | font-display: swap, subset | -50% font load |
| **Caching** | CDN, browser cache, stale-while-revalidate | 90%+ cache hit |
| **Compression** | Brotli (CDN) | -70% transfer size |
| **Database** | Connection pooling, indexes, query optimization | -50% query time |
| **Edge Caching** | Cloud CDN, static assets | <50ms TTFB |

### 9.3 מדרגיות

Cloud Run מספק מדרגיות אוטומטית מ-0 עד 100+ instances בהתאם לעומס. זמן Cold Start מינימלי של פחות מ-100ms בזכות CPU Boost ו-Gen2 execution environment. בסיס הנתונים Cloud SQL תומך ב-High Availability עם failover אוטומטי ו-Read Replicas לעומסים גבוהים. Cloud CDN מפזר עומס סטטי על פני edge locations גלובליים עם נקודת נוכחות בישראל.

---

## נספחים

### נספח א': פקודות התקנה

```bash
# Clone and setup
git clone https://github.com/thrive-system/lashonhara-v2.git
cd lashonhara-v2
pnpm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your values

# Database setup
pnpm db:push

# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Tests
pnpm test

# Type checking
pnpm check

# Linting
pnpm lint
```

### נספח ב': משתני סביבה

```env
# .env.example

# Database
DATABASE_URL=mysql://user:pass@host:3306/lashonhara

# Authentication
JWT_SECRET=your-jwt-secret-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_MONTHLY_PRICE_ID=price_xxx

# SendGrid
SENDGRID_API_KEY=SG.xxx

# GCP
GCP_PROJECT_ID=lashonhara-v2
GCS_BUCKET=lashonhara-uploads

# App
VITE_APP_URL=https://lashonhara.co.il
VITE_APP_TITLE=לשון הרע לא מדבר אליי

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### נספח ג': קישורים שימושיים

| משאב | קישור |
|------|-------|
| React 19 Docs | https://react.dev |
| TailwindCSS 4.0 | https://tailwindcss.com |
| tRPC Docs | https://trpc.io |
| Drizzle ORM | https://orm.drizzle.team |
| Cloud Run Docs | https://cloud.google.com/run/docs |
| Stripe Docs | https://stripe.com/docs |
| SendGrid Docs | https://docs.sendgrid.com |

---

**סוף המסמך**

מסמך זה הוכן על ידי **ניוקלאוס - מבית THRIVE SYSTEM**


---

## 10. מערכת RAG - חפץ חיים

### 10.1 סקירה כללית

מערכת RAG (Retrieval-Augmented Generation) תאפשר למשתמשים לשאול שאלות על הלכות לשון הרע ורכילות ולקבל תשובות מבוססות על ספר "חפץ חיים" של הרב ישראל מאיר הכהן זצ"ל. המערכת תכלול את כל ההלכות, הביאורים והפרשנויות.

### 10.2 תוכן המאגר

#### 10.2.1 ספר חפץ חיים - הלכות לשון הרע

| חלק | תוכן | כמות |
|-----|------|------|
| **הקדמה** | הקדמת המחבר | 1 |
| **פתיחה** | פתיחה להלכות | 1 |
| **לאוין** | איסורי לאו הקשורים ללשון הרע | 17 לאוין |
| **עשין** | מצוות עשה הקשורות לשמירת הלשון | 14 מצוות |
| **ארורין** | ארורים הקשורים ללשון הרע | 3 |
| **הלכות לשון הרע** | כללים א'-י' | 10 כללים, ~100 סעיפים |
| **הלכות רכילות** | כללים א'-ט' | 9 כללים, ~80 סעיפים |
| **ציורים** | דוגמאות מעשיות | 11 ציורים |
| **נספחים** | הערות, תשובות, עליות | 4 נספחים |

#### 10.2.2 באר מים חיים (פירוש)

פירוש מקיף של המחבר על כל הלכה, הכולל מקורות מהש"ס והפוסקים, הרחבות והסברים, ודיונים הלכתיים מעמיקים.

#### 10.2.3 פרשנויות נוספות

| פירוש | תיאור |
|-------|-------|
| **שמירת הלשון** | ספר המוסר של החפץ חיים |
| **נתיבות חיים** | ביאורים על הלכות לשון הרע |
| **מחנה ישראל** | הלכות למחנה צבאי |
| **אהבת חסד** | הלכות גמילות חסדים |

### 10.3 ארכיטקטורת RAG

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                                 │
│                    (Chat Interface / Search Box)                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         QUERY PROCESSING                                 │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Query Parser    │  │ Hebrew NLP      │  │ Intent Classification   │  │
│  │ (Normalize)     │  │ (Tokenization)  │  │ (Question Type)         │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│       VECTOR SEARCH             │   │      KEYWORD SEARCH             │
│   (Semantic Similarity)         │   │   (Full-Text Search)            │
│                                 │   │                                 │
│  ┌───────────────────────────┐  │   │  ┌───────────────────────────┐  │
│  │   Vertex AI Embeddings   │  │   │  │   Cloud SQL Full-Text     │  │
│  │   text-multilingual-     │  │   │  │   (Hebrew Tokenizer)      │  │
│  │   embedding-002          │  │   │  └───────────────────────────┘  │
│  └───────────────────────────┘  │   │                                 │
│                                 │   │  ┌───────────────────────────┐  │
│  ┌───────────────────────────┐  │   │  │   Elasticsearch          │  │
│  │   Vector Store            │  │   │  │   (Hebrew Analyzer)       │  │
│  │   (AlloyDB / Pinecone)    │  │   │  └───────────────────────────┘  │
│  └───────────────────────────┘  │   │                                 │
└─────────────────────────────────┘   └─────────────────────────────────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         CONTEXT BUILDER                                  │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Relevance       │  │ Context         │  │ Source Attribution      │  │
│  │ Ranking         │  │ Aggregation     │  │ (Citations)             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         LLM GENERATION                                   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    Vertex AI (Gemini 2.0)                        │    │
│  │                                                                   │    │
│  │  System Prompt:                                                   │    │
│  │  "אתה מומחה להלכות לשון הרע על פי ספר חפץ חיים.                   │    │
│  │   ענה על שאלות בהתבסס על המקורות שסופקו בלבד.                     │    │
│  │   ציין תמיד את המקור (כלל, סעיף, באר מים חיים)."                  │    │
│  │                                                                   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         RESPONSE                                         │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Answer Text     │  │ Source Links    │  │ Related Halachot        │  │
│  │ (Hebrew)        │  │ (Citations)     │  │ (Suggestions)           │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.4 סכמת בסיס נתונים - RAG

```typescript
// טבלת תוכן החפץ חיים
export const chofetzChaimContent = mysqlTable("chofetz_chaim_content", {
  id: int("id").autoincrement().primaryKey(),
  
  // מיקום בספר
  book: mysqlEnum("book", [
    "chofetz_chaim",      // חפץ חיים
    "shmirat_halashon",   // שמירת הלשון
    "netivot_chaim",      // נתיבות חיים
    "ahavat_chesed"       // אהבת חסד
  ]).notNull(),
  
  section: mysqlEnum("section", [
    "hakdama",            // הקדמה
    "pticha",             // פתיחה
    "lavin",              // לאוין
    "asin",               // עשין
    "arrurin",            // ארורין
    "hilchot_lashon_hara", // הלכות לשון הרע
    "hilchot_rechilut",   // הלכות רכילות
    "tziyurim",           // ציורים
    "nispachim"           // נספחים
  ]).notNull(),
  
  klal: int("klal"),                              // מספר הכלל (1-10)
  seif: int("seif"),                              // מספר הסעיף
  subSeif: varchar("subSeif", { length: 10 }),    // תת-סעיף (א, ב, ג...)
  
  // תוכן
  title: varchar("title", { length: 300 }).notNull(),
  content: text("content").notNull(),             // טקסט ללא ניקוד
  contentWithNikud: text("contentWithNikud"),     // טקסט עם ניקוד
  
  // מטא-דאטה
  wordCount: int("wordCount"),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// טבלת פירושים וביאורים
export const chofetzChaimCommentary = mysqlTable("chofetz_chaim_commentary", {
  id: int("id").autoincrement().primaryKey(),
  
  // קישור לתוכן הראשי
  contentId: int("contentId").notNull().references(() => chofetzChaimContent.id),
  
  // סוג הפירוש
  commentaryType: mysqlEnum("commentaryType", [
    "beer_mayim_chaim",   // באר מים חיים
    "hagahot",            // הגהות
    "hearot",             // הערות
    "tshuvot",            // תשובות
    "modern"              // פירושים מודרניים
  ]).notNull(),
  
  // תוכן הפירוש
  title: varchar("title", { length: 300 }),
  content: text("content").notNull(),
  contentWithNikud: text("contentWithNikud"),
  
  // מקור
  author: varchar("author", { length: 200 }),
  sourceBook: varchar("sourceBook", { length: 300 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// טבלת Embeddings לחיפוש סמנטי
export const chofetzChaimEmbeddings = mysqlTable("chofetz_chaim_embeddings", {
  id: int("id").autoincrement().primaryKey(),
  
  // קישור לתוכן
  contentId: int("contentId").references(() => chofetzChaimContent.id),
  commentaryId: int("commentaryId").references(() => chofetzChaimCommentary.id),
  
  // טקסט ה-chunk
  chunkText: text("chunkText").notNull(),
  chunkIndex: int("chunkIndex").notNull(),
  
  // Vector Embedding (768 dimensions for text-multilingual-embedding-002)
  // Note: MySQL doesn't support vector type natively, use JSON or external vector DB
  embeddingJson: json("embeddingJson"),
  
  // מטא-דאטה לחיפוש
  tokens: int("tokens"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// טבלת שאלות ותשובות (לשיפור המערכת)
export const ragConversations = mysqlTable("rag_conversations", {
  id: int("id").autoincrement().primaryKey(),
  
  userId: int("userId").references(() => users.id),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  
  // השאלה
  question: text("question").notNull(),
  questionEmbeddingJson: json("questionEmbeddingJson"),
  
  // התשובה
  answer: text("answer").notNull(),
  sourcesJson: json("sourcesJson"),  // מערך של contentIds
  
  // משוב
  rating: int("rating"),              // 1-5 stars
  feedback: text("feedback"),
  
  // מטא-דאטה
  responseTimeMs: int("responseTimeMs"),
  tokensUsed: int("tokensUsed"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// טבלת אינדקס נושאים
export const chofetzChaimTopics = mysqlTable("chofetz_chaim_topics", {
  id: int("id").autoincrement().primaryKey(),
  
  topicHebrew: varchar("topicHebrew", { length: 200 }).notNull(),
  topicEnglish: varchar("topicEnglish", { length: 200 }),
  
  description: text("description"),
  
  // קישורים לתוכן רלוונטי
  relatedContentIds: json("relatedContentIds"),  // מערך של IDs
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

### 10.5 שירותי GCP ל-RAG

| שירות | שימוש | עלות משוערת |
|-------|-------|-------------|
| **Vertex AI Embeddings** | יצירת embeddings לטקסט עברי | ~$0.0001/1K tokens |
| **Vertex AI (Gemini 2.0)** | יצירת תשובות | ~$0.00025/1K input, $0.0005/1K output |
| **AlloyDB** | Vector DB עם pgvector | ~$50-100/month |
| **Cloud Run** | RAG Service | ~$20/month |
| **Cloud Tasks** | Async embedding jobs | ~$1/month |

**עלות חודשית משוערת ל-RAG**: ~$80-150/month (תלוי בשימוש)

### 10.6 API Endpoints - RAG

```typescript
// server/routers/rag.ts

export const ragRouter = router({
  // שאילתת RAG - שאלה וקבלת תשובה
  ask: publicProcedure
    .input(z.object({
      question: z.string().min(3).max(500),
      sessionId: z.string().optional(),
      includeCommentary: z.boolean().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      // 1. Create embedding for question
      // 2. Search vector DB for relevant content
      // 3. Build context from top results
      // 4. Generate answer with LLM
      // 5. Return answer with sources
    }),

  // חיפוש בתוכן
  search: publicProcedure
    .input(z.object({
      query: z.string().min(2).max(200),
      section: z.enum(["all", "lashon_hara", "rechilut", "lavin", "asin"]).default("all"),
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      // Full-text + semantic search
    }),

  // קבלת הלכה ספציפית
  getHalacha: publicProcedure
    .input(z.object({
      section: z.enum(["hilchot_lashon_hara", "hilchot_rechilut"]),
      klal: z.number().min(1).max(10),
      seif: z.number().min(1).max(20).optional(),
      includeCommentary: z.boolean().default(true),
    }))
    .query(async ({ input }) => {
      // Get specific halacha with commentary
    }),

  // הלכה יומית
  getDailyHalacha: publicProcedure
    .query(async () => {
      // Return today's halacha based on learning schedule
    }),

  // רשימת נושאים
  getTopics: publicProcedure
    .query(async () => {
      // Return all indexed topics
    }),

  // הלכות לפי נושא
  getByTopic: publicProcedure
    .input(z.object({
      topicId: z.number(),
    }))
    .query(async ({ input }) => {
      // Return all halachot related to topic
    }),

  // משוב על תשובה
  submitFeedback: publicProcedure
    .input(z.object({
      conversationId: z.number(),
      rating: z.number().min(1).max(5),
      feedback: z.string().max(1000).optional(),
    }))
    .mutation(async ({ input }) => {
      // Save feedback for improvement
    }),
});
```

### 10.7 ממשק משתמש - Chat

```typescript
// client/src/components/ChofetzChaimChat.tsx

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    section: string;
    klal: number;
    seif: number;
    title: string;
    snippet: string;
  }[];
  timestamp: Date;
}

// Features:
// - Hebrew RTL interface
// - Streaming responses
// - Source citations with links
// - Related halachot suggestions
// - Daily halacha widget
// - Search history
// - Bookmark favorite answers
```

### 10.8 תהליך הטמעת התוכן

```mermaid
graph TD
    A[Download from Sources] --> B[Parse & Structure]
    B --> C[Store in Database]
    C --> D[Generate Embeddings]
    D --> E[Index in Vector DB]
    E --> F[Test & Validate]
    F --> G[Deploy RAG Service]
    
    subgraph Sources
        S1[Wikisource Hebrew]
        S2[ToratEmet]
        S3[HebrewBooks PDF]
    end
    
    S1 --> A
    S2 --> A
    S3 --> A
```

### 10.9 דוגמאות שימוש

**שאלה**: "האם מותר לספר לחבר שמישהו דיבר עליו רע?"

**תשובה מהמערכת**:
> על פי ספר חפץ חיים, הלכות רכילות כלל א' סעיף א':
> 
> "איסור רכילות הוא שלא לספר לחברו מה שפלוני דיבר עליו או עשה נגדו, אפילו אם הדברים אמת..."
> 
> **באר מים חיים**: מבאר שאיסור זה חמור מאוד כי גורם למחלוקת בין אנשים...
> 
> **מקורות**:
> - הלכות רכילות, כלל א', סעיף א'
> - באר מים חיים, שם
> - הלכות רכילות, כלל ט' (מתי מותר)

### 10.10 אבטחה ופרטיות

| נושא | פתרון |
|------|-------|
| **Rate Limiting** | 10 שאלות/דקה למשתמש |
| **Content Filtering** | סינון שאלות לא רלוונטיות |
| **Prompt Injection** | Sanitization של קלט |
| **Data Privacy** | אנונימיזציה של שיחות |
| **Audit Log** | תיעוד כל השאילתות |

---

*מסמך זה הוכן על ידי ניוקלאוס - מבית THRIVE SYSTEM*


---

## 11. נספחים

המפרט הטכני כולל נספחים מפורטים לכל תת-מערכת:

### 11.1 נספח A: מערכת מכירות (E-commerce)

**קובץ**: `docs/ecommerce-specification.md`

מפרט מלא של מערכת המכירות הכולל:
- קטלוג מוצרים עם 6 קטגוריות
- עגלת קניות עם שמירה
- תהליך Checkout עם Stripe
- ניהול הזמנות מלא
- ניהול מלאי אוטומטי
- משלוחים (חינם מעל 100₪)
- קופונים והנחות
- אזור לקוח אישי
- סיטונאות והזמנות מיוחדות
- 15 טבלאות DB
- 25+ API endpoints

### 11.2 נספח B: מערכת ניהול (Admin Dashboard)

**קובץ**: `docs/admin-specification.md`

מפרט מלא של מערכת הניהול הכולל:
- דשבורד ראשי עם סטטיסטיקות
- ניהול מוצרים וקטגוריות
- ניהול הזמנות
- ניהול תוכן (CMS)
- ניהול התחייבויות
- ניהול ניוזלטר
- ניהול שותפויות
- ניהול גלריה
- ניהול פעילויות
- ניהול הודעות
- ניהול תרומות
- ניהול משתמשים והרשאות
- דוחות ואנליטיקס
- הגדרות מערכת
- Audit Log

### 11.3 נספח C: אינטגרציות חיצוניות

**קובץ**: `docs/integrations-specification.md`

מפרט מלא של כל האינטגרציות:
- Stripe - תשלומים ותרומות
- SendGrid/Flashy - אימיילים
- Google Analytics
- Facebook Pixel
- Instagram Feed
- WhatsApp Business
- Google Tag Manager
- Cloud Storage
- סרגל נגישות מלא

### 11.4 נספח D: מערכת RAG - חפץ חיים

**קובץ**: `docs/chofetz-chaim-sources-research.md`

מחקר מקורות ומפרט מערכת RAG:
- מקורות דיגיטליים (ויקיטקסט, תורת אמת)
- סכמת DB לתוכן
- Vector embeddings
- AI Q&A
- לימוד יומי

### 11.5 נספח E: ספר מותג

**קובץ**: `docs/brand-book-summary.md`

סיכום הנחיות המותג:
- צבעים: אדום #ED1C24, שחור, לבן
- פונט: Heebo
- לוגואים: 4 גרסאות
- רקעים: טקסטורת בטון

### 11.6 נספח F: בדיקת פונקציות קיימות

**קובץ**: `docs/existing-features-audit.md`

בדיקה מקיפה של האתר הקיים:
- כל הדפים והסקשנים
- מערכת WooCommerce
- טפסים
- אינטגרציות
- נגישות
- רשימת פונקציות נדרשות

---

## 12. סיכום

מפרט זה מגדיר מערכת מלאה לאתר V2 של "לשון הרע לא מדבר אליי" הכוללת:

| רכיב | תיאור |
|------|-------|
| **Frontend** | React 19, TypeScript 5.7, TailwindCSS 4.0 |
| **Backend** | Node.js 22, Express 5, tRPC 11 |
| **Database** | Cloud SQL MySQL 8.4, Drizzle ORM |
| **E-commerce** | חנות מלאה עם Stripe |
| **Admin** | מערכת ניהול מקיפה |
| **RAG** | מערכת AI לחפץ חיים |
| **Cloud** | GCP (Cloud Run, Cloud SQL, Cloud Storage) |

### עלות משוערת

| סביבה | עלות חודשית |
|-------|-------------|
| Development | ~$50 |
| Production | ~$200-400 |

### לוח זמנים

| ספרינט | שבועות | תוכן |
|--------|--------|------|
| 1 | 1-2 | תשתית, DB, Design System |
| 2 | 3-4 | דפים, גלריה, CMS |
| 3 | 5-6 | E-commerce, Stripe |
| 4 | 7-8 | RAG, Email, השקה |

---

*מסמך זה הוכן על ידי ניוקלאוס - מבית THRIVE SYSTEM*
