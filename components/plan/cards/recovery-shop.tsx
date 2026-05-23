import { z } from "zod";
import { ShoppingBag, Store } from "lucide-react";
import { PatientCard } from "@/components/patient/patient-card";

export const recoveryShopPropsSchema = z.object({
  title: z.string(),
  intro: z.string().optional(),
  products: z
    .array(
      z.object({
        name: z.string(),
        why: z.string(),
        price: z.string(),
        retailer: z.string(),
      }),
    )
    .min(1)
    .max(5),
});

export type RecoveryShopProps = z.infer<typeof recoveryShopPropsSchema>;

export function RecoveryShop({ title, intro, products }: RecoveryShopProps) {
  return (
    <PatientCard eyebrow="Recovery shop" title={title}>
      {intro && (
        <p className="mb-3 text-sm leading-relaxed text-[color:var(--halo-ink)]/80">
          {intro}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {products.map((product, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-[color:var(--halo-ink)]/5 bg-white p-3"
          >
            <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[color:var(--halo-cream)] text-[color:var(--halo-gold)]">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-sm font-semibold text-[color:var(--halo-ink)]">
                  {product.name}
                </span>
                <span className="flex-none text-sm font-semibold text-[color:var(--halo-ink)]">
                  {product.price}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--halo-ink)]/75">
                {product.why}
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[color:var(--halo-muted)]">
                <Store className="h-3 w-3" />
                {product.retailer}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PatientCard>
  );
}
