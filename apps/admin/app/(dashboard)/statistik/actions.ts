"use server";

import { revalidatePath } from "next/cache";
import { statisticsRepo } from "@desa/lib";
import { requireAuth } from "@/lib/session";
import { revalidatePublic } from "@/lib/revalidate-public";

export interface FormState {
  error?: string;
  ok?: boolean;
}

export async function updateStatisticsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAuth();
  try {
    const stats = await statisticsRepo.getStatistics();
    for (const s of stats) {
      const value = formData.get(s.key);
      if (value !== null) {
        await statisticsRepo.updateStatValue(s.key, String(value));
      }
    }
  } catch {
    return { error: "Gagal menyimpan statistik" };
  }
  revalidatePath("/statistik");
  revalidatePublic("/");
  return { ok: true };
}
