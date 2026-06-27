import { createClient } from "@supabase/supabase-js";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Env ${name} belum di-set`);
  return value;
}

function getSupabaseClient() {
  const globalKey = "__desa_supabase_storage_client__";
  const globalStore = globalThis as typeof globalThis & Record<string, unknown>;

  if (!globalStore[globalKey]) {
    const url = getEnv("SUPABASE_URL");
    const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");
    globalStore[globalKey] = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return globalStore[globalKey] as ReturnType<typeof createClient>;
}

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadFile(
  file: File,
  bucket: string,
  folder: string,
): Promise<UploadResult> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await getSupabaseClient().storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = getSupabaseClient().storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_DOC = 20 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-zip-compressed",
];

export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return "Format gambar harus JPG, PNG, WEBP, atau GIF";
  if (file.size > MAX_IMAGE) return "Ukuran gambar maksimal 5 MB";
  return null;
}

export function validateDocument(file: File): string | null {
  if (!DOC_TYPES.includes(file.type)) return "Format harus PDF, DOC, DOCX, XLS, XLSX, atau ZIP";
  if (file.size > MAX_DOC) return "Ukuran file maksimal 20 MB";
  return null;
}
