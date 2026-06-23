import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { settingsRepo } from "@desa/lib";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const s = await settingsRepo.getSettings().catch(() => ({}) as Record<string, string>);
  const nama = s.namaDesa || "Website Desa Digital";
  const slogan = s.slogan || "Pusat informasi dan transparansi desa";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${nama} — Website Resmi`, template: `%s — ${nama}` },
    description: slogan,
    keywords: ["desa", "website desa", nama, "berita desa", "pemerintahan desa"],
    openGraph: {
      title: `${nama} — Website Resmi`,
      description: slogan,
      type: "website",
      locale: "id_ID",
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await settingsRepo
    .getSettings()
    .catch(() => ({}) as Record<string, string>);

  return (
    <html lang="id" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Navbar namaDesa={settings.namaDesa || "Website Desa"} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
