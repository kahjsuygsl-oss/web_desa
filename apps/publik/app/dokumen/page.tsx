import { Download, FileText } from "lucide-react";
import type { Metadata } from "next";
import { documentsRepo, formatTanggal } from "@desa/lib";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Dokumen",
  description: "Unduh dokumen dan arsip publik desa.",
};

export default async function DokumenPage() {
  const docs = await documentsRepo.getAllDocuments().catch(() => []);

  return (
    <>
      <PageHeader title="Dokumen Publik" subtitle="Unduh dokumen dan arsip resmi desa." />
      <div className="container py-12">
        {docs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {docs.map((d) => (
              <Card key={d.id} className="flex items-center gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900">{d.name}</h3>
                  <p className="text-xs text-gray-500">
                    {d.category} · {formatTanggal(d.createdAt)} · {d.downloadCount} unduhan
                  </p>
                </div>
                <a
                  href={`/api/download/${d.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" /> Unduh
                </a>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            Belum ada dokumen.
          </div>
        )}
      </div>
    </>
  );
}
