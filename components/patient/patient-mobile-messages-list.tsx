import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PatientShell } from "./patient-shell";
import { PatientCard } from "./patient-card";
import { openPrimaryCareThread } from "@/app/actions/messages";

export type InboxThread = {
  id: string;
  title: string;
  preview: string;
  postedAt: Date | null;
  authorName: string | null;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTimestamp(date: Date | null): string {
  if (!date) return "";
  const today = new Date();
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function PatientMobileMessagesList({
  firstName,
  threads,
}: {
  firstName: string;
  threads: InboxThread[];
}) {
  return (
    <PatientShell
      greeting={`Messages, ${firstName}.`}
      subhead="Direct conversations with your care circle."
    >
      {threads.length === 0 ? (
        <PatientCard
          eyebrow="Get started"
          title="Open your care conversation"
        >
          <p className="mb-4 text-sm text-[color:var(--halo-muted)]">
            We'll set up a direct line with your care team and seed it with a
            recent check-in.
          </p>
          <form action={openPrimaryCareThread}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--halo-green)] px-4 py-3 text-sm font-semibold text-white"
            >
              Open care team thread
            </button>
          </form>
        </PatientCard>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white">
          <ul className="divide-y divide-[color:var(--halo-ink)]/5">
            {threads.map((thread) => (
              <li key={thread.id}>
                <Link
                  href={`/messages/${thread.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-[color:var(--halo-green-soft)]/40"
                >
                  <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[color:var(--halo-green-soft)] text-sm font-semibold text-[color:var(--halo-green)]">
                    {thread.authorName ? initials(thread.authorName) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-[color:var(--halo-ink)]">
                        {thread.title}
                      </span>
                      <span className="flex-none text-[11px] text-[color:var(--halo-muted)]">
                        {formatTimestamp(thread.postedAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-[color:var(--halo-muted)]">
                      {thread.preview || "No messages yet"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PatientShell>
  );
}
