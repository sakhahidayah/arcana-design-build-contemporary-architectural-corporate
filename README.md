# Arkana Design & Build

Fondasi TASK 02 untuk website demo berbahasa Indonesia. Belum berisi portfolio,
layanan, atau klaim bisnis. Halaman sementara dan admin memakai `noindex`.

## Runtime

- pnpm 10.34.9; `pnpm-workspace.yaml` mengelola Node 24.22.2 khusus proyek.
- Next.js 16.4.5, React 19.3.1, Payload dan adapter 3.93.0, TypeScript 5.9.3.
- PostgreSQL 17 existing, service `postgres`, database `designbuild_db`.
- Payload 3.93.0 meminta Next >=16.3.3 <17 pada peer dependencies,
  lebih ketat daripada minimum 16.2.6 di halaman instalasi.

Jalankan dari PowerShell di folder proyek:

```powershell
pnpm install --frozen-lockfile
pnpm exec node --version
docker compose ps
pnpm check:db
pnpm dev
```

Jika pnpm belum terpasang di mesin lain: `npm install --global pnpm@10.34.9`.
Node sistem tidak diganti; gunakan perintah pnpm agar runtime proyek terpilih.
Jika Docker Desktop berhenti, buka Docker Desktop terlebih dahulu. Jangan
membuat ulang container/volume untuk menjalankan aplikasi.

## Konfigurasi Lokal

`.env` dan `docker-compose.yaml` existing dipertahankan. `.env.local` berisi
DATABASE_URL dan PAYLOAD_SECRET, tidak boleh di-commit atau dicetak.
Pada checkout baru dengan `.env` Docker yang benar, jalankan `pnpm setup:env`.
Generator memakai password existing dan random secret, serta menolak menimpa
`.env.local` yang sudah ada. `.env.example` hanya berisi placeholder.

## Admin dan Verifikasi

- Website sementara: http://127.0.0.1:3000
- CMS: http://127.0.0.1:3000/admin
- Saat belum ada user, gunakan flow Create First User lokal dengan kredensial
  pilihan sendiri. Tidak ada akun/password seed. Jangan expose server sebelum
  akun pertama dibuat dan pengaturan akses produksi selesai.
- Auth saat ini hanya baseline admin. Role Editor/Super Admin terperinci belum
  diimplementasikan; jangan gunakan sebagai CMS multi-role produksi.
- Email sengaja dinonaktifkan; reset password via email belum tersedia dan
  isi email/token tidak dicetak ke console.
- GraphQL dinonaktifkan; REST Payload tersedia dengan kontrol akses collection.

```powershell
pnpm test
pnpm lint
pnpm typecheck
pnpm build
pnpm test:smoke
```

Smoke test menjalankan `pnpm dev` di port 3102, memeriksa HTML/noindex halaman
publik/admin serta penolakan anonymous users API, lalu menghentikan prosesnya.
Ini tes HTTP, bukan pengujian interaksi browser end-to-end.

Di DBeaver gunakan host `127.0.0.1`, port `5432`, database `designbuild_db`,
user `designbuild_admin`, dan password existing secara lokal. Inspeksi read-only:

```sql
SELECT current_database(), version();
SELECT name, batch FROM payload_migrations;
```

## Schema

Migrasi Payload `20261106_062420_initial` menambahkan users, sessions, serta
tabel internal CMS. Migrasi UP sudah diterapkan pada database lokal yang
sebelumnya tidak memiliki tabel pengguna. Tidak ada reset atau migrasi DOWN
yang dijalankan. Auto-push dan auto-create database dinonaktifkan.

Migrasi belum diuji pada database disposable terpisah; wajib validasi terpisah
sebelum deployment produksi. Jangan menjalankan DOWN/reset/fresh pada database
existing. Perubahan schema selanjutnya melalui config Payload dan migrasi
yang ditinjau. Jangan menjalankan migrasi produksi tanpa backup dan persetujuan.

`pnpm payload generate:types` dan `pnpm payload generate:importmap` memperbarui
file generated setelah perubahan config. ESLint 9 dan dua dependency transitif
esbuild-kit memiliki peringatan deprecation; tidak di-upgrade lintas major
tanpa pengecekan kompatibilitas.

Referensi: https://payloadcms.com/docs/getting-started/installation dan
https://payloadcms.com/docs/database/postgres.
