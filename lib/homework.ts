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
import type { IconBadgeTone } from "@/components/patient/icon-badge";

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
  { label: string; icon: LucideIcon; tone: IconBadgeTone }
> = {
  meds: { label: "Medication", icon: Pill, tone: "rose" },
  incision: { label: "Incision photo", icon: Camera, tone: "gold" },
  walk: { label: "Walk", icon: Footprints, tone: "green" },
  hydration: { label: "Hydration", icon: GlassWater, tone: "sky" },
  vitals: { label: "Vitals check", icon: HeartPulse, tone: "violet" },
  sleep: { label: "Sleep", icon: Moon, tone: "slate" },
  exercise: { label: "Exercise", icon: Stethoscope, tone: "green" },
  other: { label: "Other", icon: ListChecks, tone: "slate" },
};

export function isHomeworkKind(s: string): s is HomeworkKind {
  return (HOMEWORK_KINDS as readonly string[]).includes(s);
}
