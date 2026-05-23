import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { roleLabel } from "@/lib/roles";
import { PatientShell } from "@/components/patient/patient-shell";
import { PatientCard } from "@/components/patient/patient-card";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <PatientShell greeting="Profile">
      <PatientCard eyebrow={roleLabel(user.role)} title={user.name}>
        <dl className="divide-y divide-[color:var(--halo-ink)]/5 text-sm">
          <Row label="Email" value={user.email ?? "—"} />
          <Row label="Locale" value={user.locale} />
          <Row label="Joined" value={user.createdAt.toLocaleDateString()} />
        </dl>
      </PatientCard>
    </PatientShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <dt className="text-xs uppercase tracking-wider text-[color:var(--halo-muted)]">
        {label}
      </dt>
      <dd className="text-sm text-[color:var(--halo-ink)]">{value}</dd>
    </div>
  );
}
