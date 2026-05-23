"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { resolveCareReport } from "@/app/actions/recipients";

export function ResolveReportButton({ reportId }: { reportId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await resolveCareReport(reportId);
        })
      }
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--halo-green-soft)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--halo-green)] hover:bg-[color:var(--halo-green)] hover:text-white disabled:opacity-60"
    >
      <Check className="h-3 w-3" />
      {pending ? "Resolving…" : "Resolve"}
    </button>
  );
}
