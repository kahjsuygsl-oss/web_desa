"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { News } from "@desa/lib";
import { ImageUpload } from "@/components/image-upload";
import { RichEditor } from "@/components/rich-editor";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import type { FormState } from "@/app/(dashboard)/berita/actions";

/** Kategori bawaan — dipakai bila tab categories di Sheets masih kosong. */
const DEFAULT_CATEGORIES = [
  "Pemerintahan",
  "Pendidikan",
  "Kesehatan",
  "Pertanian",
  "Pariwisata",
  "UMKM",
  "Infrastruktur",
];

export function NewsForm({
  action,
  categories,
  initial,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  categories: string[];
  initial?: News;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  // Gabungkan kategori dari Sheets + bawaan + kategori berita ini (kalau ada),
  // tanpa duplikat — agar dropdown tidak pernah kosong.
  const categoryOptions = Array.from(
    new Set([
      ...categories,
      ...DEFAULT_CATEGORIES,
      ...(initial?.category ? [initial.category] : []),
    ]),
  ).filter(Boolean);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <Label htmlFor="title">Judul Berita</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initial?.title}
              placeholder="Judul berita..."
              required
            />
          </div>

          <div>
            <Label>Isi Berita</Label>
            <RichEditor name="content" defaultValue={initial?.content} />
          </div>

          <div>
            <Label htmlFor="excerpt">Ringkasan (opsional)</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={initial?.excerpt}
              placeholder="Ringkasan singkat. Dikosongkan = otomatis dari isi."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={initial?.status ?? "draft"}>
                  <option value="draft">Draft</option>
                  <option value="published">Terbitkan</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  name="category"
                  list="kategori-list"
                  defaultValue={initial?.category ?? ""}
                  placeholder="Pilih atau ketik kategori"
                  required
                />
                <datalist id="kategori-list">
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="mt-1 text-xs text-gray-400">
                  Pilih dari daftar atau ketik kategori baru.
                </p>
              </div>

              <div>
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={initial?.author ?? "Admin Desa"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <ImageUpload name="thumbnail" defaultValue={initial?.thumbnail} label="Thumbnail" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <SubmitButton edit={!!initial} />
      </div>
    </form>
  );
}

function SubmitButton({ edit }: { edit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Menyimpan..." : edit ? "Simpan Perubahan" : "Simpan Berita"}
    </Button>
  );
}
