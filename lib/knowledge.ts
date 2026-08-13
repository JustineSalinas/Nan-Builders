/**
 * The chatbot's entire knowledge base.
 *
 * There is no model and no API behind the widget — it retrieves from this file
 * and nothing else, so it can only ever say things we wrote down here. Two
 * rules keep it honest:
 *
 *   1. Facts are single-sourced. Prices, materials, services and contact
 *      details are composed from lib/pricing.ts, lib/services.ts and
 *      lib/site.ts rather than retyped, so the bot can't drift from the pages.
 *   2. Anything we don't actually know — a build cost, a delivery date, payment
 *      terms — gets a routing answer that promises nothing and hands the
 *      visitor to a human. Never invent a number here.
 *
 * `keywords` is where matching is won: put in the words visitors actually type,
 * including Taglish ("magkano", "pwede ba", "lipat bahay"), abbreviations and
 * misspellings. They're weighted above the question text itself.
 */
import { site } from "./site";
import { services } from "./services";
import { printingPrices, supplyCatalog } from "./pricing";

export type Topic =
  | "Services"
  | "Supply"
  | "Printing"
  | "Pricing"
  | "Company"
  | "Contact";

export type KnowledgeEntry = {
  id: string;
  /** Canonical phrasing. Shown as a suggestion chip and as "related" links. */
  question: string;
  /** Alternate phrasings and search terms. Weighted highest when matching. */
  keywords: string[];
  /** Reply body, one string per paragraph. */
  answer: string[];
  /** Optional list rendered under the paragraphs. */
  bullets?: string[];
  /** Optional deep link offered as a button beneath the reply. */
  link?: { label: string; href: string };
  topic: Topic;
};

const hours = site.hours.map((h) => `${h.day}: ${h.time}`);
const serviceTitles = services.map((s) => s.title);
const designServices = services
  .filter((s) => s.category === "Design")
  .map((s) => s.title);
const permitServices = services
  .filter((s) => s.category === "Permits")
  .map((s) => s.title);

export const knowledgeBase: KnowledgeEntry[] = [
  // ---------------------------------------------------------------- Services
  {
    id: "what-we-do",
    topic: "Services",
    question: "What does Nan Builders do?",
    keywords: [
      "what do you do",
      "who are you",
      "about",
      "company",
      "business",
      "ano ang ginagawa",
      "anong negosyo",
      "overview",
      "line of work",
    ],
    answer: [
      `${site.legalName} is a design-and-build contractor and construction supplier based in ${site.address.city}, ${site.address.province}.`,
      "Four lines of business under one roof: construction, material supply, hauling and delivery, and large-format printing. We also do design, 3D visualization and BIM work.",
    ],
    link: { label: "See all services", href: "/services" },
  },
  {
    id: "services-list",
    topic: "Services",
    question: "What services do you offer?",
    keywords: [
      "services",
      "service list",
      "offer",
      "what can you do",
      "ano ang serbisyo",
      "list of services",
      "help with",
    ],
    answer: ["Here's everything we offer:"],
    bullets: serviceTitles,
    link: { label: "Service details", href: "/services" },
  },
  {
    id: "design-and-build",
    topic: "Services",
    question: "Do you handle the whole build from start to finish?",
    keywords: [
      "design and build",
      "design-build",
      "construction",
      "build my house",
      "magpatayo ng bahay",
      "contractor",
      "turnover",
      "general contractor",
      "start to finish",
      "end to end",
      "build a house",
      "commercial building",
    ],
    answer: [
      "Yes. Design & Build is a single accountable team from groundbreaking to turnover — structural works, finishes and site management under one roof.",
      "That means one point of contact instead of coordinating a designer, a contractor and a supplier yourself.",
    ],
    link: { label: "Talk to us about your build", href: "/contact?service=Design%20%26%20Build" },
  },
  {
    id: "design-consultation",
    topic: "Services",
    question: "Can I get help with plans and design?",
    keywords: [
      "design consultation",
      "designer",
      "architect",
      "plans",
      "floor plan",
      "layout",
      "feasibility",
      "plano",
      "disenyo",
      "drafting",
      ...designServices,
    ],
    answer: [
      "Yes. Sit down with our designers and we'll shape your ideas into a buildable plan that fits your lot, your lifestyle and your budget.",
      "We also do interior design and fit-out — space planning through to finishing.",
    ],
    link: { label: "Book a consultation", href: "/contact?service=Design%20Consultation" },
  },
  {
    id: "permits",
    topic: "Services",
    question: "Can you process our building permit?",
    keywords: [
      "building permit",
      "permit",
      "permiso",
      "sign and seal",
      "signed and sealed",
      "licensed engineer",
      "requirements",
      "city hall",
      "municipal",
      "approval",
      "submission",
      ...permitServices,
    ],
    answer: [
      "Yes — we prepare and process the building permit package so you can start building sooner.",
      "We also sign and seal construction plans: reviewed, signed and sealed by licensed professionals, ready for permit submission.",
    ],
    link: { label: "Ask about permits", href: "/contact?service=Building%20Permits" },
  },
  {
    id: "renovation",
    topic: "Services",
    question: "Do you do renovations and repairs?",
    keywords: [
      "renovation",
      "repair",
      "maintenance",
      "remodel",
      "fix",
      "ayos",
      "pagawa",
      "extension",
      "retrofit",
      "existing house",
    ],
    answer: [
      "Yes. Repairs, renovations and preventive maintenance for both homes and commercial buildings.",
      "No job is too small to ask about — tell us what needs doing and we'll tell you honestly whether we're the right people for it.",
    ],
    link: { label: "Describe the job", href: "/contact?service=Maintenance%20%26%20Repairs" },
  },
  {
    id: "visualization",
    topic: "Services",
    question: "Do you do 3D renders and BIM?",
    keywords: [
      "3d",
      "render",
      "rendering",
      "perspective",
      "visualization",
      "bim",
      "revit",
      "model",
      "modelling",
      "shop drawings",
      "clash",
      "mep",
      "outsourcing",
      "animation",
    ],
    answer: [
      "Yes. We produce exterior and interior perspectives, 3D renders, BIM models, services coordination and shop-drawing packages.",
      "This is the part of the business that isn't tied to Iloilo — we've delivered visualization and BIM work for clients in Negros, Saudi Arabia and Thailand.",
    ],
    link: { label: "See the portfolio", href: "/projects" },
  },

  // ------------------------------------------------------------------ Supply
  {
    id: "materials",
    topic: "Supply",
    question: "What materials do you sell?",
    keywords: [
      "materials",
      "supply",
      "supplies",
      "sell",
      "stock",
      "available",
      "hardware",
      "ano ang benta",
      "bili",
      "order materials",
      "construction supply",
    ],
    answer: ["We carry the everyday essentials for a build:"],
    bullets: supplyCatalog.map((item) => `${item.name} — ${item.desc}`),
    link: { label: "Browse supply", href: "/supply" },
  },
  {
    id: "hollowblocks",
    topic: "Supply",
    question: "Do you sell hollowblocks?",
    keywords: [
      "hollowblock",
      "hollow block",
      "hollowblocks",
      "chb",
      "block",
      "blocks",
      "concrete hollow block",
      "bloke",
      "4 inch",
      "5 inch",
      "6 inch",
    ],
    answer: [
      'Yes — standard 4", 5" and 6" concrete hollow blocks, supplied in the quantities your build needs and delivered on schedule.',
      "Tell us your quantity and delivery address and we'll quote it.",
    ],
    link: { label: "Request a quote", href: "/contact?service=Construction%20Supply" },
  },
  {
    id: "sand-gravel",
    topic: "Supply",
    question: "Do you supply sand, gravel and fill?",
    keywords: [
      "sand",
      "gravel",
      "aggregate",
      "soil",
      "fill",
      "filling",
      "buhangin",
      "graba",
      "lupa",
      "escombro",
      "washed sand",
      "by volume",
      "truckload",
      "cubic",
    ],
    answer: [
      "Yes — washed sand, graded gravel, filling soil and aggregates, delivered to your site by volume.",
      "Give us the volume and the site location and we'll come back with a delivered price.",
    ],
    link: { label: "Ask for a delivered price", href: "/contact?service=Soil%2C%20Sand%20%26%20Gravel" },
  },
  {
    id: "cement-steel",
    topic: "Supply",
    question: "Do you have cement and steel?",
    keywords: [
      "cement",
      "semento",
      "portland",
      "bag",
      "steel",
      "rebar",
      "bakal",
      "deformed bar",
      "tie wire",
      "pvc",
      "pipe",
      "tubo",
      "fittings",
    ],
    answer: [
      "Yes. Bagged Portland cement from trusted brands — by the bag or by the truckload — plus deformed bars and tie wire in common gauges, and sanitary and pressure PVC pipes with fittings.",
    ],
    link: { label: "Browse supply", href: "/supply" },
  },
  {
    id: "delivery",
    topic: "Supply",
    question: "Do you deliver to my site?",
    keywords: [
      "deliver",
      "delivery",
      "shipping",
      "hatid",
      "deliver to site",
      "free delivery",
      "delivery fee",
      "truck",
      "do you deliver",
      // Timing questions land here too, so this entry has to own "turnaround"
      // — otherwise "gaano katagal ang delivery" matched the printing
      // turnaround entry and answered about plot jobs.
      "turnaround",
      "how long delivery",
      "when will it arrive",
      "lead time",
      "kailan dating",
      "delivery schedule",
    ],
    answer: [
      "Yes — delivery is part of what we do, and we run our own trucks.",
      "Cost depends on volume and distance, so it's quoted per order rather than fixed, and the date depends on stock and where you are — we'll confirm both when you order.",
      "Send us the address and quantity and we'll include delivery in the quote.",
    ],
    link: { label: "Get a delivered quote", href: "/contact?service=Construction%20Supply" },
  },
  {
    id: "hauling",
    topic: "Supply",
    question: "Do you do hauling and lipat bahay?",
    keywords: [
      "hauling",
      "haul",
      "hakot",
      "lipat bahay",
      "lipat",
      "moving",
      "movers",
      "debris",
      "disposal",
      "dump truck",
      "escombro",
      "transfer",
      "relocate",
    ],
    answer: [
      "Yes. Dump trucks and hauling for construction materials, debris disposal and lipat-bahay moves.",
      "Tell us what's being moved and where from and to, and we'll price it.",
    ],
    link: { label: "Book hauling", href: "/contact?service=Hauling%20%26%20Lipat%20Bahay" },
  },

  // ---------------------------------------------------------------- Printing
  {
    id: "printing",
    topic: "Printing",
    question: "What can you print?",
    keywords: [
      "printing",
      "print",
      "large format",
      "plotting",
      "plot",
      "cad",
      "blueprint",
      "blue print",
      "tarpaulin",
      "tarp",
      "signage",
      "sign",
      "a0",
      "a1",
      "a2",
      "papapaprint",
      "magpaprint",
    ],
    answer: [
      "Large-format printing up to A0: CAD plots in black and white or full colour, blueprint copies, tarpaulins and signage.",
      "We also scan, convert to PDF, fold blueprints and laminate.",
    ],
    link: { label: "Printing and prices", href: "/printing" },
  },
  {
    id: "printing-prices",
    topic: "Pricing",
    question: "How much is printing?",
    keywords: [
      "printing price",
      "print cost",
      "how much print",
      "magkano print",
      "magkano ang plot",
      "rate",
      "price list",
      "presyo",
      "plotting price",
      "a0 price",
      "lamination price",
      "scanning price",
      "per sheet",
      // The line items are only in the bullets, which index at body weight —
      // too light to carry "blueprint copy price" over the threshold on their
      // own.
      "blueprint copy",
      "blueprint",
      "copy",
    ],
    answer: ["Our printing price list:"],
    bullets: printingPrices.map(
      (row) => `${row.service} — ${row.price}${row.note ? ` ${row.note}` : ""}`
    ),
    link: { label: "Full price list", href: "/printing" },
  },
  {
    id: "turnaround",
    topic: "Printing",
    question: "How fast can you print my plans?",
    keywords: [
      "turnaround",
      "how fast",
      "rush",
      "same day",
      "urgent",
      "deadline",
      "kailan matapos",
      "waiting time",
      "quick",
      "asap",
    ],
    answer: [
      "Fast turnaround is one of the things we sell on, and small plot jobs are often same-visit.",
      "We won't promise a specific time here without seeing the job — send the files or drop by and we'll give you a real answer on the spot.",
    ],
    link: { label: "Send us your files", href: "/contact?service=Large-Format%20Printing" },
  },

  // ----------------------------------------------------------------- Pricing
  {
    id: "quote",
    topic: "Pricing",
    question: "How do I get a quote?",
    keywords: [
      "quote",
      "quotation",
      "estimate",
      "canvass",
      "pabid",
      "bid",
      "proposal",
      "request",
      "how much would it cost",
      "presyo",
      "magpaquote",
    ],
    answer: [
      "Send us what you have — plans, a sketch, or even a description and the lot size — and we'll come back with a quote.",
      `Fastest route is a call or text to ${site.phone}. You can also fill in the contact form and we'll reply by email.`,
    ],
    link: { label: "Request a quote", href: "/contact" },
  },
  {
    id: "build-cost",
    topic: "Pricing",
    question: "How much does it cost to build a house?",
    keywords: [
      "cost to build",
      "how much house",
      "magkano magpatayo",
      "magkano ang bahay",
      "price per square meter",
      "per sqm",
      "budget",
      "gastos",
      "construction cost",
      "how much build",
    ],
    answer: [
      "There's no honest single number for this — it moves with the lot, the area, the finishes and the current price of materials.",
      "What we can do is give you a real figure quickly. Send your plans or tell us the floor area and the finish level you have in mind, and we'll work up a proper estimate rather than a guess.",
    ],
    link: { label: "Get an estimate", href: "/contact?service=Design%20%26%20Build" },
  },
  {
    id: "payment",
    topic: "Pricing",
    question: "What are your payment terms?",
    keywords: [
      "payment",
      "terms",
      "downpayment",
      "down payment",
      "installment",
      "hulugan",
      "cash",
      "bank transfer",
      "gcash",
      "billing",
      "how to pay",
      "deposit",
    ],
    answer: [
      "Payment terms depend on the scope, so they're set out in your quote rather than fixed here.",
      "Ask us when we quote and we'll spell out the schedule before anything starts — no surprises mid-build.",
    ],
    link: { label: "Ask about terms", href: "/contact" },
  },

  // ----------------------------------------------------------------- Company
  {
    id: "location",
    topic: "Contact",
    question: "Where are you located?",
    keywords: [
      "where",
      "location",
      "address",
      "saan",
      "nasaan",
      "office",
      "shop",
      "store",
      "find you",
      "map",
      "directions",
      "maasin",
      "iloilo",
    ],
    answer: [
      `We're at ${site.address.full}.`,
      "Drop by during opening hours, or call ahead if you're coming from far — it saves you a trip if we need to prepare something.",
    ],
    link: { label: "Contact details", href: "/contact" },
  },
  {
    id: "hours",
    topic: "Contact",
    question: "What are your opening hours?",
    keywords: [
      "hours",
      "open",
      "opening",
      "closing",
      "schedule",
      "oras",
      "bukas",
      "sarado",
      "weekend",
      "saturday",
      "sunday",
      "what time",
      "anong oras",
    ],
    answer: ["Our opening hours:"],
    bullets: hours,
    link: { label: "Contact details", href: "/contact" },
  },
  {
    id: "contact",
    topic: "Contact",
    question: "How do I contact you?",
    keywords: [
      "contact",
      "phone",
      "number",
      "call",
      "text",
      "email",
      "whatsapp",
      "viber",
      "message",
      "reach",
      "tawag",
      "cellphone",
      "mobile",
      "talk to someone",
      "human",
      "agent",
    ],
    answer: [
      `Phone or text: ${site.phone}`,
      `Email: ${site.email}`,
      "WhatsApp works on the same number. For anything detailed, the contact form gets it to us with your requirements attached.",
    ],
    link: { label: "Open the contact form", href: "/contact" },
  },
  {
    id: "service-area",
    topic: "Company",
    question: "Do you work outside Iloilo?",
    keywords: [
      "service area",
      "areas served",
      "outside iloilo",
      "nationwide",
      "overseas",
      "abroad",
      "manila",
      "negros",
      "bacolod",
      "antique",
      "capiz",
      "province",
      "international",
      "far",
      "location covered",
    ],
    answer: [
      `Construction, supply and hauling are physical work, so those stay around ${site.address.city} and ${site.address.province} province.`,
      "Design, 3D visualization, BIM and shop drawings travel — we've delivered those to clients in Negros, Saudi Arabia and Thailand.",
    ],
    link: { label: "See where we've worked", href: "/projects" },
  },
  {
    id: "credentials",
    topic: "Company",
    question: "Are you licensed and registered?",
    keywords: [
      "licensed",
      "license",
      "registered",
      "registration",
      "dti",
      "legit",
      "accredited",
      "credentials",
      "permit to operate",
      "business permit",
      "rehistrado",
    ],
    answer: [
      `Yes. ${site.legalName} is DTI-registered — DTI No. ${site.dtiNo}, Registration No. ${site.registrationNo}.`,
      "Plans we sign and seal are handled by licensed professionals.",
    ],
    link: { label: "About us", href: "/about" },
  },
  {
    id: "portfolio",
    topic: "Company",
    question: "Can I see past projects?",
    keywords: [
      "projects",
      "portfolio",
      "past work",
      "sample",
      "examples",
      "references",
      "gawa",
      "photos",
      "show me",
      "previous",
    ],
    answer: [
      "Yes — the Projects page has our design and visualization work: residences in Iloilo and Himamaylan, a café fit-out, hotel and mixed-use interiors, plus BIM and shop-drawing packages.",
      "Want references for a specific type of project? Ask and we'll send relevant work.",
    ],
    link: { label: "View projects", href: "/projects" },
  },
  {
    id: "careers",
    topic: "Company",
    question: "Are you hiring?",
    keywords: [
      "hiring",
      "jobs",
      "job",
      "career",
      "careers",
      "apply",
      "application",
      "vacancy",
      "work with you",
      "trabaho",
      "resume",
      "employment",
    ],
    answer: [
      "We're always glad to hear from skilled people, even when nothing specific is posted.",
      "Send your details through the careers page and we'll keep you in mind as work comes up.",
    ],
    link: { label: "Careers", href: "/careers" },
  },
];

/** Opening suggestions — the questions most visitors actually arrive with. */
export const starterQuestions = [
  "What services do you offer?",
  "How much is printing?",
  "Do you deliver to my site?",
  "How do I get a quote?",
];
