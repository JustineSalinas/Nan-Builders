/**
 * Quantity estimating for concrete hollow block walls.
 *
 * Every figure here is a planning rule of thumb, not a take-off. They live in
 * one place, named and sourced, so Renan can correct them against how the crew
 * actually estimates without going near the component that renders them.
 *
 * The calculator deliberately stops at blocks and mortar. Grout, reinforcing
 * steel and footings depend on the wall's structural role, and guessing them on
 * a website would be inventing numbers a customer might build on.
 */

/**
 * Blocks per square metre of wall face.
 *
 * A standard CHB face is 400 x 200 mm. With a 10 mm mortar joint each block
 * occupies 410 x 210 mm = 0.0861 m², giving 11.6 per m²; the trade rounds to
 * 12.5 to absorb cutting and the odd broken block.
 *
 * This is the same for 4", 5" and 6" block — they share a face size and differ
 * only in thickness. Thickness changes mortar and fill, never the count.
 */
export const BLOCKS_PER_SQM = 12.5;

/** Extra blocks ordered against breakage and cuts. */
export const WASTE_ALLOWANCE = 0.05;

/**
 * Mortar for laying, per square metre of wall, as a range.
 *
 * Ranges rather than single numbers because the answer moves with the mix
 * (class A/B/C), joint thickness and how thick the block is. Quoting one figure
 * would imply a precision that doesn't exist.
 */
export const MORTAR_CEMENT_BAGS_PER_SQM = { low: 0.35, high: 0.55 };
export const MORTAR_SAND_CUM_PER_SQM = { low: 0.02, high: 0.03 };

export type WallInput = {
  /** Metres. */
  length: number;
  /** Metres. */
  height: number;
  /** Square metres of doors and windows to deduct. */
  openings: number;
};

export type WallEstimate = {
  netArea: number;
  blocks: number;
  cementBags: { low: number; high: number };
  sandCubicMetres: { low: number; high: number };
};

/** Round up — you cannot order 2.3 blocks. */
const ceil = (value: number) => Math.ceil(value);
/** Materials sold by volume are quoted to one decimal. */
const round1 = (value: number) => Math.round(value * 10) / 10;

export function estimateWall({ length, height, openings }: WallInput): WallEstimate | null {
  if (!(length > 0) || !(height > 0)) return null;

  const gross = length * height;
  const netArea = Math.max(0, gross - Math.max(0, openings || 0));
  if (netArea === 0) return null;

  return {
    netArea: round1(netArea),
    blocks: ceil(netArea * BLOCKS_PER_SQM * (1 + WASTE_ALLOWANCE)),
    cementBags: {
      low: Math.ceil(netArea * MORTAR_CEMENT_BAGS_PER_SQM.low),
      high: Math.ceil(netArea * MORTAR_CEMENT_BAGS_PER_SQM.high),
    },
    sandCubicMetres: {
      low: round1(netArea * MORTAR_SAND_CUM_PER_SQM.low),
      high: round1(netArea * MORTAR_SAND_CUM_PER_SQM.high),
    },
  };
}
