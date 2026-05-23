import { CircleCheck, Circle, GraduationCap } from "lucide-react";
import type { TaskWithAssignor } from "@/lib/patient-view";
import {
  HOMEWORK_KIND_META,
  isHomeworkKind,
  type HomeworkKind,
} from "@/lib/homework";

export function HomeworkPanel({
  tasks,
}: {
  tasks: TaskWithAssignor[];
}) {
  if (tasks.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-[color:var(--halo-ink)]/15 bg-white/50 px-5 py-4 text-sm text-[color:var(--halo-muted)]">
        <span className="inline-flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          No homework assigned yet. Use the gold button above to assign one.
        </span>
      </section>
    );
  }

  const pending = tasks.filter((t) => !t.completedAt);
  const done = tasks.filter((t) => t.completedAt);

  return (
    <section className="rounded-3xl border border-[color:var(--halo-ink)]/10 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(20,36,27,0.4)]">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6ecd6] text-[color:var(--halo-gold)]">
            <GraduationCap className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--halo-muted)]">
              Homework
            </div>
            <h2 className="text-base font-semibold tracking-tight text-[color:var(--halo-ink)]">
              Assigned to patient
            </h2>
          </div>
        </div>
        <span className="text-xs text-[color:var(--halo-muted)]">
          {pending.length} pending · {done.length} completed
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[...pending, ...done].map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </section>
  );
}

function TaskCard({ task }: { task: TaskWithAssignor }) {
  const kindKey: HomeworkKind = isHomeworkKind(task.kind) ? task.kind : "other";
  const Icon = HOMEWORK_KIND_META[kindKey].icon;
  const done = Boolean(task.completedAt);
  return (
    <div
      className={`rounded-2xl border p-4 ${
        done
          ? "border-[color:var(--halo-ink)]/5 bg-[color:var(--halo-cream)]/40"
          : "border-[color:var(--halo-gold)]/30 bg-[#fdf6e6]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white text-[color:var(--halo-gold)]">
          <Icon className="h-4 w-4" />
        </span>
        {done ? (
          <CircleCheck className="h-4 w-4 text-[color:var(--halo-green)]" />
        ) : (
          <Circle className="h-4 w-4 text-[color:var(--halo-muted)]/60" />
        )}
      </div>
      <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
        {HOMEWORK_KIND_META[kindKey].label}
      </div>
      <div
        className={`mt-0.5 text-sm font-semibold ${
          done
            ? "text-[color:var(--halo-muted)] line-through"
            : "text-[color:var(--halo-ink)]"
        }`}
      >
        {task.title}
      </div>
      {task.subtitle && (
        <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--halo-ink)]/75">
          {task.subtitle}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[color:var(--halo-muted)]">
        <span>by {task.assignedBy.name.split(" ").slice(-1)[0]}</span>
        <span>
          {done
            ? `done ${task.completedAt?.toLocaleDateString()}`
            : task.createdAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
