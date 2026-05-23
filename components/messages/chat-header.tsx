import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ThreadMember, User } from "@prisma/client";

type Member = ThreadMember & { user: User };

export function ChatHeader({
  members,
  viewerId,
}: {
  members: Member[];
  viewerId: string;
}) {
  const others = members.filter((m) => m.userId !== viewerId);
  const title =
    others.length === 1
      ? others[0].user.name
      : others.map((m) => m.user.name.split(" ")[0]).join(", ");

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--halo-ink)]/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
        <Link
          href="/messages"
          className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color:var(--halo-cream)]/70 text-[color:var(--halo-ink)]"
          aria-label="Back to messages"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-[color:var(--halo-ink)]">
            {title}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {members
              .filter((m) => m.userId !== viewerId)
              .map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center rounded-full bg-[color:var(--halo-green-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--halo-green)]"
                >
                  {m.role ?? m.user.role}
                </span>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
