# Website Desa Digital

Website desa modern: **publik** (informasi untuk warga) + **admin** (kelola konten tanpa coding).
Backend memakai **Google Apps Script** (skrip add-on di Spreadsheet, **tanpa Service Account**)
sebagai database, dan **Cloudinary** untuk gambar/dokumen. Sisi web berjalan di **Vercel**.

## Arsitektur

```
web_desa/
├── apps/
│   ├── publik/   → situs publik   (mis. desaku.id)
│   └── admin/    → dashboard admin (mis. admin.desaku.id)
├── packages/
│   └── lib/      → data layer bersama (klien Apps Script, Cloudinary, auth, tipe, validasi)
└── apps-script/
    └── Code.gs   → backend Web App (tempel di Spreadsheet → Apps Script)
```

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, komponen gaya shadcn, Lucide.
- **Database**: Google Sheets via **Apps Script Web App** (tiap tab = tabel). Publik memakai **ISR** agar cepat.
- **File**: Cloudinary (thumbnail, foto, dokumen PDF/DOC/XLS/ZIP).
- **Auth admin**: 1 akun, password di env, session cookie bertanda (jose).
- **Editor berita**: TipTap (rich text, gambar, embed YouTube, tabel).

> 📖 Panduan setup lengkap langkah demi langkah ada di **`PANDUAN-SETUP.md`**.

---

## 1. Prasyarat

- Node.js ≥ 20
- Akun Google (untuk Spreadsheet + Apps Script — gratis, tanpa Google Cloud)
- Akun [Cloudinary](https://cloudinary.com) (gratis)
- Akun [Vercel](https://vercel.com)

---

## 2. Setup Backend (Apps Script)

1. Buat **Spreadsheet kosong** di Google Sheets.
2. **Extensions → Apps Script** → tempel seluruh isi **`apps-script/Code.gs`**.
3. Ganti `var TOKEN = '...'` dengan token rahasia Anda → **Save**.
4. Pilih fungsi **`setup`** → **Run** (beri izin akses) → tab + data contoh dibuat otomatis.
5. **Deploy → New deployment → Web app** (Execute as: *Me*, Who has access: *Anyone*) →
   salin **Web app URL** (`/exec`).

Hasil: `APPS_SCRIPT_URL` (URL `/exec`) + `APPS_SCRIPT_TOKEN` (sama dengan TOKEN di Code.gs).

---

## 3. Setup Cloudinary

1. Daftar di Cloudinary → buka **Dashboard**.
2. Salin **Cloud name**, **API Key**, **API Secret** → isi env terkait.

---

## 4. Konfigurasi Environment

```bash
cp .env.example .env
```

Isi `.env` (lihat komentar di dalamnya). Catatan:
- `APPS_SCRIPT_TOKEN` **wajib sama** dengan `TOKEN` di `Code.gs`.
- `ADMIN_PASSWORD` & `SESSION_SECRET` hanya dipakai app **admin**.
- `DATA_REVALIDATE`: `0` saat lokal; di Vercel project **publik** set `600`.

---

## 5. Inisialisasi Spreadsheet

Sudah dilakukan oleh fungsi **`setup`** di Apps Script (Bagian 2, langkah 4).
Tidak ada script Node tambahan.

---

## 6. Menjalankan Lokal

```bash
npm run dev:publik   # http://localhost:3000
npm run dev:admin    # http://localhost:3001  (login pakai ADMIN_PASSWORD)
```

> Jalankan di dua terminal terpisah (port berbeda).

---

## 7. Deploy ke Vercel (2 domain)

Buat **dua project Vercel** dari repository yang sama:

### Project A — Publik
- **Root Directory**: `apps/publik`
- **Framework Preset**: Next.js
- **Environment Variables**: `APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`, `CLOUDINARY_*`,
  `NEXT_PUBLIC_SITE_URL`, `DATA_REVALIDATE=600`, `REVALIDATE_SECRET` (opsional).
- **Domain**: `desaku.id` (domain publik Anda).

### Project B — Admin
- **Root Directory**: `apps/admin`
- **Framework Preset**: Next.js
- **Environment Variables**: `APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN`, `CLOUDINARY_*`,
  `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET` (opsional).
  > Jangan set `DATA_REVALIDATE` di admin (biar data selalu fresh).
- **Domain**: `admin.desaku.id`.

> Karena monorepo, Vercel mendeteksi `apps/<x>` lewat **Root Directory**. Tidak perlu konfigurasi khusus.

### Revalidate instan (opsional)
Set `REVALIDATE_SECRET` (nilai sama) di kedua project. Setelah admin menyimpan, halaman publik
terkait langsung di-refresh (path + cache data). Jika tidak diset, perubahan muncul mengikuti
`DATA_REVALIDATE` (mis. ±10 menit).

---

## 8. Cara Pakai Admin

1. Buka domain admin → login dengan `ADMIN_PASSWORD`.
2. **Pengaturan**: isi identitas desa, profil (sejarah/visi/misi/sambutan), dan kontak terlebih dulu.
3. **Statistik**: perbarui angka kependudukan.
4. **Berita / Agenda / Galeri / Dokumen**: tambah konten. Gambar & file otomatis ke Cloudinary.

---

## Catatan Teknis

- **Kapasitas**: cocok untuk skala desa (puluhan–ratusan artikel). Apps Script & Sheets punya
  kuota harian; ISR caching di sisi publik menutupinya. Untuk skala sangat besar, pertimbangkan
  pindah ke database sungguhan kelak — data layer terisolasi di `packages/lib` (`sheets.ts`),
  jadi cukup ganti satu file.
- **Keamanan**: token Apps Script & kredensial Cloudinary hanya di env (server-side). Web App
  di-deploy "Anyone" tetapi semua aksi tulis butuh `APPS_SCRIPT_TOKEN` yang benar. Jangan commit `.env`.
- **Ubah backend**: setiap kali mengedit `apps-script/Code.gs`, deploy ulang versi baru di Apps Script.
- **Modul lanjutan** (Potensi Desa, Aparatur, multi-user Admin/Editor) belum termasuk MVP ini dan
  bisa ditambah mengikuti pola repo yang sama.
