import {
  appendRow,
  deleteRow,
  patchRow,
  readAll,
  updateRow,
} from "../sheets";
import { SHEETS, type News, type NewsStatus } from "../types";
import { generateId, slugify, stripHtml, truncate, uniqueSlug } from "../utils";
import type { NewsInput } from "../validation";

/** Ambil semua berita (urut terbaru). */
export async function getAllNews(): Promise<News[]> {
  const rows = await readAll<News>(SHEETS.news);
  return rows.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

/** Berita yang sudah publish saja (untuk sisi publik). */
export async function getPublishedNews(): Promise<News[]> {
  const all = await getAllNews();
  return all
    .filter((n) => n.status === "published")
    .sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
}

export async function getLatestNews(limit = 6): Promise<News[]> {
  return (await getPublishedNews()).slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const all = await readAll<News>(SHEETS.news);
  return all.find((n) => n.slug === slug) ?? null;
}

export async function getNewsById(id: string): Promise<News | null> {
  const all = await readAll<News>(SHEETS.news);
  return all.find((n) => n.id === id) ?? null;
}

export async function getNewsByCategory(category: string): Promise<News[]> {
  return (await getPublishedNews()).filter((n) => n.category === category);
}

export async function createNews(input: NewsInput): Promise<News> {
  const all = await readAll<News>(SHEETS.news);
  const slug = uniqueSlug(input.title, all.map((n) => n.slug));
  const now = new Date().toISOString();
  const news: News = {
    id: generateId(),
    title: input.title,
    slug,
    category: input.category,
    excerpt: input.excerpt || truncate(stripHtml(input.content)),
    content: input.content,
    thumbnail: input.thumbnail,
    author: input.author,
    views: 0,
    status: input.status,
    publishedAt: input.status === "published" ? now : "",
    createdAt: now,
    updatedAt: now,
  };
  await appendRow(SHEETS.news, news as unknown as Record<string, unknown>);
  return news;
}

export async function updateNews(
  id: string,
  input: NewsInput,
): Promise<News | null> {
  const existing = await getNewsById(id);
  if (!existing) return null;

  // Slug ikut diperbarui bila judul berubah, tetap dijaga unik.
  let slug = existing.slug;
  if (slugify(input.title) !== slugify(existing.title)) {
    const all = await readAll<News>(SHEETS.news);
    slug = uniqueSlug(
      input.title,
      all.filter((n) => n.id !== id).map((n) => n.slug),
    );
  }

  const now = new Date().toISOString();
  const becamePublished =
    existing.status !== "published" && input.status === "published";

  const updated: News = {
    ...existing,
    title: input.title,
    slug,
    category: input.category,
    excerpt: input.excerpt || truncate(stripHtml(input.content)),
    content: input.content,
    thumbnail: input.thumbnail,
    author: input.author,
    status: input.status,
    publishedAt: becamePublished ? now : existing.publishedAt,
    updatedAt: now,
  };
  const ok = await updateRow(
    SHEETS.news,
    id,
    updated as unknown as Record<string, unknown>,
  );
  return ok ? updated : null;
}

export async function deleteNews(id: string): Promise<boolean> {
  return deleteRow(SHEETS.news, id);
}

export async function setNewsStatus(
  id: string,
  status: NewsStatus,
): Promise<boolean> {
  const patch: Partial<News> = { status, updatedAt: new Date().toISOString() };
  if (status === "published") patch.publishedAt = new Date().toISOString();
  return patchRow(SHEETS.news, id, patch);
}

/** Tambah jumlah views (fire-and-forget, jangan blok render). */
export async function incrementViews(id: string): Promise<void> {
  const n = await getNewsById(id);
  if (!n) return;
  await patchRow(SHEETS.news, id, { views: (n.views ?? 0) + 1 });
}
