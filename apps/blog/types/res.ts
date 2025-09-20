// ----------------------
// Core Vocab (string unions for easy serialization)
// ----------------------
type ReasoningMode = "deductive" | "inductive" | "abductive";
type CredibilityLevel = "homerun" | "strong" | "solid" | "weak" | "embarrassing";

// Claim type (is the statement about how the world *is* or how it *ought* to be?)
// - "descriptive": empirical/factual claims
// - "normative": value/ought claims
type ClaimType = "descriptive" | "normative";

// Moral valence (for normative claims):
// Instead of mixing deontic categories and evaluation, represent both.
type DeonticForce = "obligation" | "permission" | "prohibition";
type MoralEvaluation = "excellent" | "good" | "neutral" | "bad" | "evil";

// Ethical dimensions (meta-structure a user can commit to and re-use)

// WHO is morally considerable?
// (Retain your playful options but fix typos; allow extensibility)
type MoralSubject =
  | "sapientism"
  | "sentientism"
  | "animalism"
  | "plantism"
  | "bacteriumism"
  | "virusism"
  | "fungism"
  | "biocentrism"
  | "theocentrism"
  | "ecocentrism"
  | "mineralism"

// To what EXTENT are they considerable? Represent as orientation + strength (0..1)
interface SubjectExtent {
  orientation: "protection" | "fairness" | "preservation" | "indifferent" | "hostile"; // maps to your: sacred/fair/preserve/who cares/anti
  strength: number; // 0..1 (how strong the commitment is)
  notes?: string;
}

// RELATIONSHIP: egoism ↔ altruism (continuous scale)
interface RelationalStance {
  axis: "egoism-altruism";
  position: number; // -1 (pure egoism) .. +1 (pure altruism)
  notes?: string;
}

// WHAT value is prioritized?
type ValueKind =
  | "happiness"
  | "health"
  | "freedom"
  | "knowledge"
  | "power"
  | "wealth"
  | "pleasure"

// HOW are decisions justified? Separate meta-ethics vs normative methods
// Meta-ethics (what is moral truth?)
type MetaEthic = "moral-realism" | "moral-anti-realism" | "constructivism"

// Normative method (how to decide?)
type NormativeMethod =
  | "consequentialism"
  | "deontology"
  | "virtue-ethics"
  | "contractualism"
  | "utilitarianism"
  | "care-ethics"

// Axiom bundle (user’s reusable ethical commitments)
interface Axiom {
  subject: MoralSubject;
  extent: SubjectExtent;
  value: ValueKind;
  metaEthic?: MetaEthic; // optional but explicit
  method: NormativeMethod;
  relationship: RelationalStance;
}

// Evidence modeling for Noble

export type ISODate = string; // e.g., "2025-09-18T12:34:56Z"

export type CitationReliance =
  | "deductive"      // premises entail conclusion
  | "inductive"      // generalization/probabilistic support
  | "abductive";     // inference to best explanation

export type CitationDistance =
  | "primary"        // original data, firsthand reporting
  | "secondary"      // analysis/review of primary
  | "tertiary"       // summaries/encyclopedias/textbooks
  | "hearsay";       // unverified claim of a claim

export type CitationScope =
  | "anecdotal"      // single/few instances
  | "trend"          // descriptive stats, polls
  | "study"          // single study/report
  | "meta-analysis"  // syntheses, systematic reviews
  | "scientific-theory" // well-corroborated explanatory framework
  | "novel-theory";  // speculative / not yet corroborated

export type SourceType =
  | "news-article"
  | "op-ed"
  | "book"
  | "chapter"
  | "journal-article"
  | "preprint"
  | "dataset"
  | "whitepaper"
  | "report"
  | "webpage"
  | "legal-document"
  | "video"
  | "podcast"
  | "speech";

export interface Author {
  name: string;              // "Jane Doe"
  orcid?: string;            // "0000-0002-1825-0097"
}

export interface Identifier {
  doi?: string;
  isbn?: string;
  issn?: string;
  pmid?: string;
}

export interface CitationQuality {
  // Keep these separate so you can weight them differently in scoring
  sourceReliability: number; // 0..1 (outlet/author reputation, retractions, transparency)
  evidenceStrength: number;  // 0..1 (method quality, sample size, replication)
}

export interface Locator {
  pages?: string;        // "123–129"
  section?: string;      // "§2.1" or "Results"
  timestamp?: string;    // "00:13:40" for AV
}

export interface Citation {
  id: string;
  url?: string;                  // canonical URL
  archivedUrl?: string;          // Wayback/Perma.cc
  lastCheckedAt?: ISODate;       // link-health freshness
  isLinkBroken?: boolean;
  quote?: string;                // optional excerpt used

  container?: string;            // Journal/book/site name ("Nature", "The Selfish Gene", "Wikipedia")
  publisher?: string;            // Publisher/organization
  publicationDate?: ISODate;
  accessedAt?: ISODate;

  type: SourceType;
  authors?: Author[];

  identifiers?: Identifier;
  language?: string;             // "en", "no", etc.
  isPaywalled?: boolean;
  isRetracted?: boolean;


  reliance: CitationReliance;
  distance: CitationDistance;
  scope: CitationScope;

  quality: CitationQuality;      // split metrics
  tags?: string[];               // free-form labels for faceting
}

// ----------------------
// Credibility Model
// ----------------------
interface Credibility {
  // Overall normalized score 0..1; level is derived from value by a policy
  value: number; // 0..1
  level: CredibilityLevel; // keep redundant for fast querying/UI
  votes: Vote[];
}

interface Vote {
  userId: string; // who voted
  value: number; // 0..1 (rater’s score)
  level: CredibilityLevel; // rater’s chosen bucket
  labels: string[]; // free-form tags like "methodology", "bias", etc.
  axioms?: Axiom[]; // which axioms/rationales informed this vote
  comment?: string; // optional explanation
  createdAt: ISODate; // timestamp
  weight?: number; // trust weighting (rater reputation)
}

// ----------------------
// Knowledge Graph: Propositions and Reasons
// ----------------------

// Canonical proposition users commit to (so we can compare a user against themselves later)
interface Proposition {
  id: string;
  text: string; // canonical phrasing
  tags?: string[];
  createdBy: string;
  createdAt: ISODate;
  updatedAt?: ISODate;
  version: number;
}

// A Reason is an argument instance that supports or opposes a Proposition
type PremisePolarity = "pro" | "con";

interface Premise {
  id: string;
  polarity: PremisePolarity;
  text: string;
  citations?: Citation[];
  credibility: Credibility;
  createdBy: string;
  createdAt: ISODate;
}

interface Reason {
  id: string;
  propositionId: string;
  claimType: ClaimType;
  reasoning: ReasoningMode;
  conclusion: string;
  premises: Premise[];
  credibility: Credibility;
  // Normative-only fields (optional for descriptive reasons)
  deontic?: DeonticForce;
  evaluation?: MoralEvaluation;
  referencedAxioms?: Axiom[]; // snapshot of user’s axioms at the time
  backgroundImage?: { url: string; alt?: string; offset?: string };
  createdBy: string;
  createdAt: ISODate;
  updatedAt?: ISODate;
  version: number;
}

// ----------------------
// Helper policies & checks
// ----------------------

// Map value (0..1) to a CredibilityLevel bucket
export function bucketCredibility(value: number): CredibilityLevel {
  if (value >= 0.9) return "homerun";
  if (value >= 0.75) return "strong";
  if (value >= 0.6) return "solid";
  if (value >= 0.4) return "weak";
  return "embarrassing";
}

// Compute an aggregate credibility score from votes (simple example)
export function aggregateCredibility(votes: Vote[]): Credibility {
  if (votes.length === 0) return { value: 0.5, level: "weak", votes: [] };
  const weighted = votes.map(v => (v.weight ?? 1) * v.value);
  const totalW = votes.reduce((s, v) => s + (v.weight ?? 1), 0);
  const value = Math.min(1, Math.max(0, weighted.reduce((a, b) => a + b, 0) / totalW));
  return { value, level: bucketCredibility(value), votes };
}

export function aggregatedCitationCredibility(citations: Citation[]) {
  if (citations.length === 0) return 0.5;
  const total = citations.reduce((sum, cit) => sum + (cit.quality.sourceReliability + cit.quality.evidenceStrength) / 2, 0);
  return total / citations.length;
}

export type CitationCredibility = "discredited" | "unreliable" | "questionable" | "reliable" | "expert" | "authoritative" | "gold-standard";

export function getCitationCredibility(credibility: number = 0.5): CitationCredibility {
  // Discredited means that the source actively lies or distorts the truth
  // Unreliable means that the source has a history of being wrong or biased
  // Questionable means that the source is not well known or is often wrong
  // Reliable means that the source is generally accurate and has a process for citation, fact-checking, and correction
  // Experts means that the source is written or reviewed by people with relevant expertise
  // Authoritative means that the source is widely respected and trusted by experts in the field such as through peer review or editorial oversight
  // Gold Standard means that the source is drawing on meta studies, consensus across a broad field of authoritative sources. In other words, a gold standard is a source that on its own represents multiple authoritative sources

  if (credibility <= 0) return 'discredited'
  if (credibility <= 0.4) return 'unreliable'
  if (credibility <= 0.5) return 'questionable'
  if (credibility <= 0.7) return 'reliable'
  if (credibility <= 0.8) return 'expert'
  if (credibility <= 0.95) return 'authoritative'
  return 'gold-standard'
}

// ----------------------
// Example Data
// ----------------------
const exampleAxiom: Axiom = {
  subject: "sentientism",
  extent: { orientation: "protection", strength: 0.8, notes: "prioritize avoidance of suffering" },
  value: "freedom",
  metaEthic: "constructivism",
  method: "utilitarianism",
  relationship: { axis: "egoism-altruism", position: 0.6 },
};

const exampleProposition: Proposition = {
  id: "prop_123",
  text: "The state should ban factory farming.",
  tags: ["animals", "policy"],
  createdBy: "user_1",
  createdAt: new Date().toISOString(),
  version: 1,
};

const voteA: Vote = {
  userId: "user_2",
  value: 0.82,
  level: "strong",
  labels: ["coherent", "evidence-backed"],
  axioms: [exampleAxiom],
  createdAt: new Date().toISOString(),
  weight: 1.2,
};

const premise1: Premise = {
  id: "prem_1",
  polarity: "pro",
  text: "Factory farming causes significant, preventable suffering in sentient animals.",
  citations: [
    {
      id: "cit_1",
      container: "Journal of Animal Ethics",
      publisher: "Oxford University Press",
      publicationDate: "2020-05-15",
      type: "journal-article",
      authors: [{ name: "Dr. Jane Smith", orcid: "0000-0002-1825-0097" }],
      url: "https://doi.org/10.1093/jae/ejz012",
      reliance: "deductive",
      distance: "primary",
      scope: "study",
      quality: { sourceReliability: 0.9, evidenceStrength: 0.85 },
    }
  ],
  credibility: aggregateCredibility([voteA]),
  createdBy: "user_1",
  createdAt: new Date().toISOString(),
};

const exampleReason: Reason = {
  id: "rsn_1",
  propositionId: exampleProposition.id,
  claimType: "normative",
  reasoning: "deductive",
  conclusion: "Support a ban on factory farming.",
  premises: [premise1],
  credibility: aggregateCredibility([voteA]),
  deontic: "obligation",
  evaluation: "excellent",
  referencedAxioms: [exampleAxiom],
  createdBy: "user_1",
  createdAt: new Date().toISOString(),
  version: 1,
};

export {
  exampleReason,
}

export type {
  ReasoningMode,
  CredibilityLevel,
  ClaimType,
  DeonticForce,
  MoralEvaluation,
  MoralSubject,
  SubjectExtent,
  RelationalStance,
  ValueKind,
  MetaEthic,
  NormativeMethod,
  Axiom,
  Credibility,
  Vote,
  Proposition,
  PremisePolarity,
  Premise,
  Reason,
};
