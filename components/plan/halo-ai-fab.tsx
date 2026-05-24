import Link from "next/link";
import { Sparkles } from "lucide-react";

export function HaloAiFab() {
  return (
    <Link
      href="/ai"
      aria-label="Ask Halo AI"
      className="fixed bottom-24 right-5 z-30 flex flex-col items-center md:hidden"
    >
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--halo-green)] text-white shadow-[0_20px_40px_-12px_rgba(31,111,74,0.55)] ring-4 ring-white/80 transition active:scale-95">
        <Sparkles className="h-6 w-6" />
      </span>
      <span className="mt-1 text-[11px] font-medium text-[color:var(--halo-ink)]">
        Halo AI
      </span>
    </Link>
  );
}
