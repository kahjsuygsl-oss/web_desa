import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Eye,
  ImageIcon,
  MapPin,
  Newspaper,
  Sparkles,
  Target,
  User,
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
import { Reveal } from "@/components/reveal";
import { StatCounter } from "@/components/stat-counter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FALLBACK_EVENTS,
  FALLBACK_NEWS,
  FALLBACK_PHOTOS,
  FALLBACK_STATS,
  withFallbackSettings,
} from "@/lib/fallback";

export const revalidate = 600; // ISR: refresh tiap 10 menit

/** Menu yang ditonjolkan di beranda (highlight, bukan seluruh isi). */
const MENU_HIGHLIGHT = [
  {
    href: "/profil",
    label: "Profil",
    desc: "Sejarah, visi & misi, serta sambutan kepala desa.",
    icon: User,
  },
  {
    href: "/berita",
    label: "Berita",
    desc: "Kabar terbaru dan informasi seputar desa.",
    icon: Newspaper,
  },
  {
    href: "/agenda",
    label: "Agenda",
    desc: "Jadwal kegiatan dan acara desa mendatang.",
    icon: CalendarDays,
  },
  {
    href: "/galeri",
    label: "Galeri",
    desc: "Dokumentasi foto dan video kegiatan desa.",
    icon: ImageIcon,
  },
] as const;

export default async function HomePage() {
  const [liveSettings, liveStats, latestNews, liveUpcoming, photos] =
    await Promise.all([
      settingsRepo.getSettings().catch(() => ({}) as Record<string, string>),
      statisticsRepo.getHeroStatistics().catch(() => []),
      newsRepo.getLatestNews(3).catch(() => []),
      eventsRepo.getUpcomingEvents(3).catch(() => []),
      galleryRepo.getLatestPhotos(8).catch(() => []),
    ]);

  // Pakai data asli bila ada; jika kosong, tampilkan contoh Masbagik Timur.
  const settings = withFallbackSettings(liveSettings);
  const stats = liveStats.length > 0 ? liveStats : FALLBACK_STATS;
  const topNews = latestNews.length > 0 ? latestNews : FALLBACK_NEWS;
  const upcoming = liveUpcoming.length > 0 ? liveUpcoming : FALLBACK_EVENTS;
  const topPhotos = photos.length > 0 ? photos : FALLBACK_PHOTOS;

  const namaDesa = settings.namaDesa || "Desa Digital";
  const misiList = (settings.misi || "")
    .split(/[;\n]/)
    .map((m) => m.trim())
    .filter(Boolean);
  const hasProfil = Boolean(
    settings.sambutan || settings.sejarah || settings.visi || misiList.length,
  );

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-white">
        {/* Dekorasi: blob mengambang + pola titik */}
        <div
          aria-hidden
          className="animate-blob animate-float-slow absolute -left-24 -top-24 h-72 w-72 bg-white/10 blur-2xl"
        />
        <div
          aria-hidden
          className="animate-blob animate-float-slow absolute -bottom-32 -right-16 h-80 w-80 bg-accent/20 blur-2xl"
          style={{ animationDelay: "1.5s" }}
        />
        <div aria-hidden className="bg-dots absolute inset-0 opacity-60" />

        <div className="container relative z-10 py-20 text-center md:py-28">
          <p className="animate-fade-up mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Selamat Datang di Website Resmi
          </p>
          <h1
            className="animate-fade-up text-4xl font-extrabold leading-tight md:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            {namaDesa}
          </h1>
          <p
            className="animate-fade-up mx-auto mt-4 max-w-2xl text-lg text-white/90"
            style={{ animationDelay: "160ms" }}
          >
            {settings.slogan || "Desa Transparan, Desa Digital, Desa Maju"}
          </p>

          <div
            className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button asChild variant="accent" size="lg">
              <Link href="/berita">
                <Newspaper className="h-5 w-5" /> Lihat Berita
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/profil">
                Profil Desa <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Akses cepat menu (chip interaktif) */}
          <div
            className="animate-fade-up mt-10 flex flex-wrap justify-center gap-2"
            style={{ animationDelay: "320ms" }}
          >
            {MENU_HIGHLIGHT.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition-all hover:border-white/60 hover:bg-white/15"
              >
                <m.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                {m.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Lengkungan pemisah ke bawah */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-12 bg-background"
          style={{ clipPath: "ellipse(75% 100% at 50% 100%)" }}
        />
      </section>

      {/* ===================== STATISTIK ===================== */}
      {stats.length > 0 && (
        <section className="container relative z-20 -mt-10">
          <Reveal className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 md:grid-cols-4">
            {stats.slice(0, 4).map((s) => (
              <div key={s.key} className="text-center">
                <StatCounter value={s.value} />
                <div className="mt-1 text-xs text-gray-500 md:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      {/* ===================== MENU HIGHLIGHT ===================== */}
      <section className="container py-16">
        <Reveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Jelajahi {namaDesa}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-gray-500">
            Akses cepat ke informasi penting desa — pilih menu di bawah ini.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MENU_HIGHLIGHT.map((m, i) => (
            <Reveal key={m.href} delay={i * 90}>
              <Link href={m.href} className="group block h-full">
                <Card className="flex h-full flex-col p-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/30 group-hover:shadow-lg">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <m.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    {m.label}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-gray-500">{m.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Selengkapnya
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== PROFIL (HIGHLIGHT) ===================== */}
      {hasProfil && (
        <section className="bg-white py-16">
          <div className="container grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <BookOpen className="h-4 w-4" /> Profil Desa
              </span>
              <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">
                Mengenal Lebih Dekat {namaDesa}
              </h2>
              <p className="mt-4 line-clamp-5 whitespace-pre-line leading-relaxed text-gray-600">
                {settings.sambutan ||
                  settings.sejarah ||
                  settings.visi ||
                  ""}
              </p>
              <Button asChild className="mt-6">
                <Link href="/profil">
                  Lihat Profil Lengkap <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>

            <Reveal delay={120} className="grid gap-4">
              {settings.visi && (
                <Card className="p-6">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <Eye className="h-5 w-5 text-primary" /> Visi
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {settings.visi}
                  </p>
                </Card>
              )}
              {misiList.length > 0 && (
                <Card className="p-6">
                  <h3 className="flex items-center gap-2 font-bold text-gray-900">
                    <Target className="h-5 w-5 text-primary" /> Misi
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                    {misiList.slice(0, 3).map((m, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                        <span className="line-clamp-1">{m}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {/* ===================== BERITA TERBARU (HIGHLIGHT) ===================== */}
      <section className="container py-16">
        <SectionHeader
          icon={<Newspaper className="h-5 w-5" />}
          title="Berita Terbaru"
          subtitle="Informasi dan kabar terkini dari desa."
          href="/berita"
        />
        {topNews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topNews.map((n, i) => (
              <Reveal key={n.id} delay={i * 90} className="group h-full">
                <NewsCard news={n} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Empty text="Belum ada berita." />
        )}
      </section>

      {/* ===================== AGENDA (HIGHLIGHT) ===================== */}
      {upcoming.length > 0 && (
        <section className="bg-white py-16">
          <div className="container">
            <SectionHeader
              icon={<CalendarDays className="h-5 w-5" />}
              title="Agenda Mendatang"
              subtitle="Jangan lewatkan kegiatan desa berikutnya."
              href="/agenda"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {upcoming.map((e, i) => (
                <Reveal key={e.id} delay={i * 90}>
                  <Card className="h-full border-l-4 border-l-accent p-5">
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
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== GALERI (HIGHLIGHT) ===================== */}
      {topPhotos.length > 0 && (
        <section className="container py-16">
          <SectionHeader
            icon={<ImageIcon className="h-5 w-5" />}
            title="Galeri Terbaru"
            subtitle="Potret kegiatan dan momen di desa."
            href="/galeri"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {topPhotos.map((p, i) => (
              <Reveal
                key={p.id}
                delay={i * 60}
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={p.imageUrl}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {p.title && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 text-xs font-medium text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    {p.title}
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ===================== CTA KONTAK ===================== */}
      <section className="container pb-20">
        <Reveal className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-secondary px-8 py-12 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ada pertanyaan atau butuh layanan?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Hubungi perangkat desa untuk informasi, pengaduan, maupun layanan
            administrasi.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-white text-primary hover:bg-white/90"
          >
            <Link href="/kontak">
              Hubungi Kami <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <Reveal className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <span className="text-primary">{icon}</span>
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <Link
        href={href}
        className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Lihat Semua
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Reveal>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
      {text}
    </div>
  );
}
