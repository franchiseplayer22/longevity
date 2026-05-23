import { prisma } from "@/lib/prisma";
import { ensureDemoUser } from "@/lib/demo-users";
import { MARGARET_CHART } from "@/lib/margaret-chart";
import type { CareRecipient } from "@prisma/client";

export async function ensureDemoRecipient(): Promise<CareRecipient> {
  const existing = await prisma.careRecipient.findFirst({
    where: { name: MARGARET_CHART.recipient.name },
  });
  if (existing) {
    await ensurePatientMembership(existing.id);
    return existing;
  }
  const created = await prisma.careRecipient.create({
    data: { name: MARGARET_CHART.recipient.name },
  });
  await ensurePatientMembership(created.id);
  return created;
}

async function ensurePatientMembership(recipientId: string): Promise<void> {
  const patient = await ensureDemoUser("patient");
  const existing = await prisma.membership.findUnique({
    where: { userId_recipientId: { userId: patient.id, recipientId } },
  });
  if (existing) return;
  await prisma.membership.create({
    data: {
      userId: patient.id,
      recipientId,
      familyKind: "patient",
    },
  });
}

export async function getRecipientWithReports(id: string) {
  return prisma.careRecipient.findUnique({
    where: { id },
    include: {
      reports: {
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        include: {
          author: { select: { id: true, name: true, role: true } },
          resolvedBy: { select: { id: true, name: true } },
        },
      },
      memberships: {
        include: {
          user: { select: { id: true, name: true, role: true } },
        },
      },
    },
  });
}
