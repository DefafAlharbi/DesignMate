"use client";

import { motion } from "framer-motion";
import { MessageSquareText, ImageUp, ListChecks, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Describe or upload",
    description: "Write your app idea in plain language, or upload a UI screenshot to review.",
  },
  {
    icon: ListChecks,
    title: "Agent analyzes",
    description: "The right agent asks clarifying questions if needed, then does its focused job.",
  },
  {
    icon: ImageUp,
    title: "Review the output",
    description: "Get a mockup, an audit with a score, or prioritized design recommendations.",
  },
  {
    icon: Rocket,
    title: "Iterate quickly",
    description: "Move between agents — generate, review, then recommend — in one workflow.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-muted/40 py-24">
      <div className="container px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            A simple, linear workflow — no accounts, no setup.
          </p>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex flex-col items-start"
            >
              <div className="relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-brand">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
