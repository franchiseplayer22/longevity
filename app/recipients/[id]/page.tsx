import { notFound, redirect } from "next/navigation";
import { Smartphone } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDesktopPatientChartData } from "@/lib/patient-view";
import { DesktopShell } from "@/components/desktop/desktop-shell";
import { RecipientSidebar } from "@/components/desktop/recipient-sidebar";
import { DesktopPatientChart } from "@/components/desktop/desktop-patient-chart";

export default async function RecipientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) redirect("/");
  if (me.role === "patient") redirect("/dashboard");

  const data = await getDesktopPatientChartData(id);
  if (!data) notFound();

  return (
    <>
      <DesktopShell
        sidebar={
          <RecipientSidebar
            activeId={id}
            recipients={[
              {
                id,
                name: data.recipient.name,
                subtitle: `POD ${data.recipient.postopDay} · ${data.recipient.procedure}`,
                status: "Active",
              },
            ]}
          />
        }
      >
        <DesktopPatientChart data={data} />
      </DesktopShell>

      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center md:hidden">
        <Smartphone className="h-10 w-10 text-[color:var(--halo-muted)]" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          Open this on a desktop
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--halo-muted)]">
          The clinical chart is built for a larger screen. We'll ship a mobile
          summary view for clinicians in a future phase.
        </p>
      </main>
    </>
  );
}
