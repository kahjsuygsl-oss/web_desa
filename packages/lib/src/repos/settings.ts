import { patchRow, readAll } from "../sheets";
import { SHEETS, type SettingItem, type SettingsMap } from "../types";

/** Ambil semua pengaturan sebagai map key->value. */
export async function getSettings(): Promise<SettingsMap> {
  const rows = await readAll<SettingItem>(SHEETS.settings);
  const map: SettingsMap = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

export async function getSetting(key: string, fallback = ""): Promise<string> {
  const map = await getSettings();
  return map[key] ?? fallback;
}

/** Perbarui satu pengaturan. Baris harus sudah ada (dibuat oleh init-sheet). */
export async function updateSetting(key: string, value: string): Promise<boolean> {
  return patchRow(SHEETS.settings, key, { value }, "key");
}

/** Perbarui beberapa pengaturan sekaligus. */
export async function updateSettings(patch: SettingsMap): Promise<void> {
  for (const [key, value] of Object.entries(patch)) {
    await updateSetting(key, value);
  }
}
