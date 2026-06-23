import { customAlphabet } from "nanoid";

/** ID pendek alfanumerik, aman untuk URL & cell sheet. */
const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);

export function generateId(): string {
  return nano();
}

/** Ubah judul menjadi slug SEO-friendly. */
export function slugify(input: string): string {
  return input
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "") // hapus diakritik
    .replace(/[^a-z0-9\s-]/g, "") // hanya huruf, angka, spasi, strip
    .trim()
    .replace(/[\s-]+/g, "-") // spasi -> strip
    .replace(/^-+|-+$/g, "");
}

/** Slug unik dengan menambahkan suffix bila sudah ada. */
export function uniqueSlug(base: string, existing: string[]): string {
  const slug = slugify(base) || generateId();
  if (!existing.includes(slug)) return slug;
  let i = 2;
  while (existing.includes(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}

/** Format tanggal Indonesia, mis: 23 Juni 2026. */
export function formatTanggal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Ekstrak YouTube video ID dari berbagai bentuk URL. */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  );
  return m ? m[1] : null;
}

/** Potong teks untuk excerpt/preview. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

/** Buang tag HTML, untuk membuat excerpt dari konten kaya. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
