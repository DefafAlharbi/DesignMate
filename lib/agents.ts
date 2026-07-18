import { AgentMeta } from "./types";

export const AGENTS: AgentMeta[] = [
  {
    id: "generate",
    name: "Design Generator",
    tagline: "Describe it, see it",
    description: "Turn a plain-language app idea into a structured UI mockup with rationale.",
  },
  {
    id: "review",
    name: "Design Reviewer",
    tagline: "Spot the friction",
    description: "Upload a screenshot and get a heuristic-backed usability and visual audit.",
  },
  {
    id: "recommend",
    name: "Design Recommendation",
    tagline: "Prioritized next steps",
    description: "Transform the Design Reviewer's findings into grouped, prioritized, actionable recommendations.",
  },
];

export function getAgent(id: string): AgentMeta {
  return AGENTS.find((a) => a.id === id) ?? AGENTS[0];
}
