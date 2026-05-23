import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { roleLabel } from "@/lib/roles";
import { PatientTodayScreen } from "@/components/patient/patient-today-screen";
import { openDemoRecipient } from "@/app/actions/recipients";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  if (user.role === "patient") {
    const firstName = user.name.split(" ")[0] ?? "there";
    return <PatientTodayScreen firstName={firstName} />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-6 py-12 md:py-16">
      <header className="flex items-center justify-between">
        <span className="halo-wordmark text-base text-[color:var(--halo-muted)]">
          Halo
        </span>
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] text-[color:var(--halo-muted)] hover:text-[color:var(--halo-ink)]"
        >
          Switch role
        </Link>
      </header>
      <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--halo-green-soft)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--halo-green)]">
        {roleLabel(user.role)}
      </span>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Good morning, {user.name.split(" ")[0]}.
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[color:var(--halo-muted)]">
        Open a patient chart to review vitals, recent reports, and the night
        handoff plan.
      </p>

      <form action={openDemoRecipient} className="mt-8">
        <button
          type="submit"
          className="group flex w-full items-center justify-between rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white p-5 text-left transition hover:border-[color:var(--halo-green)]/40"
        >
          <span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
              Today's patient
            </span>
            <span className="block text-lg font-semibold text-[color:var(--halo-ink)]">
              Margaret Okafor
            </span>
            <span className="block text-xs text-[color:var(--halo-muted)]">
              POD 3 · Right TKA · Dr. Lee
            </span>
          </span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--halo-green)] text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </form>

      <p className="mt-6 text-[11px] text-[color:var(--halo-muted)]">
        Mobile chart for clinicians is on the roadmap — open this view on a
        desktop for the full layout.
      </p>
    </main>
  );
}
