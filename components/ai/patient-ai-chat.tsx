"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { renderPlanComponent } from "@/components/plan/cards";
import { AI_SUGGESTIONS, resolveReply, type AiReply } from "@/lib/ai-replies";
import { AugurInsightCard } from "./augur-insight-card";

type ChatMessage =
  | { id: string; from: "user"; text: string }
  | { id: string; from: "ai"; reply: AiReply };

const TYPING_MIN_MS = 450;
const TYPING_MAX_MS = 950;

export function PatientAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      from: "user",
      text,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const startedAt = Date.now();
    const minDelay =
      TYPING_MIN_MS + Math.random() * (TYPING_MAX_MS - TYPING_MIN_MS);
    void (async () => {
      const reply = await resolveReply(text);
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, minDelay - elapsed);
      window.setTimeout(() => {
        setMessages((m) => [
          ...m,
          { id: `a-${Date.now()}`, from: "ai", reply },
        ]);
        setTyping(false);
      }, wait);
    })();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--halo-cream)]/30">
      <header className="sticky top-0 z-20 border-b border-[color:var(--halo-ink)]/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <Link
            href="/plan"
            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[color:var(--halo-cream)]/70 text-[color:var(--halo-ink)]"
            aria-label="Back to plan"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-1 items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--halo-green)] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-semibold text-[color:var(--halo-ink)]">
                Halo AI
              </div>
              <div className="text-[11px] uppercase tracking-wider text-[color:var(--halo-muted)]">
                Care assistant
              </div>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="mx-auto w-full max-w-md flex-1 overflow-y-auto px-4 pb-32 pt-4">
        {messages.length === 0 ? (
          <EmptyState onPick={send} />
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((m) => (
              <li key={m.id}>{renderMessage(m)}</li>
            ))}
            {typing && (
              <li>
                <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-3 py-2.5 text-sm shadow-sm">
                  <Dot />
                  <Dot delay="150ms" />
                  <Dot delay="300ms" />
                </div>
              </li>
            )}
          </ul>
        )}
      </div>

      <Composer
        value={input}
        onChange={setInput}
        onSubmit={() => send(input)}
        disabled={typing}
      />
    </div>
  );
}

function renderMessage(m: ChatMessage) {
  if (m.from === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-[color:var(--halo-green)] px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
          {m.text}
        </div>
      </div>
    );
  }
  if (m.reply.kind === "text") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[80%] rounded-2xl bg-white px-4 py-2.5 text-sm leading-relaxed text-[color:var(--halo-ink)] shadow-sm">
          {m.reply.text}
        </div>
      </div>
    );
  }
  if (m.reply.kind === "augur") {
    return (
      <div className="flex flex-col gap-2">
        {m.reply.intro && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl bg-white px-4 py-2.5 text-sm leading-relaxed text-[color:var(--halo-ink)] shadow-sm">
              {m.reply.intro}
            </div>
          </div>
        )}
        <AugurInsightCard data={m.reply.data} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {m.reply.intro && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl bg-white px-4 py-2.5 text-sm leading-relaxed text-[color:var(--halo-ink)] shadow-sm">
            {m.reply.intro}
          </div>
        </div>
      )}
      <div>{renderPlanComponent(m.reply.item)}</div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--halo-green)] text-white">
        <Sparkles className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-[color:var(--halo-ink)]">
        Ask Halo AI
      </h2>
      <p className="mt-1 max-w-xs text-sm text-[color:var(--halo-muted)]">
        I can find local support, suggest meals, or pull up products that help.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2">
        {AI_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-2xl border border-[color:var(--halo-ink)]/10 bg-white px-4 py-3 text-left text-sm font-medium text-[color:var(--halo-ink)] transition hover:border-[color:var(--halo-green)]/40 hover:bg-[color:var(--halo-green-soft)]/40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--halo-ink)]/5 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-md items-end gap-2 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={1}
          placeholder="Ask Halo AI…"
          className="flex-1 resize-none rounded-2xl border border-[color:var(--halo-ink)]/10 bg-[color:var(--halo-cream)]/60 px-4 py-3 text-sm leading-relaxed focus:border-[color:var(--halo-green)] focus:bg-white focus:outline-none"
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-[color:var(--halo-green)] text-white shadow-[0_14px_28px_-18px_rgba(31,111,74,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="halo-typing-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--halo-muted)]"
      style={{ animationDelay: delay }}
    />
  );
}
