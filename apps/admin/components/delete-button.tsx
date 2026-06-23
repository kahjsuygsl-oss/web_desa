"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

/** Tombol hapus generik dengan konfirmasi. Memanggil server action `action(id)`. */
export function DeleteButton({
  id,
  action,
  label = "Hapus item ini?",
}: {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
}) {
  const [pending, start] = useTransition();

  function handle() {
    if (!window.confirm(label)) return;
    start(async () => {
      await action(id);
      toast.success("Berhasil dihapus");
    });
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="grid h-8 w-8 place-items-center rounded text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
      title="Hapus"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
