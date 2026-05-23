import { PatientShell } from "@/components/patient/patient-shell";
import { PatientCard } from "@/components/patient/patient-card";

export default function MessagesPage() {
  return (
    <PatientShell greeting="Messages" subhead="Your care circle, in one inbox.">
      <PatientCard eyebrow="Coming soon" title="Direct messages">
        <p className="text-sm text-[color:var(--halo-muted)]">
          Threads with your surgeon, nurse, and family land here in a later
          phase.
        </p>
      </PatientCard>
    </PatientShell>
  );
}
