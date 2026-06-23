"use server";

import { revalidatePath } from "next/cache";
import { documentsRepo, documentSchema } from "@desa/lib";
import { requireAuth } from "@/lib/session";
import { revalidatePublic } from "@/lib/revalidate-public";

export interface FormState {
  error?: string;
  ok?: boolean;
}

export async function createDocumentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  const parsed = documentSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category") || "Umum",
    fileUrl: formData.get("fileUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    await documentsRepo.createDocument(parsed.data);
  } catch {
    return { error: "Gagal menyimpan dokumen" };
  }
  revalidatePath("/dokumen");
  revalidatePublic("/dokumen");
  return { ok: true };
}

export async function deleteDocumentAction(id: string): Promise<void> {
  await requireAuth();
  await documentsRepo.deleteDocument(id);
  revalidatePath("/dokumen");
  revalidatePublic("/dokumen");
}
