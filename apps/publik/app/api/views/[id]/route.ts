import { NextResponse } from "next/server";
import { newsRepo } from "@desa/lib";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // fire-and-forget; jangan blokir bila Sheets lambat
  newsRepo.incrementViews(id).catch(() => {});
  return NextResponse.json({ ok: true });
}
