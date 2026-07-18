import {
  IssueSeverity,
  Recommendation,
  RecommendationGroup,
  RecommendationGroupName,
  RecommendationPriority,
  ReviewCategoryName,
  ReviewResult,
  RecommendationResult,
} from "./types";

/**
 * The Recommendation Agent.
 *
 * It is a distinct agent in the pipeline, but it does NOT call Gemini. It runs
 * entirely locally, consuming the Review agent's structured output and turning
 * each finding into a grouped, severity-prioritized, actionable recommendation.
 * This makes the two agents genuinely cooperate — the Reviewer analyzes, the
 * Recommender advises on top of that analysis — instead of repeating the same
 * model call twice.
 */

/** Which higher-level group each of the nine review categories rolls up into. */
const CATEGORY_GROUP: Record<ReviewCategoryName, RecommendationGroupName> = {
  Layout: "UI",
  Consistency: "UI",
  Usability: "UX",
  "Visual Hierarchy": "Visual Design",
  Spacing: "Visual Design",
  Alignment: "Visual Design",
  Typography: "Visual Design",
  "Color Contrast": "Accessibility",
  Accessibility: "Accessibility",
};

/** A short, actionable title per category. */
const CATEGORY_TITLE: Record<ReviewCategoryName, string> = {
  Layout: "Improve layout structure",
  "Visual Hierarchy": "Sharpen visual hierarchy",
  Spacing: "Standardize spacing",
  Alignment: "Fix alignment",
  Typography: "Refine typography",
  "Color Contrast": "Increase color contrast",
  Accessibility: "Improve accessibility",
  Consistency: "Unify component styling",
  Usability: "Reduce task friction",
};

/** The concrete recommended action per category. */
const CATEGORY_ACTION: Record<ReviewCategoryName, string> = {
  Layout:
    "Reorganize the layout so content follows a clear reading order and the primary region leads the page.",
  "Visual Hierarchy":
    "Strengthen hierarchy by increasing size and weight contrast so the most important element is seen first.",
  Spacing:
    "Apply a consistent spacing scale (e.g. an 8px grid) to group related elements and separate distinct ones.",
  Alignment:
    "Align elements to a shared grid so edges line up and the layout reads as intentional.",
  Typography:
    "Define a clearer type scale with distinct heading and body sizes, weights, and consistent line-height.",
  "Color Contrast":
    "Raise text and icon contrast against their backgrounds to meet the WCAG 4.5:1 minimum for body text.",
  Accessibility:
    "Add visible labels, clear keyboard focus states, and adequately sized touch targets.",
  Consistency:
    "Unify styling — consistent corner radii, colors, and spacing tokens across similar components.",
  Usability:
    "Reduce friction on the primary task: make the main action obvious and provide clear feedback.",
};

const SEVERITY_TO_PRIORITY: Record<IssueSeverity, RecommendationPriority> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const PRIORITY_ORDER: Record<RecommendationPriority, number> = { High: 0, Medium: 1, Low: 2 };

/** Fixed display order for the groups. */
const GROUP_ORDER: RecommendationGroupName[] = ["UI", "UX", "Accessibility", "Visual Design"];

export function buildRecommendations(review: ReviewResult): RecommendationResult {
  const recommendations: Recommendation[] = [];

  review.categories.forEach((finding) => {
    const group = CATEGORY_GROUP[finding.category];

    if (finding.status === "attention") {
      recommendations.push({
        id: `rec-${finding.id}`,
        group,
        sourceCategory: finding.category,
        priority: SEVERITY_TO_PRIORITY[finding.severity ?? "medium"],
        title: CATEGORY_TITLE[finding.category],
        action: CATEGORY_ACTION[finding.category],
        evidence: finding.summary,
        principle: finding.principle,
      });
    } else if (finding.status === "insufficient") {
      // The reviewer couldn't judge this from a static image — surface it as a
      // low-priority manual check rather than a fix.
      recommendations.push({
        id: `rec-${finding.id}`,
        group,
        sourceCategory: finding.category,
        priority: "Low",
        title: `Manually verify ${finding.category.toLowerCase()}`,
        action: `${finding.category} couldn't be assessed from a static screenshot — verify it directly in the running interface.`,
        evidence: finding.summary,
        principle: finding.principle,
      });
    }
    // "positive" findings are strengths — nothing to recommend.
  });

  const groups: RecommendationGroup[] = GROUP_ORDER.map((name) => ({
    name,
    recommendations: recommendations
      .filter((r) => r.group === name)
      .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]),
  })).filter((g) => g.recommendations.length > 0);

  const highCount = recommendations.filter((r) => r.priority === "High").length;
  const mediumCount = recommendations.filter((r) => r.priority === "Medium").length;
  const lowCount = recommendations.filter((r) => r.priority === "Low").length;

  const total = recommendations.length;
  const summary =
    total === 0
      ? "Your review came back clean — no priority fixes were flagged. Keep the current direction."
      : `${total} recommendation${total === 1 ? "" : "s"} derived from your review across ${groups.length} area${
          groups.length === 1 ? "" : "s"
        }${highCount > 0 ? `, ${highCount} high priority` : ""}.`;

  return {
    score: review.score,
    grade: review.grade,
    summary,
    highCount,
    mediumCount,
    lowCount,
    groups,
    imageUrl: review.imageUrl,
  };
}
