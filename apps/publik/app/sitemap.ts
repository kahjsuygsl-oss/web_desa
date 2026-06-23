import type { MetadataRoute } from "next";
import { newsRepo } from "@desa/lib";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await newsRepo.getPublishedNews().catch(() => []);

  const staticPages = ["", "/profil", "/berita", "/agenda", "/galeri", "/dokumen", "/kontak"].map(
    (p) => ({
      url: `${BASE}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    }),
  );

  const newsPages = news.map((n) => ({
    url: `${BASE}/berita/${n.slug}`,
    lastModified: new Date(n.updatedAt || n.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages];
}
