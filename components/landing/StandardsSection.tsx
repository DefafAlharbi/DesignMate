"use client";

import { motion } from "framer-motion";
import { Eye, ShieldCheck, Layers } from "lucide-react";

const STANDARDS = [
  {
    icon: Eye,
    name: "Nielsen's 10 Usability Heuristics",
    description:
      "Feedback references established principles like visibility of system status, consistency, and error prevention.",
  },
  {
    icon: ShieldCheck,
    name: "WCAG 2.2 AA",
    description:
      "Reviews check for accessibility fundamentals — contrast ratios, target sizes, and focus visibility.",
  },
  {
    icon: Layers,
    name: "Material Design 3",
    description:
      "Suggestions draw on modern design system conventions for color roles, type scale, and adaptive layout.",
  },
];

export function StandardsSection() {
  return (
    <section id="standards" className="container px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Backed by recognized design standards
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
          Every piece of review feedback and every recommendation cites the principle behind it —
          no vague opinions, just grounded reasoning.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {STANDARDS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-7 card-shadow"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
