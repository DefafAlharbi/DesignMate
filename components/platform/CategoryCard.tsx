import { AlertTriangle, AlertCircle, CheckCircle2, CircleHelp, Info } from "lucide-react";
import { CategoryFinding } from "@/lib/types";
import { PrincipleTag } from "./PrincipleTag";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  positive: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Good" },
  insufficient: { icon: CircleHelp, color: "text-muted-foreground", bg: "bg-muted", label: "Insufficient Evidence" },
} as const;

const SEVERITY_CONFIG = {
  high: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", label: "Needs Attention" },
  medium: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", label: "Needs Attention" },
  low: { icon: Info, color: "text-warning", bg: "bg-warning/10", label: "Minor" },
} as const;

export function CategoryCard({ finding }: { finding: CategoryFinding }) {
  const config =
    finding.status === "attention"
      ? SEVERITY_CONFIG[finding.severity ?? "medium"]
      : STATUS_CONFIG[finding.status];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", config.bg, config.color)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold">{finding.category}</h4>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide", config.bg, config.color)}>
              {config.label}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{finding.summary}</p>
          {finding.principle && (
            <div className="mt-2.5">
              <PrincipleTag principle={finding.principle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
