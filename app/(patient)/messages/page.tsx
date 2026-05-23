import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listUserThreads } from "@/lib/threads";
import {
  PatientMobileMessagesList,
  type InboxThread,
} from "@/components/patient/patient-mobile-messages-list";

export default async function MessagesPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  const threads = await listUserThreads(me.id);

  const items: InboxThread[] = threads.map((thread) => {
    const others = thread.members.filter((m) => m.userId !== me.id);
    const title =
      others.map((m) => m.user.name).join(", ") || "Conversation";
    const last = thread.messages[0];
    return {
      id: thread.id,
      title,
      preview: last?.body ?? "",
      postedAt: last?.createdAt ?? null,
      authorName: others[0]?.user.name ?? null,
    };
  });

  const firstName = me.name.split(" ")[0] ?? "friend";
  return <PatientMobileMessagesList firstName={firstName} threads={items} />;
}
