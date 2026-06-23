import { NextResponse } from "next/server";
import { documentsRepo } from "@desa/lib";

/** Catat unduhan lalu redirect ke file Cloudinary. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const doc = await documentsRepo.getDocumentById(id).catch(() => null);
  if (!doc) {
    return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 });
  }
  documentsRepo.incrementDownload(id).catch(() => {});
  return NextResponse.redirect(doc.fileUrl);
}
