import {
  AlertTriangle,
  HeartPulse,
  Activity,
  Beaker,
  Pill,
  Droplets,
  Phone,
  ClipboardList,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import type { DesktopPatientChartData } from "@/lib/patient-view";
import { PostReportForm } from "./post-report-form";
import { ResolveReportButton } from "./resolve-report-button";
import { AssignHomeworkForm } from "./assign-homework-form";
import { HomeworkPanel } from "./homework-panel";

export function DesktopPatientChart({
  data,
}: {
  data: DesktopPatientChartData;
}) {
  const { recipient } = data;
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-8 py-8">
      <HeaderStrip data={data} />
      <CareTeamStrip careTeam={data.careTeam} />
      <HomeworkPanel tasks={data.tasks} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <SummaryCard
          className="xl:col-span-5"
          summary={data.summary}
          recipient={recipient}
        />
        <ReportsCard
          className="xl:col-span-4"
          recipientId={data.recipientId}
          reports={data.reports}
        />
        <HandoffCard className="xl:col-span-3" handoff={data.handoff} />
        <VitalsCard className="xl:col-span-6" vitals={data.vitals} trend={data.trend} />
        <LabsCard className="xl:col-span-6" labs={data.labs} />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <MedsCard className="xl:col-span-8" meds={data.meds} />
        <IOCard className="xl:col-span-4" io={data.io} />
      </div>
    </div>
  );
}

function Card({
  className = "",
  eyebrow,
  title,
  icon: Icon,
  action,
  children,
}: {
  className?: string;
  eyebrow?: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(20,36,27,0.4)] ${className}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <div>
            {eyebrow && (
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
                {eyebrow}
              </div>
            )}
            <h2 className="text-base font-semibold tracking-tight text-[color:var(--halo-ink)]">
              {title}
            </h2>
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
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
          <p className="mt-2 text-sm text-[color:var(--halo-ink)]">
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

function SummaryCard({
  className,
  summary,
  recipient,
}: {
  className?: string;
  summary: string;
  recipient: DesktopPatientChartData["recipient"];
}) {
  return (
    <Card className={className} eyebrow="Summary" title="Clinical narrative" icon={ClipboardList}>
      <p className="text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
        {summary}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <KV label="Allergies" value={recipient.allergies.join(", ")} />
        <KV label="Code status" value={recipient.codeStatus} />
        <KV label="Admitted" value={recipient.admittedAt} />
        <KV label="Discharge target" value={recipient.expectedDischarge} />
      </dl>
    </Card>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-[color:var(--halo-ink)]">{value}</dd>
    </div>
  );
}

function ReportsCard({
  className,
  recipientId,
  reports,
}: {
  className?: string;
  recipientId: string;
  reports: DesktopPatientChartData["reports"];
}) {
  return (
    <Card
      className={className}
      eyebrow="Reports"
      title="Recent care reports"
      icon={ClipboardList}
    >
      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--halo-ink)]/10 px-4 py-6 text-center text-sm text-[color:var(--halo-muted)]">
          No reports yet. Post one to start the record.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {reports.slice(0, 5).map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-[color:var(--halo-ink)]/10 bg-[color:var(--halo-cream)]/40 px-3 py-3"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-[color:var(--halo-ink)]">
                  {r.title}
                </span>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wider ${
                    r.status === "resolved"
                      ? "text-[color:var(--halo-muted)]"
                      : "text-[color:var(--halo-gold)]"
                  }`}
                >
                  {r.kind} · {r.status}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--halo-ink)]/80">
                {r.body}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--halo-muted)]">
                <span>
                  {r.author.name} · {r.createdAt.toLocaleString()}
                </span>
                {r.status === "open" && <ResolveReportButton reportId={r.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function HandoffCard({
  className,
  handoff,
}: {
  className?: string;
  handoff: DesktopPatientChartData["handoff"];
}) {
  return (
    <Card className={className} eyebrow="Tonight" title="Care handoff" icon={ClipboardList}>
      <ul className="flex flex-col gap-2 text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
        {handoff.map((h, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--halo-gold)]" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function VitalsCard({
  className,
  vitals,
  trend,
}: {
  className?: string;
  vitals: DesktopPatientChartData["vitals"];
  trend: DesktopPatientChartData["trend"];
}) {
  return (
    <Card
      className={className}
      eyebrow="Vitals"
      title={`Snapshot · ${new Date(vitals.capturedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`}
      icon={HeartPulse}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Vital label="BP" value={vitals.bp} unit="mmHg" />
        <Vital label="HR" value={vitals.hr} unit="bpm" />
        <Vital label="Temp" value={vitals.temp} unit="°F" />
        <Vital label="SpO₂" value={`${vitals.spo2}`} unit="%" />
        <Vital label="RR" value={vitals.rr} unit="/min" />
        <Vital label="Pain" value={`${vitals.painScore}`} unit="/10" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Trend title="BP trend" rows={trend.bp.map((p) => ({ t: p.t, v: p.v }))} />
        <Trend title="HR trend" rows={trend.hr.map((p) => ({ t: p.t, v: `${p.v}` }))} />
      </div>
    </Card>
  );
}

function Vital({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="rounded-2xl bg-[color:var(--halo-cream)]/50 px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
        {label}
      </div>
      <div className="text-lg font-semibold text-[color:var(--halo-ink)]">
        {value}
        <span className="ml-1 text-xs font-medium text-[color:var(--halo-muted)]">
          {unit}
        </span>
      </div>
    </div>
  );
}

function Trend({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ t: string; v: string }>;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--halo-ink)]/5 bg-white px-3 py-2">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
        {title}
      </div>
      <ul className="mt-1 flex flex-col gap-0.5 text-sm">
        {rows.map((r) => (
          <li key={r.t} className="flex items-center justify-between">
            <span className="text-[color:var(--halo-muted)]">{r.t}</span>
            <span className="font-medium text-[color:var(--halo-ink)]">{r.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LabsCard({
  className,
  labs,
}: {
  className?: string;
  labs: DesktopPatientChartData["labs"];
}) {
  return (
    <Card className={className} eyebrow="Labs" title="Recent values" icon={Beaker}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {labs.map((lab) => {
          const TrendIcon =
            lab.trend === "down"
              ? ArrowDownRight
              : lab.trend === "up"
                ? ArrowUpRight
                : ArrowRight;
          return (
            <div
              key={lab.name}
              className="flex items-center justify-between rounded-2xl bg-[color:var(--halo-cream)]/50 px-3 py-2.5"
            >
              <div>
                <div className="text-sm font-semibold text-[color:var(--halo-ink)]">
                  {lab.name}{" "}
                  <span className="ml-1 text-base font-bold">
                    {lab.value}
                    <span className="ml-0.5 text-xs font-medium text-[color:var(--halo-muted)]">
                      {lab.unit}
                    </span>
                  </span>
                </div>
                <div className="text-[11px] text-[color:var(--halo-muted)]">
                  ref {lab.ref}
                </div>
              </div>
              <TrendIcon
                className={`h-4 w-4 ${
                  lab.trend === "down"
                    ? "text-rose-600"
                    : lab.trend === "up"
                      ? "text-amber-600"
                      : "text-[color:var(--halo-muted)]"
                }`}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MedsCard({
  className,
  meds,
}: {
  className?: string;
  meds: DesktopPatientChartData["meds"];
}) {
  return (
    <Card className={className} eyebrow="Medications" title="Active orders" icon={Pill}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
              <th className="py-2 pr-3 font-medium">Drug</th>
              <th className="py-2 pr-3 font-medium">Dose</th>
              <th className="py-2 pr-3 font-medium">Route</th>
              <th className="py-2 pr-3 font-medium">Last given</th>
              <th className="py-2 font-medium">Indication</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((m) => (
              <tr
                key={m.name}
                className="border-t border-[color:var(--halo-ink)]/5"
              >
                <td className="py-2 pr-3 font-semibold text-[color:var(--halo-ink)]">
                  {m.name}
                </td>
                <td className="py-2 pr-3 text-[color:var(--halo-ink)]/85">{m.dose}</td>
                <td className="py-2 pr-3 text-[color:var(--halo-muted)]">{m.route}</td>
                <td className="py-2 pr-3 text-[color:var(--halo-muted)]">{m.lastGiven}</td>
                <td className="py-2 text-[color:var(--halo-muted)]">{m.indication}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function IOCard({
  className,
  io,
}: {
  className?: string;
  io: DesktopPatientChartData["io"];
}) {
  const net = io.intake24h.ml - io.output24h.ml;
  return (
    <Card className={className} eyebrow="I&O" title="Last 24 hours" icon={Droplets}>
      <div className="flex flex-col gap-3">
        <Row label="Intake" amount={`${io.intake24h.ml} ml`} sub={io.intake24h.breakdown} tone="sky" />
        <Row label="Output" amount={`${io.output24h.ml} ml`} sub={io.output24h.breakdown} tone="violet" />
        <div className="mt-1 flex items-center justify-between rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2.5">
          <span className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
            Net
          </span>
          <span className="text-base font-semibold text-[color:var(--halo-ink)]">
            {net > 0 ? "+" : ""}
            {net} ml
          </span>
        </div>
      </div>
    </Card>
  );
}

function Row({
  label,
  amount,
  sub,
  tone,
}: {
  label: string;
  amount: string;
  sub: string;
  tone: "sky" | "violet";
}) {
  const cls =
    tone === "sky"
      ? "bg-sky-50 text-sky-700"
      : "bg-violet-50 text-violet-700";
  return (
    <div className="rounded-2xl bg-[color:var(--halo-cream)]/50 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>
          {label}
        </span>
        <span className="text-base font-semibold text-[color:var(--halo-ink)]">{amount}</span>
      </div>
      <div className="mt-1 text-[11px] text-[color:var(--halo-muted)]">{sub}</div>
    </div>
  );
}
