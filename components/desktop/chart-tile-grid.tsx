"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  HeartPulse,
  Beaker,
  Pill,
  Droplets,
  ClipboardList,
  GraduationCap,
  Moon,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Image as ImageIcon,
  X,
  type LucideIcon,
} from "lucide-react";
import type { DesktopPatientChartData } from "@/lib/patient-view";
import { ResolveReportButton } from "./resolve-report-button";
import {
  HOMEWORK_KIND_META,
  isHomeworkKind,
  type HomeworkKind,
} from "@/lib/homework";

type TileId =
  | "vitals"
  | "labs"
  | "meds"
  | "io"
  | "reports"
  | "homework"
  | "summary"
  | "handoff";

type TileTone = "green" | "rose" | "gold" | "sky" | "violet" | "slate";

const TONE_BG: Record<TileTone, string> = {
  green: "bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]",
  rose: "bg-rose-50 text-rose-700",
  gold: "bg-[#f6ecd6] text-[color:var(--halo-gold)]",
  sky: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  slate: "bg-slate-100 text-slate-700",
};

const SPRING: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

export function ChartTileGrid({ data }: { data: DesktopPatientChartData }) {
  const [active, setActive] = useState<TileId | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const tiles = buildTiles(data);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tiles.map((tile) => (
          <motion.button
            key={tile.id}
            layoutId={`chart-tile-${tile.id}`}
            onClick={() => setActive(tile.id)}
            transition={SPRING}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex h-44 flex-col items-start gap-3 overflow-hidden rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white p-5 text-left shadow-[0_18px_40px_-32px_rgba(20,36,27,0.4)] transition-colors hover:border-[color:var(--halo-green)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--halo-green)]/50"
          >
            <TileHeader icon={tile.icon} tone={tile.tone} eyebrow={tile.eyebrow} />
            <div className="flex-1">{tile.preview}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--halo-ink)]/35 backdrop-blur-[3px] p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              layoutId={`chart-tile-${active}`}
              transition={SPRING}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[min(90vh,820px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white shadow-[0_60px_120px_-40px_rgba(20,36,27,0.55)]"
            >
              <DetailHeader
                tile={tiles.find((t) => t.id === active)!}
                onClose={() => setActive(null)}
              />
              <div className="flex-1 overflow-y-auto px-7 pb-7 pt-2">
                {tiles.find((t) => t.id === active)?.detail}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TileHeader({
  icon: Icon,
  tone,
  eyebrow,
}: {
  icon: LucideIcon;
  tone: TileTone;
  eyebrow: string;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${TONE_BG[tone]}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
        {eyebrow}
      </span>
    </div>
  );
}

function DetailHeader({
  tile,
  onClose,
}: {
  tile: TileDef;
  onClose: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[color:var(--halo-ink)]/5 px-7 py-5">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${TONE_BG[tile.tone]}`}
        >
          <tile.icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
            {tile.eyebrow}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-[color:var(--halo-ink)]">
            {tile.title}
          </h2>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--halo-muted)] transition hover:bg-[color:var(--halo-cream)]/70 hover:text-[color:var(--halo-ink)]"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </header>
  );
}

type TileDef = {
  id: TileId;
  icon: LucideIcon;
  tone: TileTone;
  eyebrow: string;
  title: string;
  preview: ReactNode;
  detail: ReactNode;
};

function PreviewValue({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div>
      <div className="text-2xl font-semibold leading-tight tracking-tight text-[color:var(--halo-ink)]">
        {primary}
      </div>
      {secondary && (
        <div className="mt-1 text-xs text-[color:var(--halo-muted)]">
          {secondary}
        </div>
      )}
    </div>
  );
}

function buildTiles(data: DesktopPatientChartData): TileDef[] {
  const openReports = data.reports.filter((r) => r.status === "open").length;
  const pendingTasks = data.tasks.filter((t) => !t.completedAt).length;
  const doneTasks = data.tasks.filter((t) => t.completedAt).length;
  const vitalsTime = new Date(data.vitals.capturedAt).toLocaleTimeString(
    undefined,
    { hour: "numeric", minute: "2-digit" },
  );

  return [
    {
      id: "vitals",
      icon: HeartPulse,
      tone: "green",
      eyebrow: `Vitals · ${vitalsTime}`,
      title: "Latest snapshot",
      preview: (
        <PreviewValue
          primary={
            <>
              {data.vitals.bp}
              <span className="ml-1.5 text-sm font-medium text-[color:var(--halo-muted)]">
                mmHg
              </span>
            </>
          }
          secondary={`HR ${data.vitals.hr} · SpO₂ ${data.vitals.spo2}% · Pain ${data.vitals.painScore}/10`}
        />
      ),
      detail: <VitalsDetail data={data} />,
    },
    {
      id: "labs",
      icon: Beaker,
      tone: "violet",
      eyebrow: "Labs",
      title: "Recent values",
      preview: <LabsPreview data={data} />,
      detail: <LabsDetail data={data} />,
    },
    {
      id: "meds",
      icon: Pill,
      tone: "rose",
      eyebrow: "Medications",
      title: "Active orders",
      preview: (
        <PreviewValue
          primary={`${data.meds.filter((m) => !/discontinued/i.test(m.dose)).length} active`}
          secondary={`${data.meds[0].name} · last ${data.meds[0].lastGiven}`}
        />
      ),
      detail: <MedsDetail data={data} />,
    },
    {
      id: "io",
      icon: Droplets,
      tone: "sky",
      eyebrow: "I&O · 24h",
      title: "Fluid balance",
      preview: (
        <PreviewValue
          primary={`${data.io.intake24h.ml - data.io.output24h.ml > 0 ? "+" : ""}${data.io.intake24h.ml - data.io.output24h.ml} ml`}
          secondary={`Intake ${data.io.intake24h.ml} · Output ${data.io.output24h.ml}`}
        />
      ),
      detail: <IODetail data={data} />,
    },
    {
      id: "reports",
      icon: ClipboardList,
      tone: "gold",
      eyebrow: "Reports",
      title: "Recent care reports",
      preview: (
        <PreviewValue
          primary={openReports > 0 ? `${openReports} open` : "All clear"}
          secondary={
            data.reports[0]
              ? `"${data.reports[0].title}"`
              : "No reports posted yet"
          }
        />
      ),
      detail: <ReportsDetail data={data} />,
    },
    {
      id: "homework",
      icon: GraduationCap,
      tone: "gold",
      eyebrow: "Homework",
      title: "Assigned to patient",
      preview: (
        <PreviewValue
          primary={
            data.tasks.length === 0 ? "None yet" : `${pendingTasks} pending`
          }
          secondary={
            data.tasks.length === 0
              ? "Use the gold button to assign"
              : `${doneTasks} completed`
          }
        />
      ),
      detail: <HomeworkDetail data={data} />,
    },
    {
      id: "summary",
      icon: FileText,
      tone: "slate",
      eyebrow: "Summary",
      title: "Clinical narrative",
      preview: (
        <p className="line-clamp-4 text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
          {data.summary}
        </p>
      ),
      detail: <SummaryDetail data={data} />,
    },
    {
      id: "handoff",
      icon: Moon,
      tone: "slate",
      eyebrow: "Tonight",
      title: "Care handoff",
      preview: (
        <PreviewValue
          primary={`${data.handoff.length} items`}
          secondary={data.handoff[0]}
        />
      ),
      detail: <HandoffDetail data={data} />,
    },
  ];
}

function VitalsDetail({ data }: { data: DesktopPatientChartData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Vital label="BP" value={data.vitals.bp} unit="mmHg" />
        <Vital label="HR" value={data.vitals.hr} unit="bpm" />
        <Vital label="Temp" value={data.vitals.temp} unit="°F" />
        <Vital label="SpO₂" value={`${data.vitals.spo2}`} unit="%" />
        <Vital label="RR" value={data.vitals.rr} unit="/min" />
        <Vital label="Pain" value={`${data.vitals.painScore}`} unit="/10" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Trend
          title="BP trend"
          rows={data.trend.bp.map((p) => ({ t: p.t, v: p.v }))}
        />
        <Trend
          title="HR trend"
          rows={data.trend.hr.map((p) => ({ t: p.t, v: `${p.v}` }))}
        />
      </div>
    </div>
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
    <div className="rounded-2xl bg-[color:var(--halo-cream)]/50 px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
        {label}
      </div>
      <div className="mt-0.5 text-2xl font-semibold text-[color:var(--halo-ink)]">
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
    <div className="rounded-2xl border border-[color:var(--halo-ink)]/5 bg-white px-4 py-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
        {title}
      </div>
      <ul className="mt-1.5 flex flex-col gap-1 text-sm">
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

function LabsPreview({ data }: { data: DesktopPatientChartData }) {
  const flagged = data.labs.filter((l) => l.trend !== "stable").slice(0, 2);
  if (flagged.length === 0) {
    return (
      <PreviewValue
        primary="All stable"
        secondary={`${data.labs.length} values · tap to see all`}
      />
    );
  }
  return (
    <div>
      <div className="text-2xl font-semibold leading-tight tracking-tight text-[color:var(--halo-ink)]">
        {flagged[0].name} {flagged[0].value}
        <span className="ml-1 text-sm font-medium text-[color:var(--halo-muted)]">
          {flagged[0].unit}
        </span>
        <TrendArrow trend={flagged[0].trend} className="ml-1 inline h-4 w-4" />
      </div>
      <div className="mt-1 text-xs text-[color:var(--halo-muted)]">
        {flagged.length > 1
          ? `${flagged[1].name} ${flagged[1].value} ${flagged[1].unit}`
          : `${data.labs.length} values total`}
        {" · "}tap to see all
      </div>
    </div>
  );
}

function TrendArrow({
  trend,
  className,
}: {
  trend: "up" | "down" | "stable";
  className?: string;
}) {
  if (trend === "down") return <ArrowDownRight className={`${className} text-rose-600`} />;
  if (trend === "up") return <ArrowUpRight className={`${className} text-amber-600`} />;
  return <ArrowRight className={`${className} text-[color:var(--halo-muted)]`} />;
}

function LabsDetail({ data }: { data: DesktopPatientChartData }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {data.labs.map((lab) => (
        <div
          key={lab.name}
          className="flex items-center justify-between rounded-2xl bg-[color:var(--halo-cream)]/50 px-4 py-3"
        >
          <div>
            <div className="text-sm font-semibold text-[color:var(--halo-ink)]">
              {lab.name}
              <span className="ml-1.5 text-base font-bold">
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
          <TrendArrow trend={lab.trend} className="h-4 w-4" />
        </div>
      ))}
    </div>
  );
}

function MedsDetail({ data }: { data: DesktopPatientChartData }) {
  return (
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
        {data.meds.map((m) => (
          <tr key={m.name} className="border-t border-[color:var(--halo-ink)]/5">
            <td className="py-2.5 pr-3 font-semibold text-[color:var(--halo-ink)]">
              {m.name}
            </td>
            <td className="py-2.5 pr-3 text-[color:var(--halo-ink)]/85">{m.dose}</td>
            <td className="py-2.5 pr-3 text-[color:var(--halo-muted)]">{m.route}</td>
            <td className="py-2.5 pr-3 text-[color:var(--halo-muted)]">{m.lastGiven}</td>
            <td className="py-2.5 text-[color:var(--halo-muted)]">{m.indication}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function IODetail({ data }: { data: DesktopPatientChartData }) {
  const net = data.io.intake24h.ml - data.io.output24h.ml;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-sky-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700">
            Intake
          </span>
          <span className="text-2xl font-semibold text-[color:var(--halo-ink)]">
            {data.io.intake24h.ml} ml
          </span>
        </div>
        <div className="mt-1.5 text-xs text-[color:var(--halo-muted)]">
          {data.io.intake24h.breakdown}
        </div>
      </div>
      <div className="rounded-2xl bg-violet-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-medium text-violet-700">
            Output
          </span>
          <span className="text-2xl font-semibold text-[color:var(--halo-ink)]">
            {data.io.output24h.ml} ml
          </span>
        </div>
        <div className="mt-1.5 text-xs text-[color:var(--halo-muted)]">
          {data.io.output24h.breakdown}
        </div>
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white px-4 py-3">
        <span className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
          Net 24h
        </span>
        <span className="text-2xl font-semibold text-[color:var(--halo-ink)]">
          {net > 0 ? "+" : ""}
          {net} ml
        </span>
      </div>
    </div>
  );
}

function ReportsDetail({ data }: { data: DesktopPatientChartData }) {
  if (data.reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--halo-ink)]/10 px-4 py-8 text-center text-sm text-[color:var(--halo-muted)]">
        No reports yet. Post one from the header to start the record.
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {data.reports.map((r) => (
        <li
          key={r.id}
          className="rounded-2xl border border-[color:var(--halo-ink)]/10 bg-[color:var(--halo-cream)]/40 px-4 py-3"
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
          <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--halo-ink)]/80">
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
  );
}

function HomeworkDetail({ data }: { data: DesktopPatientChartData }) {
  if (data.tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--halo-ink)]/10 px-4 py-8 text-center text-sm text-[color:var(--halo-muted)]">
        No homework assigned yet. Use the gold button in the header to assign one.
      </div>
    );
  }
  const pending = data.tasks.filter((t) => !t.completedAt);
  const done = data.tasks.filter((t) => t.completedAt);
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {[...pending, ...done].map((task) => {
        const kindKey: HomeworkKind = isHomeworkKind(task.kind)
          ? task.kind
          : "other";
        const Icon = HOMEWORK_KIND_META[kindKey].icon;
        const isDone = Boolean(task.completedAt);
        return (
          <div
            key={task.id}
            className={`rounded-2xl border p-4 ${
              isDone
                ? "border-[color:var(--halo-ink)]/5 bg-[color:var(--halo-cream)]/40"
                : "border-[color:var(--halo-gold)]/30 bg-[#fdf6e6]"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[color:var(--halo-gold)]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
                {HOMEWORK_KIND_META[kindKey].label}
              </span>
            </div>
            <div
              className={`mt-2 text-sm font-semibold ${
                isDone
                  ? "text-[color:var(--halo-muted)] line-through"
                  : "text-[color:var(--halo-ink)]"
              }`}
            >
              {task.title}
            </div>
            {task.subtitle && (
              <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--halo-ink)]/75">
                {task.subtitle}
              </p>
            )}
            {isDone && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {task.painScore !== null && task.painScore !== undefined && (
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                    Pain {task.painScore}/10
                  </span>
                )}
                {task.photoUrl && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--halo-green-soft)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--halo-green)]">
                    <ImageIcon className="h-3 w-3" />
                    Photo
                  </span>
                )}
              </div>
            )}
            {isDone && task.note && (
              <blockquote className="mt-2 border-l-2 border-[color:var(--halo-gold)]/60 pl-2 text-[11px] italic leading-relaxed text-[color:var(--halo-ink)]/80">
                &ldquo;{task.note}&rdquo;
              </blockquote>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SummaryDetail({ data }: { data: DesktopPatientChartData }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm leading-relaxed text-[color:var(--halo-ink)]/85">
        {data.summary}
      </p>
      <dl className="grid grid-cols-2 gap-4">
        <KV label="Allergies" value={data.recipient.allergies.join(", ")} />
        <KV label="Code status" value={data.recipient.codeStatus} />
        <KV label="Admitted" value={data.recipient.admittedAt} />
        <KV
          label="Discharge target"
          value={data.recipient.expectedDischarge}
        />
      </dl>
    </div>
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

function HandoffDetail({ data }: { data: DesktopPatientChartData }) {
  return (
    <ul className="flex flex-col gap-3">
      {data.handoff.map((h, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-2xl border border-[color:var(--halo-ink)]/5 bg-[color:var(--halo-cream)]/40 px-4 py-3 text-sm leading-relaxed text-[color:var(--halo-ink)]/85"
        >
          <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-[color:var(--halo-gold)]" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  );
}
