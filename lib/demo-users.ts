import { prisma } from "@/lib/prisma";
import { DEMO_ROLES, type DemoRole } from "@/lib/roles";
import type { User } from "@prisma/client";

export async function ensureDemoUser(role: DemoRole): Promise<User> {
  const existing = await prisma.user.findFirst({
    where: { role },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;
  const seed = DEMO_ROLES.find((r) => r.role === role);
  return prisma.user.create({
    data: {
      name: seed?.seedName ?? `Demo ${role}`,
      role,
      email: `demo+${role}@halo.local`,
    },
  });
}
