import { prisma } from "@/lib/prisma";
import type { Prisma, Thread, ThreadMember } from "@prisma/client";
import { extractChartSuggestions } from "@/lib/chart-suggestion";

export type ThreadWithMembers = Thread & {
  members: (ThreadMember & { user: { id: string; name: string; role: string } })[];
};

export async function getOrCreateDirectThread(
  userIdA: string,
  userIdB: string,
  opts?: { rolesByUser?: Record<string, string | null> },
): Promise<ThreadWithMembers> {
  if (userIdA === userIdB) {
    throw new Error("Direct thread requires two distinct users");
  }

  const existing = await prisma.thread.findFirst({
    where: {
      kind: "direct",
      AND: [
        { members: { some: { userId: userIdA } } },
        { members: { some: { userId: userIdB } } },
      ],
    },
    include: { members: { include: { user: true } } },
  });
  if (existing) return existing as ThreadWithMembers;

  const created = await prisma.thread.create({
    data: {
      kind: "direct",
      members: {
        create: [
          { userId: userIdA, role: opts?.rolesByUser?.[userIdA] ?? null },
          { userId: userIdB, role: opts?.rolesByUser?.[userIdB] ?? null },
        ],
      },
    },
    include: { members: { include: { user: true } } },
  });
  return created as ThreadWithMembers;
}

export async function insertThreadMessage({
  threadId,
  authorId,
  body,
  kind = "text",
  payload,
}: {
  threadId: string;
  authorId: string;
  body: string;
  kind?: string;
  payload?: Prisma.InputJsonValue;
}) {
  const suggestions = extractChartSuggestions(body);
  const finalPayload =
    payload ?? (suggestions.length ? { suggestions } : undefined);

  const message = await prisma.directMessage.create({
    data: {
      threadId,
      authorId,
      body,
      kind,
      payload: finalPayload,
    },
  });

  await prisma.thread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getThreadDetail(threadId: string, viewerUserId: string) {
  const thread = await prisma.thread.findFirst({
    where: {
      id: threadId,
      members: { some: { userId: viewerUserId } },
    },
    include: {
      members: { include: { user: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  return thread;
}

export async function listUserThreads(userId: string) {
  return prisma.thread.findMany({
    where: { members: { some: { userId } } },
    orderBy: { updatedAt: "desc" },
    include: {
      members: { include: { user: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}
