"use client";

import { useEffect, useState } from "react";
import { LANDING_LOCALES } from "@/lib/locales";

const INTERVAL_MS = 3200;

export function LandingRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % LANDING_LOCALES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const current = LANDING_LOCALES[index];

  return (
    <div className="flex flex-col gap-5">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--halo-green)]/20 bg-[color:var(--halo-green-soft)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--halo-green)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--halo-green)]" />
        {current.code}
      </span>
      <h1
        key={`h-${index}`}
        className="halo-fade-up text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--halo-ink)] sm:text-5xl lg:text-6xl"
        lang={current.code}
        dir={current.code.startsWith("ar") ? "rtl" : "ltr"}
      >
        {current.headline}
      </h1>
      <p
        key={`s-${index}`}
        className="halo-fade-up max-w-md text-base leading-relaxed text-[color:var(--halo-muted)] sm:text-lg"
        lang={current.code}
        dir={current.code.startsWith("ar") ? "rtl" : "ltr"}
      >
        {current.subhead}
      </p>
    </div>
  );
}
