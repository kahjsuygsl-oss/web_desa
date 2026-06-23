import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(255),
  category: z.string().min(1, "Kategori wajib diisi"),
  excerpt: z.string().max(500).optional().default(""),
  content: z.string().min(1, "Isi berita wajib diisi"),
  thumbnail: z.string().url("Thumbnail harus URL valid").or(z.literal("")).default(""),
  author: z.string().min(1, "Penulis wajib diisi").default("Admin"),
  status: z.enum(["draft", "published"]).default("draft"),
});
export type NewsInput = z.infer<typeof newsSchema>;

export const eventSchema = z.object({
  title: z.string().min(3, "Nama agenda minimal 3 karakter").max(255),
  description: z.string().max(2000).optional().default(""),
  eventDate: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  poster: z.string().url().or(z.literal("")).default(""),
});
export type EventInput = z.infer<typeof eventSchema>;

export const photoSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(255),
  imageUrl: z.string().url("Gambar harus URL valid"),
});
export type PhotoInput = z.infer<typeof photoSchema>;

export const videoSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(255),
  youtubeUrl: z.string().url("URL YouTube tidak valid"),
});
export type VideoInput = z.infer<typeof videoSchema>;

export const documentSchema = z.object({
  name: z.string().min(1, "Nama dokumen wajib diisi").max(255),
  category: z.string().min(1, "Kategori wajib diisi"),
  fileUrl: z.string().url("File harus URL valid"),
});
export type DocumentInput = z.infer<typeof documentSchema>;

export const statSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string().default(""),
});
export type StatInput = z.infer<typeof statSchema>;

export const loginSchema = z.object({
  password: z.string().min(1, "Password wajib diisi"),
});
