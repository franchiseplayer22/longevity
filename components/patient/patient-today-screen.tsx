import { PatientShell } from "./patient-shell";
import { RecoveryCard } from "./recovery-card";
import { TaskList } from "./task-list";
import { WearableCard } from "./wearable-card";
import { CareTeamCard } from "./care-team-card";
import {
  CARE_TEAM_UPDATE,
  RECOVERY,
  TASKS,
  WEARABLE,
} from "@/lib/patient-today";

export function PatientTodayScreen({ firstName }: { firstName: string }) {
  return (
    <PatientShell
      greeting={`Good morning, ${firstName}.`}
      subhead="Here's what your care team has lined up today."
    >
      <RecoveryCard {...RECOVERY} />
      <TaskList tasks={TASKS} />
      <WearableCard {...WEARABLE} />
      <CareTeamCard {...CARE_TEAM_UPDATE} />
    </PatientShell>
  );
}
