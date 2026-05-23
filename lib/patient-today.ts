import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Pill,
  Camera,
  GlassWater,
  Moon,
  Stethoscope,
} from "lucide-react";
import type { IconBadgeTone } from "@/components/patient/icon-badge";

export type PatientTaskItem = {
  id: string;
  title: string;
  subtitle: string;
  time?: string;
  icon: LucideIcon;
  tone: IconBadgeTone;
  done?: boolean;
};

export const RECOVERY = {
  procedure: "Right knee replacement",
  day: 3,
  totalDays: 14,
  surgeon: "Dr. Renée Lee",
};

export const TASKS: PatientTaskItem[] = [
  {
    id: "meds-am",
    title: "Take morning meds",
    subtitle: "Apixaban 2.5mg · Acetaminophen",
    time: "8:00 AM",
    icon: Pill,
    tone: "rose",
  },
  {
    id: "incision",
    title: "Log incision photo",
    subtitle: "Daily check — watch for redness",
    time: "9:30 AM",
    icon: Camera,
    tone: "gold",
  },
  {
    id: "walk",
    title: "10 minute walk",
    subtitle: "Hallway laps · use walker",
    time: "11:00 AM",
    icon: Footprints,
    tone: "green",
  },
  {
    id: "hydration",
    title: "Drink 8 oz of water",
    subtitle: "Every two hours",
    time: "Ongoing",
    icon: GlassWater,
    tone: "sky",
  },
  {
    id: "pt-call",
    title: "Tele-PT with Jordan",
    subtitle: "Range-of-motion check",
    time: "3:00 PM",
    icon: Stethoscope,
    tone: "violet",
  },
  {
    id: "sleep",
    title: "Elevate leg before bed",
    subtitle: "20 min pillow elevation",
    time: "9:30 PM",
    icon: Moon,
    tone: "slate",
  },
];

export const WEARABLE = {
  steps: 1248,
  stepsGoal: 2500,
  restingHeartRate: 72,
  sleepHours: 6.4,
};

export const CARE_TEAM_UPDATE = {
  author: "Dr. Renée Lee",
  role: "Orthopedic Surgeon",
  postedAt: "Earlier this morning",
  body: "Margaret — your incision looked clean on yesterday's photo. Keep up the short walks today; we'll check ROM on Wednesday.",
};
