/**
 * Konten contoh Desa Masbagik Timur (diambil dari purwarupa kim_masbagik_timur.html).
 * Dipakai sebagai isi bawaan ketika data dari Google Sheets masih kosong,
 * agar situs tetap menampilkan informasi nyata tanpa mengubah struktur halaman.
 * Begitu admin mengisi data di spreadsheet, data asli otomatis menggantikan ini.
 */
import type { EventItem, News, Photo, SettingsMap, StatItem } from "@desa/lib";

/**
 * Gabungkan pengaturan dari Sheets dengan nilai bawaan.
 * Nilai asli (non-kosong) selalu menang; bawaan hanya mengisi yang kosong.
 */
export function withFallbackSettings(live: SettingsMap): SettingsMap {
  const merged: SettingsMap = { ...FALLBACK_SETTINGS };
  for (const [k, v] of Object.entries(live)) {
    if (v && v.trim()) merged[k] = v;
  }
  return merged;
}

/** Identitas, profil, dan kontak desa. */
export const FALLBACK_SETTINGS: SettingsMap = {
  namaDesa: "Desa Masbagik Timur",
  slogan:
    "Pusat informasi akurat, transparan, dan terpercaya — Kabupaten Lombok Timur.",
  sambutan:
    "Selamat datang di Portal Resmi Kelompok Informasi Masyarakat (KIM) Desa Masbagik Timur. " +
    "Desa Masbagik Timur adalah salah satu desa yang terletak di Kecamatan Masbagik, Kabupaten Lombok Timur. " +
    "Kami berkomitmen mewujudkan pemerintahan desa yang transparan dan melayani dengan sepenuh hati.",
  sejarah:
    "Desa Masbagik Timur merupakan pemekaran dari desa induk Masbagik. Desa ini terus berkembang " +
    'menjadi wilayah yang mandiri dengan potensi pertanian dan kerajinan lokal yang kuat. Nama "Masbagik" ' +
    "sendiri memiliki akar sejarah yang panjang dalam kebudayaan Sasak di Lombok Timur.",
  visi:
    "Terwujudnya Desa Masbagik Timur yang Mandiri, Sejahtera, Religius, dan Berbudaya melalui " +
    "Tata Kelola Pemerintahan yang Bersih dan Transparan.",
  misi: [
    "Meningkatkan kualitas pelayanan publik.",
    "Mengembangkan potensi ekonomi kerakyatan.",
    "Membangun infrastruktur desa yang memadai.",
    "Meningkatkan kualitas pendidikan dan kesehatan masyarakat.",
  ].join("; "),
  alamat:
    "Jl. Raya Masbagik - Sikur, Desa Masbagik Timur, Kec. Masbagik, Kab. Lombok Timur, NTB 83661",
  telepon: "+62 812-XXXX-XXXX",
  email: "pemdes@kimmasbagiktimur.id",
  whatsapp: "6281900000000",
  jamOperasional:
    "Senin–Kamis 08.00–14.00, Jumat 08.00–11.30, Sabtu 08.00–12.30 WITA",
  // Gambar latar hero (pemandangan desa). Bisa ditimpa lewat pengaturan.
  heroImage:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1950&q=80",
};

/** Statistik ringkas (sesuai data yang tersedia pada purwarupa). */
export const FALLBACK_STATS: StatItem[] = [
  { key: "penduduk", label: "Jiwa Penduduk", value: "8.500" },
  { key: "kecamatan", label: "Kecamatan", value: "Masbagik" },
  { key: "kabupaten", label: "Kabupaten", value: "Lombok Timur" },
  { key: "provinsi", label: "Provinsi", value: "NTB" },
];

/** Berita contoh dari purwarupa (tanggal & kategori dipertahankan). */
export const FALLBACK_NEWS: News[] = [
  {
    id: "contoh-1",
    title: "Pembangunan Saluran Irigasi Subak Tuntas 100%",
    slug: "pembangunan-saluran-irigasi-subak-tuntas-100",
    category: "Pembangunan",
    excerpt:
      "Pemerintah Desa Masbagik Timur mengumumkan selesainya proyek irigasi yang diharapkan dapat meningkatkan hasil panen petani lokal musim ini.",
    content:
      "<p>Pemerintah Desa Masbagik Timur mengumumkan selesainya proyek irigasi yang diharapkan dapat meningkatkan hasil panen petani lokal musim ini.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    author: "Admin Desa",
    views: 0,
    status: "published",
    publishedAt: "2026-05-24T00:00:00.000Z",
    createdAt: "2026-05-24T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
  },
  {
    id: "contoh-2",
    title: "Kunjungan Bupati Lombok Timur ke Masbagik Timur",
    slug: "kunjungan-bupati-lombok-timur-ke-masbagik-timur",
    category: "Pemerintahan",
    excerpt:
      "Bupati Lombok Timur melakukan peninjauan langsung terhadap pelayanan administrasi terpadu di kantor desa.",
    content:
      "<p>Bupati Lombok Timur melakukan peninjauan langsung terhadap pelayanan administrasi terpadu di kantor desa.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    author: "Admin Desa",
    views: 0,
    status: "published",
    publishedAt: "2026-05-20T00:00:00.000Z",
    createdAt: "2026-05-20T00:00:00.000Z",
    updatedAt: "2026-05-20T00:00:00.000Z",
  },
  {
    id: "contoh-3",
    title: "Pemda Lotim Buka Beasiswa Berprestasi 2026",
    slug: "pemda-lotim-buka-beasiswa-berprestasi-2026",
    category: "Pendidikan",
    excerpt:
      "Pemerintah Kabupaten Lombok Timur resmi membuka pendaftaran beasiswa bagi mahasiswa asal Lotim. Cek persyaratannya di sini.",
    content:
      "<p>Pemerintah Kabupaten Lombok Timur resmi membuka pendaftaran beasiswa bagi mahasiswa asal Lotim. Cek persyaratannya di sini.</p>",
    thumbnail:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80",
    author: "Admin Desa",
    views: 0,
    status: "published",
    publishedAt: "2026-05-18T00:00:00.000Z",
    createdAt: "2026-05-18T00:00:00.000Z",
    updatedAt: "2026-05-18T00:00:00.000Z",
  },
];

/**
 * Agenda/pengumuman contoh dari purwarupa.
 * Tanggal digeser ke depan agar tetap relevan sebagai "agenda mendatang".
 */
export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "agenda-1",
    title: "Penyaluran BLT Dana Desa Tahap II",
    description:
      "Diberitahukan kepada KPM (Keluarga Penerima Manfaat) bahwa penyaluran BLT akan dilaksanakan mulai pukul 08:00 WITA. Harap membawa KK dan KTP asli.",
    eventDate: "2026-06-28",
    location: "Aula Kantor Desa",
    poster: "",
    createdAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "agenda-2",
    title: "Kerja Bakti Massal Persiapan Lomba Desa",
    description:
      "Diharapkan kehadiran seluruh warga masyarakat Masbagik Timur untuk kegiatan gotong royong membersihkan lingkungan masing-masing dusun.",
    eventDate: "2026-07-05",
    location: "Seluruh Dusun",
    poster: "",
    createdAt: "2026-06-01T00:00:00.000Z",
  },
];

/** Galeri foto contoh kegiatan & potensi desa. */
export const FALLBACK_PHOTOS: Photo[] = [
  {
    id: "foto-1",
    title: "Gotong Royong Warga Desa",
    imageUrl:
      "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-24T00:00:00.000Z",
  },
  {
    id: "foto-2",
    title: "Pemandangan Sawah Masbagik Timur",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-23T00:00:00.000Z",
  },
  {
    id: "foto-3",
    title: "Panen Padi Sawah Subak",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-22T00:00:00.000Z",
  },
  {
    id: "foto-4",
    title: "Rapat Perencanaan Pembangunan",
    imageUrl:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-21T00:00:00.000Z",
  },
  {
    id: "foto-5",
    title: "Musyawarah Perangkat Desa",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-20T00:00:00.000Z",
  },
  {
    id: "foto-6",
    title: "Program Pendidikan & Beasiswa",
    imageUrl:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-19T00:00:00.000Z",
  },
  {
    id: "foto-7",
    title: "Posyandu dan Layanan Kesehatan",
    imageUrl:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-18T00:00:00.000Z",
  },
  {
    id: "foto-8",
    title: "Dokumentasi Kegiatan Desa",
    imageUrl:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-17T00:00:00.000Z",
  },
  {
    id: "foto-9",
    title: "UMKM dan Kerajinan Lokal",
    imageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    createdAt: "2026-05-16T00:00:00.000Z",
  },
];
