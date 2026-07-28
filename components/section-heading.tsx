import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", onDark && "eyebrow-on-dark")}>{eyebrow}</span>
      )}
      <h2
        className={cn(
          "mt-5 text-[2rem] font-medium leading-[1.12] sm:text-4xl md:text-[2.6rem]",
          onDark ? "text-white" : "text-brand-navy"
        )}
      >
        {title}
      </h2>
      <span className={cn("accent-rule mt-6", align === "center" && "mx-auto")} />
      {description && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed sm:text-[1.05rem]",
            onDark ? "text-slate-300" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
