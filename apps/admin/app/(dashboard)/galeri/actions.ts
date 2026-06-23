"use server";

import { revalidatePath } from "next/cache";
import { galleryRepo, photoSchema, videoSchema } from "@desa/lib";
import { requireAuth } from "@/lib/session";
import { revalidatePublic } from "@/lib/revalidate-public";

export interface FormState {
  error?: string;
  ok?: boolean;
}

export async function createPhotoAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  const parsed = photoSchema.safeParse({
    title: formData.get("title") || "Foto",
    imageUrl: formData.get("imageUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    await galleryRepo.createPhoto(parsed.data);
  } catch {
    return { error: "Gagal menyimpan foto" };
  }
  revalidatePath("/galeri");
  revalidatePublic("/galeri");
  revalidatePublic("/");
  return { ok: true };
}

export async function createVideoAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  const parsed = videoSchema.safeParse({
    title: formData.get("title"),
    youtubeUrl: formData.get("youtubeUrl"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    await galleryRepo.createVideo(parsed.data);
  } catch {
    return { error: "Gagal menyimpan video" };
  }
  revalidatePath("/galeri");
  revalidatePublic("/galeri");
  return { ok: true };
}

export async function deletePhotoAction(id: string): Promise<void> {
  await requireAuth();
  await galleryRepo.deletePhoto(id);
  revalidatePath("/galeri");
  revalidatePublic("/galeri");
  revalidatePublic("/");
}

export async function deleteVideoAction(id: string): Promise<void> {
  await requireAuth();
  await galleryRepo.deleteVideo(id);
  revalidatePath("/galeri");
  revalidatePublic("/galeri");
}
