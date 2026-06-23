import type { Metadata } from "next";
import Image from "next/image";
import { galleryRepo, youtubeId } from "@desa/lib";
import { PageHeader } from "@/components/page-header";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Galeri",
  description: "Dokumentasi foto dan video kegiatan desa.",
};

export default async function GaleriPage() {
  const [photos, videos] = await Promise.all([
    galleryRepo.getAllPhotos().catch(() => []),
    galleryRepo.getAllVideos().catch(() => []),
  ]);

  return (
    <>
      <PageHeader title="Galeri Desa" subtitle="Dokumentasi foto dan video kegiatan desa." />
      <div className="container py-12">
        {/* Foto */}
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Foto</h2>
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <figure key={p.id} className="group overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="relative aspect-square">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {p.title && (
                  <figcaption className="p-3 text-sm text-gray-600">{p.title}</figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <Empty text="Belum ada foto." />
        )}

        {/* Video */}
        <h2 className="mb-6 mt-14 text-2xl font-bold text-gray-900">Video</h2>
        {videos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((v) => {
              const vid = youtubeId(v.youtubeUrl);
              return (
                <div key={v.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
                  <div className="relative aspect-video bg-gray-900">
                    {vid && (
                      <iframe
                        src={`https://www.youtube.com/embed/${vid}`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                  </div>
                  <p className="p-4 font-medium text-gray-800">{v.title}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty text="Belum ada video." />
        )}
      </div>
    </>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
      {text}
    </div>
  );
}
