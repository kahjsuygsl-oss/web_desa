import { CalendarDays, MapPin } from "lucide-react";
import { eventsRepo, formatTanggal } from "@desa/lib";
import { DeleteButton } from "@/components/delete-button";
import { EventForm } from "@/components/event-form";
import { PageTitle } from "@/components/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteEventAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const events = await eventsRepo.getAllEvents().catch(() => []);

  return (
    <div>
      <PageTitle title="Agenda" description="Kelola jadwal kegiatan desa." />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tambah Agenda</CardTitle>
          </CardHeader>
          <CardContent>
            <EventForm />
          </CardContent>
        </Card>

        <div className="space-y-3 lg:col-span-3">
          {events.length > 0 ? (
            events.map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex w-24 shrink-0 flex-col items-center rounded-lg bg-primary/5 p-2 text-center">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span className="mt-1 text-xs font-semibold text-primary">
                    {formatTanggal(e.eventDate)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-900">{e.title}</h3>
                  {e.location && (
                    <p className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" /> {e.location}
                    </p>
                  )}
                </div>
                <DeleteButton id={e.id} action={deleteEventAction} label={`Hapus agenda "${e.title}"?`} />
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-gray-400">
              Belum ada agenda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
