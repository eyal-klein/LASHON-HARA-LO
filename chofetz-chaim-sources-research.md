# מחקר: מקורות דיגיטליים להלכות לשון הרע של החפץ חיים

**תאריך**: דצמבר 2024  
**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM

---

## סיכום מנהלים

קיימים מספר מקורות דיגיטליים לספר "חפץ חיים" על הלכות לשון הרע. המקור המומלץ ביותר לאינטגרציה הוא **ויקיטקסט העברי** בשילוב עם **Sefaria API**, שניהם מציעים גישה חופשית לטקסטים יהודיים.

---

## מקורות שנמצאו

### 1. ויקיטקסט העברי (Wikisource Hebrew) ⭐ מומלץ

| פרט | מידע |
|-----|------|
| **כתובת** | https://he.wikisource.org/wiki/חפץ_חיים/הלכות_לשון_הרע |
| **תוכן** | ספר חפץ חיים המלא בעברית |
| **מבנה** | 10 כללים בהלכות לשון הרע + הלכות רכילות |
| **רישיון** | נחלת הכלל (Public Domain) |
| **פורמטים** | HTML, PDF, EPUB, MOBI |
| **API** | MediaWiki API זמין |

**יתרונות**:
- טקסט מלא וחופשי לשימוש
- מבנה מסודר לפי כללים
- API זמין להורדה אוטומטית
- עדכונים שוטפים מהקהילה

**חסרונות**:
- אין תרגום לאנגלית
- אין באר מים חיים (פירוש)

---

### 2. Sefaria API ⭐ מומלץ לאינטגרציה

| פרט | מידע |
|-----|------|
| **כתובת** | https://developers.sefaria.org |
| **תוכן** | ספריית טקסטים יהודיים ענקית |
| **API** | REST API חופשי ללא הרשמה |
| **רישיון** | Open Source |

**Endpoints עיקריים**:
```
GET /api/texts/{ref}           - קבלת טקסט
GET /api/index/{title}         - מטא-דאטה על ספר
GET /api/related/{ref}         - קישורים לטקסטים קשורים
GET /api/calendars             - לוחות לימוד יומיים
```

**הערה חשובה**: נכון לבדיקה, ספר חפץ חיים עצמו **לא נמצא ב-Sefaria**. Sefaria מתמקד בטקסטים קלאסיים (תנ"ך, תלמוד, משנה תורה, שולחן ערוך) אך לא כולל את ספרי החפץ חיים.

---

### 3. HebrewBooks.org

| פרט | מידע |
|-----|------|
| **כתובת** | https://hebrewbooks.org/14233 |
| **תוכן** | סריקת PDF של הספר המקורי |
| **גודל** | 11MB, 251 עמודים |
| **מהדורה** | ירושלים, תשל"ה (1975) |
| **הורדה** | PDF ישיר |

**יתרונות**:
- סריקה של הספר המקורי עם באר מים חיים
- איכות גבוהה
- הורדה חופשית

**חסרונות**:
- פורמט PDF בלבד (לא טקסט)
- דורש OCR לחילוץ טקסט
- לא מתאים לאינטגרציה ישירה

---

### 4. תורת אמת (ToratEmet Freeware) ⭐ מומלץ

| פרט | מידע |
|-----|------|
| **כתובת** | http://www.toratemetfreeware.com/online/f_01604.html |
| **תוכן** | ספר חפץ חיים המלא בפורמט HTML |
| **מבנה** | מאורגן לפי כללים וסעיפים |
| **רישיון** | חופשי לשימוש |

**מבנה התוכן**:
- הקדמה ופתיחה
- לאוין (17 לאווים)
- עשין (14 מצוות עשה)
- ארורין (3)
- הלכות לשון הרע - כללים א'-י'
- הלכות רכילות - כללים א'-ט'
- ציורים לכלל ט
- הערות והשמטות
- נספחים

**יתרונות**:
- טקסט מלא עם ניקוד
- מבנה מסודר וברור
- כולל את כל חלקי הספר
- HTML קל לפרסור

**חסרונות**:
- אין API רשמי
- דורש scraping
- עיצוב ישן

---

### 5. Chafetz Chayim / Mazal Press

| פרט | מידע |
|-----|------|
| **כתובת** | https://chafetzchayim.org |
| **תוכן** | ספרי החפץ חיים בתרגום אנגלי |
| **פורמט** | ספרים מודפסים למכירה |
| **רישיון** | מסחרי (זכויות יוצרים) |

**הערה**: זהו אתר מסחרי למכירת ספרים מודפסים עם תרגום אנגלי. לא מתאים לאינטגרציה דיגיטלית.

---

### 6. Netsor.org

| פרט | מידע |
|-----|------|
| **כתובת** | https://netsor.org/halachot/ |
| **תוכן** | הלכות שמירת הלשון מבוססות על החפץ חיים |
| **פורמט** | HTML |

---

## המלצות לאינטגרציה

### אפשרות א': ויקיטקסט + MediaWiki API (מומלץ)

```typescript
// דוגמה לשליפת תוכן מויקיטקסט
const WIKISOURCE_API = 'https://he.wikisource.org/w/api.php';

async function getChofetzChaimSection(section: string) {
  const params = new URLSearchParams({
    action: 'parse',
    page: `חפץ_חיים/הלכות_לשון_הרע_${section}`,
    format: 'json',
    prop: 'text|wikitext',
  });
  
  const response = await fetch(`${WIKISOURCE_API}?${params}`);
  return response.json();
}
```

**יתרונות**:
- API יציב ומתועד
- תוכן חופשי לשימוש
- עדכונים אוטומטיים

---

### אפשרות ב': Scraping מתורת אמת

```typescript
// דוגמה לשליפת תוכן מתורת אמת
const BASE_URL = 'https://www.toratemetfreeware.com/online/f_01604.html';

// מבנה הכללים
const SECTIONS = {
  lashonHara: [
    { id: 'klal_1', title: 'כלל א', url: 'f_01604_001.html' },
    { id: 'klal_2', title: 'כלל ב', url: 'f_01604_002.html' },
    // ...
  ],
  rechilut: [
    { id: 'klal_1', title: 'כלל א', url: 'f_01604_011.html' },
    // ...
  ],
};
```

**יתרונות**:
- תוכן מלא עם ניקוד
- מבנה ברור

**חסרונות**:
- דורש scraping
- עלול להישבר אם האתר משתנה

---

### אפשרות ג': יצירת בסיס נתונים מקומי

ניתן להוריד את כל התוכן פעם אחת ולשמור בבסיס הנתונים:

```typescript
// סכמת טבלה לתוכן החפץ חיים
export const chofetzChaimContent = mysqlTable("chofetz_chaim_content", {
  id: int("id").autoincrement().primaryKey(),
  section: mysqlEnum("section", ["lashon_hara", "rechilut", "introduction", "lavin", "asin"]).notNull(),
  klal: int("klal"), // מספר הכלל
  seif: int("seif"), // מספר הסעיף
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  contentWithNikud: text("contentWithNikud"),
  beerMayimChaim: text("beerMayimChaim"), // פירוש
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
```

---

## סיכום והמלצה

| מקור | זמינות | API | רישיון | המלצה |
|------|--------|-----|--------|-------|
| **ויקיטקסט** | ✅ מלא | ✅ MediaWiki | ✅ חופשי | ⭐⭐⭐ מומלץ |
| **תורת אמת** | ✅ מלא | ❌ Scraping | ✅ חופשי | ⭐⭐⭐ מומלץ |
| **HebrewBooks** | ✅ PDF | ❌ | ✅ חופשי | ⭐⭐ טוב |
| **Sefaria** | ❌ לא קיים | ✅ | ✅ | ❌ לא רלוונטי |
| **Mazal Press** | ❌ מסחרי | ❌ | ❌ | ❌ לא מתאים |

### המלצה סופית

**לאינטגרציה באתר מומלץ**:

1. **שלב ראשון**: להוריד את כל התוכן מ**ויקיטקסט** או **תורת אמת** ולשמור בבסיס הנתונים המקומי

2. **שלב שני**: ליצור API פנימי שמגיש את התוכן לפי כללים וסעיפים

3. **שלב שלישי**: להוסיף תכונות כמו:
   - לימוד יומי (Daily Halacha)
   - חיפוש בתוכן
   - שמירת מועדפים
   - שיתוף הלכות

4. **אופציונלי**: להוסיף תרגום לאנגלית (דורש רישיון מ-Mazal Press או תרגום עצמאי)

---

## קישורים שימושיים

| מקור | קישור |
|------|-------|
| ויקיטקסט - חפץ חיים | https://he.wikisource.org/wiki/חפץ_חיים |
| תורת אמת | http://www.toratemetfreeware.com/online/f_01604.html |
| HebrewBooks | https://hebrewbooks.org/14233 |
| Sefaria API Docs | https://developers.sefaria.org |
| MediaWiki API | https://www.mediawiki.org/wiki/API:Main_page |

---

*מסמך זה הוכן על ידי ניוקלאוס - מבית THRIVE SYSTEM*
