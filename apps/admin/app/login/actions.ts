"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@desa/lib";
import { login } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Password wajib diisi" };
  }

  let ok = false;
  try {
    ok = verifyPassword(password);
  } catch {
    return { error: "Konfigurasi server belum lengkap (ADMIN_PASSWORD)." };
  }

  if (!ok) {
    return { error: "Password salah." };
  }

  await login();
  redirect("/");
}
