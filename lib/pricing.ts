/**
 * Printing services price list (from the official Nan Builders price sheet).
 */
export type PriceRow = {
  service: string;
  price: string;
  note?: string;
};

export const printingPrices: PriceRow[] = [
  { service: "A0 Black & White CAD Plot", price: "₱300", note: "per sheet" },
  { service: "A0 Full Color Plot", price: "₱900", note: "per sheet" },
  { service: "A2 Black & White", price: "₱150", note: "per sheet" },
  { service: "A2 Full Color", price: "₱400", note: "per sheet" },
  { service: "Blueprint Copy (A0)", price: "₱250", note: "per sheet" },
  { service: "Blueprint Folding", price: "₱20", note: "per sheet" },
  { service: "Scanning (A0)", price: "₱150 – ₱300", note: "per sheet" },
  { service: "PDF Conversion", price: "₱20 – ₱50", note: "per file" },
  { service: "Lamination (A4)", price: "₱40 – ₱60", note: "each" },
  { service: "Lamination (A3)", price: "₱80 – ₱120", note: "each" },
];

export const printingPillars = [
  {
    title: "High Quality",
    body: "Crisp lines and vibrant colors for every print.",
  },
  {
    title: "Fast Turnaround",
    body: "On-time service to meet your project deadline.",
  },
  {
    title: "Reliable Service",
    body: "Committed to quality prints and customer satisfaction.",
  },
];

/** Materials carried by the construction supply arm. */
export const supplyCatalog = [
  { name: "Portland Cement", desc: "Bagged cement from trusted brands, by the bag or by the truckload." },
  { name: "Sand & Gravel", desc: "Washed sand and graded gravel for concrete and fill." },
  { name: "Hollowblocks (CHB)", desc: "Standard 4\", 5\", and 6\" concrete hollow blocks." },
  { name: "Steel & Rebar", desc: "Deformed bars and tie wire in common gauges." },
  { name: "PVC & Pipes", desc: "Sanitary and pressure pipes plus fittings." },
  { name: "Soil & Fill Materials", desc: "Filling soil and aggregates delivered by volume." },
];
