import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

export function PatientShell({
  greeting,
  subhead,
  children,
}: {
  greeting: string;
  subhead?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen pb-32 md:pb-12">
      <div className="mx-auto w-full max-w-md px-5 pt-8">
        <header className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--halo-ink)]">
            {greeting}
          </h1>
          {subhead && (
            <p className="mt-1 text-sm text-[color:var(--halo-muted)]">
              {subhead}
            </p>
          )}
        </header>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
