"use client";

import { FileUp, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { uploadDocumentAction } from "@/app/(dashboard)/upload-actions";
import {
  createDocumentAction,
  type FormState,
} from "@/app/(dashboard)/dokumen/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";

const KATEGORI = ["Peraturan Desa", "APBDes", "Laporan", "Formulir", "Surat", "Umum"];

export function DocumentForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createDocumentAction, {});
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Dokumen diunggah");
      formRef.current?.reset();
      setUrl("");
      setFileName("");
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  async function handleFile(file: File) {
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadDocumentAction(fd);
    setLoading(false);
    if (res.error) return toast.error(res.error);
    setUrl(res.url!);
    setFileName(file.name);
    toast.success("File terunggah, lengkapi data lalu simpan");
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="fileUrl" value={url} />
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <div>
        <Label htmlFor="doc-name">Nama Dokumen</Label>
        <Input id="doc-name" name="name" placeholder="mis. APBDes 2026" required />
      </div>

      <div>
        <Label htmlFor="doc-cat">Kategori</Label>
        <Select id="doc-cat" name="category" defaultValue="Umum">
          {KATEGORI.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>File (PDF/DOC/XLS/ZIP, maks 20MB)</Label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
          className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:border-primary hover:text-primary"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FileUp className="h-5 w-5" />
          )}
          {fileName || "Pilih file..."}
        </button>
      </div>

      <SubmitButton disabled={!url} />
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? "Menyimpan..." : "Simpan Dokumen"}
    </Button>
  );
}
