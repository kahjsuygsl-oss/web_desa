# 📋 Panduan Setup & Uji Coba (Apps Script + Cloudinary)

Backend memakai **Google Apps Script** (skrip add-on di Spreadsheet) — **tanpa Service Account**.
Gambar/dokumen diunggah ke **Cloudinary**. Ikuti urutannya dari atas (±15–20 menit).

Yang akan Anda isi ke file **`.env`**: 1 URL Apps Script + 1 token, 4 nilai Cloudinary,
password admin, dan session secret.

---

## BAGIAN A — Pasang Backend di Spreadsheet (Apps Script)

### A1. Buat Spreadsheet
1. Buka https://sheets.google.com → buat **Spreadsheet kosong baru** (beri nama bebas).

### A2. Tempel kode backend
1. Di spreadsheet itu: menu **Extensions → Apps Script**.
2. Hapus semua isi editor, lalu **tempel seluruh isi file `apps-script/Code.gs`** (ada di proyek ini).
3. Di baris atas, ganti:
   ```js
   var TOKEN = 'GANTI_TOKEN_RAHASIA_INI';
   ```
   menjadi token rahasia buatan Anda, mis. `var TOKEN = 'desa-rahasia-2026-xyz';`
   > Catat token ini — nanti dipakai di `.env`.
4. Klik ikon **Save** (💾).

### A3. Jalankan setup (buat tab + data contoh)
1. Di dropdown fungsi (atas, dekat tombol Run), pilih **`setup`**.
2. Klik **Run**. Pertama kali akan minta izin:
   **Review permissions → pilih akun Google Anda → Advanced → Go to (nama proyek) → Allow**.
3. Tunggu sampai log menampilkan `✅ Setup selesai`.
   Cek spreadsheet — kini ada tab: news, events, photos, videos, documents, statistics, settings, categories.

### A4. Deploy sebagai Web App
1. Klik **Deploy → New deployment**.
2. Klik ikon gerigi → pilih **Web app**.
3. Isi:
   - **Description**: bebas (mis. "API Desa")
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
4. Klik **Deploy** → (kalau diminta izin lagi, Allow).
5. **Salin "Web app URL"** (berakhiran `/exec`). Ini → `APPS_SCRIPT_URL` di `.env`.

> 🔁 **Penting:** setiap kali Anda mengubah `Code.gs`, deploy ulang:
> **Deploy → Manage deployments → (pilih) → Edit → Version: New version → Deploy.**
> URL tetap sama.

**Tes cepat:** buka `APPS_SCRIPT_URL` di browser → harus muncul
`{"ok":true,"message":"API Website Desa aktif"}`.

---

## BAGIAN B — Cloudinary (gambar & dokumen)

1. Daftar gratis di https://cloudinary.com → buka **Dashboard**.
2. Salin dari **Product Environment Credentials**:
   - **Cloud name** → `CLOUDINARY_CLOUD_NAME` dan `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

---

## BAGIAN C — Isi file `.env`

Buka file **`.env`** di folder utama, isi:

```
APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfyc.../exec
APPS_SCRIPT_TOKEN=desa-rahasia-2026-xyz        # SAMA dengan TOKEN di Code.gs
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdEfghIjklMnopQrstUvwxyz
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxx
ADMIN_PASSWORD=DesaKu2026!
SESSION_SECRET=rahasiapanjangsekali1234567890abcdef
DATA_REVALIDATE=0
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
```

> `APPS_SCRIPT_TOKEN` **wajib sama persis** dengan `TOKEN` di `Code.gs`, kalau tidak akan `unauthorized`.

---

## BAGIAN D — Jalankan & Uji Coba

```bash
npm install        # jika belum
```

Buka **dua terminal**:

**Terminal 1 — situs publik:**
```bash
npm run dev:publik     # http://localhost:3000
```
Homepage harus tampil dengan nama desa, statistik, dan 1 berita contoh.

**Terminal 2 — dashboard admin:**
```bash
npm run dev:admin      # http://localhost:3001  (login pakai ADMIN_PASSWORD)
```

### Uji alur lengkap
1. Admin → **Pengaturan** → ubah Nama Desa → Simpan.
2. **Statistik** → ubah angka → Simpan.
3. **Berita → Tulis Berita** → isi judul + isi (coba upload gambar di editor) → "Terbitkan" → Simpan.
4. **Galeri** → unggah 1 foto. **Dokumen** → unggah 1 PDF.
5. Buka situs publik (localhost:3000) → refresh → cek perubahan muncul.

---

## Ringkasan yang Harus Diisi

| Variabel | Dari mana | Wajib? |
|----------|-----------|--------|
| APPS_SCRIPT_URL | Web app URL hasil Deploy | ✅ |
| APPS_SCRIPT_TOKEN | sama dengan TOKEN di Code.gs | ✅ |
| CLOUDINARY_CLOUD_NAME | Dashboard Cloudinary | ✅ |
| CLOUDINARY_API_KEY | Dashboard Cloudinary | ✅ |
| CLOUDINARY_API_SECRET | Dashboard Cloudinary | ✅ |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | sama dgn CLOUD_NAME | ✅ |
| ADMIN_PASSWORD | buat sendiri | ✅ |
| SESSION_SECRET | ketik acak panjang | ✅ |
| DATA_REVALIDATE | 0 saat lokal | ✅ |
| REVALIDATE_SECRET | opsional | ❌ |
| NEXT_PUBLIC_SITE_URL / _ADMIN_URL | localhost saat uji | ✅ |

---

## Kalau Error

| Gejala | Penyebab umum |
|--------|---------------|
| `unauthorized` | `APPS_SCRIPT_TOKEN` ≠ `TOKEN` di Code.gs |
| `Env APPS_SCRIPT_URL belum di-set` | `.env` belum diisi / belum restart `npm run dev` |
| Halaman kosong / error fetch | URL bukan yang `/exec`, atau belum Deploy sebagai Web app "Anyone" |
| Perubahan Code.gs tak berefek | Belum deploy ulang (New version) |
| Gambar gagal upload | Kredensial Cloudinary salah |

Tempel pesan error ke saya kalau ada yang macet — saya bantu perbaiki.
