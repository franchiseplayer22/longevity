import {
  Sparkles,
  AlertTriangle,
  Salad,
  Lightbulb,
  Pill,
  Stethoscope,
} from "lucide-react";
import type {
  AugurFlag,
  AugurResponse,
} from "@/lib/augur-types";
import { PatientCard } from "@/components/patient/patient-card";

const TIER_TONE: Record<
  AugurResponse["tier"]["label"],
  { label: string; cls: string }
> = {
  population: {
    label: "Population prior",
    cls: "bg-slate-100 text-slate-700",
  },
  blended: {
    label: "Blended signal",
    cls: "bg-[#f6ecd6] text-[color:var(--halo-gold)]",
  },
  personal: {
    label: "Personal signal",
    cls: "bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]",
  },
};

const FLAG_TONE: Record<AugurFlag["level"], string> = {
  warning: "bg-rose-50 text-rose-700",
  caution: "bg-amber-50 text-amber-700",
  info: "bg-sky-50 text-sky-700",
};

export function AugurInsightCard({ data }: { data: AugurResponse }) {
  const tierTone = TIER_TONE[data.tier.label];
  const recognized = data.foodsParsed.filter((f) => f.recognized);
  const topPredictions = data.predictions.slice(0, 3);
  const topFlags = data.nutritionFlags.slice(0, 3);
  const allergy = data.allergyWarnings.slice(0, 2);
  const tier1 = data.recommendations.tier1_lifestyle_suggestions?.slice(0, 2) ?? [];
  const swaps = data.recommendations.tier2_food_substitutions?.slice(0, 2) ?? [];
  const supplements = data.recommendations.tier3_otc_supplement_considerations?.slice(0, 2) ?? [];
  const escalations = data.recommendations.tier4_physician_escalation_flags ?? [];

  return (
    <PatientCard
      eyebrow="Augur insight"
      title="Food → symptom analysis"
      action={
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${tierTone.cls}`}
        >
          <Sparkles className="h-3 w-3" />
          {tierTone.label}
        </span>
      }
    >
      {/* Foods chips */}
      {recognized.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {recognized.map((f, i) => (
            <span
              key={`${f.raw}-${i}`}
              className="inline-flex items-center rounded-full bg-[color:var(--halo-cream)]/70 px-2 py-0.5 text-[11px] font-medium text-[color:var(--halo-ink)]"
            >
              {f.matched ?? f.raw}
            </span>
          ))}
        </div>
      )}

      {/* Allergy warnings — urgent on top */}
      {allergy.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {allergy.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-none text-rose-700" />
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-wider text-rose-700">
                  {w.type === "food_allergy" ? "Allergy conflict" : "Pollen alert"}
                </div>
                <div className="text-xs leading-relaxed text-rose-800">
                  {w.message}
                </div>
                {w.recommendedAction && (
                  <div className="mt-1 text-[11px] italic text-rose-700/85">
                    {w.recommendedAction}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Predictions */}
      {topPredictions.length > 0 && (
        <div className="mb-3">
          <SectionLabel>Predicted impact</SectionLabel>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {topPredictions.map((p, i) => (
              <li
                key={`${p.input}-${p.symptom}-${i}`}
                className="rounded-xl bg-[color:var(--halo-cream)]/50 px-3 py-2 text-xs leading-relaxed text-[color:var(--halo-ink)]/85"
              >
                <span
                  className={`mr-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    p.direction === "aggravates"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]"
                  }`}
                >
                  {p.direction === "aggravates" ? "raises" : "helps"} {p.symptomLabel}
                </span>
                {p.prediction}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nutrition flags */}
      {topFlags.length > 0 && (
        <div className="mb-3">
          <SectionLabel>Nutrition flags</SectionLabel>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {topFlags.map((f, i) => (
              <li
                key={`${f.category}-${i}`}
                className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${FLAG_TONE[f.level]}`}
              >
                {f.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tier 1 lifestyle */}
      {tier1.length > 0 && (
        <RecBlock
          icon={Lightbulb}
          tone="green"
          title="Lifestyle"
          items={tier1.map(stringify)}
        />
      )}

      {/* Tier 2 food swaps */}
      {swaps.length > 0 && (
        <RecBlock
          icon={Salad}
          tone="gold"
          title="Food swaps"
          items={swaps.map(stringify)}
        />
      )}

      {/* Tier 3 supplement considerations */}
      {supplements.length > 0 && (
        <RecBlock
          icon={Pill}
          tone="violet"
          title="Discuss with clinician"
          items={supplements.map(stringify)}
        />
      )}

      {/* Tier 4 escalation */}
      {escalations.length > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2">
          <Stethoscope className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-700" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              Escalate
            </div>
            <ul className="mt-0.5 flex flex-col gap-1 text-xs leading-relaxed text-amber-900">
              {escalations.slice(0, 3).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="mt-3 text-[10.5px] leading-relaxed text-[color:var(--halo-muted)]">
        Augur is a discussion aid — correlational patterns, not medical advice.
      </p>
    </PatientCard>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
      {children}
    </div>
  );
}

function RecBlock({
  icon: Icon,
  tone,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "green" | "gold" | "violet";
  title: string;
  items: string[];
}) {
  const cls = {
    green: "bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)]",
    gold: "bg-[#f6ecd6] text-[color:var(--halo-gold)]",
    violet: "bg-violet-50 text-violet-700",
  }[tone];
  return (
    <div className="mt-2 rounded-2xl border border-[color:var(--halo-ink)]/5 bg-white px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ${cls}`}
        >
          <Icon className="h-3 w-3" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--halo-ink)]">
          {title}
        </span>
      </div>
      <ul className="mt-1.5 flex flex-col gap-1 text-xs leading-relaxed text-[color:var(--halo-ink)]/85">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1.5">
            <span className="mt-1.5 inline-block h-1 w-1 flex-none rounded-full bg-[color:var(--halo-muted)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function stringify(x: unknown): string {
  if (typeof x === "string") return x;
  if (x && typeof x === "object") {
    const obj = x as Record<string, unknown>;
    if (typeof obj.swap === "string") {
      return obj.reason ? `${obj.swap} — ${obj.reason}` : obj.swap;
    }
    if (typeof obj.name === "string") {
      return obj.rationale ? `${obj.name} — ${obj.rationale}` : obj.name;
    }
    return JSON.stringify(obj);
  }
  return String(x);
}
