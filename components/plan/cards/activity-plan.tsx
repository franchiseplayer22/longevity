import { z } from "zod";
import { Footprints, Clock, Flame } from "lucide-react";
import { PatientCard } from "@/components/patient/patient-card";
import { IconBadge } from "@/components/patient/icon-badge";

export const activityPlanPropsSchema = z.object({
  title: z.string(),
  intensity: z.enum(["gentle", "moderate", "challenging"]),
  durationMinutes: z.number().int().positive(),
  steps: z.array(z.string()).min(1).max(8),
});

export type ActivityPlanProps = z.infer<typeof activityPlanPropsSchema>;

const INTENSITY_LABEL = {
  gentle: "Gentle",
  moderate: "Moderate",
  challenging: "Challenging",
} as const;

export function ActivityPlan({ title, intensity, durationMinutes, steps }: ActivityPlanProps) {
  return (
    <PatientCard
      eyebrow="Activity plan"
      title={title}
      action={
        <div className="flex items-center gap-1.5 text-xs text-[color:var(--halo-muted)]">
          <Clock className="h-3 w-3" />
          {durationMinutes} min
        </div>
      }
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--halo-green-soft)] px-2.5 py-1 text-[11px] font-medium text-[color:var(--halo-green)]">
        <Flame className="h-3 w-3" />
        {INTENSITY_LABEL[intensity]}
      </div>
      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2">
            <IconBadge icon={Footprints} tone="green" size="sm" />
            <span className="text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </PatientCard>
  );
}
