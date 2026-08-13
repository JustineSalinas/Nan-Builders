/**
 * Retrieval for the chat widget. Pure string matching over lib/knowledge.ts —
 * no model, no network, no API key, and it runs in the visitor's browser.
 *
 * The shape is the retrieval half of RAG without the generation half: score the
 * query against a small corpus, return the best passage verbatim. For a fixed
 * FAQ that's a feature, not a compromise — a retrieved answer is one we wrote,
 * so the bot cannot invent a price or promise a delivery date.
 *
 * Scoring is TF-IDF-ish: every entry contributes weighted tokens (its keywords
 * count for more than its prose), rare tokens count for more than common ones,
 * and the score is normalised by the query's own weight so a long question
 * isn't punished for the words it happens to include.
 */
import { knowledgeBase, type KnowledgeEntry } from "./knowledge";

/**
 * Below this, we'd rather admit we didn't understand than answer confidently
 * from a weak keyword overlap. Tuned against the phrasings in `knowledge.ts`:
 * high enough that "asdf" and "do you sell cars" fall through, low enough that
 * a two-word question like "printing price" still lands.
 */
const CONFIDENCE_THRESHOLD = 0.42;

/** Words that carry no intent. Includes Tagalog/Hiligaynon particles. */
const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "could", "did", "do",
  "does", "for", "from", "get", "had", "has", "have", "how", "i", "if", "in",
  "is", "it", "its", "just", "me", "my", "of", "on", "or", "our", "that", "the",
  "their", "them", "then", "there", "these", "they", "this", "to", "us", "was",
  "we", "were", "what", "when", "which", "will", "with", "would", "you", "your",
  "please", "hi", "hello", "hey", "thanks", "thank",
  // Filipino particles and pronouns that add nothing to intent
  "ang", "ng", "mga", "sa", "na", "ba", "po", "ako", "ko", "mo", "niyo", "kayo",
  "ay", "at", "kung", "yung", "ito", "iyan", "may", "meron", "pa", "din", "rin",
  "lang", "naman", "ni", "si", "nyo", "ninyo",
  // Modals and question words. These read as intent but carry none: dropping
  // "pwede" is what lets "installment ba pwede" match on `installment` alone
  // instead of looking half out-of-vocabulary.
  "pwede", "puwede", "ano", "sino", "paano", "gaano", "mayroon", "gusto",
  "sana", "salamat", "kamusta", "magandang",
  // Wanting-something verbs. They front a real question ("kailangan ko ng
  // semento") and, left in, they count against the vocabulary check as though
  // the visitor had asked about something we've never heard of.
  "need", "needs", "want", "wants", "looking", "kailangan", "hanap",
]);

/**
 * Multi-word rewrites, applied to the whole query before tokenising. This is
 * where intent gets normalised: "how much" is a price question no matter what
 * follows it, and split compounds ("hollow block") have to survive as one token
 * to match the entry that spells it closed.
 */
const PHRASES: [RegExp, string][] = [
  [/\bhow much\b/g, "price"],
  [/\bhow many\b/g, "quantity"],
  [/\bhow long\b/g, "turnaround"],
  [/\bgaano katagal\b/g, "turnaround"],
  [/\bkatagal\b/g, "turnaround"],
  [/\bhow fast\b/g, "turnaround"],
  [/\bhow soon\b/g, "turnaround"],
  [/\bhollow blocks?\b/g, "hollowblock"],
  [/\bconcrete hollow blocks?\b/g, "hollowblock"],
  [/\blipat bahay\b/g, "lipatbahay"],
  [/\bdown payment\b/g, "downpayment"],
  [/\bsquare meters?\b/g, "sqm"],
  [/\bsq m\b/g, "sqm"],
  [/\bper sqm\b/g, "sqm"],
  [/\bblue print\b/g, "blueprint"],
  [/\blarge format\b/g, "largeformat"],
  [/\bsign and seal\b/g, "signandseal"],
  [/\bbuilding permits?\b/g, "permit"],
  [/\bprice list\b/g, "price"],
  [/\bopening hours?\b/g, "hours"],
  [/\bbusiness hours?\b/g, "hours"],
  [/\bwhat time\b/g, "hours"],
  [/\banong oras\b/g, "hours"],
  [/\bpast work\b/g, "portfolio"],
  [/\breal estate\b/g, "property"],
];

/** Single-token rewrites: spelling variants, abbreviations, Taglish. */
const SYNONYMS: Record<string, string> = {
  // price
  magkano: "price",
  presyo: "price",
  halaga: "price",
  cost: "price",
  costs: "price",
  pricing: "price",
  rate: "price",
  rates: "price",
  charge: "price",
  fee: "price",
  budget: "price",
  gastos: "price",
  quotation: "quote",
  quotes: "quote",
  estimate: "quote",
  estimates: "quote",
  canvass: "quote",
  bid: "quote",
  // place and time
  saan: "where",
  nasaan: "where",
  address: "location",
  located: "location",
  office: "location",
  shop: "location",
  store: "location",
  branch: "location",
  oras: "hours",
  bukas: "open",
  sarado: "closed",
  schedule: "hours",
  // contact
  tawag: "call",
  cellphone: "phone",
  mobile: "phone",
  number: "phone",
  contact: "phone",
  viber: "whatsapp",
  messenger: "message",
  // materials
  semento: "cement",
  buhangin: "sand",
  graba: "gravel",
  bakal: "steel",
  rebar: "steel",
  tubo: "pipe",
  pipes: "pipe",
  lupa: "soil",
  bloke: "hollowblock",
  chb: "hollowblock",
  blocks: "hollowblock",
  block: "hollowblock",
  aggregates: "aggregate",
  // work
  bahay: "house",
  home: "house",
  magpatayo: "build",
  patayo: "build",
  pagawa: "build",
  construct: "build",
  building: "build",
  construction: "build",
  contractor: "build",
  renovate: "renovation",
  renovations: "renovation",
  remodel: "renovation",
  repairs: "repair",
  ayos: "repair",
  disenyo: "design",
  plano: "plan",
  plans: "plan",
  drawing: "plan",
  drawings: "plan",
  blueprints: "blueprint",
  hakot: "hauling",
  haul: "hauling",
  lipat: "moving",
  movers: "moving",
  move: "moving",
  escombro: "debris",
  deliver: "delivery",
  delivered: "delivery",
  hatid: "delivery",
  // printing
  printing: "print",
  prints: "print",
  printed: "print",
  magpaprint: "print",
  papaprint: "print",
  plotting: "plot",
  plots: "plot",
  tarp: "tarpaulin",
  tarpaulins: "tarpaulin",
  signage: "sign",
  laminate: "lamination",
  scan: "scanning",
  // company
  // "job" deliberately stays put: in this trade it means a piece of work at
  // least as often as employment ("no job is too small"), and folding it into
  // "hiring" made the repairs entry compete for "are you hiring".
  career: "hiring",
  careers: "hiring",
  vacancy: "hiring",
  apply: "hiring",
  trabaho: "hiring",
  services: "service",
  legit: "licensed",
  license: "licensed",
  registered: "registration",
  rehistrado: "registration",
  projects: "portfolio",
  project: "portfolio",
  samples: "sample",
  examples: "sample",
  render: "rendering",
  renders: "rendering",
  perspective: "rendering",
  visualisation: "visualization",
  overseas: "abroad",
  international: "abroad",
};

function normalize(text: string): string {
  let out = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [pattern, replacement] of PHRASES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Crude singular: only for longer words, so "gas" and "chb" survive intact. */
function singularize(token: string): string {
  if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) {
    return token.slice(0, -1);
  }
  return token;
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map((token) => SYNONYMS[token] ?? token)
    .map(singularize)
    .filter((token) => !STOPWORDS.has(token));
}

/** Field weights. Keywords are the hand-picked intent words, so they lead. */
const WEIGHT = { keyword: 4, question: 3, body: 1 } as const;

type IndexedEntry = {
  entry: KnowledgeEntry;
  /** token -> summed field weight */
  weights: Map<string, number>;
  /** Total idf across this entry's keywords — how broad a net it casts. */
  keywordMass: number;
  /** Normalised keyword strings, for the whole-phrase bonus. */
  phrases: string[];
};

/**
 * Best field wins, rather than summing.
 *
 * Summing let repetition stand in for relevance: the printing-price entry
 * lists "price" across eight keyword phrasings, which stacked up to eight
 * times the weight and pulled "cement price" onto the printing list. A token
 * should be worth the strongest field it appears in and no more.
 */
function addTokens(map: Map<string, number>, text: string, weight: number) {
  for (const token of tokenize(text)) {
    map.set(token, Math.max(map.get(token) ?? 0, weight));
  }
}

/** Built once at module load — the corpus is static and small. */
const index: IndexedEntry[] = knowledgeBase.map((entry) => {
  const weights = new Map<string, number>();
  addTokens(weights, entry.question, WEIGHT.question);
  for (const keyword of entry.keywords) {
    addTokens(weights, keyword, WEIGHT.keyword);
  }
  addTokens(weights, entry.answer.join(" "), WEIGHT.body);
  if (entry.bullets) addTokens(weights, entry.bullets.join(" "), WEIGHT.body);
  addTokens(weights, entry.topic, WEIGHT.body);
  return {
    entry,
    weights,
    keywordMass: 0, // needs idf, so it's filled in once that exists
    phrases: entry.keywords
      .map(normalize)
      .filter((phrase) => phrase.includes(" ") && phrase.length > 6),
  };
});

/** Rare tokens discriminate; ones in every entry ("build") barely do. */
const idf = new Map<string, number>();
for (const { weights } of index) {
  for (const token of weights.keys()) {
    idf.set(token, (idf.get(token) ?? 0) + 1);
  }
}
for (const [token, docFrequency] of idf) {
  idf.set(token, Math.log(1 + index.length / docFrequency));
}
/** Unseen query tokens are maximally rare, but shouldn't dominate. */
const DEFAULT_IDF = Math.log(1 + index.length);

for (const entry of index) {
  for (const [token, weight] of entry.weights) {
    if (weight === WEIGHT.keyword) {
      entry.keywordMass += idf.get(token) ?? DEFAULT_IDF;
    }
  }
}

/** Every token the corpus knows about. Used for the out-of-domain check. */
const vocabulary = new Set(index.flatMap(({ weights }) => [...weights.keys()]));

/**
 * How much of a question has to be words we know before we'll answer it.
 *
 * Entry score alone isn't enough: "do you sell cars" matches the materials
 * entry on `sell` and nothing else, which is half the query — the same
 * proportion as a legitimate two-word question, so no threshold separates
 * them. What actually distinguishes it is that "car" appears nowhere in the
 * corpus. A question that is mostly words from our own domain gets answered;
 * one carrying an unknown noun of its own weight gets handed to a human.
 */
const VOCABULARY_FLOOR = 0.6;

export type Retrieval = {
  /** Best entry, or null when nothing cleared the confidence threshold. */
  match: KnowledgeEntry | null;
  /** Next-best entries, offered as follow-up suggestions either way. */
  related: KnowledgeEntry[];
};

export function retrieve(query: string): Retrieval {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return { match: null, related: knowledgeBase.slice(0, 3) };
  }

  const unique = [...new Set(queryTokens)];
  const queryMass = unique.reduce(
    (sum, token) => sum + (idf.get(token) ?? DEFAULT_IDF),
    0
  );
  const normalizedQuery = normalize(query);

  const scored = index
    .map(({ entry, weights, keywordMass, phrases }) => {
      let score = 0;
      let matchedKeywordMass = 0;
      for (const token of unique) {
        const weight = weights.get(token);
        if (!weight) continue;
        const tokenIdf = idf.get(token) ?? DEFAULT_IDF;
        score += weight * tokenIdf;
        if (weight === WEIGHT.keyword) matchedKeywordMass += tokenIdf;
      }
      // Normalising by the query's own mass keeps scores comparable across
      // question lengths; dividing by the top field weight puts a perfect
      // keyword hit at roughly 1.
      score = score / queryMass / WEIGHT.keyword;
      // A visitor who types a keyword phrase verbatim means it — but only
      // mildly. At 0.5 this outweighed a whole discriminating token: "how much
      // to build a house" contains design-and-build's "build a house", and the
      // bonus buried the price entry that the "how much" was asking for.
      if (phrases.some((phrase) => normalizedQuery.includes(phrase))) {
        score += 0.25;
      }
      // How much of *this entry* the query accounts for. Without it, a broad
      // entry that happens to list a word ties a narrow entry that is about
      // that word, and the winner comes down to array order — which is how
      // "are you hiring" landed on repairs, and then on the portfolio.
      if (keywordMass > 0) {
        score += 0.2 * (matchedKeywordMass / keywordMass);
      }
      return { entry, score };
    })
    .sort((a, b) => b.score - a.score);

  const knownMass = unique
    .filter((token) => vocabulary.has(token))
    .reduce((sum, token) => sum + (idf.get(token) ?? DEFAULT_IDF), 0);

  const [best, ...rest] = scored;
  const confident =
    best.score >= CONFIDENCE_THRESHOLD &&
    knownMass / queryMass >= VOCABULARY_FLOOR;
  return {
    match: confident ? best.entry : null,
    // When we did answer, "related" is the runners-up; when we didn't, it's the
    // near-misses, which is exactly what a "did you mean" list wants.
    related: (confident ? rest : scored)
      .filter((candidate) => candidate.score > 0.12)
      .slice(0, 3)
      .map((candidate) => candidate.entry),
  };
}
