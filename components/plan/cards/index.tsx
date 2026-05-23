import type { ComponentType } from "react";
import type { z } from "zod";
import {
  CareTeamUpdate,
  careTeamUpdatePropsSchema,
} from "./care-team-update";
import { ActivityPlan, activityPlanPropsSchema } from "./activity-plan";
import {
  MedicationReminder,
  medicationReminderPropsSchema,
} from "./medication-reminder";
import { MealPlan, mealPlanPropsSchema } from "./meal-plan";
import { Milestone, milestonePropsSchema } from "./milestone";
import { NearbyPlaces, nearbyPlacesPropsSchema } from "./nearby-places";
import { RecoveryShop, recoveryShopPropsSchema } from "./recovery-shop";

export type PlanComponentName =
  | "CareTeamUpdate"
  | "ActivityPlan"
  | "MedicationReminder"
  | "MealPlan"
  | "Milestone"
  | "NearbyPlaces"
  | "RecoveryShop";

type Entry<S extends z.ZodTypeAny> = {
  name: PlanComponentName;
  description: string;
  component: ComponentType<z.infer<S>>;
  propsSchema: S;
};

export const PLAN_COMPONENTS: { [K in PlanComponentName]: Entry<z.ZodTypeAny> } = {
  CareTeamUpdate: {
    name: "CareTeamUpdate",
    description: "A short message from a clinician on the patient's care team.",
    component: CareTeamUpdate as ComponentType<unknown>,
    propsSchema: careTeamUpdatePropsSchema,
  },
  ActivityPlan: {
    name: "ActivityPlan",
    description:
      "A short activity or PT plan with intensity, duration, and ordered steps.",
    component: ActivityPlan as ComponentType<unknown>,
    propsSchema: activityPlanPropsSchema,
  },
  MedicationReminder: {
    name: "MedicationReminder",
    description: "A medication reminder with dose, next-dose time, and cautions.",
    component: MedicationReminder as ComponentType<unknown>,
    propsSchema: medicationReminderPropsSchema,
  },
  MealPlan: {
    name: "MealPlan",
    description: "A recovery-friendly meal recommendation with item rationale.",
    component: MealPlan as ComponentType<unknown>,
    propsSchema: mealPlanPropsSchema,
  },
  Milestone: {
    name: "Milestone",
    description:
      "A recovery milestone with target date, narrative, and lock/progress/done status.",
    component: Milestone as ComponentType<unknown>,
    propsSchema: milestonePropsSchema,
  },
  NearbyPlaces: {
    name: "NearbyPlaces",
    description:
      "Nearby places useful for recovery (PT clinic, walking group, pool, park, etc.) with distance and CTA.",
    component: NearbyPlaces as ComponentType<unknown>,
    propsSchema: nearbyPlacesPropsSchema,
  },
  RecoveryShop: {
    name: "RecoveryShop",
    description:
      "Recovery-related product recommendations with rationale, price, and retailer.",
    component: RecoveryShop as ComponentType<unknown>,
    propsSchema: recoveryShopPropsSchema,
  },
};

export type PlanItem = {
  id: string;
  component: PlanComponentName;
  props: Record<string, unknown>;
};

export function renderPlanComponent(item: PlanItem): React.ReactNode {
  const entry = PLAN_COMPONENTS[item.component];
  if (!entry) return null;
  const parsed = entry.propsSchema.safeParse(item.props);
  if (!parsed.success) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[plan] Invalid props for ${item.component}`,
        parsed.error.issues,
      );
    }
    return null;
  }
  const Component = entry.component;
  return <Component {...(parsed.data as object)} />;
}

export const planComponentList = Object.values(PLAN_COMPONENTS);
