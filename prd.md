# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Arkana Design & Build — Corporate Website + CMS

**Status:** Blueprint untuk implementasi, bukan dokumentasi fitur yang sudah dibuat  
**Bahasa antarmuka:** Bahasa Indonesia (default); struktur dibuat siap dilokalisasi kelak, tetapi belum perlu fitur multibahasa  
**Tanggal baseline:** 6 November 2026  
**Dokumen pasangan:** `design.md`, `database-schema.md`, `AGENTS.md`, `alltask.txt` (28 task di satu file)

## 1. Visi dan ruang lingkup

Membangun **website company profile multi-page untuk brand demo Arkana Design & Build** (arsitektur, perencanaan, interior, renovasi, konstruksi/eksekusi). Website harus menunjukkan kompetensi desain *dan* realisasi bangunan melalui case study; mampu menghasilkan permintaan penawaran yang bisa ditindaklanjuti; serta menyediakan dashboard CMS yang dapat digunakan staf perusahaan nonteknis.

**Jenis produk:** corporate website + content management + inquiry workflow; **bukan** katalog e-commerce, toko online, sistem pembayaran, atau sistem manajemen proyek internal (ERP/BOQ). Proyek yang dimaksud di CMS adalah *portfolio/case study*, bukan modul penjadwalan operasional proyek.

**Pemangku kepentingan:** pengunjung (calon klien residential, commercial, interior), tim marketing/content (`Editor`), pimpinan/admin (`Super Admin`), pengembang/penguji.

**Tujuan:** (a) membangun kepercayaan melalui bukti proyek & kompetensi; (b) membuat layanan mudah dipahami; (c) menghasilkan quotation lead dengan data cukup untuk follow-up; (d) memudahkan update tanpa edit kode; (e) SEO dan kinerja mobile yang baik.

**Identitas proyek yang dikunci:** brand dummy **Arkana Design & Build**; tagline **“Designed with Vision. Built with Precision.”**; headline utama Indonesia **“Dari Konsep hingga Bangunan Nyata.”** Palet Navy `#142D3D`, Cloud `#EAEFF1`, Copper `#D99737`, Slate `#72828B`, White `#FFFFFF`. Nama ini **identitas fiktif untuk demonstrasi**, bukan verifikasi merek/perusahaan terdaftar.

**Kebijakan konten:** gunakan contoh teks Indonesia berkualitas dan **foto online legal dari katalog Unsplash yang dikurasi pada `design.md`**, diunduh secara sah lalu diimpor ke Payload `media` saat dev seed; jangan hotlink Pinterest/menyalin artwork orang lain. Dataset proyek, artikel, layanan dan lowongan bersifat **DEMO / ilustratif** dengan indikator yang terlihat; tidak boleh diklaim sebagai pekerjaan, staf, klien, sertifikat, penghargaan, atau testimoni asli Arkana. Jika identitas kontak/legal tidak tersedia, sembunyikan tautan atau beri state demo yang jujur. Sertifikasi dan testimonial **tidak perlu diisi palsu**.

**Keputusan rilis:** website boleh dipresentasikan sebagai **demo** yang jelas dan `noindex`; sebelum dipublikasikan sebagai bisnis sungguhan harus mengganti semua demo content dan memperoleh persetujuan kepemilikan foto/klaim/izin. Referensi Pinterest tetap hanya inspirasi layout.

## 2. Tech stack yang dikunci

- **Application:** Next.js 16 **App Router**, React, TypeScript; cek persyaratan resmi Payload saat install (per 6 Nov 2026: Next.js `16.2.6+`, Node.js `^22.23.4 || >=24.22.1`; gunakan versi yang tersedia dan kompatibel, jangan asal `latest`).
- **CMS + admin + server:** Payload CMS 3 terintegrasi dalam aplikasi Next.js, bukan backend Laravel terpisah.
- **Database:** PostgreSQL 17 lokal melalui Docker Compose; Payload `@payloadcms/db-postgres`.
- **Package management:** utamakan `pnpm`; satu package manager dan satu lockfile sepanjang proyek.
- **Styling:** Tailwind CSS 4, CSS custom properties; shadcn/ui + Radix hanya bila mempercepat komponen interaktif, bukan seluruh desain menjadi template dashboard.
- **Animation:** Motion for React untuk efek kecil (respect `prefers-reduced-motion`); icon Lucide React.
- **Forms:** React Hook Form + Zod (validasi browser **dan** server).
- **Editor:** Lexical (Payload); **SEO:** `@payloadcms/plugin-seo` + Next.js Metadata API.
- **Testing:** Vitest atau setara untuk unit/integration, Playwright untuk E2E; typecheck, lint, production build.
- **Email:** transport SMTP/Resend via env; fallback log hanya di local development, jangan mengklaim email terkirim bila gagal.
- **Media:** local dev storage; object storage S3-compatible untuk production, private attachments tidak boleh publik.
- **Hosting:** server yang dapat menjalankan Node.js, PostgreSQL eksternal terkelola dan persistent file storage. Detail provider diputuskan sebelum deploy.

Official references: https://payloadcms.com/docs/getting-started/installation ; https://payloadcms.com/docs/database/postgres ; https://payloadcms.com/docs/database/migrations ; https://opencode.ai/docs/rules/ .

## 3. Informasi arsitektur dan prinsip implementasi

- Satu monorepo/aplikasi Next.js dengan route group public dan route Payload admin/API (jangan menimpa route yang disediakan Payload).
- Konten bisnis dari Payload Collections/Globals. Server Components utama fetch melalui Payload Local API di server; **tetap enforce akses publik `_status=published`**, hindari `draft: true` di request publik. Local API default dapat bypass access: query server publik harus secara eksplisit memfilter published, dan operasi yang harus taat role memakai `overrideAccess: false` + user yang terautentikasi.
- Schema dan relasi mengikuti `database-schema.md`; buat migration terkontrol untuk semua perubahan skema. Jangan edit manual tabel di DBeaver.
- Database lokal existing: `designbuild_db`, username `designbuild_admin`, host `127.0.0.1:5432`, service `designbuild_postgres`, dengan password di `.env`; **jangan reset volume dan jangan overwrite credentials**.
- Simpan data input form dan media secara permanen; untuk demo gunakan seed idempotent (foto Unsplash diimpor ke media + proyek konsep berlabel demo). Saat rilis bisnis sesungguhnya, filter/hapus konten demo dari publik dan ganti dengan konten terverifikasi.

## 4. Sitemap dan halaman publik

| URL | Konten dan interaksi penting | Prioritas |
|---|---|---|
| `/` | Hero arsitektur legal dari media CMS, tagline Arkana, pendekatan Design & Build, layanan, **contoh konsep berlabel demo**, workflow, klaim terverifikasi saja, CTA inquiry | P0 |
| `/tentang-kami` | Profil, sejarah, visi-misi, proses, nilai, tim (jika tersedia), milestone | P0 |
| `/layanan` | Daftar kategori dan layanan, kartu layanan, CTA, FAQ ringkas | P0 |
| `/layanan/[slug]` | Detail layanan, tahapan, deliverables, keunggulan, proyek relevan, CTA | P0 |
| `/proyek` | Portfolio/konsep demo filterable: kategori, cakupan, lokasi (bila valid), tahun, urutan; label transparan bahwa proyek demo hanyalah ilustrasi | P0 |
| `/proyek/[slug]` | Case study asli ketika tersedia; untuk seed: *studi konsep fiktif*, brief/ide/inspirasi, foto ilustratif (tidak mengklaim sebagai render/hasil konstruksi Arkana), related projects | P0 |
| `/keahlian` | Expertise, proses Design → Development → Build → Handover, kapabilitas | P0 |
| `/sertifikasi-k3` | Sertifikasi legal/HSE yang tervalidasi, komitmen kualitas & keselamatan (bukan klaim generik) | P0 |
| `/klien-mitra` | Klien/partner/testimoni yang memiliki izin publikasi | P1 |
| `/berita` + `/berita/[slug]` | News/insights dinamis dengan artikel dan related posts | P1 |
| `/kontak` | Informasi perusahaan dari CMS, link peta resmi, CTA WA/email, form kontak sederhana (bisa arahkan ke RFQ) | P0 |
| `/permintaan-penawaran` | Form quote terstruktur, validasi, upload dokumen (opsional), consent, konfirmasi berhasil/gagal | P0 |
| `/karier` + `/karier/[slug]` | Lowongan aktif & detail; CTA apply ke alamat email yang dikonfigurasi | P1 |
| `/privasi` | Penjelasan pengelolaan data kontak/quotation; editable di CMS | P0 |
| `/<slug>` | Halaman editorial tambahan dengan blok terkontrol; nonkonflik dengan path utama | P2 |

**Company profile PDF:** tombol download mengambil asset publik `site_settings.companyProfilePdf`; jika belum tersedia, tampilkan alternatif kontak, bukan tautan rusak.

## 5. Pengalaman utama (user journeys)

### J1 — Calon klien melihat rekam jejak
1. Masuk homepage dan memahami fokus Design & Build dalam 5–10 detik.
2. Klik Projects, filter `Residential` atau `Full Design & Build`.
3. Buka detail case study; lihat galeri konsep vs hasil (jika kedua aset tersedia), scope, konteks, outcome, related service.
4. Klik `Konsultasikan Proyek` menuju quotation dengan konteks layanan/proyek terisi aman (tidak perlu expose data privat).

### J2 — Calon klien meminta penawaran
1. Isi nama, email, telepon, tipe proyek, lokasi, cakupan, estimasi budget (opsional), target waktu (opsional), ringkasan kebutuhan, consent.
2. Opsional unggah dokumen proyek yang aman dan private (format/ukuran dibatasi).
3. Server memvalidasi, membatasi spam, menyimpan request; memberikan reference ID dan pesan konfirmasi (tanpa membocorkan informasi sensitif).
4. Dashboard admin memperlihatkan `New`. Admin menindaklanjuti `Contacted → In Review → Closed` dengan notes & histori.
5. Notifikasi email kepada tim bila transport tersedia; kegagalan email tidak boleh menyebabkan kehilangan inquiry yang telah tersimpan.

### J3 — Editor mengelola konten
1. Login admin, pilih collection, buat Draft (teks, galeri, relasi, SEO).
2. Preview privat, revisi, publish.
3. Halaman publik menggunakan versi published; cache/revalidation menjamin konten baru tersaji wajar.
4. Jika keliru, gunakan Versions untuk review & restore konten sebelumnya.

### J4 — Super Admin mengelola akses
1. Create/invite editor melalui alur aman; hanya Super Admin bisa mengubah role/manage users.
2. Editor hanya akses domain konten yang disetujui dan quotation workflow; tidak bisa mengeskalasi diri menjadi admin.
3. Super Admin bisa melihat aktivitas quotation & melakukan perbaikan data sesuai kebijakan.

## 6. Detail fitur wajib (P0)

### 6.1 CMS content CRUD
- CRUD: `projects`, `services`, `project_categories`, `service_categories`, `articles`, `article_categories`, `jobs`, `testimonials`, `certifications`; juga `clients_partners`, `expertise`, `pages`.
- Slug unik, relasi valid, error validation jelas, pagination/search/filter di admin (gunakan fitur native Payload).
- Featured images, media alt text, sorting/featured flags, schedule publish opsional setelah baseline stabil.
- Delete tidak boleh menimbulkan referensi yatim: gunakan restriction/clear relationship yang aman dan UX yang jelas.

### 6.2 Media library
- `media` untuk foto proyek/OG image/logo/PDF publik; image metadata, alt, original/variants, preview; `private_files` untuk lampiran inquiry.
- Validasi server: tipe MIME nyata (jangan percaya extension saja), batas ukuran, hanya tipe di allowlist, nama file aman, storage privat, tanpa URL publik ke lampiran quote.
- Production S3-compatible dengan credentials env dan URL signing untuk private files. Dev local private route harus benar-benar memeriksa auth.

### 6.3 Publishing & version control
- `versions.drafts` pada konten editorial yang relevan; preview hanya boleh dibuka oleh pemilik akses melalui token/session aman.
- Publish/unpublish; log revisi, restore; skenario rollback wajib diuji.
- Quotation/activities tidak mengikuti workflow draft/publish editorial.

### 6.4 Metadata dan SEO
- Edit SEO title, description, OG image untuk halaman penting; canonical, index policy, sitemap, robots.txt, structured data Organization/LocalBusiness yang valid bila faktanya tersedia; breadcrumbs.
- Field SEO plugin tetap terhubung ke metadata yang benar-benar dicetak frontend, bukan hanya field di dashboard.
- Jangan indeks draft, admin, preview, RFQ success, atau private documents.

### 6.5 Quotation inbox/workflow
- Form quotation fungsional; status `new`, `contacted`, `in_review`, `closed`, timestamps, actor dan note history; optional outcome `won/lost/no_response` saat closed (pilihan dapat disesuaikan).
- Admin list/detail, search/filter, update status, internal notes, email notification, privasi.
- Perubahan status harus menghasilkan satu log yang konsisten; tidak boleh mengedit/delete audit via form publik.

### 6.6 Role-based access
- `Super Admin`: semua konten, user/role, quotation, settings, konfigurasi aplikasi.
- `Editor`: CRUD konten, draft/preview/publish editorial sesuai kebijakan, baca/update quotation tetapi tidak menghapusnya, tidak mengelola user/role atau credential.
- `Visitor`: hanya published content dan create quotation via endpoint yang divalidasi; tidak boleh read list quotation/private uploads.
- Semua akses divalidasi di server, bukan sekadar menyembunyikan tombol di UI.

### 6.7 CMS Globals
- `site_settings`: nama/legal name, logo, tagline, brand, PDF company profile, default SEO, social links, optional verified stats.
- `homepage`: hero, content order/pilihan curated cards, featured project/services, CTA, highlights.
- `about_page`: story, mission, values, timeline, process, team content dengan persetujuan.
- `contact_settings`: physical address, maps link, WA, phone, email, hours, quotation routing email.

## 7. Fitur P1 dan P2

**P1:** clients/partners & testimonials page (kosong bila belum ada bukti), careers index/detail (lowongan demo harus berlabel dan tidak dapat dilamar), news/insights, PDF company profile hanya jika sah tersedia, analytics events consent-aware, FAQ, related content, image lightbox.  
**P2 (optional):** vendor/tender portal, careers application submission database, multilingual, advanced map/filter, CRM integration, automated follow-up. Tidak dibangun tanpa kebutuhan bisnis dan keputusan data/privacy.

## 8. Content / brand direction

Lihat `design.md`. Brand **Arkana Design & Build**; tagline “Designed with Vision. Built with Precision.”; slogan homepage “Dari Konsep hingga Bangunan Nyata.” Keputusan baseline: Navy `#142D3D`, Cloud `#EAEFF1`, Copper `#D99737`, Slate `#72828B`, White `#FFFFFF`; gaya **Contemporary Architectural Corporate**, menggabungkan referensi web konstruksi minimal, brosur editorial, dan visual corporate yang tegas. Visual difokuskan pada foto bangunan dan proses desain/eksekusi; bukan foto stock pekerja berlebihan. Default konten Bahasa Indonesia, tone kompeten, ringkas, tidak hiperbolik.

### 8.1 Seed konten demonstrasi — wajib terstruktur, bukan lorem ipsum

- **Nama:** Arkana Design & Build; **tipe:** Design & Build arsitektur, interior, konstruksi dan renovasi; **bahasa:** Indonesia; **tone:** tegas, manusiawi, spesifik; tanpa angka pengalaman/sertifikasi rekaan.
- **Layanan awal (6):** Desain Arsitektur; Interior Design; Design & Build Terintegrasi; Renovasi & Remodeling; Desain Komersial; Konsultasi & Perencanaan Proyek. Judul, deskripsi, deliverable dan proses disimpan dalam CMS, bukan hardcode di React.
- **Konsep portfolio demo (8):** Nara Residence (rumah minimalis); Ruang Sela (interior hunian); Atelier Workspace (kantor kreatif); Dapur Karya (renovasi dapur); Garis Putih (fasad minimalis); Horizon Office (ruang kerja komersial); Ruang Tumbuh (studi revitalisasi); Paviliun Senja (konsep hunian kontemporer). Semua nama/lokasi/progres **ilustratif**, bukan proyek Arkana yang benar-benar dibangun. Jangan membuat klaim *before/after*, hasil realisasi, angka biaya, atau klien nyata dari foto stok.
- **Artikel awal (4):** “5 Tahap Merancang Rumah yang Efisien”; “Design & Build vs Kontraktor Tradisional”; “Memilih Material untuk Ruang Tropis”; “Checklist Sebelum Memulai Renovasi”. Konten orisinal, informatif, tanpa fakta teknis tidak diverifikasi.
- **Karier:** maksimal 1–2 lowongan contoh dengan status `demo`; tombol *Lamar* disembunyikan selama demo.
- **Trust center:** jangan seed testimoni/klien/sertifikasi palsu. Buat state kosong profesional dan jelaskan apa yang perlu diisi admin.
- **Sumber foto yang dipilih:** Unsplash Free (contoh terkurasi pada `design.md`), **bukan Unsplash+**. Agent harus memeriksa lisensi masing-masing aset sebelum penggunaan, menyimpan URL sumber/atribusi, mengunduh dan mengimpor ke `media`. Boleh gunakan Pexels Free hanya sebagai fallback terverifikasi.
- **Perilaku demo:** `site_settings.demoMode = true`, header/footer menampilkan penanda *“Website demo — proyek & konten ilustratif”* dan tiap case study memiliki badge *“Konsep Ilustratif”*. Mode demo harus `noindex`, sitemap hanya konten non-demo. Produksi nyata memfilter record `isDemo=true` ketika mode demo dimatikan. Jangan menyamarkan stock photography sebagai portofolio nyata.
- **CTA:** tombol “Lihat Inspirasi Proyek” ke `/proyek` dan “Diskusikan Kebutuhan” ke form yang benar-benar menyimpan inquiry; jangan membuat nomor WhatsApp/email fiktif yang diklik.


## 9. Non-functional requirements & keamanan

- **Mobile-first:** viewport mulai 320px; 375, 768, 1024, 1440px wajib dites.
- **Performance:** optimasi AVIF/WebP jika memungkinkan, responsive images, hero image preload tepat, lazy image nonhero, minimal client JS, cache sesuai content freshness. Target lab Lighthouse ≥90 untuk Performance/Accessibility/Best Practices/SEO di halaman utama dengan data realistis (target, bukan jaminan).
- **Aksesibilitas:** WCAG 2.2 AA sebagai target; keyboard nav, focus visible, alt text, label, contrast ratio, reduced motion; copper sebagai accent, jangan teks copper pada putih untuk normal text.
- **Safety:** server-side auth/authorization/validation; anti-CSRF sesuai strategi auth; injection-safe ORM/APIs; rate limiting dengan persistent storage pada deployment multiinstance; no exposed secrets; file upload security; sanitize rich text; security headers bila compatible.
- **Reliability:** backup database/media pada production; document restore steps; external dependencies failure handling; `404`, `500`, and empty states.
- **Legal/privacy:** privacy notice dan consent form, retensi inquiry ditentukan pemilik bisnis sebelum production; jangan memajang nomor sertifikat/informasi klien yang tidak diberi izin.
- **Analytics:** event quote submit success, WA click, PDF download, project detail view (tanpa menyertakan PII ke analytics).

## 10. Acceptance criteria end-to-end = Definisi 'jadi'

Sebuah build **belum dianggap selesai** hanya karena homepage terlihat bagus. Semua berikut harus dapat diuji:

1. Next.js + Payload CMS berjalan via project root, PostgreSQL lokal existing tersambung, tanpa reset data/volume.
2. Admin `/admin` dapat login sebagai Super Admin, create Editor; role access benar di API/UI.
3. CRUD semua collections yang masuk P0/P1 bisa dilakukan dan tervalidasi, termasuk images/PDF/relasi.
4. Published projects/services/articles/pages muncul di URL yang tepat; draft tidak muncul ke publik.
5. Preview private, version history, publish, unpublish, restore berfungsi (setidaknya projects, articles, globals penting).
6. Semua public routes memiliki navigasi dan mobile layout yang berfungsi; tidak ada dead links/dummy CTA.
7. Project portfolio: filter, responsive grid, detail case study, gallery, related services, empty/not-found states.
8. Quotation valid disimpan `new` dengan reference, admin dapat melakukan 3 transisi hingga `closed` dan histori ada, file quote tak dapat diakses anonim.
9. Metadata SEO tampil pada HTML; sitemap hanya URLs published; noindex admin/preview.
10. Automated tests memeriksa critical flows; `typecheck`, `lint`, `test`, `build` lulus; hasil tes tertulis jelas.
11. Mode demo menampilkan label demonstrasi konsisten, seeded project/artikel/pekerjaan benar-benar berstatus demo dan situs demo `noindex`; **mode bisnis sungguhan** tidak boleh menampilkan contoh konsep seolah proyek asli. Environment & deployment steps didokumentasikan.
12. Di mode demo, minimal 8 konsep proyek ilustratif, 6 layanan, 4 artikel edukatif, kategori dan media foto online berhasil dimuat via Payload; seed idempotent; tidak ada broken-image, missing label, atau CTA palsu.

## 11. Content readiness checklist sebelum go-live

Pemilik bisnis harus menyediakan/menyetujui: nama perusahaan resmi, brand/logo, domain, deskripsi bisnis, alamat, WhatsApp, email, daftar layanan & scope, proyek lengkap dengan foto dan izin publikasi, daftar sertifikasi & tanggal validitas, klien/testimoni izin publikasi, PDF company profile, notice privasi, penerima email quotation. Saat belum ada, tampilkan konten demo yang *jelas fiktif* atau state kosong yang berkelas—jangan mengarang kredibilitas. Mode demo boleh dipamerkan dengan `noindex`, tidak boleh dinyatakan sebagai website bisnis nyata.

## 12. Out of scope baseline

Payment gateway, cart/checkout, internal procurement, ERP, inventory, construction cost estimator dengan angka pasti, AI chatbot, 3D engine berat, vendor tender account portal, dan app mobile native.

## 13. Peta pengerjaan

Buka `alltask.txt`, pilih **satu** blok `TASK 01/28` sampai `TASK 28/28` dan paste ke OpenCode satu per satu. **Jangan paste seluruh `alltask.txt` sekaligus.** Tiap task punya acceptance criteria; agent harus menguji dan melaporkan status sebelum lanjut. `AGENTS.md` dibaca otomatis dari root repository.
