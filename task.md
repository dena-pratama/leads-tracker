Ini **To-Do List SUPER RINCI & MENYELURUH** dari 0 sampai **Deploy + Live**, khusus buat **Web App Leads Tracking Ads Multi-Platform** (Meta dulu, lalu platform lain nyusul).

Aku bikin formatnya kayak **checklist engineer** biar kamu tinggal centang satu-satu ✅

---

# ✅ TO-DO LIST END-TO-END (0 → Deploy → Stabil)

## A) PRE-PRODUCTION (Fondasi Produk)

### 1) Kunci tujuan & scope MVP (1–2 jam)

* [ ] Tentuin **target user**: kamu sendiri (admin) + sales team
* [ ] Tentuin fitur **Wajib MVP**

  * [ ] Login + Role (Admin/Sales)
  * [ ] Connect akun Ads (Meta dulu)
  * [ ] Sync Metrics harian (Spend, Click, Leads)
  * [ ] Sync Leads (nama, hp/email, campaign)
  * [ ] Dashboard summary + filter
  * [ ] Funnel conversion rate (%)
  * [ ] SLA lead (Warning >2 hari, Overdue >5 hari)
  * [ ] Target bulanan + progress bar
  * [ ] Export CSV
* [ ] Tentuin fitur **Later (Phase 2)**

  * [ ] Multi workspace (multi client)
  * [ ] Integrasi TikTok/Google/LinkedIn
  * [ ] Notification WA/email
  * [ ] Audit log & activity tracking
  * [ ] AI scoring leads

---

## B) SETUP TECH STACK & ENVIRONMENT

### 2) Siapin tools dev (30–60 menit)

* [x] Install **Node.js LTS**
* [x] Install **Git**
* [x] Install **VS Code**
* [x] Install **Postman / Insomnia** (test API)
* [x] Setup akun:

  * [x] GitHub
  * [x] Vercel
  * [x] Supabase / Neon (database)
  * [x] Cloudflare (DNS + WAF)
  * [x] Sentry (monitoring)

---

# ✅ C) BUILD PROJECT (Dari 0)

## 3) Buat repository & standar kerja (1 jam)

* [x] Buat repo GitHub: `leads-tracker`
* [x] Buat branch:

  * [x] `main` (production)
  * [x] `dev` (development)
* [x] Buat file dasar:

  * [x] `README.md`
  * [x] `.env.example`
  * [x] `.gitignore`
* [x] Tentuin konvensi:

  * [x] penamaan table & API route
  * [x] struktur folder
  * [x] coding standard (ESLint + Prettier)

---

## 4) Init Next.js fullstack (1–2 jam)

* [x] Create Next.js App (TypeScript)
* [x] Setup TailwindCSS
* [x] Setup shadcn/ui
* [x] Setup ESLint + Prettier
* [x] Setup path alias `@/`

**Folder layout minimal:**

* [x] `/app` (page + layout)
* [x] `/app/api` (API routes)
* [x] `/components`
* [x] `/lib` (db, auth, utils)
* [x] `/jobs` (scheduler/sync)
* [x] `/types`

---

# ✅ D) DATABASE & BACKEND FOUNDATION

## 5) Setup database Postgres (Supabase/Neon) (30–60 menit)

* [x] Buat project database
* [x] Ambil connection string
* [x] Simpan di `.env` lokal

---

## 6) Setup Prisma (1–2 jam)

* [x] Install Prisma
* [x] `prisma init`
* [x] Definisikan schema awal:

**Minimal tabel MVP**

* [x] `User`

* [x] `Workspace` *(opsional tapi bagus dari awal)*

* [x] `PlatformAccount` (token Meta)

* [x] `Campaign`

* [x] `AdMetricDaily`

* [x] `Lead`

* [x] `LeadStatusHistory` *(opsional, tapi bagus untuk tracking)*

* [x] `prisma migrate dev`

* [x] Buat Prisma client instance di `/lib/db.ts`

---

## 7) Setup Auth & Role (2–4 jam)

Pilih 1:

* [x] **Clerk (paling gampang)**
  atau
* [ ] NextAuth

Checklist:

* [x] Login page
* [x] Protected routes (dashboard wajib login)
* [x] Role: `ADMIN`, `SALES`
* [x] Middleware auth (block akses API tanpa login)

---

# ✅ E) UI FOUNDATION (BIAR KELIATAN “JADI” CEPET)

## 8) Buat halaman dasar (3–6 jam)

* [ ] Landing page (optional)
* [x] Login page
* [x] Dashboard layout

  * [x] sidebar navigation
  * [x] topbar (date range, platform filter)
  * [x] main content area

**Menu minimal:**

* [x] Overview
* [x] Leads
* [x] Campaigns
* [x] SLA Monitor
* [x] Settings (Connect Ads)

---

# ✅ F) CORE FEATURE: LEADS TRACKING

## 9) Buat struktur data leads (2–4 jam)

* [x] Buat page `Leads Table`

* [x] Kolom minimal:

  * [x] Date Created
  * [x] Platform
  * [x] Campaign
  * [x] Nama
  * [x] HP/Email
  * [x] Status
  * [x] Assigned Sales
  * [x] SLA Badge (On Track/Warning/Overdue)

* [x] Filter:

  * [x] Date range
  * [x] Platform
  * [x] Campaign
  * [x] Status
  * [x] Sales owner

* [x] Action:

  * [x] Update status lead
  * [x] Assign lead ke sales

---

## 10) Buat logic SLA (1–2 jam)

* [ ] Definisikan SLA:

  * [ ] Warning > 2 hari
  * [ ] Overdue > 5 hari
* [ ] Hitung SLA berdasarkan:

  * [ ] created_time vs last_contacted_at
  * [ ] atau created_time vs now kalau belum dihubungi
* [ ] Tampilkan badge warna:

  * [ ] On Track
  * [ ] Warning
  * [ ] Overdue

---

## 11) Buat funnel conversion (2–4 jam)

* [ ] Tentuin pipeline status:

  * [ ] NEW → CONTACTED → QUALIFIED → WON/LOST
* [ ] Hitung conversion rate:

  * [ ] NEW → CONTACTED (%)
  * [ ] CONTACTED → QUALIFIED (%)
  * [ ] QUALIFIED → WON (%)
* [ ] Buat visual funnel sederhana:

  * [ ] total angka
  * [ ] % conversion per step

---

# ✅ G) CONNECT ADS PLATFORM (META FIRST)

## 12) Setup Meta Developer App (1–2 jam)

* [ ] Buat app di Meta Developers
* [ ] Tambahkan produk:

  * [ ] Facebook Login
  * [ ] Marketing API
* [ ] Request permissions:

  * [ ] `ads_read`
  * [ ] `leads_retrieval`
* [ ] Isi redirect URL ke domain kamu (dev + prod)
* [ ] Simpan:

  * [ ] META_APP_ID
  * [ ] META_APP_SECRET

---

## 13) Buat fitur “Connect Meta Account” (2–6 jam)

* [ ] Page Settings → Connect Platform
* [ ] Button “Connect Meta”
* [ ] OAuth flow:

  * [ ] user login ke FB
  * [ ] accept permission
  * [ ] dapat access_token
* [ ] Simpan token aman ke DB:

  * [ ] encrypted token
  * [ ] expiry time

**MVP cukup 1 akun Meta Ads dulu**

* [ ] Meta Ad Account ID tersimpan di DB

---

# ✅ H) SYNC DATA (Metrics + Leads)

## 14) Buat API Sync “Manual Sync Now” (3–8 jam)

* [ ] Endpoint: `/api/sync/meta`

* [ ] Parameter:

  * [ ] date range (default 7 hari terakhir)

* [ ] Pull data:

  * [ ] list campaigns
  * [ ] daily metrics (spend, clicks, impressions)
  * [ ] leads data

* [ ] Upsert ke DB:

  * [ ] campaigns update / insert
  * [ ] ad_metrics_daily update / insert
  * [ ] leads insert (avoid duplicate via lead_id)

---

## 15) Buat auto scheduler (2–6 jam)

Pilih salah satu:

* [ ] Vercel Cron
* [ ] Inngest
* [ ] Upstash QStash
* [ ] Cloudflare Workers Cron

Auto job:

* [ ] sync metrics tiap hari jam 01:00
* [ ] sync leads tiap 30 menit (opsional)

---

# ✅ I) DASHBOARD (TAMPILAN FINAL MVP)

## 16) Overview Dashboard (3–6 jam)

Tampilkan card:

* [ ] Total Spend (range)
* [ ] Total Leads (range)
* [ ] CPL
* [ ] CTR
* [ ] CVR (click → lead)

Tampilkan chart:

* [ ] Spend per day
* [ ] Leads per day
* [ ] CPL trend

Tampilkan Top:

* [ ] Top Campaigns by Spend
* [ ] Top Campaigns by Leads
* [ ] Worst CPL campaigns

---

## 17) Target bulanan + progress bar (1–3 jam)

* [ ] Dropdown bulan (Jan/Feb/Mar)
* [ ] Input target:

  * [ ] target leads
  * [ ] target spend (optional)
* [ ] Progress bar:

  * [ ] actual vs target

---

# ✅ J) REPORTING & EXPORT

## 18) Export CSV / Excel (1–4 jam)

* [ ] Export leads list
* [ ] Export campaign performance
* [ ] Export daily summary

---

# ✅ K) QUALITY CONTROL (TESTING)

## 19) Testing dasar sebelum deploy (2–6 jam)

✅ Functional test checklist:

* [ ] Login jalan
* [ ] Connect Meta jalan
* [ ] Sync berhasil masuk DB
* [ ] Dashboard muncul bener
* [ ] Filter bekerja
* [ ] SLA logic bener
* [ ] Update status lead masuk DB

✅ Error handling:

* [ ] token expired → refresh / reconnect
* [ ] API rate limit
* [ ] empty data (no campaigns)

---

# ✅ L) SECURITY CHECKLIST (WAJIB)

## 20) Security minimal (1–3 jam)

* [ ] Encrypt token sebelum simpan ke DB
* [ ] API protected (auth required)
* [ ] Rate limit endpoint `/api/*`
* [ ] Block public access ke data internal
* [ ] Setup CORS & headers aman

---

# ✅ M) DEPLOYMENT (GO LIVE)

## 21) Deploy ke Vercel (30–90 menit)

* [ ] Connect GitHub repo → Vercel
* [ ] Set environment variables di Vercel:

  * [ ] DATABASE_URL
  * [ ] AUTH keys
  * [ ] META_APP_ID/SECRET
  * [ ] TOKEN_ENCRYPTION_KEY
* [ ] Deploy production dari branch `main`
* [ ] Pastikan build sukses

---

## 22) Setup domain + DNS (30–60 menit)

* [ ] Beli domain (Namecheap/Rumahweb/Niagahoster)
* [ ] Masuk Cloudflare:

  * [ ] add domain
  * [ ] ubah nameserver domain ke Cloudflare
* [ ] Hubungkan domain ke Vercel:

  * [ ] `trackerbrand.com`
  * [ ] `www.trackerbrand.com`
* [ ] SSL aktif (https)

---

## 23) Setup protection Cloudflare (15–45 menit)

* [ ] Turn on WAF basic rules
* [ ] Bot Fight Mode (opsional)
* [ ] Rate limiting (optional)
* [ ] Auto cache static assets

---

# ✅ N) POST-DEPLOY (BIAR STABIL & Nggak Chaos)

## 24) Monitoring & Logging (30–60 menit)

* [ ] Setup Sentry (error tracking)
* [ ] Setup log query error Prisma
* [ ] Setup health endpoint `/api/health`

---

## 25) Backup & Maintenance (opsional tapi penting)

* [ ] Backup DB otomatis (Supabase)
* [ ] Jadwal sync fail-safe (retry kalau gagal)
* [ ] Notifikasi error ke email/WA (phase 2)

---

# ✅ O) NEXT PHASE (SETELAH MVP LIVE)

## 26) Tambah platform lainnya

* [ ] TikTok Ads integration
* [ ] Google Ads integration
* [ ] LinkedIn Ads integration

## 27) Upgrade fitur pro

* [ ] Multi client workspace (per perusahaan)
* [ ] Team assignment + permissions
* [ ] Lead scoring (AI)
* [ ] WA automation follow up
* [ ] Audit log & activity log
* [ ] Integrasi CRM (HubSpot / Zoho)

---

# ✅ RINGKAS URUTAN “PALING MASUK AKAL” UNTUK KAMU

Kalau kamu mau jalan cepat:

1. Setup Next.js + DB + Auth ✅
2. Buat UI Dashboard + Leads table ✅
3. Connect Meta OAuth ✅
4. Sync metrics + leads ✅
5. SLA + Funnel ✅
6. Deploy Vercel + domain ✅

---
