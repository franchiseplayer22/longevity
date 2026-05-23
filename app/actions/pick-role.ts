"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";
import { DEMO_ROLES, type DemoRole } from "@/lib/roles";
import { isDemoMode } from "@/lib/env";

const ROLE_VALUES: DemoRole[] = ["nurse", "patient", "service"];

export async function pickRole(role: DemoRole): Promise<void> {
  if (!isDemoMode()) {
    throw new Error("Demo mode is not enabled");
  }
  if (!ROLE_VALUES.includes(role)) {
    throw new Error(`Unknown role: ${role}`);
  }

  let user = await prisma.user.findFirst({
    where: { role },
    orderBy: { createdAt: "asc" },
  });

  if (!user) {
    const seed = DEMO_ROLES.find((r) => r.role === role);
    user = await prisma.user.create({
      data: {
        name: seed?.seedName ?? "Demo User",
        role,
        email: `demo+${role}@halo.local`,
      },
    });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/dashboard");
}
