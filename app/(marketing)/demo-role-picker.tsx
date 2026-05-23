"use client";

import { useState, useTransition } from "react";
import { Stethoscope, HeartPulse, HandHeart, Sparkles } from "lucide-react";
import { pickRole } from "@/app/actions/pick-role";
import { DEMO_ROLES, type DemoRole } from "@/lib/roles";

const ICONS: Record<DemoRole, React.ComponentType<{ className?: string }>> = {
  nurse: Stethoscope,
  patient: HeartPulse,
  service: HandHeart,
};

export function DemoRolePicker() {
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState<DemoRole | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const choose = (role: DemoRole) => {
    setErr(null);
    setActive(role);
    startTransition(async () => {
      try {
        await pickRole(role);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Could not switch role");
        setActive(null);
      }
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white/90 p-7 shadow-[0_30px_80px_-40px_rgba(20,36,27,0.45)] backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <span className="halo-wordmark text-2xl text-[color:var(--halo-ink)]">
          Halo
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--halo-cream)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-gold)]">
          <Sparkles className="h-3 w-3" /> demo
        </span>
      </div>

      <h2 className="text-2xl font-semibold leading-tight tracking-tight text-[color:var(--halo-ink)]">
        Pick a role to explore.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--halo-muted)]">
        Demo mode skips sign-in. Try each role — the app reshapes for you.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {DEMO_ROLES.map(({ role, label, blurb }) => {
          const Icon = ICONS[role];
          const loading = pending && active === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => choose(role)}
              disabled={pending}
              className="group flex w-full items-start gap-3 rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white px-4 py-3.5 text-left transition hover:border-[color:var(--halo-green)]/40 hover:bg-[color:var(--halo-green-soft)]/40 active:translate-y-px disabled:opacity-60"
            >
              <span className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-[color:var(--halo-green-soft)] text-[color:var(--halo-green)] group-hover:bg-[color:var(--halo-green)] group-hover:text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-[color:var(--halo-ink)]">
                  {label}
                </span>
                <span className="block text-xs leading-relaxed text-[color:var(--halo-muted)]">
                  {blurb}
                </span>
              </span>
              {loading && (
                <span className="mt-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-[color:var(--halo-green)] border-t-transparent" />
              )}
            </button>
          );
        })}
      </div>

      {err && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {err}
        </p>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-[color:var(--halo-muted)]">
        Demo mode active via <code className="rounded bg-[color:var(--halo-cream)] px-1">NEXT_PUBLIC_DEMO_MODE=1</code>.
        Real Privy auth takes over when an app id is set.
      </p>
    </div>
  );
}
