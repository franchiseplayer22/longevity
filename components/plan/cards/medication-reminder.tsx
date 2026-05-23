import { z } from "zod";
import { Pill, Bell } from "lucide-react";
import { PatientCard } from "@/components/patient/patient-card";
import { IconBadge } from "@/components/patient/icon-badge";

export const medicationReminderPropsSchema = z.object({
  medication: z.string(),
  dose: z.string(),
  nextDoseAt: z.string(),
  reason: z.string(),
  cautions: z.array(z.string()).max(4).optional(),
});

export type MedicationReminderProps = z.infer<typeof medicationReminderPropsSchema>;

export function MedicationReminder({
  medication,
  dose,
  nextDoseAt,
  reason,
  cautions,
}: MedicationReminderProps) {
  return (
    <PatientCard eyebrow="Medication" title={medication}>
      <div className="flex items-center gap-3">
        <IconBadge icon={Pill} tone="rose" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-[color:var(--halo-ink)]">{dose}</div>
          <div className="text-xs text-[color:var(--halo-muted)]">{reason}</div>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-gold)]">
            <Bell className="h-3 w-3" /> Next
          </div>
          <div className="text-sm font-semibold text-[color:var(--halo-ink)]">
            {nextDoseAt}
          </div>
        </div>
      </div>
      {cautions && cautions.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 text-xs leading-relaxed text-[color:var(--halo-ink)]/75">
          {cautions.map((c, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-rose-500" />
              {c}
            </li>
          ))}
        </ul>
      )}
    </PatientCard>
  );
}
