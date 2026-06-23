import { patchRow, readAll } from "../sheets";
import { SHEETS, type StatItem } from "../types";

/** Urutan tampil statistik di homepage. */
const ORDER = ["penduduk", "kk", "rt", "rw", "dusun", "luas"];

export async function getStatistics(): Promise<StatItem[]> {
  const rows = await readAll<StatItem>(SHEETS.statistics);
  return rows.sort(
    (a, b) =>
      (ORDER.indexOf(a.key) === -1 ? 99 : ORDER.indexOf(a.key)) -
      (ORDER.indexOf(b.key) === -1 ? 99 : ORDER.indexOf(b.key)),
  );
}

/** Statistik utama untuk hero homepage (tanpa luas wilayah). */
export async function getHeroStatistics(): Promise<StatItem[]> {
  const all = await getStatistics();
  return all.filter((s) => s.key !== "luas");
}

/** Perbarui nilai satu statistik berdasarkan key. */
export async function updateStatValue(key: string, value: string): Promise<boolean> {
  return patchRow(SHEETS.statistics, key, { value }, "key");
}
