import type { UserRole } from "@prisma/client";

export type DemoRole = UserRole;

export const DEMO_ROLES: Array<{
  role: DemoRole;
  label: string;
  blurb: string;
  seedName: string;
}> = [
  {
    role: "nurse",
    label: "Nurse",
    blurb: "Clinical desktop view — assign homework, post reports.",
    seedName: "Dr. Renée Lee",
  },
  {
    role: "patient",
    label: "Patient",
    blurb: "Mobile Today screen — daily check-ins, care plan.",
    seedName: "Margaret Okafor",
  },
  {
    role: "service",
    label: "Social & Protective",
    blurb: "Social services coordinator — nearby supports and resources.",
    seedName: "Tomás Alvarez",
  },
];

export function roleLabel(role: DemoRole): string {
  return DEMO_ROLES.find((r) => r.role === role)?.label ?? role;
}
