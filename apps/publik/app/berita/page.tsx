import type { Metadata } from "next";
import Link from "next/link";
import { newsRepo } from "@desa/lib";
import { NewsCard } from "@/components/news-card";
import { PageHeader } from "@/components/page-header";
import { FALLBACK_NEWS } from "@/lib/fallback";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita dan informasi terbaru seputar desa.",
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const live = await newsRepo.getPublishedNews().catch(() => []);
  const all = live.length > 0 ? live : FALLBACK_NEWS;
  const news = kategori ? all.filter((n) => n.category === kategori) : all;

  const categories = Array.from(new Set(all.map((n) => n.category))).sort();

  return (
    <>
      <PageHeader title="Berita Desa" subtitle="Informasi dan kabar terbaru dari desa kami." />
      <div className="container py-12">
        {/* Filter kategori */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <FilterChip label="Semua" href="/berita" active={!kategori} />
            {categories.map((c) => (
              <FilterChip
                key={c}
                label={c}
                href={`/berita?kategori=${encodeURIComponent(c)}`}
                active={kategori === c}
              />
            ))}
          </div>
        )}

        {news.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            Belum ada berita pada kategori ini.
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white"
          : "rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary"
      }
    >
      {label}
    </Link>
  );
}
