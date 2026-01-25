# To-Do List: Leads Tracker (End-to-End)

## A) PRE-PRODUCTION (Fondasi Produk)
- [ ] 1) **Kunci tujuan & scope MVP**
    - [ ] Tentuin target user: Admin + Sales Team
    - [ ] Tentuin fitur Wajib MVP (Login, Connect Ads, Sync Metrics, Dashboard, etc.)
    - [ ] Tentuin fitur Later (Phase 2)

## B) SETUP TECH STACK & ENVIRONMENT
- [ ] 2) **Siapin tools dev**
    - [ ] Install Node.js LTS
    - [ ] Install Git
    - [ ] Setup akun (GitHub, Vercel, Supabase, Cloudflare, Sentry)

## C) BUILD PROJECT (Dari 0)
- [ ] 3) **Buat repository & standar kerja**
    - [ ] Buat repo GitHub: `leads-tracker`
    - [ ] Buat branch `main` & `dev`
    - [ ] Buat file dasar (`README.md`, `.env.example`, `.gitignore`)
    - [ ] Tentuin konvensi (naming, folder structure, ESLint + Prettier)
- [ ] 4) **Init Next.js fullstack**
    - [ ] Create Next.js App (TypeScript)
    - [ ] Setup TailwindCSS & shadcn/ui
    - [ ] Setup ESLint + Prettier
    - [ ] Setup path alias `@/`
    - [ ] Setup folder layout (`/app`, `/components`, `/lib`, `/jobs`)

## D) DATABASE & BACKEND FOUNDATION
- [ ] 5) **Setup database Postgres** (Supabase/Neon)
    - [ ] Buat project & simpan connection string
- [ ] 6) **Setup Prisma**
    - [ ] Install & Init Prisma
    - [ ] Definisikan schema awal (User, Workspace, Campaign, etc.)
    - [ ] Migrate & Client generation
- [ ] 7) **Setup Auth & Role** (Clerk/NextAuth)
    - [ ] Implement Login & Protected Routes
    - [ ] Setup Roles (ADMIN, SALES)
    - [ ] Middleware auth

## E) UI FOUNDATION
- [ ] 8) **Buat halaman dasar**
    - [ ] Login, Dashboard layout, Navigation, Settings

## F) CORE FEATURE: LEADS TRACKING
- [ ] 9) **Buat struktur data leads** (Table, Filter, Action)
- [ ] 10) **Buat logic SLA** (Calculation, Badges)
- [ ] 11) **Buat funnel conversion** (Pipeline status, metrics)

## G) CONNECT ADS PLATFORM
- [ ] 12) **Setup Meta Developer App**
- [ ] 13) **Buat fitur "Connect Meta Account"**

## H) SYNC DATA
- [ ] 14) **Buat API Sync** (Manual)
- [ ] 15) **Buat auto scheduler**

## I) DASHBOARD
- [ ] 16) **Overview Dashboard** (Cards, Charts)
- [ ] 17) **Target bulanan + progress bar**

## J) REPORTING & EXPORT
- [ ] 18) **Export CSV / Excel**

## K) QUALITY CONTROL
- [ ] 19) **Testing dasar sebelum deploy**

## L) SECURITY CHECKLIST
- [ ] 20) **Security minimal**

## M) DEPLOYMENT
- [ ] 21) **Deploy ke Vercel**
- [ ] 22) **Setup domain + DNS**
- [ ] 23) **Setup protection Cloudflare**

## N) POST-DEPLOY
- [ ] 24) **Monitoring & Logging**
- [ ] 25) **Backup & Maintenance**

## O) NEXT PHASE
- [ ] 26) **Tambah platform lainnya**
- [ ] 27) **Upgrade fitur pro**
