"use client";

import { motion } from "framer-motion";
import { Wand2, ScanSearch, Lightbulb, type LucideIcon } from "lucide-react";

interface AgentCard {
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  points: string[];
}

const CARDS: AgentCard[] = [
  {
    icon: Wand2,
    name: "Design Generator",
    tagline: "Describe it, see it",
    description:
      "Type a plain-language app idea. If details are missing, the agent asks a few short clarifying questions, then generates a structured UI mockup with rationale.",
    points: ["Clarifying questions when needed", "Template-matched layout", "Short design rationale"],
  },
  {
    icon: ScanSearch,
    name: "Design Reviewer",
    tagline: "Spot the friction",
    description:
      "Upload a screenshot. The agent analyzes contrast, density, and color composition and returns concise, standards-backed feedback with an overall score.",
    points: ["Nielsen heuristics", "WCAG 2.2 AA", "Material Design 3"],
  },
  {
    icon: Lightbulb,
    name: "Design Recommendation",
    tagline: "Style, palette, next steps",
    description:
      "Upload a screenshot and get concrete design recommendations — style, color palette, typography, components, UX suggestions, and prioritized next steps.",
    points: ["Style, palette & typography", "Design personality", "High / Medium / Low priorities"],
  },
];

export function AgentsShowcase() {
  return (
    <section id="agents" className="container px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          One platform, three specialized agents
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
          Each agent focuses on a single job and does it well — together they cover the
          full loop from idea to polished design.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 card-shadow transition-transform hover:-translate-y-1"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/5 blur-2xl transition-colors group-hover:bg-brand/10" />
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand">{card.tagline}</p>
            <h3 className="mt-1.5 text-xl font-semibold">{card.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            <ul className="mt-5 space-y-2 border-t border-border pt-5">
              {card.points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-foreground/80">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
