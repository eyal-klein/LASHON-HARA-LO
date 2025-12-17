# מחקר GCP Best Practices - סטאק מומלץ

**תאריך**: דצמבר 2024
**מחבר**: ניוקלאוס - מבית THRIVE SYSTEM

---

## 1. סיכום מנהלים

לאחר מחקר מעמיק של Google Cloud Well-Architected Framework והשוואת שירותים, להלן הסטאק המומלץ לפרויקט "לשון הרע לא מדבר אליי" V2:

### הסטאק המומלץ הסופי

| רכיב | שירות GCP | סיבה |
|------|-----------|------|
| **Compute** | Cloud Run (Gen 2) | המלצה רשמית של Google, scale-to-zero, עלות נמוכה |
| **Database** | Cloud SQL for MySQL | Fully managed, HA, backups אוטומטיים |
| **Vector DB** | AlloyDB for PostgreSQL | ביצועים גבוהים ל-RAG, pgvector מובנה |
| **Storage** | Cloud Storage | אחסון תמונות ומדיה |
| **CDN** | Cloud CDN | קישינג גלובלי |
| **Load Balancer** | Cloud Load Balancing | HTTPS, SSL, multi-region |
| **Security** | Cloud Armor | WAF, DDoS protection |
| **Secrets** | Secret Manager | ניהול credentials מאובטח |
| **CI/CD** | Cloud Build | אינטגרציה מלאה עם GCP |
| **Monitoring** | Cloud Monitoring & Logging | Observability מלא |
| **AI/ML** | Vertex AI | Gemini 2.0, Embeddings |

---

## 2. Cloud Run vs App Engine - ההמלצה הרשמית

### מה Google אומרת:

> **Important**: Cloud Run is a fully managed, modern application hosting platform that provides access to advanced capabilities, such as GPUs, at lower prices. We recommend that you evaluate Cloud Run for your upcoming projects, or for modernizing your existing applications. **For new Google Cloud users, we recommend using Cloud Run as the preferred alternative over App Engine.**

### יתרונות Cloud Run על App Engine:

| תכונה | Cloud Run | App Engine |
|-------|-----------|------------|
| Scale-to-zero | ✅ כן | ✅ כן (Standard) / ❌ לא (Flexible) |
| GPUs | ✅ כן | ❌ לא |
| Sidecar containers | ✅ כן | ❌ לא |
| Volume mounts | ✅ כן | ❌ לא |
| Multi-region LB | ✅ כן | ❌ לא |
| Server streaming | ✅ כן | ❌ לא |
| Committed Use Discounts | ✅ כן | ❌ לא |
| מחיר | נמוך יותר | גבוה יותר |

### מסקנה: **Cloud Run הוא הבחירה הנכונה**

---

## 3. בסיס נתונים - Cloud SQL vs AlloyDB vs Firestore

### השוואה:

| תכונה | Cloud SQL | AlloyDB | Firestore |
|-------|-----------|---------|-----------|
| סוג | Relational (MySQL/PostgreSQL) | PostgreSQL-compatible | NoSQL Document |
| ביצועים | סטנדרטי | 4x מהיר מ-PostgreSQL | מהיר לקריאות |
| Analytical queries | סטנדרטי | 100x מהיר | לא מתאים |
| Vector search | pgvector (PostgreSQL) | pgvector מובנה | לא נתמך |
| עלות | נמוכה | גבוהה יותר | Pay-per-read/write |
| HA | אופציונלי | מובנה | מובנה |
| מורכבות | נמוכה | בינונית | נמוכה |

### המלצה לפרויקט:

**עבור E-commerce + CMS**: Cloud SQL for MySQL
- מבנה נתונים יחסי מתאים לחנות ומוצרים
- עלות נמוכה יותר
- פשוט לניהול

**עבור RAG System**: AlloyDB for PostgreSQL
- pgvector מובנה לחיפוש וקטורי
- ביצועים גבוהים לשאילתות אנליטיות
- אופטימיזציה ל-AI workloads

### אפשרות חלופית (חסכונית):
להשתמש ב-Cloud SQL for PostgreSQL עם pgvector extension לשני הצרכים - פשוט יותר ועלות נמוכה יותר.

---

## 4. עקרונות Well-Architected Framework

### 5 עמודי התווך:

1. **Operational Excellence** - CI/CD, monitoring, automation
2. **Security, Privacy, Compliance** - IAM, encryption, audit logs
3. **Reliability** - HA, backups, disaster recovery
4. **Cost Optimization** - Right-sizing, committed use discounts
5. **Performance Optimization** - Caching, CDN, async processing

### עקרונות ליבה:

1. **Design for Change** - ארכיטקטורה מודולרית
2. **Document Your Architecture** - תיעוד מלא
3. **Simplify and Use Managed Services** - שימוש בשירותים מנוהלים
4. **Decouple Your Architecture** - הפרדה בין רכיבים
5. **Use Stateless Architecture** - ארכיטקטורה ללא מצב

---

## 5. הסטאק הסופי המומלץ

### Frontend
```
React 19 + TypeScript 5.7 + TailwindCSS 4.0 + Vite 6.0
```

### Backend
```
Node.js 22 LTS + Express 5 + tRPC 11
```

### Database
```
Cloud SQL for MySQL 8.4 (E-commerce, CMS, Users)
+ Cloud SQL for PostgreSQL 16 with pgvector (RAG)
```

### AI/ML
```
Vertex AI - Gemini 2.0 Flash (Chat)
Vertex AI - text-embedding-004 (Embeddings)
```

### Infrastructure
```
Cloud Run (Gen 2) - Application hosting
Cloud Storage - Media files
Cloud CDN - Static assets caching
Cloud Load Balancing - HTTPS, SSL
Cloud Armor - WAF, DDoS protection
Secret Manager - Credentials
Cloud Build - CI/CD
Cloud Monitoring - Observability
```

### External Services
```
Stripe - Payments
SendGrid - Transactional emails
```

---

## 6. עלויות משוערות

### Development Environment
| שירות | עלות חודשית |
|-------|-------------|
| Cloud Run | Free tier |
| Cloud SQL (db-f1-micro) | ~$10 |
| Cloud Storage | ~$1 |
| **סה"כ** | **~$15/month** |

### Production Environment
| שירות | עלות חודשית |
|-------|-------------|
| Cloud Run | ~$30-50 |
| Cloud SQL MySQL (db-n1-standard-1) | ~$50 |
| Cloud SQL PostgreSQL (RAG) | ~$50 |
| Cloud Storage | ~$5 |
| Cloud CDN | ~$5 |
| Cloud Load Balancer | ~$18 |
| Cloud Armor | ~$5 |
| Vertex AI | ~$30-50 |
| **סה"כ** | **~$200-250/month** |

---

## 7. אישור הסטאק

### ✅ הסטאק מאושר לפי:

1. **Google Cloud Well-Architected Framework** - עומד בכל 5 עמודי התווך
2. **המלצה רשמית** - Cloud Run מומלץ על ידי Google לפרויקטים חדשים
3. **Best Practices** - שימוש בשירותים מנוהלים, stateless architecture
4. **עלות-תועלת** - עלות סבירה עם יכולות מתקדמות
5. **מדרגיות** - Scale-to-zero עד מיליוני בקשות

---

## 8. שינויים מהמפרט הקודם

| רכיב | מפרט קודם | מפרט מעודכן | סיבה |
|------|-----------|-------------|------|
| Database | Cloud SQL MySQL בלבד | Cloud SQL MySQL + PostgreSQL | pgvector ל-RAG |
| Vector DB | AlloyDB | Cloud SQL PostgreSQL | חסכון בעלויות |
| AI | Vertex AI Gemini | Vertex AI Gemini 2.0 Flash | גרסה חדשה יותר |

---

*מסמך זה מבוסס על Google Cloud Well-Architected Framework ומחקר Best Practices עדכני לדצמבר 2024*
