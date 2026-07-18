# DesignMate

A production-quality prototype of an AI-powered UI/UX design platform. DesignMate gives designers, developers, and product teams three focused AI agents — **Generate**, **Review**, and **Improve** — in a single, premium SaaS-style workspace.

The three agents are powered by the **Google Gemini API** through the official `@google/genai` SDK. All model calls run server-side in Next.js route handlers, so your API key stays on the server and is never exposed to the browser. There is no database, no auth, and no user accounts — just add a Gemini API key and run.

## Features

- **Modern landing page** — hero, agent showcase, how-it-works, standards section, CTA
- **AI Design Workspace** (`/platform`) with three agents, following **Input → Clarify (if needed) → Analysis → Result**:
  - **Design Generator** — describe an app idea in plain language; if the description is too vague, the agent asks 2–5 concise clarifying questions before generating. Output is a complete UI proposal — Layout Structure, Main Sections, Design Style, Color Palette, Typography, Recommended Components, and a brief Design Rationale — plus a live, dynamic mockup preview that visibly differs by template, palette, grid density, and detected features (pricing, search, chat, booking, etc.). It never repeats or summarizes your prompt back to you.
  - **Design Reviewer** — upload a screenshot; the agent runs real client-side image analysis (brightness, contrast, whitespace, margins, quadrant-brightness variance, edge-column alignment, dominant colors) and evaluates 9 categories — Layout, Visual Hierarchy, Spacing, Alignment, Typography, Color Contrast, Accessibility, Consistency, and Usability — each tagged to Nielsen's Heuristics, WCAG 2.2 AA, or Material Design 3 where applicable. Categories the pixel data genuinely can't support (e.g. Typography, parts of Accessibility) are explicitly marked **Insufficient Evidence** rather than guessed.
  - **Design Improver** — takes a reviewed design (or a fresh upload) and produces a **redesign proposal**, not an edited image: a structured Layout/Style/Palette/Typography/Components proposal plus a targeted before/after change list, grounded only in the review's flagged categories. The original screenshot is shown unmodified alongside a newly generated "proposed direction" mockup. No new features are invented — only layout, spacing, typography, color, and hierarchy are addressed.
- **Dark and light mode**, defaulting to dark, togglable from any page
- **Fully responsive** across mobile, tablet, and desktop
- **Standards-backed feedback** — every issue and suggestion cites a real principle from Nielsen's 10 Usability Heuristics, WCAG 2.2 AA, or Material Design 3
- Smooth micro-interactions via Framer Motion, no login/auth/payment/database

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Google Gemini API](https://ai.google.dev/) via the official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK
- [Tailwind CSS](https://tailwindcss.com/) with a custom design token system (CSS variables for light/dark theming)
- [next-themes](https://github.com/pacocoursey/next-themes) for theme persistence
- [Framer Motion](https://www.framer.com/motion/) for animation
- [lucide-react](https://lucide.dev/) for icons

## Getting Started

**Requirements:** Node.js 18.17 or later, and a Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey)).

```bash
# 1. Install dependencies
npm install

# 2. Configure your API key
#    Copy the example env file, then edit .env.local and paste your key.
cp .env.example .env.local
#    Set GEMINI_API_KEY=your_real_key in .env.local

# 3. Run the development server
npm run dev

# 4. Open the app
# http://localhost:3000
```

### Environment variables

| Variable         | Required | Description                                               |
| ---------------- | -------- | --------------------------------------------------------- |
| `GEMINI_API_KEY` | Yes      | Your Google Gemini API key. Read server-side only.        |
| `GEMINI_MODEL`   | No       | Model override for all three agents (default `gemini-2.5-flash`). |

`.env.local` is git-ignored — never commit a real key. The build succeeds without a key; the app only needs it at runtime, and shows a clear in-app error if it's missing.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # lint the codebase
```

## How the AI Agents Work

Each agent has its **own system prompt** (kept in `lib/prompts/`, never hardcoded in components) and calls Gemini through a shared server-side helper. The browser only ever talks to the app's own API routes (`/api/generate`, `/api/review`, `/api/improve`) — it never sees the API key or contacts Google directly.

The flow for every agent is **Input → Clarify (if needed) → Analysis → Result**:

- **Generator** (`lib/prompts/generator.ts`, `lib/gemini/generate.ts`) — after the client-side clarification gate (`lib/clarify.ts`) collects any missing details, the brief is sent to Gemini, which returns a structured design proposal. The prompt explicitly forbids echoing or summarizing the user's request. The result renders live via `components/platform/DesignMockup.tsx`.
- **Reviewer** (`lib/prompts/reviewer.ts`, `lib/gemini/review.ts`) — the uploaded screenshot is sent to Gemini as inline image data and evaluated across 9 fixed categories. The prompt instructs the model to judge only what is visible and to mark a category **Insufficient Evidence** rather than invent a problem when a static image can't support a verdict.
- **Improver** (`lib/prompts/improver.ts`, `lib/gemini/improve.ts`) — the screenshot plus the review's findings are sent to Gemini, which proposes a redesign *direction* (layout, spacing, typography, palette, hierarchy) while preserving the original content and flow. It never edits the uploaded image; the original is shown unchanged next to the new proposal.

**Every response is validated before it reaches the UI.** Raw model JSON is coerced to the exact expected shape in `lib/gemini/coerce.ts` (enums constrained, fallbacks applied so a malformed field can't break a renderer), then passed through `lib/validate.ts` on the client for a second completeness pass. API and network errors are surfaced as a friendly in-app error state, never a crash.

### Swapping the model

All three agents share `GEMINI_MODEL` (default `gemini-2.5-flash`). Set it in `.env.local` to use a different Gemini model without any code changes.

## Project Structure

```
app/
  layout.tsx            Root layout, fonts, theme provider
  page.tsx               Landing page
  globals.css             Design tokens (light/dark CSS variables) + base styles
  platform/
    page.tsx              AI Design Workspace (state machine tying the 3 agents together)
  api/
    generate/route.ts     Design Generator endpoint (server-side Gemini call)
    review/route.ts       Design Reviewer endpoint (server-side Gemini call)
    improve/route.ts      Design Improver endpoint (server-side Gemini call)

components/
  landing/                Landing page sections (Navbar, Hero, AgentsShowcase, HowItWorks, StandardsSection, CTASection, Footer)
  platform/                Workspace UI (AgentTabs, GeneratorPanel, ReviewerPanel, ImproverPanel, DesignMockup, DesignProposalDetails, CategoryCard, ImageDropzone, ScoreRing, PrincipleTag, ClarificationQuestions, EmptyState, ErrorState, LoadingPanel, PlatformNav)
  shared/                  Reusable primitives (Button, Badge, Logo, ThemeToggle)
  theme-provider.tsx        next-themes wrapper

lib/
  types.ts                 Shared TypeScript types
  agents.ts                 Agent metadata
  clarify.ts                 Clarification-question logic for the Generator
  api-client.ts              Client helpers: call the API routes, convert images to base64, validate responses
  validate.ts                 Output validation/backfill guardrails for all three agents
  utils.ts                     cn() class-name helper
  prompts/
    generator.ts              Design Generator system prompt
    reviewer.ts               Design Reviewer system prompt
    improver.ts               Design Improver system prompt
    shapes.ts                 Shared JSON-shape descriptions embedded into the prompts
  gemini/
    client.ts                 Server-only Gemini client (reads GEMINI_API_KEY / GEMINI_MODEL from env)
    core.ts                   Shared structured-JSON call helper + image/text part builders
    coerce.ts                 Coerces raw model JSON into the exact typed shapes the UI renders
    generate.ts / review.ts / improve.ts   Per-agent call modules
    errors.ts                 Maps thrown errors to safe JSON API responses
```

## Design Notes

- No authentication, database, payments, history, or user accounts — by design, this is a focused prototype.
- The only external dependency is the Google Gemini API. The API key is read exclusively server-side (`lib/gemini/client.ts` is marked `server-only`) and never shipped to the browser.
- Color system, spacing, and typography are defined once in `app/globals.css` and `tailwind.config.ts` and reused everywhere via Tailwind utility classes and CSS variables, so switching the brand palette is a one-file change.
