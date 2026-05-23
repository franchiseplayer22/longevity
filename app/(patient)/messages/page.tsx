import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CarePlanProvider } from "@/components/plan/care-plan-provider";
import { PatientCarePlanScreen } from "@/components/plan/patient-care-plan-screen";

export default async function MessagesPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/");

  const firstName = me.name.split(" ")[0] ?? "friend";

  return (
    <CarePlanProvider userKey={me.id}>
      <PatientCarePlanScreen firstName={firstName} />
    </CarePlanProvider>
  );
}
