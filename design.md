# DESIGN SYSTEM & UI/UX SPECIFICATION
## Arkana Design & Build — Contemporary Architectural Corporate

**Status:** sumber keputusan visual untuk implementasi; desain referensi dari user disimpan pada `references/`.  
**Tujuan:** website premium, editorial, profesional dan kuat; **bukan** SaaS dashboard look, bukan template landing page generik.  
**Bahasa copy UI:** Bahasa Indonesia.

## 1. Referensi & interpretasi

| Source | File | Elemen yang diambil | Yang dihindari |
|---|---|---|---|
| Pinterest 01 — Construction landing | `references/contoh-website-company-profile.jpg` | Struktur header ringkas, hero visual kuat, navigasi sederhana, services grid | Foto pekerja stock generik, spacing yang terlalu tipis, teks sangat kecil |
| Pinterest 02 — Company profile brochure | `references/design-web-konstruksi.jpg` | Layout editorial asimetris, grid teks+foto, garis & label kategori, struktur seperti katalog arsitektur | Menyalin komposisi brosur mentah ke web; orange besar yang menyalahi palet |
| Pinterest 03 — Corporate consulting site | `references/web-perusahaan.png` | Navy color blocking, diagonal geometry secara terbatas, utilitas header, trust cues & CTA aksen | Hero terlalu padat, navbar bertumpuk, banyak icon dekoratif |

**Sintesis:** `Architectural Editorial + Confident Corporate + Design & Build Process`. Foto case study dan realisasi menjadi pemeran utama. Pilih ruang putih dan tipografi tegas, dengan *interupsi visual* navy/copper secukupnya. Identitas visual asli; tidak mengkloning komposisi, nama, ikon, atau konten template.

## 2. Color tokens — FROZEN

| Token | HEX | Penggunaan |
|---|---|---|
| `--color-navy` | `#142D3D` | Brand, headline, footer, dark sections, foreground dominan |
| `--color-cloud` | `#EAEFF1` | Background section, separators, subtle card backgrounds |
| `--color-copper` | `#D99737` | Accent, CTA bg, rules, labels di background navy |
| `--color-slate` | `#72828B` | Border, muted UI, icon decorative, bukan teks body di atas putih tanpa kontras tambahan |
| `--color-white` | `#FFFFFF` | Surface, negative space, text di navy |

**Kontras penting:** copper pada putih ~2.49:1 → **tidak cukup** untuk teks biasa; navy pada putih ~14.26:1; copper pada navy ~5.73:1. Gunakan teks navy di atas tombol copper. Untuk teks muted pada latar putih, buat semantic text token yang memenuhi 4.5:1, boleh turunan navy (misal `#405866`), jangan memaksa Slate asli untuk body kecil. Copper boleh dipakai untuk garis tebal/dekorasi dan focus ring yang jelas. Periksa kontras melalui tooling.

Contoh token CSS yang boleh disesuaikan untuk readability:

```css
:root {
  --color-navy: #142D3D;
  --color-cloud: #EAEFF1;
  --color-copper: #D99737;
  --color-slate: #72828B;
  --color-white: #FFFFFF;
  --color-ink-soft: #405866;
  --color-navy-deep: #0F2432;
  --color-border: #D5DEE2;
  --radius-control: 6px;
  --radius-card: 8px;
}
```

**Komposisi visual kasar:** White/Cloud 65–75%, Navy 20–30%, Copper 5–10%. Tidak setiap section harus memiliki background navy.

## 3. Typography & visual rhythm

- Heading/display: **Barlow Condensed** (700–800) untuk display tegas dan headline proyek; tracking netral, uppercase hanya sebagai pilihan untuk label & display khusus.
- UI/body: **Manrope** (400–700). Jika perlu fallback performa: Arial/system sans; hindari banyak varian font.
- Number/stat: Barlow Condensed Bold, tetapi angka statistik **hanya jika data telah divalidasi**.
- Skala contoh desktop: Display `clamp(3rem, 7vw, 6rem)`; H1 `clamp(2.5rem, 5vw, 4.5rem)`; H2 `clamp(2rem, 4vw, 3.25rem)`; H3 `1.375–1.75rem`; body `1rem/1.6`; lead `1.125rem/1.55`; eyebrow `0.75rem` dengan tracking.
- Container max width `1280px`, gutter mobile `20px`, tablet `32px`, desktop `48px` (adaptif); spacing 8px-based scale; max reading width `65–72ch` untuk teks panjang.
- Heading tegas, line-height rapat; body lega; gunakan garis horizontal, step indicator, image crop dan grid editorial daripada banyak shadow.

## 4. Layout & composition rules

1. **Header:** logo kiri, navigasi ringkas tengah/kanan; CTA `Konsultasi Proyek`; sticky setelah scroll opsional dengan aksesibilitas. Desktop jangan lebih dari 1 navbar + slim info bar jika benar-benar perlu; mobile menu drawer fokus-terkelola.
2. **Hero:** foto bangunan/interior atau work-in-progress berkualitas dari perusahaan (fallback dev dapat pakai neutral placeholder, production tidak memakai foto Pinterest); overlay navy gradient; headline + 1 kalimat nilai; CTA primer & sekunder. Hindari foto pekerja helm stock sebagai satu-satunya identitas.
3. **Sections:** alternating editorial split (50/50, 40/60), image panoramas, project mosaic, label number (01/02/03), section heading dengan top line Copper.
4. **Portfolio:** gallery-led; card berfoto besar, category, title, location, year; hover image scale 1.03 dan overlay halus. Tidak semua kartu perlu border.
5. **Trust:** sertifikasi valid, partner logo yang berizin, quote/testimoni autentik, verified stats; section dapat kosong bila data tidak ada.
6. **Geometry:** 1–2 diagonal cut/angled overlay pada hero atau CTA navy (inspirasi referensi 03); bukan seluruh konten dibentuk segitiga.
7. **Buttons:** primary Copper bg + Navy text; secondary Navy bg + White text; tertiary subtle underline/arrow; min tap target 44x44px.
8. **Radius:** 0–8px dominan (arsitektur presisi). Hindari glassmorphism, gradients berlebihan, neon, cards dengan shadow berat.
9. **Visual hierarchy:** 1 hero fokus per halaman; CTA utama jelas; heading semantik; no carousel auto-play (kecuali kontrol pause/accessibility penuh).

## 5. Responsive grid

- `320–639px`: 1 column, stacked split, mobile nav; hero text tidak melebihi viewport; filters bisa dropdown/chips scrollable; tabel CMS tetap tugas Payload.
- `640–1023px`: 2 columns untuk project/service cards, split beberapa section bila muat.
- `1024px+`: 3 columns cards, editorial 12-column grid, full navigation. Layout kasus proyek boleh 2-column label + body.
- Gambar pakai `next/image` bila kompatibel dengan storage; size attributes eksplisit; tidak menyebabkan CLS; alt spesifik.

## 6. Page blueprints

### `/` Homepage — urutan rekomendasi Arkana Design & Build
1. Header & navigation, logo + primary CTA.
2. Hero brand message: **"Dari Konsep hingga Bangunan Nyata."** (default copy Arkana, editable di CMS); image utama; CTA `Lihat Proyek` / `Konsultasikan Proyek`.
3. Trust strip: nilai keunggulan terverifikasi; *bukan* angka dummy. Jika statistik diset kosong, tampilkan proses/metode.
4. Intro perusahaan: editorial split foto bangunan / mission & proof points.
5. Layanan utama: curated 3–6 services tiles dengan foto/number accent.
6. Featured projects: asymmetric image grid / masonry ringan (tidak library mahal); link detail.
7. Design & Build workflow: 4–5 steps Concept → Design → Planning → Construction → Handover.
8. Quality / HSE / expertise callout (jika punya data yang valid).
9. Testimonial/clients jika berizin; jika kosong, jangan render gap kosong.
10. Full-width CTA Navy dengan Copper detail, footer.

### `/proyek`
Large page headline; intro; taxonomy filters (category, scope, year, location), reset filters, count; cards foto 4:3/3:2 dengan data nyata. URL query parameters untuk filter shareable. Loading & zero-result state.

### `/proyek/[slug]`
Hero photo, project headline + meta; **Project Overview** (type, role, client bila diizinkan, year, location, scope, status, area); editorial story (challenge, idea, solution, outcome), comparison render vs built jika tersedia (bukan slider wajib), progress/gallery (clickable lightbox), related services, adjacent projects, CTA.

### `/layanan` + detail
Intro Design & Build proposition, layanan sebagai grid editorial dengan kategori; tiap detail berisi problem solved, scope, key deliverables, process, related cases, FAQ opsional, CTA.

### `/tentang-kami` + `/keahlian`
Value statement, sejarah, prinsip desain, alur end-to-end, anggota tim yang disetujui, expertises dan relasi layanan.

### `/sertifikasi-k3` + `/klien-mitra`
List/timeline sertifikasi; verifikasi issuer/validity; company PDF CTA; clients/partners hanya yang punya izin; testimoni bukan hardcoded.

### `/berita` + detail
Editorial article cards, thumbnail, date, category; rich content, related posts, share links.

### `/kontak` + `/permintaan-penawaran`
Kontak langsung + map link valid; RFQ 1-column mobile, 2-column desktop dengan label dan helper text jelas. Progress indicator hanya jika multistep benar-benar diimplementasikan. Success & error states tertulis; upload document bukan public.

### `/karier` + detail
Daftar lowongan aktif, detail kualifikasi, deadline; CTA apply ke email HR yang diatur CMS, tanpa form yang berpura-pura menyimpan lamaran.

## 7. Komponen UI

- `SiteHeader`, `MobileNav`, `SiteFooter`, `SectionHeading`, `EyebrowLabel`, `Breadcrumbs`, `Button`, `ProjectCard`, `ServiceCard`, `EditorialSplit`, `FeatureList`, `ProcessSteps`, `MediaGallery`, `ImageLightbox`, `LogoStrip`, `TestimonialCard`, `CertificationCard`, `BlogCard`, `InquiryForm`, `FilterToolbar`, `EmptyState`, `StatusMessage`, `SeoBreadcrumbs`.
- Global UI states: hover/focus/active/disabled/loading/success/error, skeleton where meaningful; never blank pages on failed content fetch.
- Prefer native semantic elements `nav/main/section/article/figure/figcaption`; headings H1 only one per page.

## 8. Motion & microinteraction

- Entrance reveal 150–350ms subtle opacity+translate, only if not blocked by reduced-motion; don’t animate massive sections continuously.
- Gallery hover scale ≤1.04; dropdown/menu close on Escape; visible focus; no scroll hijacking, no parallax on mobile.
- Button arrow translation 2–4px; transition color ~150ms; project cover zoom <400ms.
- No animation that hides content if JS fails.

## 9. CMS-driven design mapping

- Hero, home section ordering, CTA text/image: `homepage` Global.
- Brand/logo, brochure: `site_settings` Global.
- About/story/timeline: `about_page` Global.
- Contact / WA / quotation recipient: `contact_settings` Global.
- Service taxonomy/detail: `services`, `service_categories`.
- Project galleries/story: `projects`, `project_categories`, `media`.
- Credibility: `certifications`, `clients_partners`, `testimonials`, `expertise`.
- News/jobs/extra pages: `articles`, `jobs`, `pages`.
- SEO meta from Payload SEO plugin / CMS globals; do not duplicate hardcoded marketing values.

## 10. Accessibility & QA visual acceptance

- Contrast 4.5:1 normal text, 3:1 large text & UI boundaries as applicable; do not use `#D99737` small text on white.
- Navigation via Tab, screenreader labels, mobile menu keyboard support, forms with inline errors and `aria-describedby`, logical heading order.
- Test representative widths `320 / 375 / 768 / 1024 / 1440` + landscape mobile.
- Images produce stable layout (aspect ratio) and descriptive alt; decorative images alt empty.
- No horizontal scroll, text clipping, tiny controls, blank unrendered placeholders.
- Don't publish source Pinterest images: they are visual guidance only, not project assets.

## 11. Content placeholders

Konten demo **diizinkan untuk local/staging/demo showcase** dengan banner dan badge transparan, bukan website bisnis live. Tampilkan brand **Arkana Design & Build**, tagline “Designed with Vision. Built with Precision.”, 8 studi konsep ilustratif dan 6 layanan contoh; label **Konsep Ilustratif** pada portfolio, **Demo** pada lowongan contoh. Jangan membuat statistik, testimonial, sertifikat, klien, atau klaim proyek yang fiktif seolah fakta. Seed media memakai katalog sumber foto legal di bawah; tidak boleh mengambil gambar dari screenshot Pinterest.

### 11.1 Katalog foto online terkurasi (Unsplash Free) — untuk demo

**Pilihan utama:** Unsplash Free untuk semua visual proyek, kantor/interior dan proses konstruksi. Unduh dari **halaman foto original**, cek label *Free to use under the Unsplash License*, lalu upload/import lewat Payload `media` dan simpan `sourceUrl`, `creditName`, `licenseType`, `usageRole`. **Jangan hotlink HTML `unsplash.com/photos` sebagai `src` gambar**; URL tersebut adalah halaman sumber, bukan file gambar. Jangan gunakan hasil Unsplash+ berbayar atau konten dari Pinterest sebagai aset. Jangan menyatakan foto berikut hasil proyek Arkana.

| Peran / media seed | Judul foto sumber | Halaman asli sumber foto |
|---|---|---|
| Hero/home + konsep rumah | Modern garage doors on a white house | https://unsplash.com/photos/modern-garage-doors-on-a-white-house-3qRx6B4cT6g |
| Proyek residensial 2 | Modern white house with minimalist landscaping | https://unsplash.com/photos/modern-white-house-with-minimalist-landscaping-and-clean-design-GEkHoBMJxjs |
| Fasad arsitektural | White and gray concrete house | https://unsplash.com/photos/white-and-gray-concrete-house-BJSLmyungtE |
| Interior hunian | Cozy living room with neutral tones and natural light | https://unsplash.com/photos/cozy-living-room-with-neutral-tones-and-natural-light-srzKmNLovaQ |
| Interior editorial | Modern living room with neutral tones and decor | https://unsplash.com/photos/modern-living-room-with-neutral-tones-and-decor-j_S8cdk7yK8 |
| Renovasi kitchen | A bright minimalist kitchen with plants, shelves and a cooktop | https://unsplash.com/photos/a-bright-minimalist-kitchen-with-plants-shelves-and-a-cooktop-dhJ-99yCtB8 |
| Kantor dan komersial | Modern office interior with glass walls and walkways | https://unsplash.com/photos/modern-office-interior-with-glass-walls-and-walkways-V_yQ8IyCmYY |
| Kantor progres interior | Modern office interior with glass walls and reflections | https://unsplash.com/photos/modern-office-interior-with-glass-walls-and-reflections-lIipHR8mi3o |
| Proses konstruksi | A construction site with a crane in the background | https://unsplash.com/photos/a-construction-site-with-a-crane-in-the-background-kO8f82u73Es |
| Editorial desain | Architectural drawing of a modern office interior layout | https://unsplash.com/photos/architectural-drawing-of-a-modern-office-interior-layout-S3cF3QeZ7Zs |

**Cadangan:** Pexels Free License https://www.pexels.com/legal-pages/license/ ; cari foto interior/architecture tanpa watermark atau logo. Lisensi Unsplash: https://unsplash.com/license/ . Sekalipun atribusi tidak wajib dalam lisensi umum, sebaiknya simpan kredit dan tautan sumber dalam CMS. Foto tidak mengimplikasikan dukungan orang/brand yang dipotret terhadap Arkana.

**Performa:** ukuran hero target ~1600–2000px sesuai kebutuhan, crop 16:9 atau 21:9; portfolio 3:2 / 4:3; kualitas WebP/AVIF yang sesuai; jangan download ukuran original besar tanpa kebutuhan. Pada seed, buat script idempotent (cek `sourceUrl`/key sebelum import), tangani jaringan/error/timeout dan laporkan gambar yang gagal. Hindari gambar random yang berubah setiap reload.

**Copy & identitas art direction:**
- Logo sementara: **wordmark teks** “ARKANA” / “DESIGN & BUILD” (dibuat original, jangan mengambil logo Pinterest). Navy dan Copper digunakan sebagai emphasis, bukan seluruh halaman oranye.
- Headline: “Dari Konsep hingga Bangunan Nyata.” / subcopy “Pendekatan desain dan pelaksanaan yang menyatu, dari ide awal hingga ruang yang siap digunakan.” Ini *proposition demo*, bukan jaminan pekerjaan tertentu.
- Navigasi: Beranda, Tentang, Layanan, Proyek, Keahlian, Berita, Kontak; CTA “Diskusikan Proyek”.
- Penanda tetap mode demo: “Website demonstrasi. Proyek, gambar, dan profil ditampilkan untuk kebutuhan konsep.” di atas atau bawah header. Badge “Konsep Ilustratif” di grid dan halaman detail.
- Trust section saat demo: tampilkan **metode kerja** alih-alih statistik, sertifikasi, klien, dan testimoni palsu.
- Jangan gabungkan 3 foto stok tak terkait sebagai dokumentasi fase progres/hasil akhir *satu proyek nyata*. Setiap foto adalah ilustrasi suasana dan disebut demikian.


## 12. Design-to-build handoff

Agent starts with UI tokens & CMS mapping, then public shell, homepage, detail pages, role-based content flows. When Pinterest style conflicts with accessibility or performance, choose accessible UX. Aim for original design inspired by references, not pixel-exact copying. All changes preserve locked palette.
