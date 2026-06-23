import { FileText } from "lucide-react";
import { documentsRepo, formatTanggal } from "@desa/lib";
import { DeleteButton } from "@/components/delete-button";
import { DocumentForm } from "@/components/document-form";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteDocumentAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DokumenPage() {
  const docs = await documentsRepo.getAllDocuments().catch(() => []);

  return (
    <div>
      <PageTitle title="Dokumen" description="Kelola dokumen publik desa." />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Unggah Dokumen</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentForm />
          </CardContent>
        </Card>

        <div className="space-y-3 lg:col-span-3">
          {docs.length > 0 ? (
            docs.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-900">{d.name}</h3>
                  <p className="text-xs text-gray-500">
                    {d.category} · {formatTanggal(d.createdAt)} · {d.downloadCount} unduhan
                  </p>
                </div>
                <DeleteButton id={d.id} action={deleteDocumentAction} label={`Hapus "${d.name}"?`} />
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
              Belum ada dokumen.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
