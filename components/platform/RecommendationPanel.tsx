"use client";

import { Lightbulb, RotateCcw, ScanSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { PrincipleTag } from "./PrincipleTag";
import { EmptyState } from "./EmptyState";
import { LoadingPanel } from "./LoadingPanel";
import { Recommendation, RecommendationResult, ReviewResult } from "@/lib/types";

export type RecommendStage = "idle" | "analyzing" | "done";

interface RecommendationPanelProps {
  review: ReviewResult | null;
  stage: RecommendStage;
  onGenerate: () => void;
  onReset: () => void;
  onGoToReview: () => void;
  result: RecommendationResult | null;
}

const PRIORITY_TONE: Record<Recommendation["priority"], "danger" | "warning" | "neutral"> = {
  High: "danger",
  Medium: "warning",
  Low: "neutral",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

export function RecommendationPanel({
  review,
  stage,
  onGenerate,
  onReset,
  onGoToReview,
  result,
}: RecommendationPanelProps) {
  const busy = stage === "analyzing";
  const attentionCount = review?.categories.filter((c) => c.status === "attention").length ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: the source review this agent consumes */}
      <div className="space-y-4">
        {!review ? (
          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="mb-3 flex items-center gap-2 text-brand">
              <Lightbulb className="h-4 w-4" />
              <p className="text-sm font-semibold">This agent builds on your review</p>
            </div>
            <p className="text-sm text-muted-foreground">
              The Recommendation agent doesn&apos;t re-analyze your screenshot — it turns the
              Design Reviewer&apos;s findings into prioritized, actionable recommendations. Run a
              review first, then come back here.
            </p>
            <div className="mt-5">
              <Button onClick={onGoToReview} variant="outline">
                <ScanSearch className="h-4 w-4" />
                Go to Design Reviewer
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="mb-3 flex items-center gap-2 text-brand">
              <ScanSearch className="h-4 w-4" />
              <p className="text-sm font-semibold">Source: Design Review</p>
            </div>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.imageUrl}
                alt="Reviewed design"
                className="h-16 w-16 rounded-lg border border-border object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Score: {review.score} · {review.grade}</p>
                <p className="text-xs text-muted-foreground">
                  {attentionCount} categor{attentionCount !== 1 ? "ies" : "y"} flagged for attention
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Button onClick={onGenerate} disabled={busy}>
                <Lightbulb className="h-4 w-4" />
                {result ? "Regenerate" : "Generate Recommendations"}
              </Button>
              {result && (
                <Button variant="ghost" onClick={onReset}>
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
            <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
              Runs locally from the review findings — no additional AI request.
            </p>
          </div>
        )}
      </div>

      {/* Right: the recommendations */}
      <div className="space-y-4">
        {stage === "analyzing" && <LoadingPanel message="Turning review findings into recommendations..." />}
        {stage === "done" && result && (
          <div className="animate-fade-up space-y-4">
            {/* Header carried over from the review */}
            <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
              <FieldLabel>Recommendations</FieldLabel>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="brand">Review score {result.score} · {result.grade}</Badge>
                {result.highCount > 0 && <Badge tone="danger">{result.highCount} High</Badge>}
                {result.mediumCount > 0 && <Badge tone="warning">{result.mediumCount} Medium</Badge>}
                {result.lowCount > 0 && <Badge tone="neutral">{result.lowCount} Low</Badge>}
              </div>
            </div>

            {result.groups.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
                <p className="text-sm text-muted-foreground">
                  No priority fixes were flagged. Keep the current direction and re-review after your
                  next iteration.
                </p>
              </div>
            ) : (
              result.groups.map((group) => (
                <div key={group.name} className="space-y-3 rounded-2xl border border-border bg-card p-6 card-shadow">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {group.recommendations.length} recommendation{group.recommendations.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {group.recommendations.map((rec) => (
                      <div key={rec.id} className="rounded-xl border border-border p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-semibold">{rec.title}</h4>
                          <Badge tone={PRIORITY_TONE[rec.priority]}>{rec.priority}</Badge>
                        </div>
                        <p className="mt-2 flex items-start gap-1.5 text-sm text-foreground/90">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          {rec.action}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/70">From review — {rec.sourceCategory}: </span>
                          {rec.evidence}
                        </p>
                        {rec.principle && (
                          <div className="mt-2.5">
                            <PrincipleTag principle={rec.principle} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {stage === "idle" && (
          <EmptyState
            icon={Lightbulb}
            title="Your prioritized recommendations will appear here"
            description="This agent consumes the Design Reviewer's findings and groups them into UI, UX, Accessibility, and Visual Design recommendations — ordered by severity, no extra AI call."
          />
        )}
      </div>
    </div>
  );
}
