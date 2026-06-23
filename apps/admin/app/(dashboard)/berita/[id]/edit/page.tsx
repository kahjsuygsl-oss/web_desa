import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoriesRepo, newsRepo } from "@desa/lib";
import { NewsForm } from "@/components/news-form";
import { updateNewsAction, type FormState } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [news, categories] = await Promise.all([
    newsRepo.getNewsById(id).catch(() => null),
    categoriesRepo.getCategoryNames().catch(() => []),
  ]);

  if (!news) notFound();

  const action = updateNewsAction.bind(null, id) as (
    prev: FormState,
    fd: FormData,
  ) => Promise<FormState>;

  return (
    <div>
      <Link
        href="/berita"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Berita</h1>
      <NewsForm action={action} categories={categories} initial={news} />
    </div>
  );
}
