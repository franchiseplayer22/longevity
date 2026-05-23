import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-32 pt-8">
      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--halo-muted)] shadow-sm"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Today's check-in
      </h1>
      <p className="mt-2 text-sm text-[color:var(--halo-muted)]">
        Multi-step incision · daily check · feeling · review flow lands in the
        next phase.
      </p>
    </main>
  );
}
