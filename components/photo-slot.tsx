import Image from "next/image";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo";

/**
 * Image frame for project/product photography.
 *
 * Drop a real photo in `/public` and pass `src` — until then it renders a
 * branded blueprint panel rather than a broken-looking empty box, so pages read
 * as intentional while the owner's photo library is being assembled.
 */
export function PhotoSlot({
  src,
  alt,
  label,
  className,
  ratio = "aspect-[4/3]",
  priority = false,
  blurDataURL,
  fit = "cover",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  zoomOnHover = false,
}: {
  src?: string;
  alt: string;
  /** Short caption shown on the placeholder, e.g. "Photo coming soon". */
  label?: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
  /** Tiny inline preview so photos fade in instead of popping. */
  blurDataURL?: string;
  /** `contain` for drawings and models, which must not be cropped. */
  fit?: "cover" | "contain";
  sizes?: string;
  /**
   * Slow zoom while an ancestor marked `group` is hovered. Deliberately opt-in:
   * it only makes sense where the whole card is a link, and it's wrong for
   * `contain` drawings, where scaling just shrinks the white margin.
   */
  zoomOnHover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-brand-navy-900",
        ratio,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
          className={cn(
            fit === "contain" ? "object-contain" : "object-cover",
            // Long and eased — a fast zoom reads as a jump, not as craft. The
            // reduced-motion block in globals.css collapses this transition.
            zoomOnHover &&
              "transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          )}
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div
            aria-hidden
            className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-brand-blue/35 blur-3xl"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <LogoMark className="h-12 w-12 opacity-70" title="" />
            {label && (
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.28em] text-white/45">
                {label}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
