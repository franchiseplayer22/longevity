"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { ensureDemoRecipient } from "@/lib/recipients";

const REPORT_KINDS = ["incident", "observation", "handoff", "note"] as const;
type ReportKind = (typeof REPORT_KINDS)[number];

function assertCaregiver(role: string) {
  if (role !== "nurse" && role !== "service") {
    throw new Error("Only clinical roles can post or resolve reports");
  }
}

export async function createCareReport(
  recipientId: string,
  input: { kind: ReportKind; title: string; body: string },
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Not signed in" };
  if (me.role === "patient") {
    return { ok: false, error: "Patients can't post care reports" };
  }
  if (!REPORT_KINDS.includes(input.kind)) {
    return { ok: false, error: "Invalid report kind" };
  }
  const title = input.title.trim();
  const body = input.body.trim();
  if (!title || !body) return { ok: false, error: "Title and body required" };

  const report = await prisma.careReport.create({
    data: {
      recipientId,
      authorId: me.id,
      kind: input.kind,
      title,
      body,
    },
  });

  await recordAudit({
    userId: me.id,
    action: "report.created",
    subject: report.id,
    meta: { recipientId, kind: input.kind },
  });

  revalidatePath(`/recipients/${recipientId}`);
  return { ok: true, id: report.id };
}

export async function resolveCareReport(
  reportId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const me = await getCurrentUser();
  if (!me) return { ok: false, error: "Not signed in" };
  assertCaregiver(me.role);

  const report = await prisma.careReport.findUnique({ where: { id: reportId } });
  if (!report) return { ok: false, error: "Report not found" };
  if (report.status === "resolved") return { ok: true };

  await prisma.careReport.update({
    where: { id: reportId },
    data: {
      status: "resolved",
      resolvedAt: new Date(),
      resolvedById: me.id,
    },
  });

  await recordAudit({
    userId: me.id,
    action: "report.resolved",
    subject: report.id,
    meta: { recipientId: report.recipientId },
  });

  revalidatePath(`/recipients/${report.recipientId}`);
  return { ok: true };
}

export async function openDemoRecipient(): Promise<void> {
  const me = await getCurrentUser();
  if (!me) redirect("/");
  const recipient = await ensureDemoRecipient();
  redirect(`/recipients/${recipient.id}`);
}
