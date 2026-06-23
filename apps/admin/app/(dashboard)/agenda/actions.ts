"use server";

import { revalidatePath } from "next/cache";
import { eventsRepo, eventSchema } from "@desa/lib";
import { requireAuth } from "@/lib/session";
import { revalidatePublic } from "@/lib/revalidate-public";

export interface FormState {
  error?: string;
  ok?: boolean;
}

function parse(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || "",
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    poster: formData.get("poster") || "",
  });
}

export async function createEventAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  try {
    await eventsRepo.createEvent(parsed.data);
  } catch {
    return { error: "Gagal menyimpan agenda" };
  }
  revalidatePath("/agenda");
  revalidatePublic("/agenda");
  revalidatePublic("/");
  return { ok: true };
}

export async function deleteEventAction(id: string): Promise<void> {
  await requireAuth();
  await eventsRepo.deleteEvent(id);
  revalidatePath("/agenda");
  revalidatePublic("/agenda");
  revalidatePublic("/");
}
