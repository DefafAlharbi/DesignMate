/**
 * Shared, reusable JSON-shape descriptions embedded into the agent system
 * prompts. Keeping them here (rather than inline in each prompt) means the
 * Generator and Improver ask Gemini for the exact same design object, and the
 * contract stays in one place if the UI's expected shape ever changes.
 *
 * These strings intentionally mirror the TypeScript types in `lib/types.ts`.
 */

export const TEMPLATE_IDS = ["saas-landing", "dashboard", "ecommerce", "mobile-app", "portfolio"] as const;

export const EXTRA_BLOCK_IDS = ["pricing", "testimonials", "search", "chat", "booking", "analytics"] as const;

export const REVIEW_CATEGORY_NAMES = [
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

/** The design proposal object both the Generator and Improver must return. */
export const DESIGN_JSON_SHAPE = `{
  "templateId": one of ["saas-landing","dashboard","ecommerce","mobile-app","portfolio"] (pick the closest fit — this drives the live wireframe preview),
  "headline": string (a short example headline for the screen, max ~8 words; do NOT restate the user's request),
  "subheadline": string (one short supporting line),
  "ctaLabel": string (2-4 words for the primary button),
  "accent": string (hex color, e.g. "#6366F1"),
  "secondaryAccent": string (hex color that complements accent),
  "gridColumns": integer, one of 2, 3, or 4 (density of the main content grid),
  "extraBlocks": array (0-2 items) chosen ONLY from ["pricing","testimonials","search","chat","booking","analytics"], include one only if clearly implied by the request,
  "layoutStructure": string (one concise sentence describing top-to-bottom structure),
  "mainSections": array of 3-6 short section names (strings),
  "designStyle": string (one concise sentence on the visual style/tone),
  "colorPalette": array of exactly 4 objects: {"role":"Primary","hex":"#..."},{"role":"Secondary","hex":"#..."},{"role":"Neutral","hex":"#..."},{"role":"Background","hex":"#..."},
  "typography": {"heading": string, "body": string, "scale": string like "32 / 20 / 16 / 14px"},
  "components": array of 4-8 short component names (strings),
  "rationale": string (1-2 sentences on WHY this structure works — no restating of the prompt)
}`;

/** The review object the Reviewer must return. */
export const REVIEW_JSON_SHAPE = `{
  "score": integer 0-100 (overall design quality),
  "categories": array of EXACTLY 9 objects, one per category, in this order:
    ["Layout","Visual Hierarchy","Spacing","Alignment","Typography","Color Contrast","Accessibility","Consistency","Usability"].
    Each object: {
      "category": the exact category name from the list,
      "status": one of "positive" (no issue), "attention" (a real, visible problem), or "insufficient" (not enough visible evidence to judge — use this instead of guessing),
      "severity": one of "high","medium","low" — include ONLY when status is "attention", otherwise omit,
      "summary": string, 1-2 concise, objective, evidence-based sentences describing what is actually visible,
      "principle": include when applicable: {"framework": one of "Nielsen","WCAG 2.2 AA","Material Design 3", "reference": short principle name/number}
    }
}`;

export const JSON_ONLY_INSTRUCTION =
  "Respond with a SINGLE minified JSON object and nothing else — no markdown, no code fences, no commentary before or after.";
