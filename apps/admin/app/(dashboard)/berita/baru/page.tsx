import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { categoriesRepo } from "@desa/lib";
import { NewsForm } from "@/components/news-form";
import { createNewsAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function BeritaBaruPage() {
  const categories = await categoriesRepo.getCategoryNames().catch(() => []);

  return (
    <div>
      <Link
        href="/berita"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Tulis Berita Baru</h1>
      <NewsForm action={createNewsAction} categories={categories} />
    </div>
  );
}
