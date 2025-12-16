# ניתוח קוד מפורט - lashonhara.co.il

## מבנה HTML

### כותרות (Headings Structure)
- **H1**: "לשון הרע לא מדבר אליי" (כותרת ראשית יחידה - נכון מבחינת SEO)
- **H2**: 
  - "היה אתה השינוי שאתה רוצה לראות בעולמך"
  - "סל הקניות"
- **H3**:
  - "מה זה לשון הרע?"
  - "איך תרצו להיות שותפים"
  - "השינוי מתחיל בי!"
  - "הפעילות שלנו"
  - "השגרירים והשותפים שלנו"
  - "הישארו מעודכנים - הצטרפו לניוזלטר"
  - "כל החברים פה"

### טפסים (Forms)
**טופס התחייבות ראשי:**
- שדות:
  1. `name` - שם פרטי (text)
  2. `email` - מספר טלפון (tel) - **שים לב: שם השדה לא תואם לסוג**
  3. `field_eac07b8` - כתובת אימייל (email)
  4. `field_d205442` - הסכמה לקבלת דיוורים (checkbox)
- Method: POST
- Action: אותו עמוד (self-submit)

### וידאו ומדיה
- שימוש ב-YouTube iframes
- וידאו משובץ בראש העמוד
- פיד Instagram משובץ (Elfsight)

### תמונות
- תמונות של שגרירים ופעילויות
- לוגו העמותה
- אייקונים לפעילויות שונות
- **בעיה**: חלק מהתמונות ללא alt text מתאים

## עיצוב ו-CSS

### פלטת צבעים
- **צבע ראשי**: `rgb(237, 9, 19)` - אדום בוהק (#ED0913)
- **כפתורים**: רקע אדום, טקסט לבן
- **רקע**: לבן עם אזורים באפור בהיר

### טיפוגרפיה
- **פונט ראשי**: `almoni-neue, "PT Sans Narrow", sans-serif`
- פונט עברי נקי וקריא
- גודל מכולה מקסימלי: 1200px

### רספונסיביות
- Viewport: 1279x907 (בדיקה בדסקטופ)
- שימוש ב-Elementor breakpoints
- תמיכה במובייל (צריך בדיקה נוספת)

## ארכיטקטורת קוד

### סקריפטים נטענים (30+ קבצים)
**בעיית ביצועים חמורה:**
1. jQuery 1.12.4 (גרסה ישנה מ-2016)
2. jQuery UI מלא
3. Elementor frontend (3 קבצים)
4. Elementor Pro
5. WooCommerce (מספר קבצים)
6. PixelYourSite Pro
7. Instagram Feed
8. YITH Search
9. Google Tag Manager
10. Facebook Pixel
11. YouTube API
12. Vimeo API
13. Flashy

### סגנונות (Stylesheets)
- Bootstrap 4.2
- Elementor styles
- WooCommerce styles
- תבנית Boutique Starter
- פלאגינים נוספים

## פונקציונליות

### תכונות עיקריות
1. **טופס התחייבות** - איסוף מידע ממשתמשים
2. **חנות מקוונת** - WooCommerce
3. **חיפוש מתקדם** - YITH Ajax Search
4. **פיד Instagram** - תצוגת תוכן חברתי
5. **ניוזלטר** - הרשמה לעדכונים
6. **מעקב אנליטיקס** - Google Analytics, Facebook Pixel

### אינטגרציות
- **תשלומים**: WooCommerce (ככל הנראה)
- **משלוחים**: Table Rate Shipping
- **שיווק**: Flashy, PixelYourSite
- **רשתות חברתיות**: Facebook, Instagram

## בעיות מזוהות

### ביצועים
1. **30+ קבצי JavaScript** - זמן טעינה איטי
2. **jQuery ישן** - בעיות אבטחה וביצועים
3. **אין minification** - קבצים לא ממוזערים
4. **אין lazy loading** - תמונות נטענות בבת אחת
5. **Elementor כבד** - קוד מנופח

### אבטחה
1. **jQuery 1.12.4** - גרסה עם פרצות אבטחה ידועות
2. **פלאגינים רבים** - משטח תקיפה גדול
3. **WordPress** - דורש עדכונים קבועים

### נגישות
- יש סרגל נגישות בסיסי
- חסרות תכונות WCAG 2.1 מתקדמות
- חלק מהתמונות ללא alt text

### SEO
- מבנה H1-H3 תקין
- Open Graph tags קיימים
- **בעיה**: URLs לא ידידותיים
- **בעיה**: Schema.org חסר

## המלצות לקוד V2

### טכנולוגיות מומלצות
1. **Frontend**: React 18 + TypeScript + Vite
2. **Styling**: TailwindCSS
3. **Forms**: React Hook Form + Zod validation
4. **State**: Zustand או Context API
5. **Routing**: React Router v6
6. **Backend**: Node.js + Express או Next.js API routes
7. **Database**: MySQL/PostgreSQL
8. **CMS**: Headless CMS (Strapi/Sanity) או custom admin

### ארכיטקטורה
```
/src
  /components
    /common (כפתורים, טפסים, כרטיסים)
    /layout (Header, Footer, Navigation)
    /sections (Hero, Activities, Ambassadors)
  /pages
    Home
    About
    Activities
    Join
    Donate
    Contact
    Shop
  /hooks (custom React hooks)
  /utils (פונקציות עזר)
  /services (API calls)
  /assets (תמונות, אייקונים)
  /styles (global styles)
```

### אופטימיזציות
1. **Code Splitting** - טעינה של רק מה שצריך
2. **Lazy Loading** - תמונות ורכיבים
3. **Image Optimization** - WebP, responsive images
4. **Caching** - Service Workers, CDN
5. **Minification** - CSS, JS
6. **Tree Shaking** - הסרת קוד מת

### אבטחה
1. **HTTPS** - חובה
2. **CSP Headers** - Content Security Policy
3. **Input Validation** - client + server side
4. **Rate Limiting** - הגנה מפני spam
5. **CORS** - הגדרות נכונות
