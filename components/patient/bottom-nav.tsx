"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  Sparkles,
  MessageCircle,
  User,
  type LucideIcon,
} from "lucide-react";

type Tab = { href: string; label: string; icon: LucideIcon; match: string };

const TABS: Tab[] = [
  { href: "/dashboard", label: "Today", icon: Home, match: "/dashboard" },
  { href: "/progress", label: "Progress", icon: TrendingUp, match: "/progress" },
  { href: "/plan", label: "Plan", icon: Sparkles, match: "/plan" },
  { href: "/messages", label: "Messages", icon: MessageCircle, match: "/messages" },
  { href: "/profile", label: "Profile", icon: User, match: "/profile" },
];

const PILL_EASE = "cubic-bezier(0.34, 1.35, 0.64, 1)";

export function BottomNav() {
  const pathname = usePathname() ?? "";
  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => pathname.startsWith(tab.match)),
  );
  const pillWidth = 100 / TABS.length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 md:hidden">
      <div className="mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2">
        <div className="rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white/95 px-2 py-2 shadow-[0_24px_50px_-30px_rgba(20,36,27,0.4)] backdrop-blur">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 rounded-2xl bg-[color:var(--halo-green-soft)]"
              style={{
                width: `${pillWidth}%`,
                transform: `translate3d(${activeIndex * 100}%, 0, 0)`,
                transition: `transform 300ms ${PILL_EASE}`,
              }}
            />
            <div className="relative grid grid-cols-5">
              {TABS.map((tab, i) => {
                const active = i === activeIndex;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative z-10 flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                      active
                        ? "text-[color:var(--halo-green)]"
                        : "text-[color:var(--halo-muted)] hover:text-[color:var(--halo-ink)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
