# Nano Banana V2 - Project TODO

## Phase 1: Design & Planning
- [ ] Create design mockups for user approval
- [ ] Define color palette (orange-red-pink gradient + turquoise accents)
- [ ] Setup Rubik Hebrew font

## Phase 2: Database Schema
- [ ] Users table (existing)
- [ ] Commitments table (personal pledges)
- [ ] Subscribers table (newsletter)
- [ ] Partners table (ambassadors, schools, supporters)
- [ ] Activities table (events, workshops)
- [ ] Gallery table (photos, ambassadors)
- [ ] Content table (CMS dynamic content)
- [ ] Donations table (Stripe payments)
- [ ] Contact messages table

## Phase 3: Main Pages
- [ ] Home page with hero section
- [ ] Gandhi quote section
- [ ] Lashon Hara explanation section
- [ ] About page
- [ ] Activities page
- [ ] Contact page

## Phase 4: Forms & Partnerships
- [ ] Personal commitment form (name, phone, email, checkbox)
- [ ] Four partnership pathways UI
- [ ] Ambassador signup
- [ ] Financial support pathway
- [ ] School representative pathway
- [ ] Inspiration sharing pathway

## Phase 5: Gallery & CMS
- [ ] Gallery page with visual layout
- [ ] Admin CMS dashboard
- [ ] Content management (texts, images)
- [ ] Activities management
- [ ] Gallery management

## Phase 6: Stripe & Cloud Storage
- [ ] Stripe integration for donations
- [ ] Donation page/modal
- [ ] S3 cloud storage for photos
- [ ] Photo upload functionality

## Phase 7: Email Notifications
- [ ] Email subscription system
- [ ] Automated notifications for new activities
- [ ] Event announcements

## Phase 8: Testing & Optimization
- [ ] Vitest unit tests
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Final review and delivery

## User Feedback
- [ ] Update mockups to match existing brand identity (logo, colors #ED0913, almoni-neue font)
- [ ] Use original content from existing website
- [ ] Modernize design while keeping brand consistency

## Technical Specification
- [x] Create full technical specification document
- [x] Frontend architecture and components
- [x] Backend API endpoints and services
- [x] Database schema design
- [x] GCP deployment architecture

## RAG System - Chofetz Chaim Integration
- [x] Add RAG system specification to technical document
- [x] Design database schema for Chofetz Chaim content
- [x] Include all commentaries (Be'er Mayim Chaim, etc.)
- [x] Vector embeddings for semantic search
- [x] AI-powered Q&A based on halachot

## Development Plan
- [x] Create detailed development plan document
- [x] Define 4 sprints with weekly breakdown
- [x] Document dependencies and milestones
- [x] Estimate costs and resources

## GCP & GitHub Setup
- [x] Validate GCP Service Account credentials
- [x] Clone GitHub repository
- [x] Push all planning documents to GitHub
- [ ] Setup GitHub Actions for CI/CD

## Brand Book
- [x] Analyze brand book PDF
- [x] Extract brand guidelines (colors, fonts, logos)
- [x] Create brand-book-summary.md
- [x] Push to GitHub

## Admin Management System
- [ ] Add admin dashboard specification
- [ ] User management (roles, permissions)
- [ ] Content management (CMS)
- [ ] Commitments management
- [ ] Newsletter subscribers management
- [ ] Contact messages management
- [ ] Analytics and reports

## Sales/E-commerce System
- [ ] Add e-commerce specification
- [ ] Product catalog (bracelets, merchandise)
- [ ] Shopping cart
- [ ] Checkout with Stripe
- [ ] Order management
- [ ] Inventory tracking
- [ ] Sales reports

## Missing Features from Current Site (Audit)
- [x] Complete features audit of existing site
- [x] Add full E-commerce system to specification
- [x] Add product categories management
- [x] Add inventory management
- [x] Add order management
- [x] Add shipping calculations
- [x] Add coupons and discounts
- [x] Add customer account area
- [x] Add wholesale/bulk orders
- [x] Add event products
- [x] Add Instagram feed integration
- [x] Add WhatsApp integration
- [x] Add Flashy/email automation

## Detailed Development Plan
- [x] Update technical specification with final GCP stack
- [x] Create detailed development plan with tasks and milestones
- [x] Define sprint breakdown with daily tasks
- [x] Push updated plan to GitHub

## Sprint 1 - Day 1-2: Infrastructure
- [x] Create GitHub Actions CI/CD workflow
- [x] Create Dockerfile for production
- [x] Configure GCP authentication in GitHub (docs created)
- [x] Setup Cloud Run deployment
- [ ] Test full deployment pipeline (pending secrets setup)

## GCP Infrastructure Setup
- [x] Enable required GCP APIs
- [x] Create Artifact Registry repository
- [x] Create Cloud SQL MySQL instance (34.165.149.222)
- [x] Create Cloud Storage bucket
- [x] Create database and user
- [x] Configure GitHub Secrets (GCP_SA_KEY, DATABASE_URL)
- [x] Create full database schema (14 tables)
- [x] Run database migrations
- [ ] Configure Cloud Run service
- [ ] Set up Secret Manager secrets

## Frontend Development - Homepage
- [ ] Setup brand colors and fonts (almoni-neue, #ED0913)
- [ ] Hero Section with logo and main message
- [ ] Personal commitment form
- [ ] 4 partnership cards (Ambassador, Supporter, School, Inspiration)
- [ ] Statistics counter (commitments count)
- [ ] Footer with links and social media
- [ ] Mobile responsive design

## Brand Compliance Fixes
- [x] Change font from Almoni Neue to Heebo (Hebrew) + Roboto (English) per brand book
- [x] Update primary color from #ED0913 to #ED1C24 per brand book
- [ ] Add Shon mascot logo support
- [ ] Ensure logo text styling matches brand (red "לשון הרע" with drip effect)
