"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { createThreadMessage } from "@/app/actions/messages";

export function MessageComposer({ threadId }: { threadId: string }) {
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const value = body.trim();
    if (!value || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await createThreadMessage(threadId, value);
      if (res.ok) {
        setBody("");
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--halo-ink)]/5 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-end gap-2 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Write a message…"
          className="flex-1 resize-none rounded-2xl border border-[color:var(--halo-ink)]/10 bg-[color:var(--halo-cream)]/60 px-4 py-3 text-sm leading-relaxed focus:border-[color:var(--halo-green)] focus:bg-white focus:outline-none"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={!body.trim() || pending}
          className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[color:var(--halo-green)] text-white shadow-[0_14px_28px_-18px_rgba(31,111,74,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <div className="mx-auto max-w-md px-4 pb-2 text-xs text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}
