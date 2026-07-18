"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";

export function CTASection() {
  return (
    <section className="container px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand/10 via-card to-card px-8 py-16 text-center card-shadow"
      >
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/25 blur-[100px]" />
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to design with an AI team?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-balance text-muted-foreground">
          No sign-up, no setup. Jump straight into the platform and try all three agents.
        </p>
        <Link href="/platform" className="mt-8 inline-block">
          <Button size="lg" className="group">
            Open the Platform
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
