import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { SettingsMap } from "@desa/lib";

export function Footer({ settings }: { settings: SettingsMap }) {
  return (
    <footer className="mt-16 bg-primary text-white">
      <div className="container grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold">{settings.namaDesa ?? "Website Desa"}</h3>
          <p className="text-sm text-white/80">{settings.slogan}</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Navigasi</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/profil" className="hover:text-white">Profil Desa</Link></li>
            <li><Link href="/berita" className="hover:text-white">Berita</Link></li>
            <li><Link href="/dokumen" className="hover:text-white">Dokumen</Link></li>
            <li><Link href="/kontak" className="hover:text-white">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Kontak</h4>
          <ul className="space-y-2 text-sm text-white/80">
            {settings.alamat && (
              <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0" /> {settings.alamat}</li>
            )}
            {settings.telepon && (
              <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0" /> {settings.telepon}</li>
            )}
            {settings.email && (
              <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0" /> {settings.email}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/70">
        © {new Date().getFullYear()} {settings.namaDesa ?? "Website Desa"}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
