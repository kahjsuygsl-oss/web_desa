import { youtubeId } from "@desa/lib";
import { galleryRepo } from "@desa/lib";
import { DeleteButton } from "@/components/delete-button";
import { PhotoForm, VideoForm } from "@/components/gallery-forms";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePhotoAction, deleteVideoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const [photos, videos] = await Promise.all([
    galleryRepo.getAllPhotos().catch(() => []),
    galleryRepo.getAllVideos().catch(() => []),
  ]);

  return (
    <div className="space-y-8">
      <PageTitle title="Galeri" description="Kelola foto dan video desa." />

      {/* Foto */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Unggah Foto</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoForm />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Foto ({photos.length})</h3>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p) => (
                <div key={p.id} className="group relative overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.imageUrl} alt={p.title} className="aspect-square w-full object-cover" />
                  <div className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded bg-white/90 shadow">
                      <DeleteButton id={p.id} action={deletePhotoAction} label="Hapus foto ini?" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="Belum ada foto." />
          )}
        </div>
      </div>

      {/* Video */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tambah Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoForm />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Video ({videos.length})</h3>
          {videos.length > 0 ? (
            <div className="space-y-3">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId(v.youtubeUrl)}/default.jpg`}
                    alt={v.title}
                    className="h-12 w-20 rounded object-cover"
                  />
                  <span className="flex-1 truncate text-sm font-medium text-gray-800">{v.title}</span>
                  <DeleteButton id={v.id} action={deleteVideoAction} label="Hapus video ini?" />
                </div>
              ))}
            </div>
          ) : (
            <Empty text="Belum ada video." />
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}
