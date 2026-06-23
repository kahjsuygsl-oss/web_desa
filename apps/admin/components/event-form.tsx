"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { createEventAction, type FormState } from "@/app/(dashboard)/agenda/actions";

export function EventForm() {
  const [state, formAction] = useActionState<FormState, FormData>(createEventAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Agenda ditambahkan");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="title">Nama Agenda</Label>
        <Input id="title" name="title" placeholder="mis. Musyawarah Desa" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="eventDate">Tanggal</Label>
          <Input id="eventDate" name="eventDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="location">Lokasi</Label>
          <Input id="location" name="location" placeholder="Balai Desa" required />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Deskripsi (opsional)</Label>
        <Textarea id="description" name="description" placeholder="Keterangan acara..." />
      </div>
      <ImageUpload name="poster" label="Poster (opsional)" />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Tambah Agenda"}
    </Button>
  );
}
