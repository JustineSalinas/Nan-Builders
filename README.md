# Nan Builders & Construction Supply — Website

Marketing site for **Nan Builders & Construction Supply** (Maasin, Iloilo): design-and-build
construction, construction material supply, hauling, and large-format printing.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**
(Base UI), **motion**, and **Resend** for the contact forms.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in RESEND_API_KEY to enable email (optional)
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project structure

```
app/
  layout.tsx            Root layout: fonts, header/footer, SEO metadata, JSON-LD
  page.tsx              Home
  about | services | projects | supply | printing | insights | careers | contact
  api/contact/route.ts  Form handler (Resend email + graceful fallback)
  sitemap.ts, robots.ts SEO
components/
  layout/               site-header, site-footer
  sections/             home-hero, service-grid, cta-band
  brand/logo.tsx        SVG monogram (placeholder — swap for official assets)
  ui/                   shadcn/ui primitives + ButtonLink
  contact-form.tsx, careers-form.tsx, page-hero, section-heading, reveal, empty-state
lib/
  site.ts               Business info, contact details, nav, values  ← edit here
  services.ts           The 10 services
  pricing.ts            Printing price list + supply catalog
  validation.ts         Zod schemas for the forms
```

**Most content edits live in `lib/`** — change contact details in `lib/site.ts`,
services in `lib/services.ts`, printing rates in `lib/pricing.ts`.

## Contact forms

The Contact and Careers forms POST to `/api/contact`, which emails
`renan.nanbuilders@gmail.com` via Resend.

- **With `RESEND_API_KEY` set:** submissions are emailed (reply-to = the sender).
- **Without it:** the form still validates and shows a friendly message directing
  users to call/email directly. Nothing breaks.

To enable email: create a Resend account, add `RESEND_API_KEY` and `CONTACT_FROM`
to `.env.local` (and to your host's env vars). For production, verify your domain
in Resend so mail sends from `@nanbuilders.com`.

## TODO / owner to provide

Search the codebase for `TODO:` to find content slots awaiting real assets:

- Official logo vector (replace `components/brand/logo.tsx`) and update the favicon.
- Real project photos + case studies (`app/projects/page.tsx`).
- Blog posts / client reviews (`app/insights/page.tsx`).
- Google Map embed on the Contact page.
- Facebook/social links and confirmed business hours in `lib/site.ts`.
- Set the live domain (`site.url` in `lib/site.ts`).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected.
3. Add env vars `RESEND_API_KEY` and `CONTACT_FROM` in Project Settings → Environment Variables.
4. Deploy. Add your custom domain and update `site.url` in `lib/site.ts`.
