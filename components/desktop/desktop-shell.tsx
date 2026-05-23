import Link from "next/link";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";

export function DesktopShell({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
}) {
  return (
    <div className="hidden min-h-screen w-full bg-[color:var(--halo-cream)]/40 md:flex">
      <NavRail />
      {sidebar && (
        <aside className="hidden w-72 flex-none border-r border-[color:var(--halo-ink)]/5 bg-white/60 lg:block">
          {sidebar}
        </aside>
      )}
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavRail() {
  return (
    <nav className="flex w-16 flex-none flex-col items-center gap-2 border-r border-[color:var(--halo-ink)]/5 bg-white py-4">
      <span className="halo-wordmark mb-2 text-base text-[color:var(--halo-ink)]">
        H
      </span>
      <RailLink href="/dashboard" label="Home" icon={LayoutDashboard} />
      <RailLink href="/recipients" label="Patients" icon={Users} />
      <RailLink href="#" label="Reports" icon={ClipboardList} />
      <RailLink href="#" label="Activity" icon={Activity} />
      <div className="mt-auto flex flex-col gap-2">
        <RailLink href="#" label="Settings" icon={Settings} />
        <RailLink href="/" label="Sign out" icon={LogOut} />
      </div>
    </nav>
  );
}

function RailLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[color:var(--halo-muted)] transition hover:bg-[color:var(--halo-green-soft)] hover:text-[color:var(--halo-green)]"
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </Link>
  );
}
