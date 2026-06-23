/**
 * Tipe data untuk seluruh "tabel" (tab) di Google Spreadsheet.
 * Tiap tab punya baris header (urutan kolom) yang harus cocok dengan SHEET_HEADERS.
 */

export type NewsStatus = "draft" | "published";

export interface News {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string; // HTML dari editor TipTap
  thumbnail: string; // URL Cloudinary
  author: string;
  views: number;
  status: NewsStatus;
  publishedAt: string; // ISO string, kosong jika draft
  createdAt: string;
  updatedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string; // ISO date (YYYY-MM-DD)
  location: string;
  poster: string; // URL Cloudinary (opsional)
  createdAt: string;
}

export interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  fileUrl: string; // URL Cloudinary
  downloadCount: number;
  createdAt: string;
}

/** Statistik desa disimpan sebagai baris key-value agar mudah ditambah. */
export interface StatItem {
  key: string; // penduduk | kk | rt | rw | dusun | luas
  label: string;
  value: string;
}

/** Pengaturan situs & teks profil, key-value. */
export interface SettingItem {
  key: string;
  value: string;
}

/** Kategori berita (referensi). */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export type SettingsMap = Record<string, string>;

/** Daftar nama tab di spreadsheet — sumber kebenaran tunggal. */
export const SHEETS = {
  news: "news",
  events: "events",
  photos: "photos",
  videos: "videos",
  documents: "documents",
  statistics: "statistics",
  settings: "settings",
  categories: "categories",
} as const;

export type SheetName = (typeof SHEETS)[keyof typeof SHEETS];

/** Header (urutan kolom) tiap tab. Dipakai init-sheet & mapping baris↔objek. */
export const SHEET_HEADERS: Record<SheetName, string[]> = {
  news: [
    "id",
    "title",
    "slug",
    "category",
    "excerpt",
    "content",
    "thumbnail",
    "author",
    "views",
    "status",
    "publishedAt",
    "createdAt",
    "updatedAt",
  ],
  events: ["id", "title", "description", "eventDate", "location", "poster", "createdAt"],
  photos: ["id", "title", "imageUrl", "createdAt"],
  videos: ["id", "title", "youtubeUrl", "createdAt"],
  documents: ["id", "name", "category", "fileUrl", "downloadCount", "createdAt"],
  statistics: ["key", "label", "value"],
  settings: ["key", "value"],
  categories: ["id", "name", "slug"],
};

/** Kolom yang harus dikonversi ke number saat dibaca dari sheet. */
export const NUMERIC_COLUMNS: Partial<Record<SheetName, string[]>> = {
  news: ["views"],
  documents: ["downloadCount"],
};
