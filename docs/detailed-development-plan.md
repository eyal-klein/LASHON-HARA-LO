# תוכנית פיתוח מפורטת - "לשון הרע לא מדבר אליי" V2

**תאריך**: דצמבר 2024
**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM
**משך הפרויקט**: 8 שבועות (40 ימי עבודה)

---

## 1. סקירה כללית

### מטרת הפרויקט
בניית אתר V2 מודרני לעמותת "לשון הרע לא מדבר אליי" הכולל חנות מקוונת, מערכת ניהול, מערכת RAG לחפץ חיים, ואינטגרציות מתקדמות.

### צוות נדרש

| תפקיד | כמות | אחריות |
|-------|------|--------|
| Full-Stack Developer | 1-2 | פיתוח Frontend ו-Backend |
| DevOps Engineer | 0.5 | הקמת תשתית GCP |
| QA Engineer | 0.5 | בדיקות |
| Project Manager | 0.25 | ניהול ומעקב |

### סטאק טכנולוגי מאושר

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | React 19, TypeScript 5.7, TailwindCSS 4.0, Vite 6.0 |
| Backend | Node.js 22, Express 5, tRPC 11 |
| Database | Cloud SQL MySQL 8.4, Cloud SQL PostgreSQL 16 + pgvector |
| AI/ML | Vertex AI Gemini 2.0 Flash, text-embedding-004 |
| Infrastructure | Cloud Run, Cloud Storage, Cloud CDN, Cloud Armor |
| Payments | Stripe |
| Email | SendGrid |

---

## 2. חלוקה לספרינטים

### Sprint 1: תשתית ו-Design System (שבועות 1-2)
### Sprint 2: דפים ראשיים וטפסים (שבועות 3-4)
### Sprint 3: E-commerce ו-Stripe (שבועות 5-6)
### Sprint 4: RAG, Admin ו-Launch (שבועות 7-8)

---

## 3. Sprint 1 - תשתית ו-Design System

**משך**: 10 ימי עבודה
**מטרה**: הקמת תשתית GCP, Design System, ודפי בסיס

### שבוע 1 (ימים 1-5)

#### יום 1: הקמת פרויקט GCP
| משימה | שעות | תיאור |
|-------|------|-------|
| יצירת GCP Project | 1 | הגדרת פרויקט ו-billing |
| הפעלת APIs | 1 | Cloud Run, Cloud SQL, Storage, Secret Manager |
| יצירת Service Accounts | 1 | SA לכל שירות עם הרשאות מינימליות |
| הגדרת Secret Manager | 1 | שמירת credentials |
| הגדרת Cloud SQL | 2 | MySQL instance + PostgreSQL instance |
| תיעוד | 1 | עדכון README עם הוראות setup |

**Deliverable**: GCP Project מוכן עם כל השירותים

#### יום 2: הגדרת CI/CD
| משימה | שעות | תיאור |
|-------|------|-------|
| הגדרת Cloud Build | 2 | Trigger מ-GitHub |
| יצירת Dockerfile | 1 | Multi-stage build |
| הגדרת Cloud Run | 2 | Service configuration |
| בדיקת deployment | 2 | Deploy ראשוני |
| תיעוד | 1 | CI/CD documentation |

**Deliverable**: Pipeline עובד מ-GitHub ל-Cloud Run

#### יום 3: Database Schema
| משימה | שעות | תיאור |
|-------|------|-------|
| עיצוב schema מלא | 3 | כל הטבלאות |
| יצירת Drizzle migrations | 2 | MySQL schema |
| יצירת PostgreSQL schema | 2 | RAG tables + pgvector |
| Seed data | 1 | נתוני בדיקה |

**Deliverable**: Database schema מלא ומיגרציות

#### יום 4: Design System - צבעים ופונטים
| משימה | שעות | תיאור |
|-------|------|-------|
| הגדרת CSS variables | 2 | צבעים לפי ספר מותג |
| הגדרת Heebo font | 1 | Google Fonts integration |
| יצירת theme configuration | 2 | TailwindCSS config |
| יצירת color palette component | 1 | תיעוד צבעים |
| בדיקת RTL | 2 | תמיכה בעברית |

**Deliverable**: Design System בסיסי

#### יום 5: Design System - רכיבים בסיסיים
| משימה | שעות | תיאור |
|-------|------|-------|
| Button component | 1 | כל הווריאציות |
| Input component | 1 | Text, email, phone |
| Card component | 1 | Product, info cards |
| Header component | 2 | Navigation, logo |
| Footer component | 2 | Links, social, contact |
| בדיקות | 1 | Visual testing |

**Deliverable**: רכיבי UI בסיסיים

### שבוע 2 (ימים 6-10)

#### יום 6: Layout ו-Navigation
| משימה | שעות | תיאור |
|-------|------|-------|
| Main layout | 2 | Header + Footer + Content |
| Mobile navigation | 2 | Hamburger menu |
| Breadcrumbs | 1 | Navigation trail |
| Scroll to top | 0.5 | Button component |
| WhatsApp button | 0.5 | Floating button |
| בדיקות responsive | 2 | Mobile, tablet, desktop |

**Deliverable**: Layout מלא ורספונסיבי

#### יום 7: דף הבית - Hero Section
| משימה | שעות | תיאור |
|-------|------|-------|
| Hero design | 2 | לפי מוקאפ |
| Background texture | 1 | טקסטורת בטון |
| Logo integration | 1 | לוגו מותג |
| CTA buttons | 1 | כפתורי פעולה |
| Animation | 1 | Framer Motion |
| Mobile optimization | 2 | רספונסיביות |

**Deliverable**: Hero Section מושלם

#### יום 8: דף הבית - סקשן לשון הרע
| משימה | שעות | תיאור |
|-------|------|-------|
| "מה זה לשון הרע" section | 2 | תוכן + עיצוב |
| ציטוט גנדי | 1 | Quote component |
| Icons integration | 1 | Lucide icons |
| Animation on scroll | 1 | Intersection Observer |
| בדיקות | 2 | Cross-browser |

**Deliverable**: סקשן הסבר לשון הרע

#### יום 9: דף הבית - כרטיסי שותפות
| משימה | שעות | תיאור |
|-------|------|-------|
| Partnership card component | 2 | 4 סוגי שותפות |
| Grid layout | 1 | Responsive grid |
| Hover effects | 1 | Animations |
| Modal for details | 2 | Dialog component |
| בדיקות | 2 | Functionality |

**Deliverable**: 4 כרטיסי שותפות

#### יום 10: Sprint Review ו-Testing
| משימה | שעות | תיאור |
|-------|------|-------|
| Integration testing | 2 | כל הרכיבים יחד |
| Bug fixes | 2 | תיקון באגים |
| Performance check | 1 | Lighthouse audit |
| Documentation | 1 | עדכון README |
| Sprint review | 1 | סיכום והצגה |
| Planning Sprint 2 | 1 | הכנה לספרינט הבא |

**Deliverable**: Sprint 1 מושלם ומתועד

---

## 4. Sprint 2 - דפים ראשיים וטפסים

**משך**: 10 ימי עבודה
**מטרה**: השלמת כל דפי האתר הראשיים וטפסים

### שבוע 3 (ימים 11-15)

#### יום 11: טופס התחייבות אישית
| משימה | שעות | תיאור |
|-------|------|-------|
| Form design | 2 | שם, טלפון, אימייל, checkbox |
| Form validation | 1 | Zod schema |
| tRPC endpoint | 1 | commitments.create |
| Database integration | 1 | שמירה ל-DB |
| Success message | 1 | Toast notification |
| בדיקות | 2 | E2E testing |

**Deliverable**: טופס התחייבות עובד

#### יום 12: טופס ניוזלטר + צור קשר
| משימה | שעות | תיאור |
|-------|------|-------|
| Newsletter form | 2 | Email subscription |
| Contact form | 2 | Full contact form |
| tRPC endpoints | 1 | subscribers.create, contact.submit |
| Email validation | 1 | Double opt-in |
| בדיקות | 2 | Form testing |

**Deliverable**: טפסי ניוזלטר וצור קשר

#### יום 13: דף אודות
| משימה | שעות | תיאור |
|-------|------|-------|
| Page layout | 2 | עיצוב הדף |
| Content sections | 2 | סיפור, חזון, מטרות |
| Team section | 1 | אם רלוונטי |
| Images | 1 | תמונות מותג |
| בדיקות | 2 | Responsive |

**Deliverable**: דף אודות מלא

#### יום 14: דף הפעילויות
| משימה | שעות | תיאור |
|-------|------|-------|
| Activities page | 2 | Layout |
| Activity cards | 2 | חלוקות, שגרירים, סדנאות |
| Filter/tabs | 1 | לפי סוג פעילות |
| tRPC endpoint | 1 | activities.list |
| בדיקות | 2 | Functionality |

**Deliverable**: דף הפעילויות

#### יום 15: דף גלריה - בסיס
| משימה | שעות | תיאור |
|-------|------|-------|
| Gallery layout | 2 | Masonry grid |
| Image component | 1 | Lazy loading |
| Lightbox | 2 | Full-screen view |
| Categories filter | 1 | שגרירים, אירועים |
| בדיקות | 2 | Performance |

**Deliverable**: גלריה בסיסית

### שבוע 4 (ימים 16-20)

#### יום 16: גלריה - Cloud Storage Integration
| משימה | שעות | תיאור |
|-------|------|-------|
| Cloud Storage setup | 2 | Bucket configuration |
| Upload endpoint | 2 | tRPC gallery.uploadImage |
| Image optimization | 1 | Resize, compress |
| CDN integration | 1 | Cloud CDN |
| בדיקות | 2 | Upload testing |

**Deliverable**: גלריה עם אחסון ענן

#### יום 17: דף צור קשר מלא
| משימה | שעות | תיאור |
|-------|------|-------|
| Contact page design | 2 | Layout מלא |
| Map integration | 1 | Google Maps |
| Social links | 1 | Facebook, Instagram, WhatsApp |
| Contact info | 1 | טלפון, אימייל, כתובת |
| בדיקות | 2 | Responsive |

**Deliverable**: דף צור קשר מלא

#### יום 18: דף תרומה - UI
| משימה | שעות | תיאור |
|-------|------|-------|
| Donation page design | 2 | Layout |
| Amount selection | 2 | Preset + custom amounts |
| Donor form | 1 | פרטי תורם |
| Thank you page | 1 | אישור תרומה |
| בדיקות | 2 | UI testing |

**Deliverable**: UI לדף תרומה

#### יום 19: CMS Backend - בסיס
| משימה | שעות | תיאור |
|-------|------|-------|
| Content schema | 1 | Database tables |
| content.get endpoint | 1 | קריאת תוכן |
| content.update endpoint | 2 | עדכון תוכן |
| Content seeding | 2 | תוכן ראשוני |
| בדיקות | 2 | CRUD testing |

**Deliverable**: CMS Backend בסיסי

#### יום 20: Sprint 2 Review
| משימה | שעות | תיאור |
|-------|------|-------|
| Integration testing | 2 | כל הדפים |
| Bug fixes | 2 | תיקונים |
| Performance audit | 1 | Lighthouse |
| Documentation | 1 | עדכון docs |
| Sprint review | 1 | סיכום |
| Planning Sprint 3 | 1 | הכנה |

**Deliverable**: Sprint 2 מושלם

---

## 5. Sprint 3 - E-commerce ו-Stripe

**משך**: 10 ימי עבודה
**מטרה**: מערכת מכירות מלאה עם Stripe

### שבוע 5 (ימים 21-25)

#### יום 21: Products Schema ו-Backend
| משימה | שעות | תיאור |
|-------|------|-------|
| Products schema | 2 | טבלאות מוצרים |
| Categories schema | 1 | קטגוריות |
| Variants schema | 1 | וריאציות |
| products.list endpoint | 1 | רשימת מוצרים |
| products.getById endpoint | 1 | מוצר בודד |
| בדיקות | 2 | API testing |

**Deliverable**: Backend למוצרים

#### יום 22: Product Catalog UI
| משימה | שעות | תיאור |
|-------|------|-------|
| Products page | 2 | Grid layout |
| Product card | 2 | תמונה, שם, מחיר |
| Category filter | 1 | סינון לפי קטגוריה |
| Search | 1 | חיפוש מוצרים |
| בדיקות | 2 | UI testing |

**Deliverable**: קטלוג מוצרים

#### יום 23: Product Detail Page
| משימה | שעות | תיאור |
|-------|------|-------|
| Product page | 2 | Layout מלא |
| Image gallery | 1 | תמונות מוצר |
| Variant selector | 1 | בחירת וריאציה |
| Add to cart | 1 | כפתור הוספה |
| Related products | 1 | מוצרים קשורים |
| בדיקות | 2 | Functionality |

**Deliverable**: דף מוצר

#### יום 24: Shopping Cart
| משימה | שעות | תיאור |
|-------|------|-------|
| Cart schema | 1 | Database |
| cart.add endpoint | 1 | הוספה לעגלה |
| cart.update endpoint | 1 | עדכון כמות |
| cart.remove endpoint | 1 | הסרה |
| Cart UI | 2 | Drawer/page |
| בדיקות | 2 | Cart testing |

**Deliverable**: עגלת קניות

#### יום 25: Stripe Integration - Setup
| משימה | שעות | תיאור |
|-------|------|-------|
| Stripe account setup | 1 | API keys |
| Stripe SDK integration | 2 | Server-side |
| Payment Intent | 2 | Create payment |
| Webhook setup | 2 | Payment events |
| בדיקות | 1 | Test mode |

**Deliverable**: Stripe מוגדר

### שבוע 6 (ימים 26-30)

#### יום 26: Checkout Flow
| משימה | שעות | תיאור |
|-------|------|-------|
| Checkout page | 2 | Multi-step form |
| Shipping form | 1 | כתובת משלוח |
| Shipping calculation | 1 | חינם מעל 100₪ |
| Order summary | 1 | סיכום הזמנה |
| Stripe Elements | 2 | Payment form |
| בדיקות | 1 | Flow testing |

**Deliverable**: תהליך Checkout

#### יום 27: Order Management
| משימה | שעות | תיאור |
|-------|------|-------|
| Orders schema | 1 | Database |
| orders.create endpoint | 2 | יצירת הזמנה |
| orders.list endpoint | 1 | רשימת הזמנות |
| Order confirmation | 2 | Email + page |
| בדיקות | 2 | Order flow |

**Deliverable**: ניהול הזמנות

#### יום 28: Donations with Stripe
| משימה | שעות | תיאור |
|-------|------|-------|
| Donation payment | 2 | Stripe integration |
| donations.create endpoint | 1 | שמירת תרומה |
| Receipt generation | 2 | קבלה |
| Thank you email | 1 | אימייל תודה |
| בדיקות | 2 | Donation flow |

**Deliverable**: תרומות עם Stripe

#### יום 29: Coupons ו-Discounts
| משימה | שעות | תיאור |
|-------|------|-------|
| Coupons schema | 1 | Database |
| coupons.validate endpoint | 2 | בדיקת קופון |
| Apply coupon UI | 2 | בעגלה/checkout |
| Discount calculation | 1 | חישוב הנחה |
| בדיקות | 2 | Coupon testing |

**Deliverable**: מערכת קופונים

#### יום 30: Sprint 3 Review
| משימה | שעות | תיאור |
|-------|------|-------|
| E2E testing | 2 | Full purchase flow |
| Bug fixes | 2 | תיקונים |
| Performance | 1 | Optimization |
| Documentation | 1 | API docs |
| Sprint review | 1 | סיכום |
| Planning Sprint 4 | 1 | הכנה |

**Deliverable**: Sprint 3 מושלם

---

## 6. Sprint 4 - RAG, Admin ו-Launch

**משך**: 10 ימי עבודה
**מטרה**: מערכת RAG, Admin Dashboard, והשקה

### שבוע 7 (ימים 31-35)

#### יום 31: RAG - Content Scraping
| משימה | שעות | תיאור |
|-------|------|-------|
| Scraper setup | 2 | ויקיטקסט + תורת אמת |
| Content parsing | 2 | חילוץ הלכות |
| Database storage | 1 | שמירה ל-PostgreSQL |
| Content validation | 1 | בדיקת שלמות |
| בדיקות | 2 | Data quality |

**Deliverable**: תוכן חפץ חיים ב-DB

#### יום 32: RAG - Embeddings
| משימה | שעות | תיאור |
|-------|------|-------|
| Vertex AI setup | 1 | API configuration |
| Embedding generation | 3 | כל התוכן |
| pgvector storage | 2 | שמירת וקטורים |
| בדיקות | 2 | Vector search |

**Deliverable**: Embeddings מוכנים

#### יום 33: RAG - Search ו-Chat
| משימה | שעות | תיאור |
|-------|------|-------|
| rag.search endpoint | 2 | חיפוש סמנטי |
| rag.ask endpoint | 2 | שאלה ותשובה |
| Gemini integration | 2 | Response generation |
| בדיקות | 2 | Q&A testing |

**Deliverable**: RAG Backend

#### יום 34: RAG - UI
| משימה | שעות | תיאור |
|-------|------|-------|
| Chat interface | 2 | AIChatBox component |
| Search UI | 1 | חיפוש הלכות |
| Daily halacha | 1 | הלכה יומית |
| Sources display | 2 | הצגת מקורות |
| בדיקות | 2 | UX testing |

**Deliverable**: RAG UI מלא

#### יום 35: Admin Dashboard - Layout
| משימה | שעות | תיאור |
|-------|------|-------|
| Admin layout | 2 | Sidebar + content |
| Dashboard home | 2 | סטטיסטיקות |
| Auth protection | 1 | Admin only |
| Navigation | 1 | All modules |
| בדיקות | 2 | Access control |

**Deliverable**: Admin Layout

### שבוע 8 (ימים 36-40)

#### יום 36: Admin - Products ו-Orders
| משימה | שעות | תיאור |
|-------|------|-------|
| Products management | 3 | CRUD UI |
| Orders management | 3 | List + status |
| בדיקות | 2 | Admin testing |

**Deliverable**: Admin E-commerce

#### יום 37: Admin - Content ו-Gallery
| משימה | שעות | תיאור |
|-------|------|-------|
| Content editor | 3 | CMS UI |
| Gallery management | 2 | Upload + organize |
| Activities management | 2 | CRUD |
| בדיקות | 1 | Testing |

**Deliverable**: Admin CMS

#### יום 38: Admin - Users ו-Reports
| משימה | שעות | תיאור |
|-------|------|-------|
| Commitments list | 1 | רשימה + export |
| Subscribers list | 1 | ניוזלטר |
| Donations list | 1 | תרומות |
| Contact messages | 1 | הודעות |
| Reports | 2 | גרפים וסטטיסטיקות |
| בדיקות | 2 | Testing |

**Deliverable**: Admin Reports

#### יום 39: Email Integration
| משימה | שעות | תיאור |
|-------|------|-------|
| SendGrid setup | 1 | API configuration |
| Email templates | 2 | Order, donation, newsletter |
| Automated emails | 2 | Triggers |
| Newsletter send | 2 | Campaign sending |
| בדיקות | 1 | Email testing |

**Deliverable**: Email System

#### יום 40: Launch Preparation
| משימה | שעות | תיאור |
|-------|------|-------|
| Final testing | 2 | Full E2E |
| Bug fixes | 1 | Critical fixes |
| Performance optimization | 1 | Final tuning |
| Security audit | 1 | Security check |
| Documentation | 1 | Final docs |
| Production deployment | 1 | Go live |
| Monitoring setup | 1 | Alerts |

**Deliverable**: אתר חי בפרודקשן!

---

## 7. אבני דרך (Milestones)

| אבן דרך | תאריך | תיאור | קריטריונים |
|---------|-------|-------|------------|
| M1 | סוף יום 2 | Infrastructure Ready | GCP, CI/CD עובדים |
| M2 | סוף יום 5 | Design System | רכיבי UI בסיסיים |
| M3 | סוף יום 10 | Sprint 1 Complete | דף הבית בסיסי |
| M4 | סוף יום 15 | Core Pages | כל הדפים הראשיים |
| M5 | סוף יום 20 | Sprint 2 Complete | טפסים ו-CMS |
| M6 | סוף יום 25 | E-commerce Backend | מוצרים ועגלה |
| M7 | סוף יום 30 | Sprint 3 Complete | Stripe עובד |
| M8 | סוף יום 35 | RAG System | חפץ חיים AI |
| M9 | סוף יום 38 | Admin Complete | Dashboard מלא |
| M10 | סוף יום 40 | Production Launch | אתר חי! |

---

## 8. סיכונים ומיטיגציה

| סיכון | הסתברות | השפעה | מיטיגציה |
|-------|----------|--------|----------|
| עיכוב ב-Stripe approval | בינונית | גבוהה | להתחיל תהליך מוקדם |
| בעיות RAG quality | בינונית | בינונית | בדיקות מוקדמות |
| ביצועים לא מספקים | נמוכה | גבוהה | Monitoring מתמיד |
| באגים קריטיים | בינונית | גבוהה | בדיקות E2E |
| שינויי דרישות | גבוהה | בינונית | Agile methodology |

---

## 9. Definition of Done

### לכל משימה:
- [ ] קוד כתוב ועובד
- [ ] בדיקות עברו
- [ ] Code review בוצע
- [ ] תיעוד עודכן
- [ ] Deployed לסביבת staging

### לכל ספרינט:
- [ ] כל המשימות הושלמו
- [ ] אין באגים קריטיים
- [ ] Performance תקין
- [ ] Demo ללקוח

### להשקה:
- [ ] כל הפונקציונליות עובדת
- [ ] אבטחה נבדקה
- [ ] ביצועים אופטימליים
- [ ] Monitoring מוגדר
- [ ] Backup מוגדר
- [ ] תיעוד מלא

---

## 10. תקציב שעות

| ספרינט | שעות מתוכננות | Buffer (20%) | סה"כ |
|--------|--------------|--------------|------|
| Sprint 1 | 80 | 16 | 96 |
| Sprint 2 | 80 | 16 | 96 |
| Sprint 3 | 80 | 16 | 96 |
| Sprint 4 | 80 | 16 | 96 |
| **סה"כ** | **320** | **64** | **384** |

---

*מסמך זה הוכן על ידי ניוקלאוס - מבית THRIVE SYSTEM*
