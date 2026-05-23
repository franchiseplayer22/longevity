import { Stethoscope } from "lucide-react";
import { PatientCard } from "./patient-card";
import { IconBadge } from "./icon-badge";

export function CareTeamCard({
  author,
  role,
  postedAt,
  body,
}: {
  author: string;
  role: string;
  postedAt: string;
  body: string;
}) {
  return (
    <PatientCard eyebrow="Care team update">
      <div className="flex items-start gap-3">
        <IconBadge icon={Stethoscope} tone="green" />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-[color:var(--halo-ink)]">
              {author}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
              {role}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
            {body}
          </p>
          <div className="mt-2 text-[11px] text-[color:var(--halo-muted)]">
            {postedAt}
          </div>
        </div>
      </div>
    </PatientCard>
  );
}
