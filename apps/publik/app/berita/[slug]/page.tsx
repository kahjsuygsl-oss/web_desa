import { CalendarDays, Eye, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { formatTanggal, newsRepo } from "@desa/lib";
import { Badge } from "@/components/ui/card";
import { ViewTracker } from "./view-tracker";

export const revalidate = 600;

export async function generateStaticParams() {
  const news = await newsRepo.getPublishedNews().catch(() => []);
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsRepo.getNewsBySlug(slug).catch(() => null);
  if (!news) return { title: "Berita tidak ditemukan" };
  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      type: "article",
      images: news.thumbnail ? [{ url: news.thumbnail }] : undefined,
      publishedTime: news.publishedAt,
    },
    alternates: { canonical: `/berita/${news.slug}` },
  };
}

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await newsRepo.getNewsBySlug(slug).catch(() => null);

  if (!news || news.status !== "published") notFound();

  const cleanHtml = DOMPurify.sanitize(news.content, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "src", "target"],
  });

  return (
    <article className="container max-w-3xl py-12">
      <ViewTracker id={news.id} />

      <Link href="/berita" className="text-sm text-primary hover:underline">
        ← Kembali ke Berita
      </Link>

      <Badge className="mt-4">{news.category}</Badge>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
        {news.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" /> {news.author}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {formatTanggal(news.publishedAt || news.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" /> {news.views} kali dilihat
        </span>
      </div>

      {news.thumbnail && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose-berita mt-8 text-gray-800"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </article>
  );
}
