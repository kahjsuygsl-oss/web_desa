# PRD - Website Desa Digital

## 1. Informasi Proyek

### Nama Proyek

Website Desa Digital

### Versi

v1.0

### Tujuan

Membangun website desa modern yang berfungsi sebagai pusat informasi, publikasi berita, transparansi pemerintahan desa, promosi potensi desa, serta media komunikasi masyarakat.

---

# 2. Target Pengguna

## Administrator

Memiliki akses penuh ke seluruh sistem.

### Hak Akses

* Kelola berita
* Kelola agenda
* Kelola galeri
* Kelola dokumen
* Kelola aparatur desa
* Kelola statistik desa
* Kelola pengguna
* Pengaturan website

---

## Editor

### Hak Akses

* Menambah berita
* Mengedit berita
* Mengunggah galeri
* Mengelola agenda

---

## Pengunjung

### Hak Akses

* Membaca informasi publik
* Mengunduh dokumen
* Melihat galeri
* Menghubungi pemerintah desa

---

# 3. Teknologi

## Frontend

* Next.js 15
* TypeScript
* TailwindCSS
* Shadcn UI
* Lucide Icons

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

## Authentication

* JWT Authentication
* Role Based Access Control (RBAC)

## Penyimpanan File

* Local Storage
* Cloudinary (Opsional)

## Deployment

* Frontend: Vercel
* Backend: VPS Ubuntu
* Docker Support

---

# 4. Struktur Menu Website

## Home

### Profil Desa

* Sejarah Desa
* Visi dan Misi
* Sambutan Kepala Desa
* Struktur Organisasi

### Pemerintahan

* Aparatur Desa
* BPD
* LPMD

### Berita

### Agenda

### Galeri

* Foto
* Video

### Dokumen

### Potensi Desa

### Statistik Desa

### Kontak

---

# 5. Homepage

## Hero Section

Menampilkan:

* Nama Desa
* Slogan Desa
* Tombol Berita
* Tombol Profil

Contoh:

> Selamat Datang di Website Resmi Desa
> Desa Transparan, Desa Digital, Desa Maju

---

## Statistik Desa

Menampilkan:

* Jumlah Penduduk
* Jumlah KK
* Jumlah RT
* Jumlah RW
* Jumlah Dusun

---

## Berita Terbaru

Menampilkan 6 berita terbaru.

Data yang ditampilkan:

* Thumbnail
* Judul
* Ringkasan
* Penulis
* Tanggal

---

## Agenda Desa

Menampilkan agenda mendatang.

Data:

* Nama Agenda
* Lokasi
* Tanggal

---

## Galeri Terbaru

Menampilkan foto terbaru.

---

# 6. Modul Berita

## Fitur

* Tambah Berita
* Edit Berita
* Hapus Berita
* Draft
* Publish
* Scheduled Publish
* SEO Friendly URL

---

## Struktur Database

```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    slug VARCHAR(255),
    excerpt TEXT,
    content TEXT,
    thumbnail VARCHAR(255),
    author_id INT,
    category_id INT,
    views INT DEFAULT 0,
    status VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Form Berita

Field:

* Judul
* Slug Otomatis
* Kategori
* Thumbnail
* Ringkasan
* Isi Berita
* Tag
* Status

Editor:

* TipTap Editor
* Rich Text
* Upload Gambar
* Embed YouTube
* Tabel
* Heading

---

# 7. Modul Kategori Berita

Kategori Default:

* Pemerintahan
* Pendidikan
* Kesehatan
* Pertanian
* Pariwisata
* UMKM
* Infrastruktur

---

## Database

```sql
CREATE TABLE news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    slug VARCHAR(100)
);
```

---

# 8. Modul Agenda

## Database

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    event_date DATE,
    location VARCHAR(255),
    poster VARCHAR(255)
);
```

### Fitur

* Tambah Agenda
* Kalender Agenda
* Pengingat Acara

---

# 9. Modul Galeri

## Foto

```sql
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP
);
```

## Video

```sql
CREATE TABLE videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    youtube_url VARCHAR(255),
    created_at TIMESTAMP
);
```

---

# 10. Modul Aparatur Desa

## Database

```sql
CREATE TABLE officials (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255),
    jabatan VARCHAR(255),
    foto VARCHAR(255),
    email VARCHAR(255),
    telepon VARCHAR(50),
    urutan INT
);
```

### Data Ditampilkan

* Foto
* Nama
* Jabatan
* Kontak

---

# 11. Modul Dokumen

## Database

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    nama_dokumen VARCHAR(255),
    kategori VARCHAR(100),
    file_url VARCHAR(255),
    download_count INT DEFAULT 0
);
```

### Format File

* PDF
* DOC
* DOCX
* XLS
* XLSX
* ZIP

---

# 12. Modul Potensi Desa

Kategori:

* Pariwisata
* Pertanian
* Peternakan
* UMKM
* Perikanan

## Database

```sql
CREATE TABLE potentials (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255),
    kategori VARCHAR(100),
    gambar VARCHAR(255),
    deskripsi TEXT
);
```

---

# 13. Modul Statistik Desa

Data yang dapat dikelola:

* Jumlah Penduduk
* Jumlah KK
* Jumlah RT
* Jumlah RW
* Jumlah Dusun
* Luas Wilayah

---

# 14. Modul Kontak

Data:

* Alamat Desa
* Nomor Telepon
* Email
* Jam Operasional
* Lokasi Google Maps
* WhatsApp Admin

---

# 15. Dashboard Admin

## Sidebar

* Dashboard
* Berita
* Kategori Berita
* Agenda
* Galeri
* Dokumen
* Aparatur Desa
* Potensi Desa
* Statistik Desa
* Pengguna
* Pengaturan

---

## Dashboard Analytics

Menampilkan:

* Total Berita
* Total Pengunjung
* Total Dokumen
* Total Agenda

Grafik:

* Pengunjung Bulanan
* Berita Terpopuler
* Dokumen Terbanyak Diunduh

---

# 16. SEO

## Fitur SEO

* Meta Title
* Meta Description
* Keywords
* Open Graph Image
* Canonical URL
* Sitemap XML
* Robots.txt

---

# 17. Keamanan

* JWT Authentication
* Password Hashing (bcrypt)
* CSRF Protection
* Rate Limiter
* Input Validation
* Upload Validation
* SQL Injection Protection

---

# 18. Desain UI

## Warna Utama

```css
Primary: #0F766E;
Secondary: #14B8A6;
Accent: #F59E0B;
Background: #F8FAFC;
Text: #1F2937;
```

---

# 19. Responsive Design

Mendukung:

* Desktop
* Tablet
* Mobile

---

# 20. Struktur Folder

```text
desa-digital/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   └── types/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.ts
│   │
│   ├── uploads/
│   └── prisma/
│
├── database/
│
├── docker/
│
├── docs/
│
└── README.md
```

---

# 21. Target Akhir

Website harus:

* Modern
* Cepat
* SEO Friendly
* Mudah digunakan perangkat desa
* Mendukung upload berita tanpa coding
* Memiliki dashboard admin lengkap
* Siap deploy ke VPS atau Hosting
* Mendukung ribuan artikel dan dokumen
* Aman dan scalable

---

# Deliverables

* Source Code Frontend
* Source Code Backend
* Database PostgreSQL
* Docker Configuration
* API Documentation
* User Manual Admin
* Deployment Guide
