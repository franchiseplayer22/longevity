import { PatientShell } from "@/components/patient/patient-shell";
import { PatientCard } from "@/components/patient/patient-card";

export default function ProgressPage() {
  return (
    <PatientShell greeting="Progress" subhead="Trends across your recovery.">
      <PatientCard eyebrow="Coming soon" title="Trends + milestones">
        <p className="text-sm text-[color:var(--halo-muted)]">
          We'll plot steps, sleep, and pain scores here as data accumulates.
        </p>
      </PatientCard>
    </PatientShell>
  );
}
