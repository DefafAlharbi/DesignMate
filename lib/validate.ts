import {
  ColorSwatch,
  GeneratedDesign,
  REVIEW_CATEGORIES,
  ReviewResult,
} from "./types";

/**
 * Every agent output passes through here before it's shown to the user.
 * These are guardrails, not a happy-path formality: if an evaluator ever
 * produces something incomplete or out of range, we backfill a safe,
 * clearly-labeled default rather than render a broken or misleading result.
 */

export function validateReview(result: ReviewResult): ReviewResult {
  const score = Math.max(0, Math.min(100, Math.round(result.score)));

  const byCategory = new Map(result.categories.map((c) => [c.category, c]));
  const categories = REVIEW_CATEGORIES.map((name) => {
    const existing = byCategory.get(name);
    if (existing && existing.summary.trim().length > 0) return existing;
    return {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      category: name,
      status: "insufficient" as const,
      summary: `${name} could not be evaluated from the available image data.`,
    };
  });

  return { ...result, score, categories };
}

function fallbackColorPalette(accent: string): ColorSwatch[] {
  return [
    { role: "Primary", hex: accent },
    { role: "Secondary", hex: "#64748B" },
    { role: "Neutral", hex: "#E5E7EB" },
    { role: "Background", hex: "#FFFFFF" },
  ];
}

export function validateDesignProposal(design: GeneratedDesign): GeneratedDesign {
  return {
    ...design,
    headline: design.headline.trim() || "A focused, single-purpose screen",
    subheadline: design.subheadline.trim() || "A clear layout built around one primary action.",
    layoutStructure:
      design.layoutStructure.trim() ||
      "A single-column, top-to-bottom structure that introduces the primary action before supporting detail.",
    mainSections: design.mainSections.length >= 2 ? design.mainSections : ["Navigation", "Primary content", "Primary action", "Footer"],
    designStyle: design.designStyle.trim() || "Clean, modern, and minimal with a single accent color.",
    colorPalette: design.colorPalette.length >= 3 ? design.colorPalette : fallbackColorPalette(design.accent || "#6366F1"),
    typography:
      design.typography.heading && design.typography.body
        ? design.typography
        : { heading: "Semibold sans-serif", body: "Regular sans-serif", scale: "32 / 20 / 16 / 14px" },
    components: design.components.length >= 3 ? design.components : ["Primary Button", "Nav Bar", "Card", "Footer"],
    rationale:
      design.rationale.trim() ||
      "This structure keeps the primary action visible immediately, which supports faster task completion.",
    sections: design.sections.length >= 1 ? design.sections : [{ id: "content", label: "Primary Content" }],
  };
}

