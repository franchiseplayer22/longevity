import type { DirectMessage, ThreadMember, User } from "@prisma/client";

type Msg = DirectMessage;
type Member = ThreadMember & { user: User };

type Group = {
  authorId: string;
  authorName: string;
  authorRole: string | null;
  isSelf: boolean;
  startAt: Date;
  messages: Msg[];
};

const FIVE_MIN = 5 * 60 * 1000;

function groupMessages(messages: Msg[], members: Member[], viewerId: string): Group[] {
  const byUser = new Map(members.map((m) => [m.userId, m]));
  const out: Group[] = [];
  for (const msg of messages) {
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.authorId === msg.authorId &&
      msg.createdAt.getTime() - prev.messages[prev.messages.length - 1].createdAt.getTime() <
        FIVE_MIN
    ) {
      prev.messages.push(msg);
      continue;
    }
    const member = byUser.get(msg.authorId);
    out.push({
      authorId: msg.authorId,
      authorName: member?.user.name ?? "Member",
      authorRole: member?.role ?? null,
      isSelf: msg.authorId === viewerId,
      startAt: msg.createdAt,
      messages: [msg],
    });
  }
  return out;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageList({
  messages,
  members,
  viewerId,
}: {
  messages: Msg[];
  members: Member[];
  viewerId: string;
}) {
  const groups = groupMessages(messages, members, viewerId);

  if (groups.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-20 text-center text-sm text-[color:var(--halo-muted)]">
        No messages yet. Say hi.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-4 pt-2">
      {groups.map((g, i) => (
        <div
          key={`${g.authorId}-${i}`}
          className={`flex ${g.isSelf ? "justify-end" : "justify-start"}`}
        >
          <div className="flex max-w-[78%] flex-col gap-1">
            {!g.isSelf && (
              <div className="px-3 text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
                {g.authorName}
                {g.authorRole ? ` · ${g.authorRole}` : ""} · {formatTime(g.startAt)}
              </div>
            )}
            {g.messages.map((m) => {
              const suggestions =
                m.payload &&
                typeof m.payload === "object" &&
                !Array.isArray(m.payload) &&
                "suggestions" in m.payload
                  ? (m.payload.suggestions as Array<{ label: string }>)
                  : null;

              return (
                <div
                  key={m.id}
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    g.isSelf
                      ? "bg-[color:var(--halo-green)] text-white"
                      : "bg-white text-[color:var(--halo-ink)]"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{m.body}</div>
                  {suggestions && suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {suggestions.map((s, idx) => (
                        <span
                          key={idx}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                            g.isSelf
                              ? "bg-white/20 text-white"
                              : "bg-[color:var(--halo-cream)] text-[color:var(--halo-gold)]"
                          }`}
                        >
                          {s.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {g.isSelf && (
              <div className="px-1 text-right text-[10px] uppercase tracking-wider text-[color:var(--halo-muted)]">
                {formatTime(g.startAt)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
