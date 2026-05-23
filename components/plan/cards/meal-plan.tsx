import { z } from "zod";
import { Apple, Utensils } from "lucide-react";
import { PatientCard } from "@/components/patient/patient-card";
import { IconBadge } from "@/components/patient/icon-badge";

export const mealPlanPropsSchema = z.object({
  title: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  items: z
    .array(
      z.object({
        name: z.string(),
        why: z.string(),
      }),
    )
    .min(1)
    .max(6),
  caloriesApprox: z.number().int().positive().optional(),
});

export type MealPlanProps = z.infer<typeof mealPlanPropsSchema>;

const MEAL_LABEL = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
} as const;

export function MealPlan({ title, mealType, items, caloriesApprox }: MealPlanProps) {
  return (
    <PatientCard
      eyebrow={MEAL_LABEL[mealType]}
      title={title}
      action={
        caloriesApprox ? (
          <span className="text-xs text-[color:var(--halo-muted)]">
            ~{caloriesApprox} kcal
          </span>
        ) : undefined
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <IconBadge icon={Utensils} tone="gold" size="sm" />
        <span className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
          Recovery-friendly
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <Apple className="mt-0.5 h-4 w-4 flex-none text-[color:var(--halo-green)]" />
            <div>
              <div className="text-sm font-semibold text-[color:var(--halo-ink)]">
                {item.name}
              </div>
              <div className="text-xs text-[color:var(--halo-muted)]">{item.why}</div>
            </div>
          </li>
        ))}
      </ul>
    </PatientCard>
  );
}
