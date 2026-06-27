"use server";

import { uploadFile, validateDocument, validateImage } from "@desa/lib";
import { requireAuth } from "@/lib/session";

export interface UploadResponse {
  url?: string;
  error?: string;
}

/** Upload gambar (thumbnail, foto galeri, gambar editor). */
export async function uploadImageAction(formData: FormData): Promise<UploadResponse> {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File tidak ditemukan" };
  }
  const invalid = validateImage(file);
  if (invalid) return { error: invalid };
  try {
    const { url } = await uploadFile(file, "images", "images");
    return { url };
  } catch {
    return { error: "Gagal mengunggah gambar" };
  }
}

/** Upload dokumen (PDF/DOC/XLS/ZIP). */
export async function uploadDocumentAction(formData: FormData): Promise<UploadResponse> {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "File tidak ditemukan" };
  }
  const invalid = validateDocument(file);
  if (invalid) return { error: invalid };
  try {
    const { url } = await uploadFile(file, "documents", "documents");
    return { url };
  } catch {
    return { error: "Gagal mengunggah dokumen" };
  }
}
