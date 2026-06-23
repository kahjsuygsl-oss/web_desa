"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newsRepo, newsSchema } from "@desa/lib";
import { requireAuth } from "@/lib/session";
import { revalidatePublic } from "@/lib/revalidate-public";

export interface FormState {
  error?: string;
}

function parseNews(formData: FormData) {
  return newsSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    excerpt: formData.get("excerpt") || "",
    content: formData.get("content"),
    thumbnail: formData.get("thumbnail") || "",
    author: formData.get("author") || "Admin",
    status: formData.get("status") || "draft",
  });
}

export async function createNewsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  const parsed = parseNews(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  try {
    await newsRepo.createNews(parsed.data);
  } catch {
    return { error: "Gagal menyimpan berita" };
  }
  revalidatePath("/berita");
  revalidatePublic("/berita");
  revalidatePublic("/");
  redirect("/berita");
}

export async function updateNewsAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  const parsed = parseNews(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  try {
    const updated = await newsRepo.updateNews(id, parsed.data);
    if (!updated) return { error: "Berita tidak ditemukan" };
  } catch {
    return { error: "Gagal memperbarui berita" };
  }
  revalidatePath("/berita");
  revalidatePublic("/berita");
  revalidatePublic("/");
  redirect("/berita");
}

export async function deleteNewsAction(id: string): Promise<void> {
  await requireAuth();
  await newsRepo.deleteNews(id);
  revalidatePath("/berita");
  revalidatePublic("/berita");
  revalidatePublic("/");
}
