import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { settingsRepo } from "@desa/lib";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi pemerintah desa.",
};

export default async function KontakPage() {
  const s = await settingsRepo.getSettings().catch(() => ({}) as Record<string, string>);
  const wa = (s.whatsapp || "").replace(/[^0-9]/g, "");

  const items = [
    { icon: <MapPin className="h-5 w-5" />, label: "Alamat", value: s.alamat },
    { icon: <Phone className="h-5 w-5" />, label: "Telepon", value: s.telepon },
    { icon: <Mail className="h-5 w-5" />, label: "Email", value: s.email },
    { icon: <Clock className="h-5 w-5" />, label: "Jam Operasional", value: s.jamOperasional },
  ].filter((i) => i.value);

  return (
    <>
      <PageHeader title="Kontak" subtitle="Hubungi pemerintah desa untuk informasi lebih lanjut." />
      <div className="container grid gap-8 py-12 md:grid-cols-2">
        <div className="space-y-4">
          {items.map((i) => (
            <Card key={i.label} className="flex items-start gap-4 p-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                {i.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{i.label}</div>
                <div className="text-sm text-gray-600">{i.value}</div>
              </div>
            </Card>
          ))}

          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-green-600 font-medium text-white transition-colors hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" /> Chat WhatsApp
            </a>
          )}
        </div>

        {/* Peta */}
        <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
          {s.mapsEmbed ? (
            <iframe
              src={s.mapsEmbed}
              title="Lokasi Desa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full border-0"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full min-h-[320px] place-items-center text-gray-400">
              Peta lokasi belum diatur.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
