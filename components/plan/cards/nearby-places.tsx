import { z } from "zod";
import {
  MapPin,
  Dumbbell,
  Trees,
  Stethoscope,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { PatientCard } from "@/components/patient/patient-card";
import { IconBadge } from "@/components/patient/icon-badge";
import type { IconBadgeTone } from "@/components/patient/icon-badge";

const PLACE_KIND = z.enum([
  "clinic",
  "park",
  "gym",
  "pool",
  "group",
  "other",
]);
type PlaceKind = z.infer<typeof PLACE_KIND>;

export const nearbyPlacesPropsSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  places: z
    .array(
      z.object({
        name: z.string(),
        kind: PLACE_KIND,
        distance: z.string(),
        why: z.string(),
        cta: z.string().optional(),
      }),
    )
    .min(1)
    .max(5),
});

export type NearbyPlacesProps = z.infer<typeof nearbyPlacesPropsSchema>;

const KIND_META: Record<
  PlaceKind,
  { icon: LucideIcon; tone: IconBadgeTone; label: string }
> = {
  clinic: { icon: Stethoscope, tone: "violet", label: "Clinic" },
  park: { icon: Trees, tone: "green", label: "Park" },
  gym: { icon: Dumbbell, tone: "rose", label: "Gym" },
  pool: { icon: Waves, tone: "sky", label: "Pool" },
  group: { icon: Users, tone: "gold", label: "Group" },
  other: { icon: MapPin, tone: "slate", label: "Nearby" },
};

export function NearbyPlaces({ title, intro, places }: NearbyPlacesProps) {
  return (
    <PatientCard eyebrow="Nearby" title={title}>
      {intro && (
        <p className="mb-3 text-sm leading-relaxed text-[color:var(--halo-ink)]/80">
          {intro}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {places.map((place, i) => {
          const meta = KIND_META[place.kind];
          return (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-[color:var(--halo-ink)]/5 bg-[color:var(--halo-cream)]/50 p-3"
            >
              <IconBadge icon={meta.icon} tone={meta.tone} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-[color:var(--halo-ink)]">
                    {place.name}
                  </span>
                  <span className="flex-none text-[11px] text-[color:var(--halo-muted)]">
                    {place.distance}
                  </span>
                </div>
                <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
                  {meta.label}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--halo-ink)]/75">
                  {place.why}
                </p>
                {place.cta && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[color:var(--halo-green)] px-3 py-1 text-[11px] font-semibold text-white">
                    {place.cta}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </PatientCard>
  );
}
