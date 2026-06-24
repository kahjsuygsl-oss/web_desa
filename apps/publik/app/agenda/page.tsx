import { CalendarDays, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { eventsRepo, formatTanggal } from "@desa/lib";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { FALLBACK_EVENTS } from "@/lib/fallback";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Agenda",
  description: "Jadwal kegiatan dan agenda desa mendatang.",
};

export default async function AgendaPage() {
  const live = await eventsRepo.getUpcomingEvents().catch(() => []);
  const events = live.length > 0 ? live : FALLBACK_EVENTS;

  return (
    <>
      <PageHeader title="Agenda Desa" subtitle="Jadwal kegiatan dan acara desa mendatang." />
      <div className="container py-12">
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((e) => (
              <Card key={e.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
                <div className="flex w-full shrink-0 flex-col items-center justify-center rounded-xl bg-primary/5 p-4 md:w-32">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  <span className="mt-1 text-center text-sm font-semibold text-primary">
                    {formatTanggal(e.eventDate)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{e.title}</h3>
                  {e.location && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" /> {e.location}
                    </p>
                  )}
                  {e.description && (
                    <p className="mt-2 text-sm text-gray-600">{e.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            Belum ada agenda mendatang.
          </div>
        )}
      </div>
    </>
  );
}
