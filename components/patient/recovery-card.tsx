import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PatientCard } from "./patient-card";
import { ProgressRing } from "./progress-ring";

export function RecoveryCard({
  procedure,
  day,
  totalDays,
  surgeon,
}: {
  procedure: string;
  day: number;
  totalDays: number;
  surgeon: string;
}) {
  const pct = day / totalDays;
  return (
    <PatientCard tone="green">
      <div className="flex items-center gap-5">
        <ProgressRing
          value={pct}
          size={104}
          stroke={10}
          label={`${day}`}
          sublabel={`of ${totalDays}`}
        />
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
            Recovery
          </div>
          <h2 className="text-lg font-semibold leading-tight tracking-tight">
            {procedure}
          </h2>
          <p className="mt-1 text-sm text-white/80">
            Day {day} of {totalDays} · under {surgeon}
          </p>
        </div>
      </div>
      <Link
        href="/check-in"
        className="mt-5 inline-flex w-full items-center justify-between rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 active:translate-y-px"
      >
        <span>Start today's check-in</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </PatientCard>
  );
}
