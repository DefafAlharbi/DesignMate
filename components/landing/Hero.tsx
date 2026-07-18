"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Wand2, ScanSearch, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-pattern bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_10%,transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />

      <div className="container flex flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge tone="brand" className="mb-6">
            <Sparkles className="h-3 w-3" />
            Three specialized AI agents, one workflow
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          Build Better Interfaces {" "}
          <span className="bg-gradient-to-r from-brand to-violet-400 bg-clip-text text-transparent">
            with AI agents
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
         Turn ideas into modern interfaces, review existing designs, 
         and improve them using AI agents powered by recognized UX standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/platform">
            <Button size="lg" className="group">
              Generate Design
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <a href="#agents">
            <Button size="lg" variant="outline">
              learn more
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mt-20 w-full max-w-5xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card card-shadow">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 text-xs text-muted-foreground">designmate.app/platform</span>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              {[
                { icon: Wand2, label: "Design Generator", desc: "Idea → structured mockup", delay: 0 },
                { icon: ScanSearch, label: "Design Reviewer", desc: "Screenshot → usability audit", delay: 0.6 },
                { icon: Lightbulb, label: "Design Recommendation", desc: "Screenshot → recommendations", delay: 1.2 },
              ].map(({ icon: Icon, label, desc, delay }) => (
                <div
                  key={label}
                  className="animate-float rounded-xl border border-border bg-background p-5 text-left"
                  style={{ animationDelay: `${delay}s` }}
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
