"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { ensureDemoUser } from "@/lib/demo-users";
import {
  getOrCreateDirectThread,
  insertThreadMessage,
} from "@/lib/threads";

export async function createThreadMessage(
  threadId: string,
  body: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Message can't be empty" };
  if (trimmed.length > 4000) {
    return { ok: false, error: "Message too long" };
  }

  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const member = await prisma.threadMember.findUnique({
    where: { threadId_userId: { threadId, userId: user.id } },
  });
  if (!member) return { ok: false, error: "Not a member of this thread" };

  await insertThreadMessage({
    threadId,
    authorId: user.id,
    body: trimmed,
  });

  await recordAudit({
    userId: user.id,
    action: "thread.message.send",
    subject: threadId,
  });

  revalidatePath(`/messages/${threadId}`);
  return { ok: true };
}

const SEED_MESSAGES = [
  {
    role: "nurse",
    body: "Margaret — your incision photos this week look great. Keep the short walks going.",
  },
  {
    role: "patient",
    body: "Thanks, Dr. Lee. Pain is 4/10 today, slept 7 hours.",
  },
  {
    role: "nurse",
    body: "Good improvement on the pain — let's hold the current med plan. Tele-PT today at 3.",
  },
];

export async function openPrimaryCareThread(): Promise<void> {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  const counterpartRole = me.role === "patient" ? "nurse" : "patient";
  const counterpart = await ensureDemoUser(counterpartRole);

  const thread = await getOrCreateDirectThread(me.id, counterpart.id, {
    rolesByUser: { [me.id]: me.role, [counterpart.id]: counterpart.role },
  });

  const existingCount = await prisma.directMessage.count({
    where: { threadId: thread.id },
  });
  if (existingCount === 0) {
    const patient = me.role === "patient" ? me : counterpart;
    const nurse = me.role === "patient" ? counterpart : me;
    for (const seed of SEED_MESSAGES) {
      const author = seed.role === "nurse" ? nurse : patient;
      await insertThreadMessage({
        threadId: thread.id,
        authorId: author.id,
        body: seed.body,
      });
    }
  }

  redirect(`/messages/${thread.id}`);
}
