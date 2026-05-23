import { AuthCard } from "./(marketing)/auth-card";
import { LandingRotator } from "./(marketing)/landing-rotator";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 -left-24 h-[520px] w-[520px] rounded-full bg-[color:var(--halo-green-soft)] blur-3xl" />
        <div className="absolute top-1/2 right-[-15%] hidden h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-[color:var(--halo-cream)] blur-3xl lg:block" />
      </div>

      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="halo-wordmark text-xl text-[color:var(--halo-ink)]">
          Halo
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--halo-muted)]">
          Care · Recovery · Family
        </span>
      </header>

      <section className="grid flex-1 grid-cols-1 items-center gap-12 px-6 pb-16 pt-6 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-12">
        <div className="hidden lg:block">
          <LandingRotator />
        </div>

        <div className="flex w-full justify-center lg:justify-end">
          <AuthCard />
        </div>
      </section>

      <footer className="px-6 pb-8 text-xs text-[color:var(--halo-muted)] sm:px-10">
        © {new Date().getFullYear()} Halo Health. Built with care.
      </footer>
    </main>
  );
}
