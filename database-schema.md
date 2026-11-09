# DATABASE SCHEMA & CMS MODEL
## Arkana Design & Build — PostgreSQL 17 + Payload CMS 3

**Status:** rancangan logis implementasi. `Payload` yang menghasilkan tabel SQL sebenarnya, jangan mengarang nama tabel pendukung untuk raw SQL app.  
**Existing DB yang harus digunakan:** `designbuild_db` (`designbuild_admin` pada `127.0.0.1:5432`) di Docker container `designbuild_postgres` menggunakan named volume Compose. **Jangan reset/rename/hapus volume.**

## 1. Prinsip modeling

- 17 **Collections utama** dan 4 **Globals** sebagaimana disepakati; field detail dapat memakai Payload relationship, array, blocks, group dan rich text. Brand demo **Arkana Design & Build** tersimpan di `site_settings` melalui seed, bukan hardcode publik.
- Gunakan PostgreSQL adapter `@payloadcms/db-postgres`, UID/ID dikelola Payload, timestamp `createdAt/updatedAt` otomatis.
- Public content yang punya slug: unique index, format kebab case, reserved words tidak boleh menjadi generic pages slug. Query publik harus mengizinkan konten demo **hanya saat** `demoMode=true`; bila false, filter `isDemo!=true`. Konten demo yang terlihat selalu memuat disclosure. Halaman demo `noindex` dan tidak perlu mengindeks sitemap demo.
- File fisik disimpan di storage; Postgres menyimpan metadata/referensi. Foto demo diunduh dari halaman sumber Unsplash Free dan diimpor ke `media`, dengan `sourceUrl`, `creditName`, `licenseType`. Private files memakai akses terpisah.
- `versions` dan `drafts` menyimpan revisi/editorial status `_status`; **jangan** buat `publication_status` duplikat untuk content editorial. `isDemo`/`demoMode` adalah **asal konten dan disclosure**, bukan status publish.
- `project.constructionStage` berarti tahap proyek konstruksi (mis. `planned`, `design`, `in_progress`, `completed`), **berbeda** dari `_status` publication.
- Migrations di-source-control: dev `push` boleh untuk iterasi lokal, tetapi setiap penambahan domain/model harus menghasilkan migration dan dites pada empty database terpisah sebelum production. Tidak pernah menjalankan destructive migrate fresh/reset/down pada existing DB tanpa approval.
- Untuk data pengguna, kontrol akses berada di Payload access control + endpoint server-side. **Local API default overrideAccess=true**; tambahkan `overrideAccess:false` + `user` pada operasi user-scoped atau enforce explicit public `_status` filtering di trusted server-only functions.

## 2. Collections — 17 model logis

### 2.1 `users` (Auth Collection)
- Field: `name` text required; `email` auth unique required; `password` auth internal (jangan manual hashing); `role` select enum `super_admin|editor` required; `isActive` boolean default true; `lastLoginAt` datetime optional.
- Access: create/read/update/delete user **Super Admin only**; Editor hanya bisa baca/edit profil milik sendiri lewat alur aman yang tidak mengizinkan perubahan role/isActive. Public tidak bisa daftar dan tidak bisa mengakses user list.
- First Super Admin bootstrap via setup resmi atau script yang memerlukan env explicit; jangan auto-seed akun admin password hardcoded.

### 2.2 `project_categories`
- Fields: `name` required, `slug` unique, `description`, `sortOrder` integer, `isActive` boolean. Examples (dev taxonomy): Residential, Commercial, Interior, Renovation, Hospitality.
- Relationships: projects many-to-many via projects.projectCategories.

### 2.3 `projects`
- Fields: `isDemo` boolean default false (seed selalu true untuk konsep), `demoDisclosure` optional text, `title` required, `slug` unique required, `summary` required on publish, `description` rich text, `projectCategories` relationship hasMany, `relatedServices` relationship hasMany, `client` relation clients_partners optional, `clientDisplayName` optional ONLY if permission to publish, `locationCity`, `locationRegion`, `year` number, `startedAt`, `completedAt`, `constructionStage` enum `planned|design|in_progress|completed`, `deliveryScope` enum `design_only|build_only|design_build|interior|renovation`, `builtAreaM2` positive optional, `projectType`, `coverImage` relationship media required to publish, `gallery` array `{image: media, caption, phase: concept|render|progress|completed, sortOrder}`, `brief`, `designApproach`, `challenge`, `solution`, `outcome` richtext/text; `featured` bool, `sortOrder`, `meta` SEO plugin, `publishedAt` optional; `versions.drafts:true`.
- Public: read published only. Admin: editor CRUD; enforce image/slug/summary validity at publish (draft boleh partial).
- Gallery should not be duplicated as disconnected image URLs.

### 2.4 `service_categories`
- Fields: `name`, `slug` unique, `summary`, `sortOrder`, `isActive`.

### 2.5 `services`
- Fields: `title`, `slug` unique, `category` relation, `subtitle`, `excerpt`, `description` richtext, `deliverables` array text, `processSteps` array `{title,description}`, `features` array, `coverImage` relation media, `featured`, `sortOrder`, `meta`, `publishedAt`, versions drafts.
- `isDemo` boolean default false (seed layanan mock true); `relatedProjects` can be derived via reverse lookup rather than duplicate relationship; keep single source of truth.
- Suggested services: Architecture Design, Interior Design, Design & Build, Renovation, Construction Management. Only publish actual services.

### 2.6 `article_categories`
- `name`, `slug` unique, `description`, `sortOrder`.

### 2.7 `articles`
- `isDemo` boolean default false (seed artikel true), `title`, `slug` unique, `excerpt`, `content` Lexical richtext, `thumbnail` media, `category` article_categories relation, `author` users relation, `tags` array text, `featured`, `meta`, `publishedAt`, versions drafts.

### 2.8 `jobs`
- Field tambahan: `isDemo` boolean default false (lowongan sample true). UI tidak boleh menampilkan CTA melamar pada job demo.
- `title`, `slug` unique, `department`, `employmentType` `full_time|part_time|contract|internship`, `location`, `workModel` `onsite|hybrid|remote`, `description` richtext, `requirements` richtext/array, `closingDate`, `applyEmail` optional default contact_settings, `isOpen` boolean, `meta`, versions drafts.
- Public only `_status=published` and `isOpen=true` and nonexpired if closingDate set. Application collection and CV form **tidak** termasuk baseline; link mailto harus fungsional.

### 2.9 `testimonials`
- `clientName`, `position`, `company` text, `quote`, `portrait` media optional, `relatedProject` relation optional, `relatedClient` relation optional, `approvedForPublication` bool, `featured`, `sortOrder`, versions drafts.
- Public only published **and** approvedForPublication. Never seed fake testimonials.

### 2.10 `certifications`
- `title`, `issuer`, `certificateNumber` optional restricted/internal? (mask / omit public by config), `issueDate`, `expiryDate` nullable, `verificationUrl` optional, `document` relation media (only public if approved), `logo` media, `category` (business_registration|safety|quality|professional|other), `approvedForPublication` bool, `sortOrder`, versions drafts.
- Show status *valid/expired* based on `expiryDate` where applicable; no badge "verified" without evidence.

### 2.11 `clients_partners`
- `name`, `slug` optional unique, `type` `client|partner`, `logo` media, `website` url optional, `summary`, `approvedForPublication` bool, `sortOrder`. Enable drafts if publishing approval workflow requires it.

### 2.12 `expertise`
- `title`, `slug` unique, `summary`, `details` richtext, `iconKey` string allowlisted Lucide ID, `relatedServices` relationship hasMany, `sortOrder`, versions drafts.

### 2.13 `media` (Public Upload Collection)
- Provenance for curated online demo assets: `sourceUrl` (full photo page URL, indexed for idempotent imports), `creditName`, `licenseType` (`unsplash_free|pexels_free|owned|other_verified`), `licenseCheckedAt`, `usageRole` (`hero|project|service|article|other`), `isDemoAsset` bool. Do not store a random HTML photo page as an image `src`. File bytes must be imported into Payload Storage using upload APIs.
- Payload upload fields: filename/mime/size/width/height/image variants; custom `alt` required for meaningful photos, `caption`, `credit`, `usageRights` optional, `folderTag` optional, `isApprovedPublic` bool.
- Allowed: JPEG/PNG/WebP/AVIF and PDF public. **Reject user-submitted SVG by default** unless separately sanitized. MIME/size validate server. Never expose `.env` or code uploads.
- Public `read` only approved-public assets; restricted upload/update/delete to authenticated editorial roles. SEO media handles via relation.

### 2.14 `private_files` (Private Upload Collection)
- Fields: Payload upload metadata, `uploadedBy` users optional (form upload may be anonymous through validated server), `purpose` enum `quotation_attachment`, `expiresAt` optional, `scanStatus` enum `pending|clean|blocked` only if scanning is implemented.
- Allowed: PDF and selected images only (e.g. 10MB/file, max 3 files/request; both configurable); never public URL, serve through **authenticated authorization check**, safe response headers, signed URLs for production storage (short expiry). Private storage path physically distinct from media.
- Do not enable public read for entire collection; do not use S3 adapter with public-read by accident.

### 2.15 `quotation_requests`
- Fields: `reference` unique randomly generated public-facing ID; `contactName`, `email`, `phone`, `companyName` optional, `projectType` select, `deliveryScope` enum consistent projects, `location`, `budgetRange` enum optional (no precise price quotes), `expectedStart` optional, `description` required, `attachments` relation hasMany private_files, `relatedService` relation optional, `consentAt` timestamp, `privacyPolicyVersion` text, `status` select `new|contacted|in_review|closed` default new, `closedOutcome` optional `won|lost|no_response|other`, `assignedTo` users optional, `lastContactedAt` optional, `internalNotes` restricted, `submittedAt` required, `sourcePage` safe URL path.
- Public access: **create only via dedicated validated and rate-limited server endpoint**, no read/update/delete/list. CMS read/update Admin+Editor; delete Super Admin only if retention policy warrants it.
- Privacy data is never exposed through public Local API or analytics.

### 2.16 `quotation_activities`
- Fields: `quotation` relation required, `eventType` `created|status_changed|note_added|assigned|closed`, `fromStatus`, `toStatus`, `note`, `actor` users optional (system for created), `createdAt` system.
- Immutable from user forms/admin UI (no update/delete); created by server/hooks after valid action only. Avoid recursive hooks; all transitions transactionally consistent with quote update where feasible.

### 2.17 `pages`
- `title`, `slug` unique, `layout` blocks (hero, richText, imageSplit, CTA, FAQ, stats only if verified), `meta`, `publishedAt`, versions drafts. Reserve main route slugs: `admin`, `api`, `proyek`, `layanan`, `tentang-kami`, `kontak`, `permintaan-penawaran`, `karier`, `berita`, `sertifikasi-k3`, `klien-mitra`, `keahlian`, `privasi` (or serve privasi as special curated page without slug collision).
- Only allow safe block types with strict inputs and responsive layout support.

## 3. Globals — 4 model logis

### 3.1 `site_settings`
- `companyName` default “Arkana Design & Build”, `legalName` blank (unverified), `tagline` default “Designed with Vision. Built with Precision.”, `demoMode` boolean default true (Super Admin only, controls visible demo banner + `noindex` + public demo filters), `shortDescription`, `logoLight`, `logoDark`, `favicon`, `companyProfilePdf` relation media, `socialLinks` array {platform,url}, `defaultMeta` (SEO), `verifiedStats` array {label,value,sourceNote,enabled}, `brandStyle` (no arbitrary colors; locked tokens), versions drafts.

### 3.2 `homepage`
- `hero` group {eyebrow, headline (default “Dari Konsep hingga Bangunan Nyata.”), description, heroImage, primaryCTA, secondaryCTA}; `sectionSettings` {enableAbout, enableServices, enableProjects, enableProcess, enableTrust, enableTestimonials}; `featuredProjects` relation hasMany, `featuredServices` hasMany, `processSteps` array; `bottomCTA` group; SEO meta; versions drafts.

### 3.3 `about_page`
- `hero`, `story` richtext, `mission`, `vision`, `values` array, `milestones` array {year,title,description}, `team` array {name,role,photo,bio,publicationConsent} optional, `process` array, SEO meta, versions drafts.

### 3.4 `contact_settings`
- `address`, `city`, `province`, `postalCode`, `mapUrl`, `mapEmbedUrl` optional allowlist, `publicEmail`, `phone`, `whatsapp`, `officeHours`, `quotationRecipientEmail`, `careersEmail`, `responseTimeCopy` optional/verified, versions drafts.

## 4. Logical relationship graph

```text
users 1 ---- * articles.author
users 1 ---- * quotation_activities.actor
users 1 ---- * quotation_requests.assignedTo
project_categories * ---- * projects
service_categories 1 ---- * services
services * ---- * projects.relatedServices
clients_partners 1 ---- * projects.client
media 1 ---- * projects.coverImage / projects.gallery
media 1 ---- * services.coverImage / articles.thumbnail / certifications.document
articles * ---- 1 article_categories
projects 1 ---- * testimonials.relatedProject
quotation_requests 1 ---- * quotation_activities
quotation_requests * ---- * private_files
homepage 1 ---- * projects/services (curated relationships)
```

**Catatan:** many-to-many dan Payload arrays mungkin menghasilkan tabel pendukung yang dihasilkan adapter. Jangan menulis FK raw SQL berdasarkan asumsi nama-nama tabel ini.

## 5. Hak akses matrix

| Resource/action | Anonymous | Editor | Super Admin |
|---|---|---|---|
| Content published read | Yes | Yes | Yes |
| Content draft read/preview | No | Yes | Yes |
| Content create/edit/publish | No | Yes | Yes |
| Content delete | No | Yes (kecuali restricted) | Yes |
| Users list/create/change role | No | No | Yes |
| Own profile/password | No | Own only | Yes |
| Media public read | Approved only | Yes | Yes |
| Private files read | No | Linked quotation, authenticated | Yes |
| Public quotation submit | Validated endpoint only | Yes | Yes |
| Quotation list/status edit | No | Yes | Yes |
| Quotation delete | No | No | Yes (after retention review) |
| Quotation activity tamper | No | No | No direct edit |
| Settings / Globals edit | No | Editorial except restricted fields | Yes |

**Extra:** enforce field-level restrictions for user role/password, quote internal notes, contact recipient and sensitive settings; beware Server Actions/routes/local API circumventing checks.

## 6. Data quality & validation rules

- All emails normalized and validated; phone Indonesian plus international formatting allowed; limit lengths; allow text Unicode safely.
- `slug` unique per collection, reserved routes excluded from generic pages; URL safe.
- `year` reasonable range (`1900..currentYear+2`); built area positive; `issueDate≤expiryDate` when expiry set.
- File extensions + content-type + detected magic bytes; reject scripts; PDF image previews if needed but no executing PDFs server-side.
- Per quotation max `description` 5000 chars, max 3 attachments 10MB each (configurable), `consentAt` required; avoid persisting honeypot/IP plaintext unless justified.
- Quotation status transitions: `new → contacted → in_review → closed`. Disallow invalid skips in UI unless explicit super_admin override with required note; audit every change. Closed outcome optional with proper UX.
- Versioning on content & relevant Globals; quote activity is append-only audit separate from Payload versions.
- On delete relationship: avoid orphaning media/files; no cascading deletes from project to shared public media.
- Published routes cannot show missing hero/title/main content; handle fallback/editor publish validation.

## 7. Indexing / performance

- Unique slug indexes for content collections; index public query filters `projects._status, featured, year`, `projects.constructionStage`, `articles._status, publishedAt`, `jobs._status,isOpen,closingDate`, `quotation_requests.status,submittedAt`; indexes must match real generated schema and be added via migration only when justified.
- Pagination for list endpoints/admin. Related content limit. Avoid fetching depth-heavy relation graphs everywhere.

## 8. Migration + seed policy

1. Before schema work, inspect DB with `docker compose ps` / safe read-only check; **no reset**.
2. Create Payload collections + Globals and adapter config; use official Postgres workflow. Dev `push` allowed; generate reviewed migrations using Payload CLI (e.g. `pnpm payload migrate:create ...`, depending package scripts).
3. Commit generated migrations alongside schema. Test migration on **disposable separate database** (not user's existing `designbuild_db`) before production.
4. Seed data harus **idempotent dan explicit opt-in hanya dev/staging/demo**. Minimal 8 demo concept projects, 6 services, 4 original educational articles + taxonomy; foto source katalog `design.md` diunduh legal, diverifikasi lisensinya, dan diimpor ke `media` dengan metadata provenance. `isDemo=true` untuk semua record sampel, `demoMode=true` untuk keseluruhan situs demo, tampilkan disclosure. Jangan seed users dengan password, contacts palsu, fake clients, testimonials, certifications. Kalau foto gagal diunduh, log error + fallback tanpa broken images.
5. `pnpm payload migrate` for deployment after backup and explicit approval; never `migrate:fresh/reset/refresh` on existing DB without direct permission.
6. `DATABASE_URL` in app `.env.local`, constructed from existing credentials; root `.env` already used by Docker Compose. **Do not expose or overwrite secrets**. If special chars in password, URL-encode when constructing URL; never print it in logs.
7. New PostgreSQL is not needed. Existing Docker service works for the application running directly on host at `localhost:5432`; if app someday runs inside Docker, host becomes Compose service name `postgres` instead.

## 9. File storage & privacy

- Development public uploads local in managed directory; ensure ignore generated files in Git except intentional assets.
- Development private uploads in protected location that is NOT Next.js `public/`; authenticated download route with access policy. Do not assume Payload upload collection automatically prevents static-file reachability if static route exposes directory.
- Production: S3-compatible bucket with separate prefixes/buckets and policies: public media only if approved, private quotes never publicly accessible; signed downloads short TTL, no ACL `public-read` for private files.
- Backups must include PostgreSQL **and** media assets; test restore.

## 9.1 Aturan demo yang diuji (content origin, bukan status publish)

1. `site_settings.demoMode=true`: public pages menampilkan disclaimer website demo secara konsisten dan kartu project dummy memiliki badge “Konsep Ilustratif”. `robots: noindex, nofollow` untuk demo preview; sitemap kosong atau hanya URL resmi yang aman.
2. Setiap concept `projects.isDemo=true`; sample `services`, `articles`, `jobs` juga `isDemo=true`. `isDemo=false` harus diisi hanya setelah editor memverifikasi data dan memiliki izin publikasi, tidak otomatis berubah saat publish.
3. `site_settings.demoMode=false`: public readers harus otomatis mengecualikan `isDemo=true` dari list/detail/related entries/sitemap/SEO. Jangan mengizinkan admin mematikan demoMode untuk peluncuran bisnis nyata tanpa checklist verifikasi konten, kontak, hak gambar, privacy, dan operator persetujuan. Jika data asli belum ada, tampilkan empty states, bukan stock work sebagai bukti perusahaan.
4. Asset media demo disimpan secara persisten lewat Payload (bukan URL random) dengan `sourceUrl`, `creditName`, `licenseType` dan `isDemoAsset`; jangan pernah mengekspose quote attachments sebagai media publik.
5. Seed ulang tidak menciptakan duplicate taxonomy, proyek, artikel maupun media (gunakan unique slug/sourceUrl dan safe upsert).


## 10. Security acceptance

- Anonymous `GET /api/quotation-requests` => denied; anonymous access to private file URLs => denied; Editor role escalation => denied; unauthorized preview => denied.
- Published/draft isolation on all read methods; demo/verified isolation per demoMode; no leak via sitemap, search, related items, SEO metadata or GraphQL/REST APIs.
- Server validates all RFQ data and file types and enforces rate limit; audit status transitions exact.
- Email fail after DB write should not delete or roll back submitted inquiry; logs must omit PII/tokens.

## 11. Schema review / exit criteria

- Collections and Globals are visible and usable in Payload Admin.
- Relationship fields behave correctly; duplicate slug rejected; data persists through `docker compose restart`.
- Real migration files exist in git; schema regeneration command documented.
- E2E verifies role permissions, draft/published content, uploads, quote workflow, and historical rollback.
- DBeaver is read-only inspection/debug tool in normal workflow, not the source of truth for schema.

## 12. Official documentation

- Postgres: https://payloadcms.com/docs/database/postgres
- Migrations: https://payloadcms.com/docs/database/migrations
- Drafts: https://payloadcms.com/docs/versions/drafts
- Local API access: https://payloadcms.com/docs/local-api/access-control
- Uploads / storage: https://payloadcms.com/docs/upload/overview and https://payloadcms.com/docs/upload/storage-adapters
- SEO plugin: https://payloadcms.com/docs/plugins/seo
