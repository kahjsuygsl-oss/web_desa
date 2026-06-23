import {
  CalendarDays,
  Eye,
  FileText,
  Image as ImageIcon,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import {
  documentsRepo,
  eventsRepo,
  galleryRepo,
  newsRepo,
} from "@desa/lib";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [news, events, docs, photos] = await Promise.all([
    newsRepo.getAllNews().catch(() => []),
    eventsRepo.getUpcomingEvents().catch(() => []),
    documentsRepo.getAllDocuments().catch(() => []),
    galleryRepo.getAllPhotos().catch(() => []),
  ]);

  const totalViews = news.reduce((sum, n) => sum + (n.views ?? 0), 0);
  const published = news.filter((n) => n.status === "published").length;

  const stats = [
    { label: "Total Berita", value: news.length, sub: `${published} terbit`, icon: Newspaper, color: "bg-primary" },
    { label: "Total Pengunjung", value: totalViews, sub: "dilihat", icon: Eye, color: "bg-secondary" },
    { label: "Total Dokumen", value: docs.length, sub: "file", icon: FileText, color: "bg-accent" },
    { label: "Agenda Mendatang", value: events.length, sub: "acara", icon: CalendarDays, color: "bg-purple-500" },
  ];

  const popular = [...news]
    .filter((n) => n.status === "published")
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Ringkasan website desa.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className={`mb-3 grid h-10 w-10 place-items-center rounded-lg text-white ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500">
              {s.label} <span className="text-gray-400">· {s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Berita Terpopuler</h2>
            <Link href="/berita" className="text-sm text-primary hover:underline">
              Kelola
            </Link>
          </div>
          {popular.length > 0 ? (
            <ul className="space-y-3">
              {popular.map((n, i) => (
                <li key={n.id} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-sm text-gray-700">{n.title}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye className="h-3.5 w-3.5" /> {n.views}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">Belum ada berita.</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Aksi Cepat</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickLink href="/berita/baru" icon={Newspaper} label="Tulis Berita" />
            <QuickLink href="/agenda" icon={CalendarDays} label="Tambah Agenda" />
            <QuickLink href="/galeri" icon={ImageIcon} label="Unggah Foto" />
            <QuickLink href="/dokumen" icon={FileText} label="Unggah Dokumen" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Newspaper;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
    >
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  );
}
