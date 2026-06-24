"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Menghitung naik dari 0 ke angka tujuan saat elemen terlihat.
 * Mempertahankan bagian non-angka (mis. "1.234 jiwa", "± 5 km²").
 */
export function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pisahkan angka pertama dari teks pembungkusnya.
    const match = value.match(/[\d.,]+/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const raw = match[0];
    const target = Number(raw.replace(/[.,]/g, ""));
    if (!Number.isFinite(target) || target === 0) {
      setDisplay(value);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + raw.length);
    // Gunakan pemisah ribuan ala Indonesia jika angka asli memakainya.
    const grouped = /[.,]/.test(raw);
    const fmt = (n: number) =>
      `${prefix}${grouped ? n.toLocaleString("id-ID") : String(n)}${suffix}`;

    if (reduce) {
      setDisplay(fmt(target));
      return;
    }

    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const duration = 1400;
      let startTime: number | null = null;
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const p = Math.min((now - startTime) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(fmt(Math.round(target * eased)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    setDisplay(fmt(0));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl font-extrabold text-primary md:text-4xl">
      {display}
    </div>
  );
}
