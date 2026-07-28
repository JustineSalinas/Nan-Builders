import { NextResponse } from "next/server";
import { Resend } from "resend";
import { submissionSchema } from "@/lib/validation";
import { site } from "@/lib/site";

export const runtime = "nodejs";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Honeypot triggered — pretend success, drop silently.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM || "Nan Builders <onboarding@resend.dev>";

  const isCareers = data.type === "careers";
  const subject = isCareers
    ? `New application: ${data.role} — ${data.name}`
    : `New inquiry${data.service ? ` (${data.service})` : ""} — ${data.name}`;

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ...(isCareers
      ? ([
          ["Role", data.role],
          ["Portfolio", data.portfolio || "—"],
        ] as [string, string][])
      : ([["Service", data.service || "—"]] as [string, string][])),
    ["Message", data.message],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#0f172a">
      <h2 style="color:#0b2a6b">${escapeHtml(subject)}</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${k}</td><td style="padding:6px 12px">${escapeHtml(
                v
              ).replace(/\n/g, "<br/>")}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  // Graceful fallback when email isn't configured yet.
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — submission not emailed:", {
      type: data.type,
      name: data.name,
    });
    return NextResponse.json({
      ok: true,
      delivered: false,
      message: `Thanks, ${data.name}! Email delivery isn't fully set up yet — please also reach us directly at ${site.email} or ${site.phone}.`,
    });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: site.email,
      replyTo: data.email,
      subject,
      html,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "We couldn't send your message. Please try again or call us." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}
