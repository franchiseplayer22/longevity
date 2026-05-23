export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="halo-wordmark text-2xl text-[color:var(--halo-ink)]">
        Halo
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        Welcome to your care circle.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[color:var(--halo-muted)]">
        We're setting up your profile. Onboarding flow ships in a later phase.
      </p>
    </main>
  );
}
