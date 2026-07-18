import {
  CategoryFinding,
  CategoryStatus,
  ColorSwatch,
  DesignPrinciple,
  ExtraBlockId,
  GeneratedDesign,
  IssueSeverity,
  PrincipleFramework,
  REVIEW_CATEGORIES,
  ReviewCategoryName,
  ReviewResult,
  TypographySpec,
} from "../types";

/**
 * Defensive coercion from raw Gemini JSON (`unknown`) into the exact typed
 * shapes the existing UI renders. The model is instructed to return these
 * shapes, but we never trust that blindly: every enum is constrained to a
 * known value and every field is given a safe fallback so a malformed field
 * can never break a renderer (e.g. an unknown templateId would otherwise pick
 * no wireframe). This runs on the server; `lib/validate.ts` adds a second
 * completeness pass on the client before display.
 */

const TEMPLATE_IDS = ["saas-landing", "dashboard", "ecommerce", "mobile-app", "portfolio"] as const;
type TemplateId = (typeof TEMPLATE_IDS)[number];

const TEMPLATE_NAMES: Record<TemplateId, string> = {
  "saas-landing": "SaaS Landing Page",
  dashboard: "Analytics Dashboard",
  ecommerce: "E-commerce Storefront",
  "mobile-app": "Mobile App Screen",
  portfolio: "Portfolio / Personal Site",
};

const EXTRA_BLOCK_IDS: ExtraBlockId[] = ["pricing", "testimonials", "search", "chat", "booking", "analytics"];
const FRAMEWORKS: PrincipleFramework[] = ["Nielsen", "WCAG 2.2 AA", "Material Design 3"];
const STATUSES: CategoryStatus[] = ["positive", "attention", "insufficient"];
const SEVERITIES: IssueSeverity[] = ["high", "medium", "low"];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => asString(v)).filter(Boolean);
}

function asHex(value: unknown, fallback: string): string {
  const s = asString(value);
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s) ? s : fallback;
}

function asInt(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const s = asString(value);
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

function coercePrinciple(value: unknown): DesignPrinciple | undefined {
  const raw = asRecord(value);
  const reference = asString(raw.reference);
  if (!reference) return undefined;
  return {
    framework: oneOf(raw.framework, FRAMEWORKS, "Nielsen"),
    reference,
  };
}

function coerceTypography(value: unknown): TypographySpec {
  const raw = asRecord(value);
  return {
    heading: asString(raw.heading, "Modern sans-serif"),
    body: asString(raw.body, "Regular sans-serif"),
    scale: asString(raw.scale, "32 / 20 / 16 / 14px"),
  };
}

function coercePalette(value: unknown, accent: string, secondary: string): ColorSwatch[] {
  const roles = ["Primary", "Secondary", "Neutral", "Background"];
  const defaults: Record<string, string> = {
    Primary: accent,
    Secondary: secondary,
    Neutral: "#E5E7EB",
    Background: "#FFFFFF",
  };
  const provided = Array.isArray(value) ? value.map(asRecord) : [];
  const byRole = new Map<string, string>();
  provided.forEach((swatch) => {
    const role = asString(swatch.role);
    const hex = asHex(swatch.hex, "");
    if (role && hex) byRole.set(role, hex);
  });
  return roles.map((role) => ({ role, hex: byRole.get(role) || defaults[role] }));
}

function coerceExtraBlocks(value: unknown): ExtraBlockId[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<ExtraBlockId>();
  value.forEach((v) => {
    const id = asString(v).toLowerCase();
    if ((EXTRA_BLOCK_IDS as string[]).includes(id)) seen.add(id as ExtraBlockId);
  });
  return Array.from(seen).slice(0, 2);
}

function coerceGridColumns(value: unknown): 2 | 3 | 4 {
  const n = asInt(value, 3);
  if (n <= 2) return 2;
  if (n >= 4) return 4;
  return 3;
}

export function coerceDesign(value: unknown): GeneratedDesign {
  const raw = asRecord(value);
  const templateId = oneOf(raw.templateId, TEMPLATE_IDS, "saas-landing");
  const accent = asHex(raw.accent, "#6366F1");
  const secondaryAccent = asHex(raw.secondaryAccent, "#22D3EE");
  const mainSections = asStringArray(raw.mainSections);

  return {
    templateId,
    templateName: TEMPLATE_NAMES[templateId],
    headline: asString(raw.headline, "A focused, single-purpose screen"),
    subheadline: asString(raw.subheadline, "A clear layout built around one primary action."),
    ctaLabel: asString(raw.ctaLabel, "Get Started"),
    accent,
    secondaryAccent,
    gridColumns: coerceGridColumns(raw.gridColumns),
    extraBlocks: coerceExtraBlocks(raw.extraBlocks),
    sections:
      mainSections.length > 0
        ? mainSections.map((label, i) => ({ id: `s${i}`, label }))
        : [{ id: "content", label: "Primary Content" }],
    layoutStructure: asString(
      raw.layoutStructure,
      "A single-column, top-to-bottom structure that introduces the primary action before supporting detail."
    ),
    mainSections: mainSections.length >= 2 ? mainSections : ["Navigation", "Primary content", "Primary action", "Footer"],
    designStyle: asString(raw.designStyle, "Clean, modern, and minimal with a single accent color."),
    colorPalette: coercePalette(raw.colorPalette, accent, secondaryAccent),
    typography: coerceTypography(raw.typography),
    components: (() => {
      const c = asStringArray(raw.components);
      return c.length >= 3 ? c : ["Primary Button", "Nav Bar", "Card", "Footer"];
    })(),
    rationale: asString(
      raw.rationale,
      "This structure keeps the primary action visible immediately, which supports faster task completion."
    ),
  };
}

function coerceCategory(value: unknown): CategoryFinding | null {
  const raw = asRecord(value);
  const category = asString(raw.category);
  if (!(REVIEW_CATEGORIES as readonly string[]).includes(category)) return null;

  const status = oneOf(raw.status, STATUSES, "insufficient");
  const finding: CategoryFinding = {
    id: category.toLowerCase().replace(/\s+/g, "-"),
    category: category as ReviewCategoryName,
    status,
    summary: asString(raw.summary, `${category} could not be evaluated from the available image.`),
    principle: coercePrinciple(raw.principle),
  };
  if (status === "attention") {
    finding.severity = oneOf(raw.severity, SEVERITIES, "medium");
  }
  return finding;
}

export function coerceReview(value: unknown, imageUrl: string): ReviewResult {
  const raw = asRecord(value);
  const provided = Array.isArray(raw.categories)
    ? (raw.categories.map(coerceCategory).filter(Boolean) as CategoryFinding[])
    : [];
  const byName = new Map(provided.map((c) => [c.category, c]));

  const categories = REVIEW_CATEGORIES.map(
    (name): CategoryFinding =>
      byName.get(name) ?? {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        category: name,
        status: "insufficient",
        summary: `${name} could not be evaluated from the available image.`,
      }
  );

  const score = Math.max(0, Math.min(100, asInt(raw.score, 70)));

  return {
    score,
    grade: scoreToGrade(score),
    categories,
    imageUrl,
  };
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Work";
  return "Critical Issues";
}
