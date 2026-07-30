import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { submissionSchema } from "@/lib/validation";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Delivery goes over plain SMTP rather than a provider SDK so the mail host is
 * an environment concern, not a code one: Gmail works today with an App
 * Password and no domain, and swapping to Resend, Brevo or anything else once
 * the domain lands is an env-var change with no edit here.
 *
 * Port 465 is implicit TLS; everything else (587, 25) starts plaintext and
 * upgrades via STARTTLS, which is what `secure: false` means to nodemailer.
 */
function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

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

  const transport = getTransport();
  // Most hosts reject a From they don't own, so it defaults to the authenticated
  // mailbox. The enquirer goes in Reply-To, which is what you actually hit reply on.
  const from = process.env.CONTACT_FROM || process.env.SMTP_USER || "";
  const to = process.env.CONTACT_TO || site.email;

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
  if (!transport) {
    console.warn("[contact] SMTP not configured — submission not emailed:", {
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
    await transport.sendMail({
      from,
      to,
      replyTo: data.email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or call us." },
      { status: 500 }
    );
  }
}
