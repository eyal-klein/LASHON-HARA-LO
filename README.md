# לשון הרע לא מדבר אליי - V2

אתר חדש לעמותת "לשון הרע לא מדבר אליי" (דרך ננו בננה)

## 📚 תיעוד

| מסמך | תיאור |
|------|-------|
| [מפרט טכני](docs/technical-specification.md) | ארכיטקטורה, סטאק, DB, API |
| [תוכנית פיתוח](docs/development-plan.md) | 4 ספרינטים, לוחות זמנים |
| [הצעת עיצוב](docs/design-proposal-v2.md) | צבעים, פונטים, מבנה |
| [תקציר ללקוח](docs/executive-summary-client.md) | סיכום מנהלים |
| [מחקר RAG](docs/chofetz-chaim-sources-research.md) | מקורות לחפץ חיים |
| [מחקר האתר](docs/lashonhara_research.md) | ניתוח האתר הקיים |
| [ניתוח קוד](docs/code_analysis.md) | Code review |

## 🛠️ סטאק טכנולוגי

- **Frontend**: React 19 + TypeScript 5.7 + TailwindCSS 4.0 + Vite 6.0
- **Backend**: Node.js 22 LTS + Express 5 + tRPC 11
- **Database**: Cloud SQL (MySQL 8.4) + Drizzle ORM
- **AI/RAG**: Vertex AI (Gemini 2.0) + AlloyDB pgvector
- **Cloud**: Google Cloud Platform (Cloud Run, Cloud Storage, CDN)
- **Payments**: Stripe

## 📋 תכונות עיקריות

- דף הבית עם Hero, ציטוט גנדי, הסבר לשון הרע
- טופס התחייבות אישית
- 4 מסלולי שותפות
- גלריה דינמית
- מערכת CMS לניהול תוכן
- תרומות מאובטחות (Stripe)
- מערכת RAG לחפץ חיים עם AI Chat
- אימיילים אוטומטיים

## 🚀 התחלה מהירה

```bash
# Clone
git clone https://github.com/eyal-klein/LASHON-HARA-LO.git

# Install
pnpm install

# Dev
pnpm dev
```

## 📁 מבנה הפרויקט

```
├── docs/                 # תיעוד
├── client/              # React Frontend
├── server/              # Node.js Backend
├── drizzle/             # Database Schema
└── todo.md              # משימות
```

---

**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM
