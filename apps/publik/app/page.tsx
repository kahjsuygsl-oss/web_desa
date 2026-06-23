import {
  ArrowRight,
  CalendarDays,
  Home as HomeIcon,
  MapPin,
  Newspaper,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  eventsRepo,
  formatTanggal,
  galleryRepo,
  newsRepo,
  settingsRepo,
  statisticsRepo,
} from "@desa/lib";
import { NewsCard } from "@/components/news-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const revalidate = 600; // ISR: refresh tiap 10 menit

export default async function HomePage() {
  const [settings, stats, latestNews, upcoming, photos] = await Promise.all([
    settingsRepo.getSettings().catch(() => ({}) as Record<string, string>),
    statisticsRepo.getHeroStatistics().catch(() => []),
    newsRepo.getLatestNews(6).catch(() => []),
    eventsRepo.getUpcomingEvents(3).catch(() => []),
    galleryRepo.getLatestPhotos(8).catch(() => []),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container py-20 text-center md:py-28">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/80">
            Selamat Datang di Website Resmi
          </p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            {settings.namaDesa || "Desa Digital"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {settings.slogan || "Desa Transparan, Desa Digital, Desa Maju"}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/berita">
                <Newspaper className="h-5 w-5" /> Lihat Berita
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/profil">
                Profil Desa <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistik */}
      {stats.length > 0 && (
        <section className="container -mt-10 relative z-10">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-5">
            {stats.map((s) => (
              <div key={s.key} className="text-center">
                <div className="text-2xl font-extrabold text-primary md:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-gray-500 md:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Berita Terbaru */}
      <section className="container py-16">
        <SectionHeader
          icon={<Newspaper className="h-5 w-5" />}
          title="Berita Terbaru"
          href="/berita"
        />
        {latestNews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        ) : (
          <Empty text="Belum ada berita." />
        )}
      </section>

      {/* Agenda */}
      {upcoming.length > 0 && (
        <section className="bg-white py-16">
          <div className="container">
            <SectionHeader
              icon={<CalendarDays className="h-5 w-5" />}
              title="Agenda Mendatang"
              href="/agenda"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {upcoming.map((e) => (
                <Card key={e.id} className="p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                    <CalendarDays className="h-4 w-4" />
                    {formatTanggal(e.eventDate)}
                  </div>
                  <h3 className="mt-2 font-bold text-gray-900">{e.title}</h3>
                  {e.location && (
                    <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" /> {e.location}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galeri */}
      {photos.length > 0 && (
        <section className="container py-16">
          <SectionHeader
            icon={<HomeIcon className="h-5 w-5" />}
            title="Galeri Terbaru"
            href="/galeri"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function SectionHeader({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Lihat Semua <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
      {text}
    </div>
  );
}
