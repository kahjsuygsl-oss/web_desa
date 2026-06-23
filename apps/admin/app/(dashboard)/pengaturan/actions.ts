"use server";

import { revalidatePath } from "next/cache";
import { settingsRepo } from "@desa/lib";
import { requireAuth } from "@/lib/session";
import { revalidatePublic } from "@/lib/revalidate-public";

export interface FormState {
  error?: string;
  ok?: boolean;
}

/** Key pengaturan yang boleh diubah dari form. */
const KEYS = [
  "namaDesa",
  "slogan",
  "sejarah",
  "visi",
  "misi",
  "sambutan",
  "alamat",
  "telepon",
  "email",
  "jamOperasional",
  "whatsapp",
  "mapsEmbed",
];

export async function updateSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  try {
    const patch: Record<string, string> = {};
    for (const k of KEYS) {
      const v = formData.get(k);
      if (v !== null) patch[k] = String(v);
    }
    await settingsRepo.updateSettings(patch);
  } catch {
    return { error: "Gagal menyimpan pengaturan" };
  }
  revalidatePath("/pengaturan");
  // Pengaturan memengaruhi seluruh situs publik
  revalidatePublic("/");
  revalidatePublic("/profil");
  revalidatePublic("/kontak");
  return { ok: true };
}
