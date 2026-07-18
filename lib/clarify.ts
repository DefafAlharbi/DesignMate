import { ClarificationAnswers, ClarificationQuestion } from "./types";

interface SignalCheck {
  id: string;
  question: string;
  keywords: string[];
}

const SIGNAL_CHECKS: SignalCheck[] = [
  {
    id: "platform",
    question: "What's the target platform — web app, mobile app, or marketing site?",
    keywords: [
      "web",
      "website",
      "mobile",
      "ios",
      "android",
      "app",
      "desktop",
      "landing page",
      "dashboard",
      "saas",
    ],
  },
  {
    id: "audience",
    question: "Who is the primary user or audience for this product?",
    keywords: [
      "user",
      "customer",
      "audience",
      "student",
      "team",
      "business",
      "consumer",
      "developer",
      "shopper",
      "patient",
      "b2b",
      "b2c",
    ],
  },
  {
    id: "style",
    question: "What visual style or tone are you going for (e.g. minimal, playful, corporate, bold)?",
    keywords: [
      "minimal",
      "modern",
      "playful",
      "corporate",
      "bold",
      "elegant",
      "dark",
      "colorful",
      "clean",
      "premium",
      "friendly",
      "professional",
    ],
  },
  {
    id: "core-feature",
    question: "What's the single most important action or feature this screen should highlight?",
    keywords: [
      "signup",
      "checkout",
      "search",
      "booking",
      "upload",
      "track",
      "chat",
      "pay",
      "browse",
      "create",
      "manage",
      "schedule",
      "analytics",
      "cart",
    ],
  },
  {
    id: "screen",
    question: "Which specific screen should be generated — e.g. homepage, onboarding, dashboard, or product page?",
    keywords: [
      "homepage",
      "home page",
      "onboarding",
      "dashboard",
      "product page",
      "profile",
      "settings",
      "checkout",
      "pricing",
      "login",
      "signup page",
    ],
  },
];

const MIN_WORDS_NO_CLARIFY = 5;

export function needsClarification(description: string): ClarificationQuestion[] {
  const trimmed = description.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (wordCount < MIN_WORDS_NO_CLARIFY) {
    return SIGNAL_CHECKS.slice(0, 4).map(({ id, question }) => ({ id, question }));
  }

  const lower = trimmed.toLowerCase();
  const missing = SIGNAL_CHECKS.filter(
    (check) => !check.keywords.some((kw) => lower.includes(kw))
  );

  if (missing.length <= 1) return [];

  const count = Math.max(2, Math.min(5, missing.length));
  return missing.slice(0, count).map(({ id, question }) => ({ id, question }));
}

export function mergeAnswersIntoBrief(description: string, answers: ClarificationAnswers): string {
  const extras = Object.values(answers).filter(Boolean).join(". ");
  return extras ? `${description}. ${extras}` : description;
}
