import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { services, type Service } from "@/lib/services";
import { cn } from "@/lib/utils";

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <Reveal delay={(index % 3) * 0.06}>
      <Link
        href="/services"
        className="hover-lift group flex h-full flex-col rounded-xl border border-border bg-card p-7 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_20px_50px_-24px_rgba(15,39,67,0.35)]"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy transition-colors duration-300 group-hover:bg-brand-navy group-hover:text-brand-gold-200">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <ArrowUpRight className="h-5 w-5 text-border transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-gold-600" />
        </div>
        <h3 className="mt-6 font-heading text-xl font-medium leading-snug text-brand-navy">
          {service.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {service.summary}
        </p>
      </Link>
    </Reveal>
  );
}

export function ServiceGrid({
  limit,
  className,
}: {
  limit?: number;
  className?: string;
}) {
  const list = limit ? services.slice(0, limit) : services;
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {list.map((service, i) => (
        <ServiceCard key={service.slug} service={service} index={i} />
      ))}
    </div>
  );
}
