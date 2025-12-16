# הגדרת GitHub Secrets לפריסה

## Secrets נדרשים

כדי שה-CI/CD יעבוד, יש להגדיר את ה-Secrets הבאים ב-GitHub Repository:

### 1. GCP_SA_KEY (חובה)
Service Account Key בפורמט JSON לאימות מול GCP.

**איך להשיג:**
1. לך ל-GCP Console → IAM & Admin → Service Accounts
2. בחר את ה-SA: `web-lashon@lason-hara-lo.iam.gserviceaccount.com`
3. לחץ על "Keys" → "Add Key" → "Create new key"
4. בחר JSON והורד את הקובץ
5. העתק את כל תוכן הקובץ ל-Secret

**הרשאות נדרשות ל-Service Account:**
- Cloud Run Admin
- Artifact Registry Writer
- Cloud SQL Client
- Storage Admin
- Secret Manager Secret Accessor

### 2. DATABASE_URL (חובה)
Connection string לבסיס הנתונים MySQL.

**פורמט:**
```
mysql://USER:PASSWORD@HOST:3306/DATABASE?ssl=true
```

**דוגמה:**
```
mysql://lashonhara:MySecurePassword123@34.XXX.XXX.XXX:3306/lashonhara_db?ssl=true
```

### 3. CODECOV_TOKEN (אופציונלי)
Token לשירות Codecov לדוחות כיסוי קוד.

### 4. SNYK_TOKEN (אופציונלי)
Token לסריקת אבטחה עם Snyk.

---

## איך להוסיף Secrets ב-GitHub

1. לך ל-Repository → Settings → Secrets and variables → Actions
2. לחץ "New repository secret"
3. הזן את שם ה-Secret (בדיוק כמו למעלה)
4. הדבק את הערך
5. לחץ "Add secret"

---

## Environments

ה-Workflow משתמש ב-2 environments:

### staging
- Branch: `develop`
- URL: `https://lashonhara-web-staging-lason-hara-lo.run.app`
- Resources: 1 CPU, 512MB RAM, 0-5 instances

### production
- Branch: `main`
- URL: `https://lashonhara-web-lason-hara-lo.run.app`
- Resources: 2 CPU, 1GB RAM, 1-10 instances

---

## בדיקת הגדרות

לאחר הגדרת ה-Secrets, בצע push ל-branch `main` או `develop` ובדוק את ה-Actions tab ב-GitHub.

---

## פתרון בעיות נפוצות

### שגיאת אימות GCP
```
Error: google-github-actions/auth failed with: failed to generate Google Cloud access token
```
**פתרון:** ודא שה-GCP_SA_KEY מכיל את כל ה-JSON ולא רק חלק ממנו.

### שגיאת Artifact Registry
```
Error: denied: Permission denied
```
**פתרון:** ודא שה-Service Account יש הרשאת `Artifact Registry Writer`.

### שגיאת Cloud Run
```
Error: Cloud Run service could not be deployed
```
**פתרון:** ודא שה-Service Account יש הרשאת `Cloud Run Admin`.

---

*מסמך זה הוכן על ידי ניוקלאוס - מבית THRIVE SYSTEM*
