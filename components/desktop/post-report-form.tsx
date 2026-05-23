"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { createCareReport } from "@/app/actions/recipients";

const KINDS = [
  { value: "observation", label: "Observation" },
  { value: "incident", label: "Incident" },
  { value: "handoff", label: "Handoff" },
  { value: "note", label: "Note" },
] as const;
type Kind = (typeof KINDS)[number]["value"];

export function PostReportForm({
  recipientId,
  tone = "green",
}: {
  recipientId: string;
  tone?: "green" | "gold";
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("observation");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const buttonClass =
    tone === "gold"
      ? "bg-[color:var(--halo-gold)] text-white"
      : "bg-[color:var(--halo-green)] text-white";

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await createCareReport(recipientId, { kind, title, body });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setTitle("");
      setBody("");
      setOpen(false);
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-semibold ${buttonClass}`}
      >
        <Plus className="h-4 w-4" />
        Post report
      </button>
    );
  }

  return (
    <div className="w-[360px] rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white p-4 shadow-[0_24px_60px_-32px_rgba(20,36,27,0.5)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[color:var(--halo-ink)]">
          New care report
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
            onChange={(e) => setKind(e.target.value as Kind)}
            className="mt-1 w-full rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
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
            placeholder="e.g. Incision slightly warm at lateral edge"
            className="mt-1 w-full rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-[color:var(--halo-muted)]">
            Body
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="What did you observe? What should the team do?"
            className="mt-1 w-full resize-none rounded-xl border border-[color:var(--halo-ink)]/10 bg-white px-3 py-2 text-sm leading-relaxed"
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
            disabled={pending || !title.trim() || !body.trim()}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold ${buttonClass} disabled:opacity-50`}
          >
            {pending ? "Posting…" : "Post report"}
          </button>
        </div>
      </div>
    </div>
  );
}
