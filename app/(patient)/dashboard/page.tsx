import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { roleLabel } from "@/lib/roles";
import { PatientTodayScreen } from "@/components/patient/patient-today-screen";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  if (user.role === "patient") {
    const firstName = user.name.split(" ")[0] ?? "there";
    return <PatientTodayScreen firstName={firstName} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="halo-wordmark text-2xl text-[color:var(--halo-ink)]">
        Halo
      </span>
      <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--halo-green-soft)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--halo-green)]">
        {roleLabel(user.role)}
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        Welcome, {user.name.split(" ")[0]}.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--halo-muted)]">
        The clinical desktop view ships in a later phase. Open this on a phone
        as a Patient to see today's care plan.
      </p>
      <Link
        href="/"
        className="mt-6 text-xs uppercase tracking-[0.2em] text-[color:var(--halo-muted)] hover:text-[color:var(--halo-ink)]"
      >
        ← Pick a different role
      </Link>
    </main>
  );
}
