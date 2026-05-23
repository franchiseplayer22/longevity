import type { ReactNode } from "react";

export function PatientCard({
  title,
  eyebrow,
  action,
  children,
  className = "",
  tone = "white",
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "white" | "green" | "cream";
}) {
  const toneClass =
    tone === "green"
      ? "bg-[color:var(--halo-green)] text-white border-transparent"
      : tone === "cream"
        ? "bg-[color:var(--halo-cream)] border-[color:var(--halo-ink)]/5"
        : "bg-white border-[color:var(--halo-ink)]/10";

  return (
    <section
      className={`rounded-3xl border p-5 shadow-[0_18px_40px_-32px_rgba(20,36,27,0.45)] ${toneClass} ${className}`}
    >
      {(eyebrow || title || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <div
                className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
                  tone === "green"
                    ? "text-white/70"
                    : "text-[color:var(--halo-muted)]"
                }`}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h3
                className={`text-base font-semibold tracking-tight ${
                  tone === "green" ? "text-white" : "text-[color:var(--halo-ink)]"
                }`}
              >
                {title}
              </h3>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
