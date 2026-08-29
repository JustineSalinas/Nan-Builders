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

/** Long enough that the nudge doesn't land while the page is still arriving. */
const NUDGE_DELAY_MS = 2600;
const NUDGE_KEY = "nb:chat-nudge-dismissed";
/** Past the hero, so the card never covers its Get a Quote and Call buttons. */
const NUDGE_AFTER_PX = 520;

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

type Turn = { role: Message["role"]; text: string };

/**
 * Ask the grounded route. Returns null whenever it declines — no key, rate
 * limited, timed out, offline — which the caller reads as "use the local
 * answer". Nothing here distinguishes the reasons, because nothing downstream
 * should behave differently: the visitor gets an answer either way.
 */
async function askModel(
  message: string,
  history: Turn[]
): Promise<Omit<Message, "id"> | null> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    });
    const data = await response.json();
    if (!data?.grounded || typeof data.text !== "string") return null;
    return {
      role: "bot",
      text: data.text,
      link: data.link ?? undefined,
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Resolve `work`, but never sooner than `ms`.
 *
 * A local answer returns in under a millisecond, which reads as canned rather
 * than considered. The floor keeps the rhythm the same whether the reply came
 * from the model or the file — and it runs alongside the work, so a slow model
 * isn't made slower.
 */
async function notBefore<T>(work: Promise<T>, ms: number): Promise<T> {
  const [value] = await Promise.all([
    work,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
  return value;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);

  const [nudge, setNudge] = useState(false);

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

  /**
   * Show the nudge once the visitor has had a moment to look at the page.
   *
   * Session storage, not local: it should stay out of the way for this visit,
   * but someone returning next week is a new conversation. Access is wrapped
   * because private windows and blocked site data make it throw rather than
   * return null.
   */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(NUDGE_KEY)) return;
    } catch {
      // Storage unavailable — show it, just don't remember the dismissal.
    }

    // Wait for both a beat and some scrolling. On a phone the card lands right
    // where the hero's own Get a Quote and Call buttons are, so appearing on
    // arrival would cover the two things we most want tapped. Past the hero
    // there's nothing underneath it, and a visitor who has scrolled is one
    // who's actually looking for something.
    let elapsed = false;
    let scrolled = false;
    const reveal = () => {
      if (elapsed && scrolled) setNudge(true);
    };

    const timer = setTimeout(() => {
      elapsed = true;
      reveal();
    }, NUDGE_DELAY_MS);

    function onScroll() {
      if (window.scrollY <= NUDGE_AFTER_PX) return;
      scrolled = true;
      reveal();
      window.removeEventListener("scroll", onScroll);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Opening the chat answers the question the nudge was asking.
  useEffect(() => {
    if (open) dismissNudge();
  }, [open]);

  function dismissNudge() {
    setNudge(false);
    try {
      sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      // Nothing to do; it simply won't be remembered.
    }
  }

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

  /**
   * Ask the grounded model first, fall back to plain retrieval.
   *
   * The fallback isn't an error path, it's the floor: no API key configured, no
   * network, quota gone, model slow — the visitor still gets the answer we
   * wrote, and never sees a failure. `/api/chat` is built to decline quickly
   * rather than hang, which is why there's no state here beyond typing dots.
   */
  async function ask(query: string) {
    const trimmed = query.trim();
    if (!trimmed || pending) return;

    const history = messages
      .filter((m) => m.id !== GREETING.id)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", text: trimmed },
    ]);
    setDraft("");
    setPending(true);

    const grounded = await notBefore(askModel(trimmed, history), REPLY_DELAY_MS);
    const reply: Message = grounded
      ? { id: nextId.current++, ...grounded }
      : answerFor(trimmed, nextId.current++);

    setMessages((current) => [...current, reply]);
    setPending(false);
  }

  return (
    <>
      {/*
        A nudge, because an unlabelled circle in the corner is easy to read as
        decoration. It waits for the visitor to settle, dismisses for the rest
        of the session once closed, and never reappears after the chat has been
        opened — a prompt that keeps asking is an irritation, not an invitation.
      */}
      {nudge && !open && (
        <div className="fixed bottom-[10rem] right-5 z-50 w-[15.5rem] md:bottom-[5.25rem]">
          <div className="relative rounded-2xl border border-border bg-white p-4 shadow-xl">
            <button
              type="button"
              onClick={dismissNudge}
              className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Dismiss</span>
            </button>
            <button
              type="button"
              onClick={() => {
                dismissNudge();
                setOpen(true);
              }}
              className="block w-full pr-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <p className="font-heading text-base font-medium text-brand-navy">
                Any inquiries?
              </p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                Ask about prices, materials or getting a quote — answered right
                here.
              </p>
            </button>
          </div>
          {/* Points at the launcher below it. */}
          <div
            aria-hidden
            className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-border bg-white"
          />
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          // Sits above the mobile call bar on phones, back down on desktop.
          "fixed bottom-24 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full md:bottom-5",
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
            "fixed bottom-24 right-5 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl md:bottom-5",
            "w-[min(23rem,calc(100vw-2.5rem))] h-[min(34rem,calc(100vh-8.5rem))] md:h-[min(34rem,calc(100vh-2.5rem))]"
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
