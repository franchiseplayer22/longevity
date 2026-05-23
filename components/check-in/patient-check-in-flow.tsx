"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Check,
  CheckCircle2,
  Footprints,
  Frown,
  Laugh,
  Meh,
  Pill,
  Smile,
  Angry,
  Send,
  X,
  ArrowLeft,
} from "lucide-react";

type Step = "incision" | "daily" | "feeling" | "review";

const STEPS: Step[] = ["incision", "daily", "feeling", "review"];

const STEP_LABELS: Record<Step, string> = {
  incision: "Incision photo",
  daily: "Daily check-in",
  feeling: "How you feel",
  review: "Review",
};

type Walked = "yes" | "partial" | "no";
type Yn = "yes" | "no";
type Mood = 1 | 2 | 3 | 4 | 5;

type CheckInState = {
  photoCaptured: boolean;
  walked: Walked | null;
  medsTaken: Yn | null;
  painScore: number;
  sleepHours: number;
  mood: Mood | null;
  notes: string;
};

const INITIAL: CheckInState = {
  photoCaptured: false,
  walked: null,
  medsTaken: null,
  painScore: 2,
  sleepHours: 7,
  mood: null,
  notes: "",
};

export function PatientCheckInFlow({ taskId }: { taskId?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("incision");
  const [state, setState] = useState<CheckInState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const canAdvance = useMemo(() => {
    if (step === "incision") return state.photoCaptured;
    if (step === "daily")
      return state.walked !== null && state.medsTaken !== null;
    if (step === "feeling") return state.mood !== null;
    return true;
  }, [step, state]);

  const set = <K extends keyof CheckInState>(k: K, v: CheckInState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const goBack = () => {
    if (isFirst) router.push("/dashboard");
    else setStep(STEPS[stepIndex - 1]);
  };

  const goNext = () => {
    if (!canAdvance) return;
    if (!isLast) {
      setStep(STEPS[stepIndex + 1]);
      return;
    }
    setSubmitting(true);
    // Phase 4 is client-only; submission stub.
    window.setTimeout(() => router.push("/dashboard"), 350);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-32 pt-6">
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[color:var(--halo-muted)] shadow-sm hover:text-[color:var(--halo-ink)]"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
          Step {stepIndex + 1} of {STEPS.length}
        </span>
      </header>

      <ProgressDots step={step} />

      <div className="mt-2 mb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--halo-ink)]">
          {STEP_LABELS[step]}
        </h1>
        {taskId && step === "incision" && (
          <p className="mt-1 text-xs text-[color:var(--halo-muted)]">
            Linked to today's task · {taskId}
          </p>
        )}
      </div>

      <div className="flex-1">
        {step === "incision" && (
          <IncisionStep
            captured={state.photoCaptured}
            onCapture={() => set("photoCaptured", true)}
            onClear={() => set("photoCaptured", false)}
          />
        )}
        {step === "daily" && (
          <DailyStep
            walked={state.walked}
            meds={state.medsTaken}
            pain={state.painScore}
            sleep={state.sleepHours}
            onWalk={(v) => set("walked", v)}
            onMeds={(v) => set("medsTaken", v)}
            onPain={(v) => set("painScore", v)}
            onSleep={(v) => set("sleepHours", v)}
          />
        )}
        {step === "feeling" && (
          <FeelingStep
            mood={state.mood}
            notes={state.notes}
            onMood={(v) => set("mood", v)}
            onNotes={(v) => set("notes", v)}
          />
        )}
        {step === "review" && <ReviewStep state={state} />}
      </div>

      <Footer
        canAdvance={canAdvance}
        isFirst={isFirst}
        isLast={isLast}
        submitting={submitting}
        onBack={goBack}
        onNext={goNext}
      />
    </div>
  );
}

function ProgressDots({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step);
  return (
    <div className="mt-4 flex items-center gap-1.5">
      {STEPS.map((s, i) => (
        <span
          key={s}
          className={`h-1.5 flex-1 rounded-full transition ${
            i <= idx
              ? "bg-[color:var(--halo-green)]"
              : "bg-[color:var(--halo-ink)]/10"
          }`}
        />
      ))}
    </div>
  );
}

function IncisionStep({
  captured,
  onCapture,
  onClear,
}: {
  captured: boolean;
  onCapture: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[color:var(--halo-muted)]">
        Snap a clear photo of your incision in good light. Your care team
        compares it against yesterday's image.
      </p>
      {captured ? (
        <div className="overflow-hidden rounded-3xl border border-[color:var(--halo-green)]/30">
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-[color:var(--halo-green-soft)] to-[#dceadd]">
            <CheckCircle2 className="h-14 w-14 text-[color:var(--halo-green)]" />
          </div>
          <div className="flex items-center justify-between bg-white px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-[color:var(--halo-ink)]">
                Photo captured
              </div>
              <div className="text-xs text-[color:var(--halo-muted)]">
                Encrypted on-device · shared with Dr. Lee
              </div>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-[color:var(--halo-muted)] underline-offset-2 hover:underline"
            >
              Retake
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onCapture}
          className="group flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[color:var(--halo-ink)]/15 bg-white text-[color:var(--halo-muted)] transition hover:border-[color:var(--halo-green)] hover:text-[color:var(--halo-green)]"
        >
          <Camera className="h-10 w-10" />
          <span className="text-sm font-semibold">Tap to capture</span>
          <span className="px-6 text-center text-xs">
            Photo stays on this device until you submit.
          </span>
        </button>
      )}
    </div>
  );
}

function DailyStep({
  walked,
  meds,
  pain,
  sleep,
  onWalk,
  onMeds,
  onPain,
  onSleep,
}: {
  walked: Walked | null;
  meds: Yn | null;
  pain: number;
  sleep: number;
  onWalk: (v: Walked) => void;
  onMeds: (v: Yn) => void;
  onPain: (v: number) => void;
  onSleep: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <FieldGroup
        icon={<Footprints className="h-4 w-4" />}
        title="Did you take your walk?"
      >
        <Segmented<Walked>
          value={walked}
          onChange={onWalk}
          options={[
            { value: "yes", label: "Yes" },
            { value: "partial", label: "Partial" },
            { value: "no", label: "Skipped" },
          ]}
        />
      </FieldGroup>

      <FieldGroup
        icon={<Pill className="h-4 w-4" />}
        title="Meds taken today?"
      >
        <Segmented<Yn>
          value={meds}
          onChange={onMeds}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "Not yet" },
          ]}
        />
      </FieldGroup>

      <FieldGroup title="Pain right now (0–10)">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={pain}
            onChange={(e) => onPain(Number(e.target.value))}
            className="h-2 flex-1 accent-[color:var(--halo-green)]"
          />
          <span className="w-10 text-right text-lg font-semibold text-[color:var(--halo-ink)]">
            {pain}
          </span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-[color:var(--halo-muted)]">
          <span>No pain</span>
          <span>Worst</span>
        </div>
      </FieldGroup>

      <FieldGroup title="Sleep last night (hours)">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSleep(Math.max(0, sleep - 0.5))}
            className="h-10 w-10 rounded-xl border border-[color:var(--halo-ink)]/10 bg-white text-lg"
          >
            −
          </button>
          <div className="flex-1 rounded-xl border border-[color:var(--halo-ink)]/10 bg-white py-2 text-center text-lg font-semibold text-[color:var(--halo-ink)]">
            {sleep.toFixed(1)} h
          </div>
          <button
            type="button"
            onClick={() => onSleep(Math.min(14, sleep + 0.5))}
            className="h-10 w-10 rounded-xl border border-[color:var(--halo-ink)]/10 bg-white text-lg"
          >
            +
          </button>
        </div>
      </FieldGroup>
    </div>
  );
}

function FieldGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[color:var(--halo-ink)]">
        {icon && (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]">
            {icon}
          </span>
        )}
        {title}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-2"
      style={{ ["--cols" as never]: options.length }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-[color:var(--halo-green)] text-white"
                : "bg-[color:var(--halo-cream)]/70 text-[color:var(--halo-ink)] hover:bg-[color:var(--halo-green-soft)]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const MOOD_OPTIONS: Array<{
  value: Mood;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: 1, label: "Rough", icon: Angry },
  { value: 2, label: "Low", icon: Frown },
  { value: 3, label: "OK", icon: Meh },
  { value: 4, label: "Good", icon: Smile },
  { value: 5, label: "Great", icon: Laugh },
];

function FeelingStep({
  mood,
  notes,
  onMood,
  onNotes,
}: {
  mood: Mood | null;
  notes: string;
  onMood: (v: Mood) => void;
  onNotes: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <FieldGroup title="How are you feeling overall?">
        <div className="grid grid-cols-5 gap-2">
          {MOOD_OPTIONS.map(({ value, label, icon: Icon }) => {
            const active = mood === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onMood(value)}
                className={`flex flex-col items-center gap-1 rounded-xl px-1 py-3 text-[11px] font-medium transition ${
                  active
                    ? "bg-[color:var(--halo-green)] text-white"
                    : "bg-[color:var(--halo-cream)]/70 text-[color:var(--halo-ink)] hover:bg-[color:var(--halo-green-soft)]"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </FieldGroup>

      <FieldGroup title="Anything else for your care team?">
        <textarea
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          rows={5}
          placeholder="Optional — tender at incision, slept poorly, family visiting…"
          className="w-full resize-none rounded-xl border border-[color:var(--halo-ink)]/10 bg-white p-3 text-sm leading-relaxed placeholder:text-[color:var(--halo-muted)]/70 focus:border-[color:var(--halo-green)] focus:outline-none"
        />
      </FieldGroup>
    </div>
  );
}

function ReviewStep({ state }: { state: CheckInState }) {
  const moodLabel = MOOD_OPTIONS.find((m) => m.value === state.mood)?.label;
  return (
    <div className="rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white p-4">
      <ReviewRow label="Incision photo">
        {state.photoCaptured ? "Captured" : "—"}
      </ReviewRow>
      <ReviewRow label="Walk">
        {state.walked ? cap(state.walked) : "—"}
      </ReviewRow>
      <ReviewRow label="Meds">
        {state.medsTaken ? cap(state.medsTaken) : "—"}
      </ReviewRow>
      <ReviewRow label="Pain">{state.painScore} / 10</ReviewRow>
      <ReviewRow label="Sleep">{state.sleepHours.toFixed(1)} h</ReviewRow>
      <ReviewRow label="Mood">{moodLabel ?? "—"}</ReviewRow>
      {state.notes && (
        <ReviewRow label="Notes">
          <span className="block text-right text-[color:var(--halo-muted)]">
            “{state.notes}”
          </span>
        </ReviewRow>
      )}
    </div>
  );
}

function ReviewRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[color:var(--halo-ink)]/5 py-2.5 last:border-b-0">
      <span className="text-xs uppercase tracking-wider text-[color:var(--halo-muted)]">
        {label}
      </span>
      <span className="text-sm font-medium text-[color:var(--halo-ink)]">
        {children}
      </span>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Footer({
  canAdvance,
  isFirst,
  isLast,
  submitting,
  onBack,
  onNext,
}: {
  canAdvance: boolean;
  isFirst: boolean;
  isLast: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--halo-ink)]/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-5 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white px-4 py-3 text-sm font-medium text-[color:var(--halo-ink)] hover:bg-[color:var(--halo-cream)]/70"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFirst ? "Cancel" : "Back"}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || submitting}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[color:var(--halo-green)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(31,111,74,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLast ? (
            <>
              <Send className="h-4 w-4" />
              {submitting ? "Sending…" : "Submit"}
            </>
          ) : (
            <>
              Next
              <Check className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
