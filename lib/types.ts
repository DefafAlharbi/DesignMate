export type AgentId = "generate" | "review" | "recommend";

export interface AgentMeta {
  id: AgentId;
  name: string;
  tagline: string;
  description: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
}

export type ClarificationAnswers = Record<string, string>;

export interface DesignSection {
  id: string;
  label: string;
}

export interface ColorSwatch {
  role: string; // e.g. "Primary", "Secondary", "Neutral", "Background"
  hex: string;
}

export interface TypographySpec {
  heading: string;
  body: string;
  scale: string;
}

/** A complete, structured UI proposal produced by the Generator (and reused, in
 *  redesign form, by the Improver). Intentionally free of any user-prompt text. */
export interface GeneratedDesign {
  templateId: string;
  templateName: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  accent: string;
  secondaryAccent: string;
  gridColumns: 2 | 3 | 4;
  extraBlocks: ExtraBlockId[];
  sections: DesignSection[];
  layoutStructure: string;
  mainSections: string[];
  designStyle: string;
  colorPalette: ColorSwatch[];
  typography: TypographySpec;
  components: string[];
  rationale: string;
}

export type ExtraBlockId = "pricing" | "testimonials" | "search" | "chat" | "booking" | "analytics";

export interface ImageStats {
  width: number;
  height: number;
  aspectRatio: number;
  avgBrightness: number; // 0-255
  contrast: number; // 0-1 normalized stddev of luminance
  dominantColors: string[]; // hex
  warmth: number; // -1 (cool) to 1 (warm)
  edgeDensity: number; // 0-1, proxy for visual clutter/detail
  whitespaceRatio: number; // 0-1, share of pixels close to the background color
  marginRatio: number; // 0-1, how much of the outer edge band is background (higher = more breathing room)
  hierarchyVariance: number; // 0-1, brightness variance across quadrants (proxy for a clear focal point)
  alignmentScore: number | null; // 0-1, consistency of content-edge columns; null if signal too weak to measure
}

export type PrincipleFramework = "Nielsen" | "WCAG 2.2 AA" | "Material Design 3";

export interface DesignPrinciple {
  framework: PrincipleFramework;
  reference: string;
}

export type IssueSeverity = "high" | "medium" | "low";

export type CategoryStatus = "positive" | "attention" | "insufficient";

export const REVIEW_CATEGORIES = [
  "Layout",
  "Visual Hierarchy",
  "Spacing",
  "Alignment",
  "Typography",
  "Color Contrast",
  "Accessibility",
  "Consistency",
  "Usability",
] as const;

export type ReviewCategoryName = (typeof REVIEW_CATEGORIES)[number];

export interface CategoryFinding {
  id: string;
  category: ReviewCategoryName;
  status: CategoryStatus;
  severity?: IssueSeverity; // present only when status === "attention"
  summary: string; // evidence-based, concise
  principle?: DesignPrinciple;
}

export interface ReviewResult {
  score: number;
  grade: string;
  categories: CategoryFinding[];
  /** Optional: legacy client-computed image metrics. Not produced by the
   *  Gemini-backed reviewer, so consumers must not depend on it. */
  stats?: ImageStats;
  imageUrl: string;
}

/* ── Recommendation agent ─────────────────────────────────────────────────
 * The second stage of the pipeline. It does NOT call Gemini. It consumes the
 * Review agent's structured output (score, categories, severity, summaries)
 * and transforms it locally into grouped, severity-prioritized, actionable
 * design recommendations. See lib/recommend.ts. */

export type RecommendationPriority = "High" | "Medium" | "Low";

/** Higher-level groupings that the nine review categories roll up into. */
export type RecommendationGroupName = "UI" | "UX" | "Accessibility" | "Visual Design";

export interface Recommendation {
  id: string;
  group: RecommendationGroupName;
  sourceCategory: ReviewCategoryName; // which review finding this came from
  priority: RecommendationPriority; // derived from the finding's severity
  title: string; // short, actionable
  action: string; // the concrete thing to do
  evidence: string; // the reviewer's summary — why this was flagged
  principle?: DesignPrinciple; // carried over from the review finding
}

export interface RecommendationGroup {
  name: RecommendationGroupName;
  recommendations: Recommendation[];
}

export interface RecommendationResult {
  score: number; // carried over from the review (not recomputed)
  grade: string;
  summary: string;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  groups: RecommendationGroup[];
  imageUrl: string; // the reviewed screenshot, for display
}
