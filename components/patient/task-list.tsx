import Link from "next/link";
import { Circle, Check } from "lucide-react";
import { IconBadge } from "./icon-badge";
import { PatientCard } from "./patient-card";
import type { PatientTaskItem } from "@/lib/patient-today";

export function TaskList({ tasks }: { tasks: PatientTaskItem[] }) {
  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <PatientCard
      eyebrow="Today"
      title="Your care tasks"
      action={
        <span className="text-xs font-medium text-[color:var(--halo-muted)]">
          {pending.length} left
        </span>
      }
    >
      <ul className="-mx-1 flex flex-col">
        {[...pending, ...done].map((task) => (
          <li key={task.id}>
            <Link
              href={`/check-in?taskId=${task.id}`}
              className="flex items-center gap-3 rounded-2xl px-1 py-2.5 transition hover:bg-[color:var(--halo-green-soft)]/40"
            >
              <IconBadge icon={task.icon} tone={task.tone} />
              <span className="flex-1 min-w-0">
                <span
                  className={`block truncate text-sm font-medium ${
                    task.done
                      ? "text-[color:var(--halo-muted)] line-through"
                      : "text-[color:var(--halo-ink)]"
                  }`}
                >
                  {task.title}
                </span>
                <span className="block truncate text-xs text-[color:var(--halo-muted)]">
                  {task.subtitle}
                  {task.time ? ` · ${task.time}` : ""}
                </span>
              </span>
              {task.done ? (
                <Check className="h-4 w-4 text-[color:var(--halo-green)]" />
              ) : (
                <Circle className="h-4 w-4 text-[color:var(--halo-muted)]/60" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </PatientCard>
  );
}
