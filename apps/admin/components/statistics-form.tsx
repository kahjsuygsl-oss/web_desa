"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { StatItem } from "@desa/lib";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { updateStatisticsAction, type FormState } from "@/app/(dashboard)/statistik/actions";

export function StatisticsForm({ stats }: { stats: StatItem[] }) {
  const [state, formAction] = useActionState<FormState, FormData>(updateStatisticsAction, {});

  useEffect(() => {
    if (state.ok) toast.success("Statistik diperbarui");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.key}>
            <Label htmlFor={s.key}>{s.label}</Label>
            <Input id={s.key} name={s.key} defaultValue={s.value} />
          </div>
        ))}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : "Simpan Statistik"}
    </Button>
  );
}
