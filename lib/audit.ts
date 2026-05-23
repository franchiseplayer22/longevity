import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type AuditAction =
  | "thread.read"
  | "thread.message.send"
  | "report.created"
  | "report.resolved"
  | "patient_task.assigned"
  | "patient_task.completed";

export async function recordAudit({
  userId,
  action,
  subject,
  meta,
}: {
  userId: string | null;
  action: AuditAction | string;
  subject?: string;
  meta?: Prisma.InputJsonValue;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? undefined,
        action,
        subject,
        meta,
      },
    });
  } catch (err) {
    // Audit must not break the user flow.
    console.error("[audit] failed to record", action, err);
  }
}
