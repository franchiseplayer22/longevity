"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  getOrCreateDirectThread,
  insertThreadMessage,
} from "@/lib/threads";
import { isHomeworkKind, HOMEWORK_KIND_META } from "@/lib/homework";
import { getPatientRecipientId } from "@/lib/patient-tasks";

export async function assignHomework(
  recipientId: string,
  input: { kind: string; title: string; subtitle: string },
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Not signed in" };
  if (me.role !== "nurse" && me.role !== "service") {
    return { ok: false, error: "Only clinical roles can assign homework" };
  }
  if (!isHomeworkKind(input.kind)) {
    return { ok: false, error: "Invalid task kind" };
  }
  const title = input.title.trim();
  const subtitle = input.subtitle.trim();
  if (!title) return { ok: false, error: "Title required" };

  const patientMembership = await prisma.membership.findFirst({
    where: { recipientId, familyKind: "patient" },
    include: { user: true },
  });
  if (!patientMembership) {
    return { ok: false, error: "No patient is linked to this recipient yet" };
  }
  const patient = patientMembership.user;

  const thread = await getOrCreateDirectThread(me.id, patient.id, {
    rolesByUser: { [me.id]: me.role, [patient.id]: patient.role },
  });

  const task = await prisma.patientTask.create({
    data: {
      recipientId,
      assignedById: me.id,
      title,
      subtitle,
      kind: input.kind,
      threadId: thread.id,
    },
  });

  const meta = HOMEWORK_KIND_META[input.kind];
  const body = subtitle
    ? `Homework assigned — ${meta.label}: ${title}. ${subtitle}`
    : `Homework assigned — ${meta.label}: ${title}.`;

  const message = await insertThreadMessage({
    threadId: thread.id,
    authorId: me.id,
    body,
    kind: "homework_assigned",
    payload: { taskId: task.id, homeworkKind: input.kind, title, subtitle },
  });

  await prisma.patientTask.update({
    where: { id: task.id },
    data: { messageId: message.id },
  });

  await recordAudit({
    userId: me.id,
    action: "patient_task.assigned",
    subject: task.id,
    meta: { recipientId, kind: input.kind, threadId: thread.id },
  });

  revalidatePath(`/recipients/${recipientId}`);
  revalidatePath(`/messages/${thread.id}`);
  return { ok: true, id: task.id };
}

export async function submitTaskCompletion(
  taskId: string,
  input: { painScore?: number; note?: string; photoUrl?: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Not signed in" };

  const task = await prisma.patientTask.findUnique({ where: { id: taskId } });
  if (!task) return { ok: false, error: "Task not found" };

  const recipientId = await getPatientRecipientId(me.id);
  if (recipientId !== task.recipientId) {
    return { ok: false, error: "This task isn't assigned to you" };
  }
  if (task.completedAt) return { ok: true };

  const updated = await prisma.patientTask.update({
    where: { id: taskId },
    data: {
      completedAt: new Date(),
      painScore: input.painScore ?? null,
      note: input.note?.trim() || null,
      photoUrl: input.photoUrl || null,
    },
  });

  if (updated.threadId) {
    const parts: string[] = [`Completed: ${updated.title}.`];
    if (updated.painScore !== null && updated.painScore !== undefined) {
      parts.push(`Pain ${updated.painScore}/10.`);
    }
    if (updated.note) parts.push(`Note: ${updated.note}`);
    if (updated.photoUrl) parts.push("Photo attached.");
    await insertThreadMessage({
      threadId: updated.threadId,
      authorId: me.id,
      body: parts.join(" "),
      kind: "homework_completed",
      payload: {
        taskId: updated.id,
        painScore: updated.painScore ?? null,
        note: updated.note ?? null,
        photoUrl: updated.photoUrl ?? null,
      },
    });
    revalidatePath(`/messages/${updated.threadId}`);
  }

  await recordAudit({
    userId: me.id,
    action: "patient_task.completed",
    subject: updated.id,
    meta: { recipientId: updated.recipientId, kind: updated.kind },
  });

  revalidatePath(`/dashboard`);
  revalidatePath(`/recipients/${updated.recipientId}`);
  return { ok: true };
}

