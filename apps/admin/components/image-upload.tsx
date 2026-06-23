"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImageAction } from "@/app/(dashboard)/upload-actions";

/**
 * Field upload gambar: unggah ke Cloudinary lalu simpan URL ke hidden input
 * dengan nama `name` (dikirim bersama form).
 */
export function ImageUpload({
  name,
  defaultValue = "",
  label = "Gambar",
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setUrl(res.url!);
    toast.success("Gambar berhasil diunggah");
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {url ? (
        <div className="relative inline-block">
          <Image
            src={url}
            alt="preview"
            width={240}
            height={135}
            className="rounded-lg border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-red-600 text-white shadow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex h-32 w-60 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm">Pilih gambar</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
