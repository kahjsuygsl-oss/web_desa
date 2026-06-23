"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { SettingsMap } from "@desa/lib";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettingsAction, type FormState } from "@/app/(dashboard)/pengaturan/actions";

export function SettingsForm({ settings }: { settings: SettingsMap }) {
  const [state, formAction] = useActionState<FormState, FormData>(updateSettingsAction, {});

  useEffect(() => {
    if (state.ok) toast.success("Pengaturan disimpan");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identitas Desa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="namaDesa" label="Nama Desa" value={settings.namaDesa} />
            <Field name="slogan" label="Slogan" value={settings.slogan} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profil Desa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Area name="sambutan" label="Sambutan Kepala Desa" value={settings.sambutan} />
          <Area name="sejarah" label="Sejarah Desa" value={settings.sejarah} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Area name="visi" label="Visi" value={settings.visi} />
            <Area
              name="misi"
              label="Misi (pisahkan dengan ; atau baris baru)"
              value={settings.misi}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field name="alamat" label="Alamat" value={settings.alamat} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="telepon" label="Telepon" value={settings.telepon} />
            <Field name="email" label="Email" value={settings.email} />
            <Field name="jamOperasional" label="Jam Operasional" value={settings.jamOperasional} />
            <Field name="whatsapp" label="WhatsApp (cth 628123...)" value={settings.whatsapp} />
          </div>
          <Field
            name="mapsEmbed"
            label="URL Embed Google Maps (src dari iframe)"
            value={settings.mapsEmbed}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({ name, label, value }: { name: string; label: string; value?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={value ?? ""} />
    </div>
  );
}

function Area({ name, label, value }: { name: string; label: string; value?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={value ?? ""} rows={4} />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan Pengaturan"}
    </Button>
  );
}
