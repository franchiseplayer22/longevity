import { prisma } from "@/lib/prisma";
import { MARGARET_CHART } from "@/lib/margaret-chart";
import type { CareReport, User } from "@prisma/client";

export type ReportWithAuthor = CareReport & {
  author: Pick<User, "id" | "name" | "role">;
  resolvedBy: Pick<User, "id" | "name"> | null;
};

export type DesktopPatientChartData = {
  recipientId: string;
  recipient: typeof MARGARET_CHART.recipient;
  vitals: typeof MARGARET_CHART.vitals;
  trend: typeof MARGARET_CHART.trend;
  labs: typeof MARGARET_CHART.labs;
  meds: typeof MARGARET_CHART.meds;
  io: typeof MARGARET_CHART.io;
  summary: string;
  handoff: typeof MARGARET_CHART.handoff;
  careTeam: typeof MARGARET_CHART.careTeam;
  reports: ReportWithAuthor[];
};

export async function getDesktopPatientChartData(
  recipientId: string,
): Promise<DesktopPatientChartData | null> {
  const recipient = await prisma.careRecipient.findUnique({
    where: { id: recipientId },
  });
  if (!recipient) return null;

  const reports = await prisma.careReport.findMany({
    where: { recipientId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      author: { select: { id: true, name: true, role: true } },
      resolvedBy: { select: { id: true, name: true } },
    },
  });

  return {
    recipientId: recipient.id,
    recipient: MARGARET_CHART.recipient,
    vitals: MARGARET_CHART.vitals,
    trend: MARGARET_CHART.trend,
    labs: MARGARET_CHART.labs,
    meds: MARGARET_CHART.meds,
    io: MARGARET_CHART.io,
    summary: MARGARET_CHART.summary,
    handoff: MARGARET_CHART.handoff,
    careTeam: MARGARET_CHART.careTeam,
    reports,
  };
}
