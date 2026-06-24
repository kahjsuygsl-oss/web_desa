import type { SheetName } from "./types";

/**
 * Akses spreadsheet melalui Google Apps Script Web App.
 * Tidak perlu Service Account: cukup URL Web App + token rahasia.
 * Fungsi-fungsi di sini meniru API lama (readAll/appendRow/...) agar
 * repositori di folder repos/ tidak perlu berubah.
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
      // Catatan: fetch POST tidak pernah di-cache Next secara default, jadi
      // data selalu fresh. Caching di sisi publik diatur oleh readAll() via
      // unstable_cache (lihat di bawah) ketika DATA_REVALIDATE > 0.
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
  const revalidate = Number(process.env.DATA_REVALIDATE ?? "0");

  if (revalidate > 0) {
    // Cache hasil di Data Cache Next (khusus app publik yang men-set DATA_REVALIDATE).
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
  await apiCall<boolean>("append", sheet, { obj });
}

/** Perbarui satu baris (match kolom kunci, default "id"). */
export async function updateRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  keyValue: string,
  obj: T,
  keyColumn = "id",
): Promise<boolean> {
  return (await apiCall<boolean>("update", sheet, { keyValue, obj, keyColumn })) ?? false;
}

/** Hapus satu baris berdasarkan kolom kunci. */
export async function deleteRow(
  sheet: SheetName,
  keyValue: string,
  keyColumn = "id",
): Promise<boolean> {
  return (await apiCall<boolean>("delete", sheet, { keyValue, keyColumn })) ?? false;
}

/** Patch sebagian kolom pada satu baris (merge di sisi Apps Script). */
export async function patchRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  keyValue: string,
  patch: Partial<T>,
  keyColumn = "id",
): Promise<boolean> {
  return (await apiCall<boolean>("patch", sheet, { keyValue, patch, keyColumn })) ?? false;
}
