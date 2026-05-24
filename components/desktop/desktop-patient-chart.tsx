import { AlertTriangle, Phone } from "lucide-react";
import type { DesktopPatientChartData } from "@/lib/patient-view";
import { PostReportForm } from "./post-report-form";
import { AssignHomeworkForm } from "./assign-homework-form";
import { ChartTileGrid } from "./chart-tile-grid";

export function DesktopPatientChart({
  data,
}: {
  data: DesktopPatientChartData;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-8 py-6">
      <HeaderStrip data={data} />
      <CareTeamStrip careTeam={data.careTeam} />
      <ChartTileGrid data={data} />
    </div>
  );
}

function HeaderStrip({ data }: { data: DesktopPatientChartData }) {
  const { recipient } = data;
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--halo-green-soft)] text-lg font-semibold text-[color:var(--halo-green)]">
          {recipient.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--halo-ink)]">
            {recipient.name}
          </h1>
          <p className="mt-0.5 text-sm text-[color:var(--halo-muted)]">
            {recipient.age} · {recipient.pronouns} · MRN {recipient.mrn}
          </p>
          <p className="mt-1.5 text-sm text-[color:var(--halo-ink)]">
            {recipient.procedure} · POD {recipient.postopDay} · {recipient.surgeon}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="rose" icon={AlertTriangle}>
          {recipient.allergies.join(" · ")}
        </Chip>
        <Chip tone="slate">{recipient.codeStatus}</Chip>
        <Chip tone="green">
          Admit {recipient.admittedAt} → discharge {recipient.expectedDischarge}
        </Chip>
        <AssignHomeworkForm recipientId={data.recipientId} />
        <PostReportForm recipientId={data.recipientId} />
      </div>
    </div>
  );
}

function Chip({
  children,
  tone,
  icon: Icon,
}: {
  children: React.ReactNode;
  tone: "rose" | "slate" | "green";
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const cls = {
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
    green: "bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

function CareTeamStrip({
  careTeam,
}: {
  careTeam: DesktopPatientChartData["careTeam"];
}) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white px-5 py-3">
      <span className="flex-none text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
        Care team
      </span>
      <div className="flex flex-1 items-center gap-2 overflow-x-auto">
        {careTeam.map((m) => (
          <span
            key={m.name}
            className="inline-flex flex-none items-center gap-2 rounded-full bg-[color:var(--halo-cream)]/70 px-3 py-1.5 text-xs text-[color:var(--halo-ink)]"
          >
            <span className="font-semibold">{m.name}</span>
            <span className="text-[color:var(--halo-muted)]">· {m.role}</span>
            <Phone className="h-3 w-3 text-[color:var(--halo-muted)]" />
            <span className="text-[color:var(--halo-muted)]">{m.phone}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
