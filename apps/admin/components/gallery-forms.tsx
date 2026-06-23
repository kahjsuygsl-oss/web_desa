"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { uploadImageAction } from "@/app/(dashboard)/upload-actions";
import {
  createPhotoAction,
  createVideoAction,
  type FormState,
} from "@/app/(dashboard)/galeri/actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

/** Form unggah foto: upload ke Cloudinary lalu submit URL + judul. */
export function PhotoForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createPhotoAction, {});
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Foto ditambahkan");
      formRef.current?.reset();
      setUrl("");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  async function handleFile(file: File) {
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageAction(fd);
    setLoading(false);
    if (res.error) return toast.error(res.error);
    setUrl(res.url!);
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="imageUrl" value={url} />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div>
        <Label htmlFor="photo-title">Judul Foto</Label>
        <Input id="photo-title" name="title" placeholder="mis. Gotong Royong" />
      </div>

      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="preview" className="h-32 rounded-lg border object-cover" />
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          <span className="text-sm">Pilih gambar</span>
        </button>
      )}

      <SubmitButton label="Unggah Foto" disabled={!url} />
    </form>
  );
}

/** Form tambah video YouTube (cukup URL). */
export function VideoForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createVideoAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Video ditambahkan");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="video-title">Judul Video</Label>
        <Input id="video-title" name="title" placeholder="mis. Profil Desa 2026" required />
      </div>
      <div>
        <Label htmlFor="youtubeUrl">URL YouTube</Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      </div>
      <SubmitButton label="Tambah Video" />
    </form>
  );
}

function SubmitButton({ label, disabled }: { label: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? "Menyimpan..." : label}
    </Button>
  );
}
