import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SHEETS } from "@desa/lib";

/**
 * Endpoint untuk memicu refresh halaman publik secara instan dari admin.
 * Panggil: POST /api/revalidate?secret=...&path=/berita
 * Selain path, semua tag data (per-tab) juga di-refresh agar cache data ikut diperbarui.
 */
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Secret tidak valid" }, { status: 401 });
  }

  // Buang cache data semua tab + halaman terkait.
  for (const tab of Object.values(SHEETS)) revalidateTag(tab);
  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
