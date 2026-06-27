import type { SheetName } from "./types";
import {
  appendRow as supabaseAppendRow,
  deleteRow as supabaseDeleteRow,
  patchRow as supabasePatchRow,
  readAll as supabaseReadAll,
  updateRow as supabaseUpdateRow,
} from "./supabase";

function isSupabaseEnabled(): boolean {
  const backend = process.env.DATA_BACKEND?.toLowerCase();
  if (backend === "supabase") return true;
  if (backend === "apps_script") return false;

  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY),
  );
}

/**
 * Akses data melalui Supabase bila konfigurasi tersedia; bila tidak,
 * jatuh ke Google Apps Script Web App yang lama.
 */
function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Env ${name} belum di-set`);
  return v;
}

type Action = "readAll" | "append" | "update" | "delete" | "patch";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiCall<T>(
  action: Action,
  sheet: SheetName,
  payload?: unknown,
): Promise<T> {
  const url = getEnv("APPS_SCRIPT_URL");
  const token = getEnv("APPS_SCRIPT_TOKEN");
  const controller = new AbortController();
  const timeoutMs = 5000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action, sheet, payload }),
      redirect: "follow",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Apps Script HTTP ${res.status}`);
    }
    const body = (await res.json()) as ApiResponse<T>;
    if (body.error) throw new Error(`Apps Script: ${body.error}`);
    return body.data as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Apps Script request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Baca seluruh baris sebuah tab. Di sisi publik bisa di-cache lewat DATA_REVALIDATE. */
export async function readAll<T>(sheet: SheetName): Promise<T[]> {
  if (isSupabaseEnabled()) {
    return supabaseReadAll<T>(sheet);
  }

  const revalidate = Number(process.env.DATA_REVALIDATE ?? "0");

  if (revalidate > 0) {
    const { unstable_cache } = await import("next/cache");
    const cached = unstable_cache(
      async () => apiCall<T[]>("readAll", sheet),
      ["sheet", sheet],
      { revalidate, tags: [sheet] },
    );
    return (await cached()) ?? [];
  }

  return (await apiCall<T[]>("readAll", sheet)) ?? [];
}

/** Tambah satu baris. */
export async function appendRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  obj: T,
): Promise<void> {
  if (isSupabaseEnabled()) {
    await supabaseAppendRow(sheet, obj);
    return;
  }

  await apiCall<boolean>("append", sheet, { obj });
}

/** Perbarui satu baris (match kolom kunci, default "id"). */
export async function updateRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  keyValue: string,
  obj: T,
  keyColumn = "id",
): Promise<boolean> {
  if (isSupabaseEnabled()) {
    return supabaseUpdateRow(sheet, keyValue, obj, keyColumn);
  }

  return (await apiCall<boolean>("update", sheet, { keyValue, obj, keyColumn })) ?? false;
}

/** Hapus satu baris berdasarkan kolom kunci. */
export async function deleteRow(
  sheet: SheetName,
  keyValue: string,
  keyColumn = "id",
): Promise<boolean> {
  if (isSupabaseEnabled()) {
    return supabaseDeleteRow(sheet, keyValue, keyColumn);
  }

  return (await apiCall<boolean>("delete", sheet, { keyValue, keyColumn })) ?? false;
}

/** Patch sebagian kolom pada satu baris. */
export async function patchRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  keyValue: string,
  patch: Partial<T>,
  keyColumn = "id",
): Promise<boolean> {
  if (isSupabaseEnabled()) {
    return supabasePatchRow(sheet, keyValue, patch, keyColumn);
  }

  return (await apiCall<boolean>("patch", sheet, { keyValue, patch, keyColumn })) ?? false;
}
