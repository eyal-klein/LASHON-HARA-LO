# לשון הרע לא מדבר אליי V2

**Modern web application for the "Lashon Hara Lo Medaber Elay" organization**

A comprehensive platform promoting positive communication culture and combating gossip, shaming, and bullying in both physical and digital spaces.

---

## 🎯 Project Overview

This is a full-stack TypeScript web application built with:
- **Frontend**: React 19 + Tailwind CSS 4 + Wouter
- **Backend**: Express 4 + tRPC 11 + Drizzle ORM
- **Database**: MySQL 8.0
- **Authentication**: Manus OAuth
- **Deployment**: Manus Platform with CI/CD

---

## ✨ Features

### Public Features
- 🏠 **Homepage** - Hero section, statistics, featured products, activities
- 🛍️ **E-commerce Store** - Product catalog with categories, search, and filtering
- 🛒 **Shopping Cart** - localStorage persistence, quantity management
- 🖼️ **Gallery** - Image lightbox with categories
- 📅 **Activities** - Events listing with registration
- 📧 **Contact Form** - Message submission with priority levels
- 🤝 **Partnership Requests** - 4 types (ambassadors, schools, businesses, volunteers)
- 💰 **Donations** - Stripe integration (ready for production keys)
- 📝 **Commitments** - Public pledge system
- 🤖 **RAG Chatbot** - Ask questions about Chofetz Chaim (177 seifim, 338 chunks)

### Admin Features
- 📊 **Dashboard** - Statistics and quick actions
- 🛍️ **Products Management** - Full CRUD for products and categories
- 🖼️ **Gallery Management** - Upload and manage images
- 📅 **Activities Management** - Create and manage events
- 📧 **Messages Inbox** - View and manage contact messages
- 🤝 **Partnerships** - Review and approve requests
- 💰 **Donations** - Track and manage donations
- 📝 **Commitments** - View all commitments

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22.x
- pnpm 9.x
- MySQL 8.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/lashonhara-v2.git
cd lashonhara-v2

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
lashonhara-v2/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── Cart.tsx      # Shopping cart sidebar
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── NavigationWithCart.tsx
│   │   ├── contexts/         # React contexts
│   │   │   └── CartContext.tsx
│   │   ├── hooks/            # Custom hooks
│   │   │   └── use-toast.ts
│   │   ├── lib/              # Utilities
│   │   │   └── trpc.ts       # tRPC client
│   │   ├── pages/            # Page components
│   │   │   ├── HomeNew.tsx
│   │   │   ├── StoreNew.tsx
│   │   │   ├── ProductDetailNew.tsx
│   │   │   ├── GalleryNew.tsx
│   │   │   ├── ActivitiesNew.tsx
│   │   │   ├── ContactNew.tsx
│   │   │   ├── ChatbotNew.tsx
│   │   │   ├── AboutNew.tsx
│   │   │   └── admin/        # Admin pages
│   │   ├── App.tsx           # Routes and layout
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
│       └── images/           # Images (logo, products, gallery)
├── server/                   # Backend Express + tRPC
│   ├── _core/               # Framework internals
│   │   ├── context.ts       # tRPC context
│   │   ├── llm.ts          # LLM integration
│   │   └── env.ts          # Environment variables
│   ├── routers/            # tRPC routers
│   │   ├── products.ts
│   │   ├── gallery.ts
│   │   ├── activities.ts
│   │   ├── contact.ts
│   │   ├── partnerships.ts
│   │   ├── donations.ts
│   │   ├── commitments.ts
│   │   ├── chatbot.ts
│   │   └── content.ts
│   ├── routers.ts          # Router aggregation
│   ├── db.ts              # Database helpers
│   ├── email.ts           # Email templates
│   └── storage.ts         # S3 file storage
├── drizzle/               # Database schema and migrations
│   └── schema.ts
├── scripts/               # Utility scripts
│   ├── scrape-chofetz-chaim-v4.mjs
│   ├── parse-and-import-chofetz-chaim.mjs
│   └── import-to-database.mjs
├── data/                  # Scraped data
│   ├── original-site/     # Content from original website
│   └── chofetz-chaim/     # Chofetz Chaim content
├── docs/                  # Documentation
│   └── brand-book-summary.md
└── .github/
    └── workflows/
        └── ci.yml         # CI/CD pipeline
```

---

## 🔧 Environment Variables

### Required (System-provided by Manus)
```env
DATABASE_URL=mysql://...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
VITE_FRONTEND_FORGE_API_KEY=...
```

### Optional (Custom)
```env
VITE_APP_TITLE="לשון הרע לא מדבר אליי"
VITE_APP_LOGO="/images/lh-logo.png"
STRIPE_SECRET_KEY=sk_test_...  # For payments
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🗄️ Database Schema

**17 Tables:**
- `users` - User accounts (Manus OAuth)
- `commitments` - Public pledges
- `subscribers` - Newsletter subscribers
- `donations` - Donation records
- `contact_messages` - Contact form submissions
- `partnerships` - Partnership requests
- `gallery_items` - Gallery images (24 items)
- `activities` - Events and activities
- `content` - CMS content (4 sections for About page)
- `email_logs` - Email sending history
- `chofetz_chaim_content` - Chofetz Chaim text (177 seifim, 338 chunks)
- `chofetz_chaim_commentary` - Commentary
- `rag_conversations` - Chatbot conversations
- `chofetz_chaim_topics` - Topic taxonomy
- `products` - Product catalog (178 products)
- `product_categories` - Product categories (7 categories)
- `orders` - Order records

---

## 🛠️ API Documentation

### tRPC Routers

#### Products (`trpc.products.*`)
- `list({ page, limit, search, categoryId })` - List products with pagination
- `listAll({ page, limit, search, categoryId })` - List all products
- `getById(id)` - Get product by ID
- `create(data)` - Create new product (admin)
- `update({ id, data })` - Update product (admin)
- `delete(id)` - Delete product (admin)
- `listCategories()` - List all categories
- `getCategoryById(id)` - Get category by ID

#### Gallery (`trpc.gallery.*`)
- `list({ page, limit, category, featured })` - List gallery items
- `getById(id)` - Get gallery item (increments view count)
- `categories()` - List all categories
- `create(data)` - Create gallery item (admin)
- `update({ id, data })` - Update gallery item (admin)
- `delete(id)` - Delete gallery item (admin)

#### Activities (`trpc.activities.*`)
- `list({ page, limit, type, upcoming, featured })` - List activities
- `getById(id)` - Get activity by ID
- `getBySlug(slug)` - Get activity by slug
- `upcomingCount()` - Count upcoming activities
- `create(data)` - Create activity (admin)
- `update({ id, data })` - Update activity (admin)
- `delete(id)` - Delete activity (admin)

#### Contact (`trpc.contact.*`)
- `submit(data)` - Submit contact message (public)
- `list({ page, limit, unreadOnly, priority })` - List messages (admin)
- `getUnreadCount()` - Count unread messages (admin)
- `markAsRead(id)` - Mark message as read (admin)
- `archive(id)` - Archive message (admin)
- `delete(id)` - Delete message (admin)

#### Partnerships (`trpc.partnerships.*`)
- `submit(data)` - Submit partnership request (public)
- `types()` - List partnership types (public)
- `list({ page, limit, type, status })` - List requests (admin)
- `getPendingCount()` - Count pending requests (admin)
- `updateStatus({ id, status })` - Update request status (admin)
- `delete(id)` - Delete request (admin)

#### Chatbot (`trpc.chatbot.*`)
- `ask({ question, conversationId })` - Ask question with LLM
- `search(query)` - Search Chofetz Chaim content
- `getRandomQuote()` - Get random quote
- `getStats()` - Get content statistics

#### Content (`trpc.content.*`)
- `list()` - List all content sections
- `getByKey(key)` - Get content by key

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm tsc --noEmit
```

**Test Coverage:**
- 66/66 tests passing ✅
- Auth, Commitments, Donations, Products, Gallery, Activities, Contact, Partnerships, Chatbot

---

## 🚢 Deployment

### Manus Platform (Recommended)

1. **Create Checkpoint:**
   ```bash
   # Checkpoint is created automatically via UI
   ```

2. **Publish:**
   - Click "Publish" button in Management UI
   - Deployment is automatic via Manus platform

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
- ✅ Type checking
- ✅ Tests
- ✅ Build verification
- ✅ Deployment (on push to `main`)

---

## 🎨 Design System

### Brand Colors (from Brand Book)
- **Primary Red**: `#ED1C24` (oklch(0.55 0.23 27))
- **Black**: `#000000`
- **White**: `#FFFFFF`

### Typography
- **Hebrew**: Heebo (Google Fonts)
- **English**: Roboto (Google Fonts)

### Logo
- "לשון הרע" in red with drip effect
- "לא מדבר אליי!" in black
- Located at `/images/lh-logo.png`

---

## 📊 Content Migration

All content from the original site (https://lashonhara.co.il) has been migrated:

- ✅ **178 products** with images and details
- ✅ **24 gallery images**
- ✅ **4 About page sections** (Mission, Founder's Message, What is Lashon Hara, What to Do)
- ✅ **177 Chofetz Chaim seifim** (10 laws of Lashon Hara + 9 laws of Rechilut)
- ✅ **Logo and branding assets**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

Copyright © 2024 לשון הרע לא מדבר אליי

---

## 🆘 Support

For technical support or questions:
- Email: support@lashonhara.co.il
- Submit feedback: https://help.manus.im

---

## 🙏 Acknowledgments

- **Manus Platform** - Hosting and deployment
- **shadcn/ui** - UI component library
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ by the Lashon Hara Lo Medaber Elay team**
