import { settingsRepo } from "@desa/lib";
import { PageTitle } from "@/components/page-title";
import { SettingsForm } from "@/components/settings-form";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const settings = await settingsRepo
    .getSettings()
    .catch(() => ({}) as Record<string, string>);

  return (
    <div>
      <PageTitle title="Pengaturan" description="Atur identitas, profil, dan kontak desa." />
      <SettingsForm settings={settings} />
    </div>
  );
}
