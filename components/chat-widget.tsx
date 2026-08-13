"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { starterQuestions, type KnowledgeEntry } from "@/lib/knowledge";
import { retrieve } from "@/lib/knowledge-search";

/**
 * Answer desk — a retrieval chatbot over lib/knowledge.ts.
 *
 * Everything runs in the browser against a fixed knowledge base: no API, no
 * key, no per-message cost, and nothing to leak. The trade is that it can only
 * answer what we wrote down, so the failure path matters as much as the happy
 * one — when nothing matches confidently it says so plainly and offers the
 * near-misses plus a human, rather than guessing.
 */

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  bullets?: string[];
  link?: KnowledgeEntry["link"];
  /** Follow-up questions offered as tappable chips. */
  suggestions?: string[];
};

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: `Hi! Ask me anything about ${site.name} — services, materials, printing prices, or how to get a quote.`,
  suggestions: starterQuestions,
};

/** Long enough to read as a reply rather than a lookup, short enough to not annoy. */
const REPLY_DELAY_MS = 320;

function answerFor(query: string, nextId: number): Message {
  const { match, related } = retrieve(query);
  const suggestions = related.map((entry) => entry.question);

  if (!match) {
    return {
      id: nextId,
      role: "bot",
      text: `I don't have an answer for that one — I only know what's on this site, so I'd rather not guess. Try one of these, or reach a person on ${site.phone}.`,
      suggestions: suggestions.length > 0 ? suggestions : starterQuestions,
      link: { label: "Contact us", href: "/contact" },
    };
  }

  return {
    id: nextId,
    role: "bot",
    text: match.answer.join("\n\n"),
    bullets: match.bullets,
    link: match.link,
    suggestions,
  };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);

  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    const list = scrollRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, pending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes from anywhere inside the panel, and focus goes back to the
  // launcher so keyboard users aren't dropped at the top of the document.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function ask(query: string) {
    const trimmed = query.trim();
    if (!trimmed || pending) return;

    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      text: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setPending(true);

    const reply = answerFor(trimmed, nextId.current++);
    window.setTimeout(() => {
      setMessages((current) => [...current, reply]);
      setPending(false);
    }, REPLY_DELAY_MS);
  }

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full",
          "bg-brand-navy text-white shadow-lg shadow-brand-navy/25 transition-all duration-300",
          "hover:bg-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2",
          open && "scale-90 opacity-0 pointer-events-none"
        )}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Ask a question</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={`Ask ${site.name}`}
          className={cn(
            "fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl",
            "w-[min(23rem,calc(100vw-2.5rem))] h-[min(34rem,calc(100vh-2.5rem))]"
          )}
        >
          <header className="flex items-start justify-between gap-3 bg-brand-navy-900 px-5 py-4 text-white">
            <div>
              <p className="font-heading text-base font-medium leading-tight">
                Ask {site.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Instant answers · no waiting
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              className="-mr-1.5 -mt-1 rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto bg-brand-stone px-4 py-5"
          >
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  // aria-live on the container would re-announce the whole
                  // thread; announcing each reply as it arrives is what a
                  // screen reader user actually wants.
                  {...(message.role === "bot" ? { role: "status" } : {})}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "bot"
                      ? "bg-white text-foreground shadow-sm"
                      : "ml-auto bg-brand-navy text-white"
                  )}
                >
                  {message.text.split("\n\n").map((paragraph, index) => (
                    <p key={index} className={index > 0 ? "mt-2" : undefined}>
                      {paragraph}
                    </p>
                  ))}

                  {message.bullets && (
                    <ul className="mt-2 space-y-1">
                      {message.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span
                            aria-hidden
                            className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-brand-gold"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {message.link && (
                    <Link
                      href={message.link.href}
                      onClick={() => setOpen(false)}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
                    >
                      {message.link.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>

                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => ask(suggestion)}
                        className="rounded-full border border-border bg-white px-3 py-1.5 text-left text-xs font-medium text-brand-navy transition-colors hover:border-brand-blue/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {pending && (
              <div className="w-fit rounded-2xl bg-white px-4 py-3 shadow-sm">
                <span className="sr-only">Typing…</span>
                <span aria-hidden className="flex gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
            className="flex items-center gap-2 border-t border-border bg-white px-3 py-3"
          >
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question…"
              aria-label="Type your question"
              autoComplete="off"
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim() || pending}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white transition-colors hover:bg-brand-blue disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
