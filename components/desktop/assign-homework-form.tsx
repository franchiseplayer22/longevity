"use client";

import { useState, useTransition } from "react";
import { GraduationCap, X } from "lucide-react";
import {
  HOMEWORK_KINDS,
  HOMEWORK_KIND_META,
  type HomeworkKind,
} from "@/lib/homework";
import { assignHomework } from "@/app/actions/homework";

export function AssignHomeworkForm({ recipientId }: { recipientId: string }) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<HomeworkKind>("walk");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await assignHomework(recipientId, { kind, title, subtitle });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setTitle("");
      setSubtitle("");
      setOpen(false);
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-2xl bg-[color:var(--halo-gold)] px-3.5 py-2 text-sm font-semibold text-white"
      >
        <GraduationCap className="h-4 w-4" />
        Assign homework
      </button>
    );
  }

  return (
    <div className="w-[360px] rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white p-4 shadow-[0_24px_60px_-32px_rgba(20,36,27,0.5)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[color:var(--halo-ink)]">
          Assign homework
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[color:var(--halo-muted)] hover:bg-[color:var(--halo-cream)]/70"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
            Kind
          </span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as HomeworkKind)}
            className="mt-1 w-full rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2 text-sm"
          >
            {HOMEWORK_KINDS.map((k) => (
              <option key={k} value={k}>
                {HOMEWORK_KIND_META[k].label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
            Title
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 10-minute hallway walk"
            className="mt-1 w-full rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
            Subtitle / instructions
          </span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="With walker · before PT"
            className="mt-1 w-full rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2 text-sm"
          />
        </label>
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-2xl px-3 py-2 text-sm font-medium text-[color:var(--halo-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || !title.trim()}
            className="rounded-2xl bg-[color:var(--halo-gold)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? "Assigning…" : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
