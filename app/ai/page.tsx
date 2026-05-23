import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PatientAiChat } from "@/components/ai/patient-ai-chat";

export default async function AiPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/");
  return <PatientAiChat />;
}
