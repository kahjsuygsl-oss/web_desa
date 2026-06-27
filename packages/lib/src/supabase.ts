import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SheetName } from "./types";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Env ${name} belum di-set`);
  return value;
}

function getSupabaseClient(): SupabaseClient {
  const globalKey = "__desa_supabase_client__";
  const globalStore = globalThis as typeof globalThis & Record<string, unknown>;

  if (!globalStore[globalKey]) {
    const url = getEnv("SUPABASE_URL");
    const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    globalStore[globalKey] = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return globalStore[globalKey] as SupabaseClient;
}

function toSupabaseError(table: SheetName, error: unknown): Error {
  if (error instanceof Error) {
    return new Error(`Supabase ${table}: ${error.message}`);
  }

  return new Error(`Supabase ${table}: unknown error`);
}

export async function readAll<T>(sheet: SheetName): Promise<T[]> {
  const { data, error } = await getSupabaseClient().from(sheet).select("*");

  if (error) {
    throw toSupabaseError(sheet, error);
  }

  return (data as T[] | null) ?? [];
}

export async function appendRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  obj: T,
): Promise<void> {
  const { error } = await getSupabaseClient().from(sheet).insert(obj as Record<string, unknown>);

  if (error) {
    throw toSupabaseError(sheet, error);
  }
}

export async function updateRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  keyValue: string,
  obj: T,
  keyColumn = "id",
): Promise<boolean> {
  const { error } = await getSupabaseClient()
    .from(sheet)
    .update(obj as Record<string, unknown>)
    .eq(keyColumn, keyValue);

  if (error) {
    throw toSupabaseError(sheet, error);
  }

  return true;
}

export async function deleteRow(
  sheet: SheetName,
  keyValue: string,
  keyColumn = "id",
): Promise<boolean> {
  const { error } = await getSupabaseClient().from(sheet).delete().eq(keyColumn, keyValue);

  if (error) {
    throw toSupabaseError(sheet, error);
  }

  return true;
}

export async function patchRow<T extends Record<string, unknown>>(
  sheet: SheetName,
  keyValue: string,
  patch: Partial<T>,
  keyColumn = "id",
): Promise<boolean> {
  const { error } = await getSupabaseClient()
    .from(sheet)
    .update(patch as Record<string, unknown>)
    .eq(keyColumn, keyValue);

  if (error) {
    throw toSupabaseError(sheet, error);
  }

  return true;
}
