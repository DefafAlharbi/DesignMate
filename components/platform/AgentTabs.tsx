"use client";

import { Wand2, ScanSearch, Lightbulb, type LucideIcon } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { AgentId } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<AgentId, LucideIcon> = {
  generate: Wand2,
  review: ScanSearch,
  recommend: Lightbulb,
};

export function AgentTabs({
  active,
  onChange,
}: {
  active: AgentId;
  onChange: (id: AgentId) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
      {AGENTS.map((agent) => {
        const Icon = ICONS[agent.id];
        const isActive = agent.id === active;
        return (
          <button
            key={agent.id}
            onClick={() => onChange(agent.id)}
            className={cn(
              "group flex flex-1 items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              isActive
                ? "border-brand/40 bg-brand/[0.07] shadow-[0_0_0_1px_hsl(var(--brand)/0.15)]"
                : "border-border bg-card hover:border-muted-foreground/30 hover:bg-accent/40"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                isActive ? "bg-brand text-brand-foreground" : "bg-accent text-muted-foreground group-hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className={cn("block text-sm font-semibold", isActive ? "text-foreground" : "text-foreground/90")}>
                {agent.name}
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">{agent.tagline}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
