import { NextResponse } from "next/server";
import { topMatches } from "@/lib/knowledge-search";
import { site } from "@/lib/site";
import type { KnowledgeEntry } from "@/lib/knowledge";

/**
 * Conversational layer over the knowledge base.
 *
 * The widget works without this route — it falls back to retrieval-only answers
 * whenever this returns `grounded: false`. So the rule here is: fail fast and
 * hand back, never leave the visitor waiting or apologising. No key, blown
 * quota, slow model, malformed reply — all the same outcome, and the customer
 * still gets the answer we wrote.
 *
 * What the model adds is phrasing, follow-ups ("and how much for 500?") and
 * language matching. What it must never add is facts: the prompt hands it the
 * retrieved entries and forbids everything else, because a contractor quoted a
 * made-up price is a real problem, not a bad demo.
 */

export const runtime = "nodejs";

// gemini-2.5-flash is closed to new API keys — Google answers a request for it
// with a 404 pointing here instead.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

/** Past this the model is slower than the fallback is useful. */
const TIMEOUT_MS = 8000;
const MAX_MESSAGE_CHARS = 500;
/** Turns of history sent as context. Enough for a follow-up, bounded for cost. */
const MAX_HISTORY = 8;

type Turn = { role: "user" | "bot"; text: string };

/**
 * Per-IP throttle, held in memory.
 *
 * Deliberately the simple version: an in-process Map, so each running instance
 * counts separately and a determined abuser gets a multiple of the limit. It
 * exists to stop one bored visitor burning the day's quota, not to survive a
 * botnet. If this endpoint ever takes real traffic, move the counter to Redis —
 * the shape of the check doesn't change.
 */
const WINDOW_MS = 60_000;
/**
 * The free tier allows 5 generate_content requests a minute for the whole
 * project — not per visitor. So the account cap is the real limit and the
 * per-IP one only decides who gets to spend it; a single visitor holding the
 * whole minute is the case worth preventing.
 *
 * Going over isn't a failure: Google answers 429, the route reports
 * `grounded: false`, and the visitor gets the retrieval answer. That's the
 * whole reason the fallback exists. This just avoids spending every request on
 * one person and filling the logs with quota errors.
 */
const MAX_PER_IP = 3;
const MAX_TOTAL = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const fresh = (times: number[]) => times.filter((t) => now - t < WINDOW_MS);

  let total = 0;
  for (const [key, times] of hits) {
    const recent = fresh(times);
    if (recent.length === 0) hits.delete(key);
    else {
      hits.set(key, recent);
      total += recent.length;
    }
  }
  if (total >= MAX_TOTAL) return true;

  const mine = fresh(hits.get(ip) ?? []);
  if (mine.length >= MAX_PER_IP) return true;

  mine.push(now);
  hits.set(ip, mine);
  return false;
}

function contextFrom(entries: KnowledgeEntry[]): string {
  return entries
    .map((entry) => {
      const body = [...entry.answer, ...(entry.bullets ?? [])].join("\n");
      const link = entry.link
        ? "\nLink: " + entry.link.href + " (" + entry.link.label + ")"
        : "";
      return "### " + entry.question + "\n" + body + link;
    })
    .join("\n\n");
}

function systemPrompt(context: string): string {
  return [
    "You are the assistant on the website of " +
      site.legalName +
      ", a design-and-build contractor and construction supplier in " +
      site.address.city +
      ", " +
      site.address.province +
      ", Philippines.",
    "",
    "Answer ONLY from the reference material below. It is the complete set of facts you are allowed to state.",
    "",
    "Rules:",
    "- Never invent or estimate a price, a delivery date, a lead time, or a capability. If the reference material does not answer it, say so plainly and point them to " +
      site.phone +
      ".",
    "- Never promise anything on the company's behalf. \"We'll confirm when we quote\" is always the right register.",
    "- Reply in the language the visitor used. Taglish gets Taglish back.",
    "- Two or three sentences. This is a chat bubble on a phone, not a brochure.",
    "- Sound like a helpful person at the counter: direct, warm, no corporate padding, no emoji.",
    "- Prices from the reference material may be quoted exactly as written.",
    "- Never write a URL or a page path. The chat shows the link as a button under your reply, so refer to pages by name (\"the Supply page\") and let the button do the rest.",
    "- If they are ready to act, say so plainly or give the phone number.",
    "",
    "Reference material:",
    context,
  ].join("\n");
}

type GeminiPart = { text?: string; thought?: boolean };
type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  // No key configured is a normal state, not an error: the site ships without
  // one and the widget answers from the knowledge base on its own.
  if (!apiKey) return NextResponse.json({ grounded: false, reason: "no-key" });

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ grounded: false, reason: "bad-request" });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return NextResponse.json({ grounded: false, reason: "empty" });
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ grounded: false, reason: "too-long" });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ grounded: false, reason: "rate-limited" });
  }

  const history: Turn[] = Array.isArray(body.history)
    ? (body.history as Turn[])
        .filter(
          (turn) =>
            turn &&
            (turn.role === "user" || turn.role === "bot") &&
            typeof turn.text === "string"
        )
        .slice(-MAX_HISTORY)
    : [];

  // Retrieve against this message plus the last thing they asked, so a bare
  // follow-up ("how much?") still pulls the subject of the conversation.
  const previousQuestion =
    [...history].reverse().find((turn) => turn.role === "user")?.text ?? "";
  const entries = topMatches((previousQuestion + " " + message).trim(), 4);
  if (entries.length === 0) {
    return NextResponse.json({ grounded: false, reason: "no-context" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT + "/" + MODEL + ":generateContent", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt(contextFrom(entries)) }],
        },
        contents: [
          ...history.map((turn) => ({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }],
          })),
          { role: "user", parts: [{ text: message }] },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 400,
          // Flash reasons before answering by default and will spend the whole
          // budget thinking, returning MAX_TOKENS and no text — and this is a
          // lookup with the answer already in the prompt. Gemini 3 renamed this
          // knob: `thinkingBudget: 0` is a 400 here, and "none" isn't a legal
          // level either. "minimal" is as low as it goes.
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini " + response.status + ": " + (await response.text()));
      return NextResponse.json({ grounded: false, reason: "upstream" });
    }

    const data = (await response.json()) as GeminiResponse;
    // Reasoning comes back as parts flagged `thought`. They must not reach the
    // visitor — that's the model talking to itself, not to a customer.
    const text = data.candidates?.[0]?.content?.parts
      ?.filter((part) => !part.thought)
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) return NextResponse.json({ grounded: false, reason: "empty-reply" });

    // The link and follow-up chips still come from the retrieved entries, not
    // from the model — it can describe a page, but it can't invent a URL.
    return NextResponse.json({
      grounded: true,
      text,
      link: entries[0].link ?? null,
      suggestions: entries.slice(1, 4).map((entry) => entry.question),
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    if (!aborted) console.error("Gemini request failed:", error);
    return NextResponse.json({
      grounded: false,
      reason: aborted ? "timeout" : "error",
    });
  } finally {
    clearTimeout(timer);
  }
}
