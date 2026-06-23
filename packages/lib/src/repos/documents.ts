import { appendRow, deleteRow, patchRow, readAll } from "../sheets";
import { SHEETS, type DocumentItem } from "../types";
import { generateId } from "../utils";
import type { DocumentInput } from "../validation";

export async function getAllDocuments(): Promise<DocumentItem[]> {
  const rows = await readAll<DocumentItem>(SHEETS.documents);
  return rows.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
}

export async function getDocumentById(id: string): Promise<DocumentItem | null> {
  const all = await readAll<DocumentItem>(SHEETS.documents);
  return all.find((d) => d.id === id) ?? null;
}

export async function createDocument(input: DocumentInput): Promise<DocumentItem> {
  const doc: DocumentItem = {
    id: generateId(),
    name: input.name,
    category: input.category,
    fileUrl: input.fileUrl,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
  };
  await appendRow(SHEETS.documents, doc as unknown as Record<string, unknown>);
  return doc;
}

export async function deleteDocument(id: string): Promise<boolean> {
  return deleteRow(SHEETS.documents, id);
}

export async function incrementDownload(id: string): Promise<void> {
  const d = await getDocumentById(id);
  if (!d) return;
  await patchRow(SHEETS.documents, id, { downloadCount: (d.downloadCount ?? 0) + 1 });
}
