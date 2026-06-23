"use client";

import { useEffect } from "react";

/** Increment view counter sekali per render halaman (fire-and-forget). */
export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    const key = `viewed_${id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/views/${id}`, { method: "POST" }).catch(() => {});
  }, [id]);

  return null;
}
