import { PatientCheckInFlow } from "@/components/check-in/patient-check-in-flow";

export default async function CheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ taskId?: string }>;
}) {
  const { taskId } = await searchParams;
  return <PatientCheckInFlow taskId={taskId} />;
}
