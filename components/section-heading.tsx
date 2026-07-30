import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { RiseText } from "@/components/rise-text";

/**
 * The title is deliberately outside the surrounding Reveal. Nesting a masked
 * rise inside a block that is itself sliding up gives you two competing
 * transforms and the letters arrive looking soft. Here the eyebrow fades, the
 * title rises out from behind its mask, and the rule and description follow a
 * beat later — one sequence rather than three things moving at once.
 */
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
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal as="span" className={cn("eyebrow", onDark && "eyebrow-on-dark")}>
          {eyebrow}
        </Reveal>
      )}
      <h2
        className={cn(
          "mt-5 text-[2rem] font-medium leading-[1.12] sm:text-4xl md:text-[2.6rem]",
          onDark ? "text-white" : "text-brand-navy"
        )}
      >
        <RiseText delay={eyebrow ? 0.08 : 0}>{title}</RiseText>
      </h2>
      <Reveal delay={0.22}>
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
    </div>
  );
}
