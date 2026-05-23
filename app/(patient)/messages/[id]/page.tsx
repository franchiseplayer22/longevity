import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getThreadDetail } from "@/lib/threads";
import { recordAudit } from "@/lib/audit";
import { ChatHeader } from "@/components/messages/chat-header";
import { MessageList } from "@/components/messages/message-list";
import { MessageComposer } from "@/components/messages/message-composer";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) redirect("/");

  const thread = await getThreadDetail(id, me.id);
  if (!thread) notFound();

  await recordAudit({
    userId: me.id,
    action: "thread.read",
    subject: thread.id,
  });

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--halo-cream)]/30 pb-24">
      <ChatHeader members={thread.members} viewerId={me.id} />
      <main className="mx-auto w-full max-w-md flex-1">
        <MessageList
          messages={thread.messages}
          members={thread.members}
          viewerId={me.id}
        />
      </main>
      <MessageComposer threadId={thread.id} />
    </div>
  );
}
