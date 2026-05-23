import Link from "next/link";
import { Search } from "lucide-react";

export function RecipientSidebar({
  activeId,
  recipients,
}: {
  activeId: string;
  recipients: Array<{ id: string; name: string; subtitle: string; status: string }>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[color:var(--halo-ink)]/5 px-4 py-4">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
          Census
        </span>
        <h2 className="text-base font-semibold tracking-tight text-[color:var(--halo-ink)]">
          My patients
        </h2>
        <label className="mt-3 flex items-center gap-2 rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-1.5 text-sm text-[color:var(--halo-muted)]">
          <Search className="h-3.5 w-3.5" />
          <input
            type="search"
            placeholder="Search patients…"
            className="w-full bg-transparent text-[color:var(--halo-ink)] placeholder:text-[color:var(--halo-muted)] focus:outline-none"
          />
        </label>
      </div>
      <ul className="flex-1 overflow-auto px-2 py-3">
        {recipients.map((r) => {
          const active = r.id === activeId;
          return (
            <li key={r.id}>
              <Link
                href={`/recipients/${r.id}`}
                className={`block rounded-2xl px-3 py-3 transition ${
                  active
                    ? "bg-[color:var(--halo-green-soft)]"
                    : "hover:bg-[color:var(--halo-cream)]/70"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-[color:var(--halo-ink)]">
                    {r.name}
                  </span>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wider ${
                      active
                        ? "text-[color:var(--halo-green)]"
                        : "text-[color:var(--halo-muted)]"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-[color:var(--halo-muted)]">
                  {r.subtitle}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
