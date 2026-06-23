import { BookOpen, Eye, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import { settingsRepo } from "@desa/lib";
import { PageHeader } from "@/components/page-header";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Profil Desa",
  description: "Sejarah, visi misi, dan sambutan kepala desa.",
};

export default async function ProfilPage() {
  const s = await settingsRepo.getSettings().catch(() => ({}) as Record<string, string>);
  const misiList = (s.misi || "")
    .split(/[;\n]/)
    .map((m) => m.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader title="Profil Desa" subtitle={`Mengenal lebih dekat ${s.namaDesa || "desa kami"}.`} />
      <div className="container max-w-4xl space-y-12 py-12">
        {/* Sambutan */}
        {s.sambutan && (
          <Section icon={<Users className="h-5 w-5" />} title="Sambutan Kepala Desa">
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{s.sambutan}</p>
          </Section>
        )}

        {/* Sejarah */}
        {s.sejarah && (
          <Section icon={<BookOpen className="h-5 w-5" />} title="Sejarah Desa">
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{s.sejarah}</p>
          </Section>
        )}

        {/* Visi & Misi */}
        <div className="grid gap-6 md:grid-cols-2">
          {s.visi && (
            <Section icon={<Eye className="h-5 w-5" />} title="Visi">
              <p className="leading-relaxed text-gray-700">{s.visi}</p>
            </Section>
          )}
          {misiList.length > 0 && (
            <Section icon={<Target className="h-5 w-5" />} title="Misi">
              <ul className="list-disc space-y-2 pl-5 text-gray-700">
                {misiList.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
