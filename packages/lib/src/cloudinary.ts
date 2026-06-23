import { v2 as cloudinary } from "cloudinary";

/**
 * Upload file ke Cloudinary dari sisi server (Server Action).
 * Menerima File (dari FormData) dan mengembalikan secure_url.
 */

let configured = false;

function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload sebuah File ke folder tertentu.
 * resourceType "image" untuk gambar, "raw" untuk dokumen (pdf/doc/xls/zip).
 */
export async function uploadFile(
  file: File,
  folder: string,
  resourceType: "image" | "raw" | "auto" = "auto",
): Promise<UploadResult> {
  configure();
  const bytes = Buffer.from(await file.arrayBuffer());

  return new Promise<UploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `web-desa/${folder}`,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload gagal"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(bytes);
  });
}

const MAX_IMAGE = 5 * 1024 * 1024; // 5 MB
const MAX_DOC = 20 * 1024 * 1024; // 20 MB
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
