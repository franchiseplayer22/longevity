import { Activity, Heart, Moon } from "lucide-react";
import { PatientCard } from "./patient-card";
import { IconBadge } from "./icon-badge";

export function WearableCard({
  steps,
  stepsGoal,
  restingHeartRate,
  sleepHours,
}: {
  steps: number;
  stepsGoal: number;
  restingHeartRate: number;
  sleepHours: number;
}) {
  const pct = Math.min(100, Math.round((steps / stepsGoal) * 100));
  return (
    <PatientCard eyebrow="Wearable" title="Snapshot from your watch">
      <div className="grid grid-cols-3 gap-3">
        <Stat
          icon={Activity}
          tone="green"
          value={steps.toLocaleString()}
          label="Steps"
          hint={`${pct}% of goal`}
        />
        <Stat
          icon={Heart}
          tone="rose"
          value={`${restingHeartRate}`}
          label="Resting"
          hint="bpm"
        />
        <Stat
          icon={Moon}
          tone="violet"
          value={sleepHours.toFixed(1)}
          label="Sleep"
          hint="hours"
        />
      </div>
    </PatientCard>
  );
}

function Stat({
  icon,
  tone,
  value,
  label,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "green" | "rose" | "violet";
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl bg-[color:var(--halo-cream)]/60 px-3 py-3">
      <IconBadge icon={icon as never} tone={tone} size="sm" />
      <div>
        <div className="text-lg font-semibold leading-none text-[color:var(--halo-ink)]">
          {value}
        </div>
        <div className="mt-1 text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
          {label}
        </div>
        <div className="text-[11px] text-[color:var(--halo-muted)]">{hint}</div>
      </div>
    </div>
  );
}
