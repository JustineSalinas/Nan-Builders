"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { allNav, mainNav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/*
       * The address / phone / email strip that used to sit above this bar now
       * lives in the footer and on the Contact and About pages. A single phone
       * link is kept here because it is the primary conversion path.
       */}
      <div className="border-b border-border bg-brand-ivory/85 backdrop-blur supports-[backdrop-filter]:bg-brand-ivory/70">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label={site.legalName}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-brand-navy",
                  isActive(item.href) && "text-brand-navy"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-px h-px bg-brand-blue transition-transform duration-300 ease-out",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${site.phoneRaw}`}
              className="hidden items-center gap-2 text-sm font-medium text-brand-navy transition-colors hover:text-brand-blue xl:inline-flex"
            >
              <Phone className="h-4 w-4 text-brand-blue" />
              {site.phone}
            </a>

            <ButtonLink href="/contact" tone="blue" className="hidden sm:inline-flex">
              Get a Quote
            </ButtonLink>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-lg"
                    className="lg:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                {/* Mobile has room for the full site — no need to trim here. */}
                <nav className="mt-2 flex flex-col px-4">
                  {allNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "border-b border-border/70 py-3 text-base font-medium text-foreground",
                        isActive(item.href) && "text-brand-navy"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-4 flex flex-col gap-2 px-4">
                  <ButtonLink href="/contact" tone="blue" className="w-full">
                    Get a Quote
                  </ButtonLink>
                  <ButtonLink
                    href={`tel:${site.phoneRaw}`}
                    external
                    tone="outlineNavy"
                    className="w-full"
                  >
                    <Phone className="h-4 w-4" /> {site.phone}
                  </ButtonLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
