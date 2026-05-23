import { z } from "zod";
import { Trophy, Lock, CircleDot, CheckCircle2 } from "lucide-react";
import { PatientCard } from "@/components/patient/patient-card";

export const milestonePropsSchema = z.object({
  title: z.string(),
  targetDate: z.string(),
  description: z.string(),
  status: z.enum(["locked", "in_progress", "done"]),
});

export type MilestoneProps = z.infer<typeof milestonePropsSchema>;

const STATUS_META = {
  locked: { label: "Up next", icon: Lock, tone: "bg-slate-100 text-slate-600" },
  in_progress: {
    label: "In progress",
    icon: CircleDot,
    tone: "bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]",
  },
  done: {
    label: "Achieved",
    icon: CheckCircle2,
    tone: "bg-[#f6ecd6] text-[color:var(--halo-gold)]",
  },
};

export function Milestone({ title, targetDate, description, status }: MilestoneProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <PatientCard tone="cream" eyebrow="Milestone" title={title}>
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-10 w-10 flex-none items-center justify-center rounded-2xl ${meta.tone}`}
        >
          <Trophy className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.tone}`}
            >
              <Icon className="h-3 w-3" />
              {meta.label}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
              Target {targetDate}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
            {description}
          </p>
        </div>
      </div>
    </PatientCard>
  );
}
