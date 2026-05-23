"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Mail, ShieldCheck, Sparkles } from "lucide-react";
import { isPrivyConfigured } from "@/lib/env";

export function SignInCard() {
  const router = useRouter();
  const configured = isPrivyConfigured();
  const privy = usePrivy();

  useEffect(() => {
    if (configured && privy.ready && privy.authenticated) {
      router.push("/onboarding");
    }
  }, [configured, privy.ready, privy.authenticated, router]);

  const ready = !configured || privy.ready;
  const handleLogin = () => {
    if (!configured) return;
    privy.login();
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white/90 p-7 shadow-[0_30px_80px_-40px_rgba(20,36,27,0.45)] backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <span className="halo-wordmark text-2xl text-[color:var(--halo-ink)]">
          Halo
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--halo-cream)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-gold)]">
          <Sparkles className="h-3 w-3" /> beta
        </span>
      </div>

      <h2 className="text-2xl font-semibold leading-tight tracking-tight text-[color:var(--halo-ink)]">
        Sign in to your care circle.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--halo-muted)]">
        One link to your phone or email. No passwords, no apps to download.
      </p>

      <button
        type="button"
        onClick={handleLogin}
        disabled={!ready || !configured}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--halo-green)] px-4 py-3.5 text-sm font-semibold text-white transition hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mail className="h-4 w-4" />
        {configured
          ? privy.authenticated
            ? "Continuing…"
            : "Continue with email or phone"
          : "Privy not configured"}
      </button>

      <div className="mt-5 flex items-start gap-2 rounded-xl bg-[color:var(--halo-green-soft)] p-3 text-xs leading-relaxed text-[color:var(--halo-green)]">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none" />
        <span>
          HIPAA-aware. Halo never shares clinical data with third parties.
        </span>
      </div>

      {!configured && (
        <p className="mt-4 text-[11px] leading-relaxed text-[color:var(--halo-muted)]">
          Set <code className="rounded bg-[color:var(--halo-cream)] px-1">NEXT_PUBLIC_PRIVY_APP_ID</code>{" "}
          in <code>.env.local</code> to enable sign-in.
        </p>
      )}
    </div>
  );
}
