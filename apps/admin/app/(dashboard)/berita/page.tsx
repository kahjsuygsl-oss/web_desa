import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { formatTanggal, newsRepo } from "@desa/lib";
import { DeleteButton } from "@/components/delete-button";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { deleteNewsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function BeritaListPage() {
  const news = await newsRepo.getAllNews().catch(() => []);

  return (
    <div>
      <PageTitle
        title="Berita"
        description="Kelola berita dan artikel desa."
        action={
          <Button asChild>
            <Link href="/berita/baru">
              <Plus className="h-4 w-4" /> Tulis Berita
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {news.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {news.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="max-w-xs px-4 py-3">
                    <span className="line-clamp-1 font-medium text-gray-900">{n.title}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{n.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        n.status === "published"
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                      }
                    >
                      {n.status === "published" ? "Terbit" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatTanggal(n.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/berita/${n.id}/edit`}
                        className="grid h-8 w-8 place-items-center rounded text-gray-500 hover:bg-gray-100"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton
                        id={n.id}
                        action={deleteNewsAction}
                        label={`Hapus berita "${n.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center text-gray-400">
            Belum ada berita. Klik “Tulis Berita” untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
}
