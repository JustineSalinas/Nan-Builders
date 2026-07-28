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
}: {
  src?: string;
  alt: string;
  /** Short caption shown on the placeholder, e.g. "Photo coming soon". */
  label?: string;
  className?: string;
  ratio?: string;
  priority?: boolean;
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
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
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
