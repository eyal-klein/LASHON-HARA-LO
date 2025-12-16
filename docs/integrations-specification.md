# נספח: אינטגרציות חיצוניות - מפרט מלא

**גרסה**: 1.0  
**תאריך**: דצמבר 2024  
**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM

---

## תוכן עניינים

1. [Stripe - תשלומים ותרומות](#1-stripe---תשלומים-ותרומות)
2. [SendGrid/Flashy - אימיילים](#2-sendgridflashy---אימיילים)
3. [Google Analytics](#3-google-analytics)
4. [Facebook Pixel](#4-facebook-pixel)
5. [Instagram Feed](#5-instagram-feed)
6. [WhatsApp Business](#6-whatsapp-business)
7. [Google Tag Manager](#7-google-tag-manager)
8. [Cloud Storage - תמונות](#8-cloud-storage---תמונות)
9. [נגישות](#9-נגישות)

---

## 1. Stripe - תשלומים ותרומות

### 1.1 סקירה

Stripe משמש לכל התשלומים באתר - הן עבור רכישות בחנות והן עבור תרומות.

### 1.2 תכונות

| תכונה | תיאור |
|-------|-------|
| Payment Intents | תשלומים חד-פעמיים |
| Webhooks | עדכוני סטטוס תשלום |
| Refunds | החזרים כספיים |
| Stripe Elements | טופס כרטיס אשראי מאובטח |

### 1.3 הגדרות נדרשות

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 1.4 Webhook Events

| Event | פעולה |
|-------|-------|
| payment_intent.succeeded | עדכון הזמנה ל-processing |
| payment_intent.payment_failed | עדכון הזמנה ל-failed |
| charge.refunded | עדכון הזמנה ל-refunded |

### 1.5 קוד לדוגמה

```typescript
// server/integrations/stripe.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = async (amount: number, orderId: number) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // agorot
    currency: 'ils',
    metadata: { orderId: orderId.toString() },
    automatic_payment_methods: { enabled: true },
  });
};

export const createDonationIntent = async (amount: number, donorEmail: string) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'ils',
    receipt_email: donorEmail,
    metadata: { type: 'donation' },
  });
};

export const refundPayment = async (paymentIntentId: string, amount?: number) => {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
};
```

---

## 2. SendGrid/Flashy - אימיילים

### 2.1 סקירה

מערכת שליחת אימיילים אוטומטית לכל סוגי ההודעות - אישורי הזמנה, ניוזלטר, התראות.

### 2.2 סוגי אימיילים

| סוג | Trigger | תבנית |
|-----|---------|-------|
| אישור הזמנה | payment_intent.succeeded | order-confirmation |
| הזמנה נשלחה | סטטוס → shipped | order-shipped |
| התחייבות חדשה | טופס התחייבות | commitment-welcome |
| ברוכים הבאים | הרשמה לניוזלטר | newsletter-welcome |
| ניוזלטר | קמפיין ידני | newsletter-campaign |
| איפוס סיסמה | בקשת איפוס | password-reset |
| תודה על תרומה | תרומה הושלמה | donation-thanks |

### 2.3 הגדרות נדרשות

```env
# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=info@lashonhara.co.il
SENDGRID_FROM_NAME=לשון הרע לא מדבר אליי

# Flashy (Alternative)
FLASHY_API_KEY=xxx
FLASHY_LIST_ID=xxx
```

### 2.4 קוד לדוגמה

```typescript
// server/integrations/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailParams {
  to: string;
  subject: string;
  templateId: string;
  dynamicData: Record<string, any>;
}

export const sendEmail = async ({ to, subject, templateId, dynamicData }: EmailParams) => {
  return sgMail.send({
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: process.env.SENDGRID_FROM_NAME!,
    },
    subject,
    templateId,
    dynamicTemplateData: dynamicData,
  });
};

// Email Templates
export const sendOrderConfirmation = async (order: Order) => {
  return sendEmail({
    to: order.customerEmail,
    subject: `אישור הזמנה #${order.orderNumber}`,
    templateId: 'd-order-confirmation',
    dynamicData: {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      items: order.items,
      total: order.total,
      shippingAddress: order.shippingAddress,
    },
  });
};

export const sendCommitmentWelcome = async (commitment: Commitment) => {
  return sendEmail({
    to: commitment.email,
    subject: 'ברוכים הבאים למהפכה!',
    templateId: 'd-commitment-welcome',
    dynamicData: {
      name: commitment.name,
    },
  });
};
```

### 2.5 תבניות אימייל

כל התבניות בעברית עם RTL, כוללות:
- לוגו העמותה
- עיצוב תואם למותג (אדום #ED1C24)
- קישורים לרשתות חברתיות
- לינק להסרה מרשימת תפוצה

---

## 3. Google Analytics

### 3.1 סקירה

מעקב אחר תנועה, המרות, ומקורות תנועה.

### 3.2 הגדרות

```env
VITE_GA_MEASUREMENT_ID=G-XS359NZ9QV
```

### 3.3 Events לעקוב

| Event | Parameters | Trigger |
|-------|------------|---------|
| page_view | page_title, page_location | כל דף |
| sign_up | method: 'commitment' | טופס התחייבות |
| add_to_cart | item_id, item_name, price | הוספה לעגלה |
| begin_checkout | value, items | התחלת checkout |
| purchase | transaction_id, value, items | רכישה הושלמה |
| donate | value | תרומה הושלמה |

### 3.4 קוד לדוגמה

```typescript
// client/src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

export const trackPurchase = (order: Order) => {
  trackEvent('purchase', {
    transaction_id: order.orderNumber,
    value: order.total,
    currency: 'ILS',
    items: order.items.map(item => ({
      item_id: item.productId,
      item_name: item.productName,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const trackAddToCart = (product: Product, quantity: number) => {
  trackEvent('add_to_cart', {
    currency: 'ILS',
    value: product.price * quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity,
    }],
  });
};

export const trackCommitment = () => {
  trackEvent('sign_up', { method: 'commitment' });
};

export const trackDonation = (amount: number) => {
  trackEvent('donate', { value: amount, currency: 'ILS' });
};
```

---

## 4. Facebook Pixel

### 4.1 סקירה

מעקב המרות לפרסום בפייסבוק ואינסטגרם.

### 4.2 הגדרות

```env
VITE_FB_PIXEL_ID=xxx
```

### 4.3 Events

| Event | Parameters | Trigger |
|-------|------------|---------|
| PageView | - | כל דף |
| Lead | - | טופס התחייבות |
| AddToCart | content_ids, value | הוספה לעגלה |
| InitiateCheckout | value, num_items | התחלת checkout |
| Purchase | value, content_ids | רכישה |
| Donate | value | תרומה |

### 4.4 קוד לדוגמה

```typescript
// client/src/lib/fbPixel.ts
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const trackFBEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
};

export const fbTrackPurchase = (order: Order) => {
  trackFBEvent('Purchase', {
    value: order.total,
    currency: 'ILS',
    content_ids: order.items.map(i => i.productId.toString()),
    content_type: 'product',
  });
};

export const fbTrackLead = () => {
  trackFBEvent('Lead');
};
```

---

## 5. Instagram Feed

### 5.1 סקירה

הצגת פיד אינסטגרם של העמותה באתר.

### 5.2 אפשרויות

| אפשרות | תיאור |
|--------|-------|
| Elfsight Widget | Widget חיצוני (כמו באתר הקיים) |
| Instagram Basic Display API | API רשמי |
| Custom Component | רכיב מותאם |

### 5.3 Elfsight (פשוט)

```html
<!-- client/index.html -->
<script src="https://static.elfsight.com/platform/platform.js" async></script>
<div class="elfsight-app-xxx"></div>
```

### 5.4 Instagram API (מתקדם)

```typescript
// server/integrations/instagram.ts
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export const getInstagramFeed = async (limit = 12) => {
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${limit}`
  );
  return response.json();
};
```

---

## 6. WhatsApp Business

### 6.1 סקירה

כפתור WhatsApp ליצירת קשר מהירה.

### 6.2 הגדרות

```env
VITE_WHATSAPP_NUMBER=972501234567
VITE_WHATSAPP_MESSAGE=שלום, אני מעוניין לקבל מידע נוסף
```

### 6.3 רכיב

```tsx
// client/src/components/WhatsAppButton.tsx
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER;
  const message = encodeURIComponent(import.meta.env.VITE_WHATSAPP_MESSAGE);
  const url = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      aria-label="צור קשר בוואטסאפ"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};
```

---

## 7. Google Tag Manager

### 7.1 סקירה

ניהול מרכזי של כל התגיות והסקריפטים.

### 7.2 הגדרות

```env
VITE_GTM_ID=GTM-P6NWLLBL
```

### 7.3 קוד

```html
<!-- client/index.html - Head -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-P6NWLLBL');
</script>

<!-- Body -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P6NWLLBL"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
```

### 7.4 Data Layer Events

```typescript
// client/src/lib/gtm.ts
declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const pushToDataLayer = (event: string, data?: Record<string, any>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
  });
};
```

---

## 8. Cloud Storage - תמונות

### 8.1 סקירה

אחסון כל התמונות והקבצים ב-Google Cloud Storage.

### 8.2 מבנה Buckets

```
lashonhara-media/
├── products/          # תמונות מוצרים
├── gallery/           # גלריית שגרירים
├── activities/        # תמונות פעילויות
├── content/           # תמונות תוכן
└── uploads/           # העלאות כלליות
```

### 8.3 קוד

```typescript
// server/integrations/storage.ts
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket('lashonhara-media');

export const uploadFile = async (
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> => {
  const blob = bucket.file(path);
  
  await blob.save(file, {
    contentType,
    public: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  return `https://storage.googleapis.com/lashonhara-media/${path}`;
};

export const deleteFile = async (path: string): Promise<void> => {
  await bucket.file(path).delete();
};

export const getSignedUrl = async (path: string, expiresIn = 3600): Promise<string> => {
  const [url] = await bucket.file(path).getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresIn * 1000,
  });
  return url;
};
```

---

## 9. נגישות

### 9.1 סקירה

סרגל נגישות מלא כמו באתר הקיים, עם תמיכה בכל התכונות הנדרשות.

### 9.2 תכונות

| תכונה | קיצור | תיאור |
|-------|-------|-------|
| ניווט מקלדת | Shift+A | הפעלת ניווט מקלדת |
| ביטול הבהובים | Shift+B | עצירת אנימציות |
| מונוכרום | Shift+C | תצוגה בשחור-לבן |
| ספיה | Shift+D | גוון ספיה |
| ניגודיות גבוהה | Shift+E | הגברת ניגודיות |
| שחור צהוב | Shift+F | רקע שחור, טקסט צהוב |
| היפוך צבעים | Shift+G | היפוך כל הצבעים |
| הדגשת כותרות | Shift+H | הדגשת כותרות |
| הדגשת קישורים | Shift+I | הדגשת קישורים |
| הגדלת גופן | Shift+M | הגדלת גודל טקסט |
| הקטנת גופן | Shift+N | הקטנת גודל טקסט |
| סמן גדול | Shift+Q | הגדלת סמן העכבר |
| מצב קריאה | Shift+W | תצוגת קריאה נקייה |

### 9.3 רכיב נגישות

```tsx
// client/src/components/AccessibilityToolbar.tsx
import { useState } from 'react';
import { Accessibility } from 'lucide-react';

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  monochrome: boolean;
  highlightLinks: boolean;
  highlightHeadings: boolean;
  bigCursor: boolean;
  readingMode: boolean;
}

export const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>({
    fontSize: 100,
    highContrast: false,
    monochrome: false,
    highlightLinks: false,
    highlightHeadings: false,
    bigCursor: false,
    readingMode: false,
  });

  // Apply accessibility changes to document
  useEffect(() => {
    document.documentElement.style.fontSize = `${state.fontSize}%`;
    document.body.classList.toggle('high-contrast', state.highContrast);
    document.body.classList.toggle('monochrome', state.monochrome);
    document.body.classList.toggle('highlight-links', state.highlightLinks);
    document.body.classList.toggle('highlight-headings', state.highlightHeadings);
    document.body.classList.toggle('big-cursor', state.bigCursor);
    document.body.classList.toggle('reading-mode', state.readingMode);
  }, [state]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg"
        aria-label="פתח תפריט נגישות"
      >
        <Accessibility className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-white rounded-lg shadow-xl p-4 w-72">
          <h3 className="text-lg font-bold mb-4">הגדרות נגישות</h3>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-sm mb-2">גודל גופן: {state.fontSize}%</label>
            <div className="flex gap-2">
              <button onClick={() => setState(s => ({ ...s, fontSize: s.fontSize - 10 }))}>-</button>
              <button onClick={() => setState(s => ({ ...s, fontSize: 100 }))}>איפוס</button>
              <button onClick={() => setState(s => ({ ...s, fontSize: s.fontSize + 10 }))}>+</button>
            </div>
          </div>

          {/* Toggle Options */}
          {[
            { key: 'highContrast', label: 'ניגודיות גבוהה' },
            { key: 'monochrome', label: 'מונוכרום' },
            { key: 'highlightLinks', label: 'הדגשת קישורים' },
            { key: 'highlightHeadings', label: 'הדגשת כותרות' },
            { key: 'bigCursor', label: 'סמן גדול' },
            { key: 'readingMode', label: 'מצב קריאה' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={state[key as keyof AccessibilityState] as boolean}
                onChange={() => setState(s => ({ ...s, [key]: !s[key as keyof AccessibilityState] }))}
              />
              {label}
            </label>
          ))}

          {/* Reset All */}
          <button
            onClick={() => setState({
              fontSize: 100,
              highContrast: false,
              monochrome: false,
              highlightLinks: false,
              highlightHeadings: false,
              bigCursor: false,
              readingMode: false,
            })}
            className="w-full mt-4 bg-gray-200 py-2 rounded"
          >
            איפוס הכל
          </button>
        </div>
      )}
    </>
  );
};
```

### 9.4 CSS נגישות

```css
/* client/src/styles/accessibility.css */

/* High Contrast */
body.high-contrast {
  filter: contrast(1.5);
}

/* Monochrome */
body.monochrome {
  filter: grayscale(100%);
}

/* Highlight Links */
body.highlight-links a {
  outline: 3px solid yellow !important;
  background: yellow !important;
  color: black !important;
}

/* Highlight Headings */
body.highlight-headings h1,
body.highlight-headings h2,
body.highlight-headings h3,
body.highlight-headings h4,
body.highlight-headings h5,
body.highlight-headings h6 {
  outline: 3px solid cyan !important;
  background: cyan !important;
  color: black !important;
}

/* Big Cursor */
body.big-cursor,
body.big-cursor * {
  cursor: url('data:image/svg+xml,...') 16 16, auto !important;
}

/* Reading Mode */
body.reading-mode {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5dc;
  line-height: 1.8;
}
```

---

## 10. סיכום אינטגרציות

### 10.1 משתני סביבה נדרשים

```env
# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=

# Analytics
VITE_GA_MEASUREMENT_ID=
VITE_FB_PIXEL_ID=
VITE_GTM_ID=

# Social
INSTAGRAM_ACCESS_TOKEN=
VITE_WHATSAPP_NUMBER=

# Storage
GCP_PROJECT_ID=
GCP_STORAGE_BUCKET=
```

### 10.2 תלויות NPM

```json
{
  "dependencies": {
    "stripe": "^14.x",
    "@sendgrid/mail": "^8.x",
    "@google-cloud/storage": "^7.x"
  }
}
```

---

*מסמך זה הוא נספח למפרט הטכני הראשי ומפרט את כל האינטגרציות החיצוניות.*
