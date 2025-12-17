# לשון הרע לא מדבר אליי V2

**Modern web application for the "Lashon Hara Lo" organization** - promoting awareness and education about proper speech according to Jewish law.

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

---

## 📚 Tech Stack

**Frontend:**
- React 19 + TypeScript
- Tailwind CSS 4
- Wouter (routing)
- shadcn/ui components
- tRPC client

**Backend:**
- Node.js 22 + Express 4
- tRPC 11 (end-to-end type safety)
- Drizzle ORM
- MySQL/TiDB (Cloud SQL)

**Infrastructure:**
- Google Cloud Run (deployment)
- Cloud SQL (database)
- Cloud Storage (files)
- GitHub Actions (CI/CD)

---

## 📁 Project Structure

```
├── client/              # Frontend React application
│   ├── public/          # Static assets
│   └── src/
│       ├── pages/       # Page components (20 pages)
│       ├── components/  # Reusable UI components
│       ├── contexts/    # React contexts
│       └── lib/         # tRPC client setup
├── server/              # Backend tRPC server
│   ├── routers/         # API routers (10 routers, 59 endpoints)
│   ├── services/        # Business logic
│   └── _core/           # Framework plumbing
├── drizzle/             # Database schema & migrations
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

---

## 🎯 Features

### Public Pages
- Homepage with mission statement
- About the organization
- Activities gallery
- Contact form
- Join/commitment form
- Donation system (Stripe integration)
- Online shop
- Chofetz Chaim study resources

### Admin Panel
- Donations management
- Orders management
- Products management
- Users management
- Content management
- Analytics dashboard

### Technical Features
- Full type safety (tRPC + TypeScript)
- Authentication (OAuth)
- Real-time updates
- Responsive design (mobile-first)
- SEO optimized
- Accessibility compliant
- CI/CD automated deployment

---

## 🗄️ Database

**17 tables** including:
- Users & authentication
- Commitments & partnerships
- Donations & subscriptions
- Products, orders & inventory
- Gallery & activities
- Contact messages
- Chofetz Chaim content (RAG system)

---

## 🔧 Development

### Prerequisites
- Node.js 22+
- pnpm 9+
- MySQL/TiDB database

### Environment Variables
See `.env.example` for required variables.

Key variables:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID

### Database Migrations
```bash
# Generate migration
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

---

## 📦 Deployment

**Automated via GitHub Actions:**
1. Push to `main` branch
2. CI runs tests
3. Docker image built
4. Deployed to Cloud Run

**Manual deployment:**
```bash
# Build Docker image
docker build -t lashonhara-v2 .

# Deploy to Cloud Run
gcloud run deploy lashonhara-v2 \
  --image gcr.io/PROJECT_ID/lashonhara-v2 \
  --platform managed \
  --region us-central1
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/auth.logout.test.ts

# Watch mode
pnpm test --watch
```

---

## 📖 Documentation

- [Client Update](docs/client/CLIENT-UPDATE-FINAL-DAVID-HALPERIN.md) - Full feature documentation
- [Technical Specification](technical-specification.md) - Detailed technical design
- [Development Plan](development-plan.md) - 40-day implementation plan
- [GAP Analysis](GAP-ANALYSIS.md) - Feature comparison V1 vs V2

---

## 🤝 Contributing

This is a private project for the "Lashon Hara Lo" organization.

---

## 📄 License

Proprietary - All rights reserved by "לשון הרע לא מדבר אליי" organization.

---

## 📞 Support

For questions or support, contact the development team.

**Production URL:** https://lashonhara-v2-opf34n5lbq-zf.a.run.app
