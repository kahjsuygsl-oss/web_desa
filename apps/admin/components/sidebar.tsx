"use client";

import {
  CalendarDays,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Newspaper,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(dashboard)/actions";

const menu: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/berita", label: "Berita", icon: Newspaper },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/dokumen", label: "Dokumen", icon: FileText },
  { href: "/statistik", label: "Statistik", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-white">
          D
        </span>
        <span className="font-bold text-gray-900">Admin Desa</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menu.map((m) => {
          const active =
            m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="border-t border-gray-100 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </form>
    </aside>
  );
}
