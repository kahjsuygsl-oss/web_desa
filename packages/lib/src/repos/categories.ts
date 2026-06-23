import { readAll } from "../sheets";
import { SHEETS, type CategoryItem } from "../types";

export async function getCategories(): Promise<CategoryItem[]> {
  return readAll<CategoryItem>(SHEETS.categories);
}

export async function getCategoryNames(): Promise<string[]> {
  const cats = await getCategories();
  return cats.map((c) => c.name);
}
