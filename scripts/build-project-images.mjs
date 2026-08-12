/**
 * Regenerates lib/project-images.generated.ts from public/projects/*.webp.
 *
 * Next needs intrinsic width/height for `fill` images to reserve space, and a
 * tiny inline preview so photos fade in instead of popping. Both are read back
 * off the committed webp files, so this is reproducible from the repo alone —
 * run it after dropping a new render into public/projects:
 *
 *   node scripts/build-project-images.mjs
 *
 * Existing keys keep their order so adding a photo stays a small diff.
 */
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const photoDir = path.join(root, "public", "projects");
const outFile = path.join(root, "lib", "project-images.generated.ts");

const HEADER = `// GENERATED FILE — do not edit by hand.
// Run \`node scripts/build-project-images.mjs\` after adding or replacing a
// render in public/projects.
// Intentionally excludes the BIR/DTI certificate scans from the company-profile
// document — they carry the proprietor's TIN, signature and home address.

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
};

export const projectImages = {
`;

/** Keys already in the generated file, in order, so diffs stay readable. */
async function existingOrder() {
  try {
    const prev = await readFile(outFile, "utf8");
    return [...prev.matchAll(/^ {2}"([^"]+)": \{$/gm)].map((m) => m[1]);
  } catch {
    return [];
  }
}

const slugs = (await readdir(photoDir))
  .filter((f) => f.endsWith(".webp"))
  .map((f) => f.replace(/\.webp$/, ""));

const known = await existingOrder();
const ordered = [
  ...known.filter((s) => slugs.includes(s)),
  ...slugs.filter((s) => !known.includes(s)).sort(),
];

let body = "";
for (const slug of ordered) {
  const file = path.join(photoDir, `${slug}.webp`);
  const { width, height } = await sharp(file).metadata();
  const blur = await sharp(file).resize({ width: 16 }).webp({ quality: 20 }).toBuffer();
  body +=
    `  "${slug}": {\n` +
    `    src: "/projects/${slug}.webp",\n` +
    `    width: ${width},\n` +
    `    height: ${height},\n` +
    `    blurDataURL:\n` +
    `      "data:image/webp;base64,${blur.toString("base64")}",\n` +
    `  },\n`;
}

await writeFile(
  outFile,
  `${HEADER}${body}} satisfies Record<string, ProjectImage>;

export type ProjectImageKey = keyof typeof projectImages;
`,
  "utf8"
);

console.log(`Wrote ${ordered.length} images to lib/project-images.generated.ts`);
