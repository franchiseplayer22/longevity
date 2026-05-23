import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { PatientShell } from "@/components/patient/patient-shell";
import { PatientCard } from "@/components/patient/patient-card";
import { IconBadge } from "@/components/patient/icon-badge";
import { getCurrentUser } from "@/lib/auth";
import { listUserThreads } from "@/lib/threads";
import { openPrimaryCareThread } from "@/app/actions/messages";

export default async function MessagesPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  const threads = await listUserThreads(me.id);

  return (
    <PatientShell greeting="Messages" subhead="Your care circle, in one inbox.">
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
        <div className="flex flex-col gap-3">
          {threads.map((thread) => {
            const others = thread.members.filter((m) => m.userId !== me.id);
            const title =
              others.map((m) => m.user.name).join(", ") || "Conversation";
            const last = thread.messages[0];
            return (
              <Link
                key={thread.id}
                href={`/messages/${thread.id}`}
                className="flex items-start gap-3 rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white p-4 transition hover:border-[color:var(--halo-green)]/30 hover:bg-[color:var(--halo-green-soft)]/40"
              >
                <IconBadge icon={MessageCircle} tone="green" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-[color:var(--halo-ink)]">
                      {title}
                    </span>
                    {last && (
                      <span className="flex-none text-[11px] text-[color:var(--halo-muted)]">
                        {last.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[color:var(--halo-muted)]">
                    {last ? last.body : "No messages yet"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PatientShell>
  );
}
