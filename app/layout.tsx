import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Elegant modern serif for a premium, timeless display voice.
const fraunces = Fraunces({
  variable: "--font-heading",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | Design-Build, Supply & Printing in Iloilo`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "construction Iloilo",
    "design and build Maasin",
    "construction supply Iloilo",
    "hollowblocks CHB",
    "blueprint printing Iloilo",
    "building permit processing",
    "Nan Builders",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: site.url,
    siteName: site.legalName,
    title: `${site.legalName}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.brandBlue,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: site.legalName,
  description: site.description,
  telephone: site.phoneIntl,
  email: site.email,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.province,
    addressCountry: "PH",
  },
  identifier: [
    { "@type": "PropertyValue", name: "Registration No.", value: site.registrationNo },
    { "@type": "PropertyValue", name: "DTI No.", value: site.dtiNo },
  ],
  areaServed: "Iloilo, Philippines",
  slogan: site.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
