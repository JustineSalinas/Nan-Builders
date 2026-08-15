/**
 * Backdrop drawings for the interior page heroes.
 *
 * One system, three drawings: every page keeps the same navy, the same faint
 * blueprint grid underneath and the same hairline weight, and only the drawing
 * on the right changes to match what the page is about. That way the pages read
 * as a family rather than as five different templates.
 *
 * Three rules keep this on the right side of decorative:
 *
 *   1. It lives on the right. The hero's type is left-aligned in a max-w-3xl
 *      column, so the drawing occupies the space the text doesn't and dissolves
 *      before it gets there — the mask fades it out leftward.
 *   2. Hairlines only, at single-digit opacity. These are drafting lines, not
 *      graphics; the moment they compete with the headline they've failed.
 *   3. Real geometry. The plan's footprints share edges, the bond courses
 *      actually course, the plot carries a real title block. Eyeballed
 *      versions of these read as clip art.
 */

export type HeroMotif = "grid" | "plan" | "masonry" | "sheet";

/** Fades the drawing out before it reaches the headline column. */
const FADE = "linear-gradient(to left, #000 22%, rgba(0,0,0,0.45) 58%, transparent 90%)";

/** Every drawing is authored in this box, then sliced to fill the band. */
const VIEW_BOX = "0 0 800 400";

const gridStyle = {
  backgroundImage:
    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};



function Plan() {
  // A site plan: footprints drawn as double lines (wall thickness), sharing
  // edges the way buildings on a real plot do, with a drive sweeping past.
  return (
    <>
      <g>
        <rect x="90" y="96" width="252" height="176" />
        <rect x="100" y="106" width="232" height="156" />
      </g>
      <g>
        <rect x="404" y="52" width="176" height="124" />
        <rect x="412" y="60" width="160" height="108" />
      </g>
      <g>
        <rect x="404" y="216" width="308" height="140" />
        <rect x="412" y="224" width="292" height="124" />
      </g>
      {/* Terrace, hatched the way a plan hatches a paved surface */}
      <rect x="612" y="52" width="100" height="124" fill="url(#hatch)" stroke="none" />
      <rect x="612" y="52" width="100" height="124" />
      {/* Drive */}
      <path d="M60 384 C 250 384, 300 320, 386 300 S 560 286, 800 300" fill="none" />
      {/* Dimension line across the two lower footprints */}
      <line x1="90" y1="380" x2="342" y2="380" />
      <line x1="90" y1="373" x2="90" y2="387" />
      <line x1="342" y1="373" x2="342" y2="387" />
    </>
  );
}

function Masonry() {
  // Running bond — the way CHB actually goes up, which is what this page sells.
  return <rect x="0" y="0" width="800" height="400" fill="url(#bond)" stroke="none" />;
}


function Sheet() {
  // A plot on the bench: the sheet, its drawing border and title block, with a
  // second plot underneath. Everything is composed into the right-hand third,
  // where the fade still leaves the lines legible — pushed any further left and
  // the crop marks dissolve before they can read as crop marks.
  const x = 430;
  const y = 48;
  const w = 340;
  const h = 286;
  return (
    <>
      {/* The sheet under it, showing only along two edges */}
      <rect x={x - 38} y={y + 30} width={w} height={h} />
      <rect x={x} y={y} width={w} height={h} />
      {/* Drawing border */}
      <rect x={x + 16} y={y + 16} width={w - 32} height={h - 32} />
      {/* Title block, bottom right, the way a plot carries it */}
      <g>
        <rect x={x + w - 156} y={y + h - 102} width={140} height={86} />
        <line x1={x + w - 156} y1={y + h - 74} x2={x + w - 16} y2={y + h - 74} />
        <line x1={x + w - 156} y1={y + h - 46} x2={x + w - 16} y2={y + h - 46} />
        <line x1={x + w - 106} y1={y + h - 46} x2={x + w - 106} y2={y + h - 16} />
      </g>
      {/* Crop marks at the sheet corners */}
      {[
        [x, y, -1, -1],
        [x + w, y, 1, -1],
        [x, y + h, -1, 1],
        [x + w, y + h, 1, 1],
      ].map(([cx, cy, dx, dy]) => (
        <g key={`${cx}-${cy}`}>
          <line x1={cx + dx * 10} y1={cy} x2={cx + dx * 30} y2={cy} />
          <line x1={cx} y1={cy + dy * 10} x2={cx} y2={cy + dy * 30} />
        </g>
      ))}
      {/* Registration target */}
      <g>
        <circle cx={x - 62} cy={y + 8} r="12" />
        <line x1={x - 62} y1={y - 12} x2={x - 62} y2={y + 28} />
        <line x1={x - 82} y1={y + 8} x2={x - 42} y2={y + 8} />
      </g>
    </>
  );
}

const DRAWINGS: Record<Exclude<HeroMotif, "grid">, () => React.JSX.Element> = {
  plan: Plan,
  masonry: Masonry,
  sheet: Sheet,
};

export function PageHeroMotif({ variant = "grid" }: { variant?: HeroMotif }) {
  const Drawing = variant === "grid" ? null : DRAWINGS[variant];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/*
        The grid stays on every page as connective tissue — full strength where
        it's the whole idea, dropped back where a drawing sits on top of it.
      */}
      <div
        className="absolute inset-0"
        style={{ ...gridStyle, opacity: variant === "grid" ? 0.04 : 0.022 }}
      />
      {Drawing && (
        <svg
          viewBox={VIEW_BOX}
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
          stroke="#fff"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
          className="absolute inset-y-0 right-0 h-full w-[min(66rem,86%)]"
          style={{ opacity: 0.085, maskImage: FADE, WebkitMaskImage: FADE }}
        >
          <defs>
            <pattern
              id="hatch"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="14" stroke="#fff" strokeWidth="1.2" />
            </pattern>
            <pattern id="bond" width="176" height="88" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="84" height="40" stroke="#fff" fill="none" />
              <rect x="92" y="0" width="84" height="40" stroke="#fff" fill="none" />
              <rect x="-44" y="48" width="84" height="40" stroke="#fff" fill="none" />
              <rect x="48" y="48" width="84" height="40" stroke="#fff" fill="none" />
              <rect x="140" y="48" width="84" height="40" stroke="#fff" fill="none" />
            </pattern>
          </defs>
          <Drawing />
        </svg>
      )}
    </div>
  );
}
