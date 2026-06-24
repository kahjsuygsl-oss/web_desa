import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/dokumen", label: "Dokumen" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar({ namaDesa }: { namaDesa: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-primary">
            <Image
              src="/favicon.png"
              alt="Logo"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <span className="text-lg font-bold text-primary">{namaDesa}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary/5 hover:text-primary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile: details/summary, tanpa JS */}
        <details className="relative md:hidden">
          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg hover:bg-gray-100">
            <Menu className="h-5 w-5 text-gray-700" />
          </summary>
          <ul className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </nav>
    </header>
  );
}
