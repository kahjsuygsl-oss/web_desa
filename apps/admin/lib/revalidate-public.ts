import "server-only";

/**
 * Memicu refresh halaman di app PUBLIK (project Vercel terpisah) secara instan.
 * Opsional: hanya jalan bila NEXT_PUBLIC_SITE_URL & REVALIDATE_SECRET di-set.
 * Gagal diam-diam agar tidak mengganggu alur simpan admin (ISR tetap jadi cadangan).
 */
export function revalidatePublic(path: string): void {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!base || !secret) return;

  const url = `${base}/api/revalidate?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`;
  // fire-and-forget
  fetch(url, { method: "POST" }).catch(() => {});
}
