import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Footprints,
  GlassWater,
  HeartPulse,
  Moon,
  Pill,
  Stethoscope,
  ListChecks,
} from "lucide-react";

export const HOMEWORK_KINDS = [
  "meds",
  "incision",
  "walk",
  "hydration",
  "vitals",
  "sleep",
  "exercise",
  "other",
] as const;

export type HomeworkKind = (typeof HOMEWORK_KINDS)[number];

export const HOMEWORK_KIND_META: Record<
  HomeworkKind,
  { label: string; icon: LucideIcon }
> = {
  meds: { label: "Medication", icon: Pill },
  incision: { label: "Incision photo", icon: Camera },
  walk: { label: "Walk", icon: Footprints },
  hydration: { label: "Hydration", icon: GlassWater },
  vitals: { label: "Vitals check", icon: HeartPulse },
  sleep: { label: "Sleep", icon: Moon },
  exercise: { label: "Exercise", icon: Stethoscope },
  other: { label: "Other", icon: ListChecks },
};

export function isHomeworkKind(s: string): s is HomeworkKind {
  return (HOMEWORK_KINDS as readonly string[]).includes(s);
}
