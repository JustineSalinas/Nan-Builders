"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { estimateWall, BLOCKS_PER_SQM, WASTE_ALLOWANCE } from "@/lib/materials";

/**
 * How many hollowblocks does this wall need?
 *
 * The most common question a supplier gets, and one the chatbot deliberately
 * refuses — it can quote a price list but it can't do arithmetic on a wall.
 * This answers it in the open, with no pricing involved, so there's nothing to
 * get wrong beyond the estimating figures in lib/materials.ts.
 *
 * It ends on "get this quoted" because that's the point: someone who has just
 * worked out they need 940 blocks is a lead, not a browser.
 */

const FIELDS = [
  { key: "length", label: "Wall length", unit: "m", placeholder: "10" },
  { key: "height", label: "Wall height", unit: "m", placeholder: "3" },
  { key: "openings", label: "Doors & windows", unit: "m²", placeholder: "0" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function BlockCalculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    length: "",
    height: "",
    openings: "",
  });

  const estimate = estimateWall({
    length: parseFloat(values.length),
    height: parseFloat(values.height),
    openings: parseFloat(values.openings),
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="grid md:grid-cols-2">
        <div className="p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
            <Calculator className="h-4 w-4" /> Estimator
          </span>
          <h3 className="mt-4 font-heading text-2xl font-medium text-brand-navy">
            How many hollowblocks?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Give us the wall and we&apos;ll work out the blocks and mortar. The
            count is the same for 4&Prime;, 5&Prime; and 6&Prime; block — they
            share a face size, and only the thickness changes.
          </p>

          <div className="mt-6 space-y-4">
            {FIELDS.map((field) => (
              <label key={field.key} className="block">
                <span className="text-sm font-medium text-brand-navy">
                  {field.label}
                </span>
                <span className="relative mt-1.5 block">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={values[field.key]}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-input bg-background pl-3 pr-12 text-sm text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                    {field.unit}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-border bg-brand-stone p-6 sm:p-8 md:border-l md:border-t-0">
          {estimate ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {estimate.netArea} m² of wall
              </p>
              <p className="mt-3 font-heading text-5xl font-medium text-brand-navy">
                {estimate.blocks.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                hollowblocks, including {Math.round(WASTE_ALLOWANCE * 100)}% for
                cuts and breakage
              </p>

              <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Cement for mortar</dt>
                  <dd className="text-right font-medium text-brand-navy">
                    {estimate.cementBags.low}–{estimate.cementBags.high} bags
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Sand for mortar</dt>
                  <dd className="text-right font-medium text-brand-navy">
                    {estimate.sandCubicMetres.low}–{estimate.sandCubicMetres.high} m³
                  </dd>
                </div>
              </dl>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                Planning figures at {BLOCKS_PER_SQM}{" "}
                blocks per m². Mortar is a
                range because it moves with the mix, the joint and the block
                thickness. Steel and grout aren&apos;t included — those depend on
                what the wall is holding up, so we work them out with you.
              </p>

              <Link
                href="/contact?service=Construction%20Supply"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
              >
                Get this quoted <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex h-full min-h-[14rem] flex-col justify-center">
              <p className="font-heading text-xl font-medium text-brand-navy">
                Enter a length and height
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A 10 m wall at 3 m high needs around 400 blocks. Put your own
                numbers in and we&apos;ll do the rest.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
