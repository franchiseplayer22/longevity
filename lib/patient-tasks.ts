import { prisma } from "@/lib/prisma";
import { HOMEWORK_KIND_META, isHomeworkKind } from "@/lib/homework";
import type { PatientTaskItem } from "@/lib/patient-today";
import type { PatientTask } from "@prisma/client";

export async function getPatientRecipientId(
  userId: string,
): Promise<string | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, familyKind: "patient" },
    orderBy: { createdAt: "asc" },
  });
  return membership?.recipientId ?? null;
}

export async function getTasksForPatientUser(
  userId: string,
): Promise<PatientTask[]> {
  const recipientId = await getPatientRecipientId(userId);
  if (!recipientId) return [];
  return prisma.patientTask.findMany({
    where: { recipientId },
    orderBy: [
      { completedAt: { sort: "asc", nulls: "first" } },
      { createdAt: "desc" },
    ],
  });
}

export function toDisplayTask(task: PatientTask): PatientTaskItem {
  const meta = isHomeworkKind(task.kind)
    ? HOMEWORK_KIND_META[task.kind]
    : HOMEWORK_KIND_META.other;
  return {
    id: task.id,
    title: task.title,
    subtitle: task.subtitle,
    time: task.completedAt
      ? `Done ${task.completedAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
      : `Assigned ${task.createdAt.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`,
    icon: meta.icon,
    tone: meta.tone,
    done: Boolean(task.completedAt),
  };
}
