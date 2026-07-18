"use client";

import { ScanSearch, RotateCcw } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { ImageDropzone } from "./ImageDropzone";
import { ScoreRing } from "./ScoreRing";
import { CategoryCard } from "./CategoryCard";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingPanel } from "./LoadingPanel";
import { ReviewResult } from "@/lib/types";

export type ReviewStage = "idle" | "loading" | "done" | "error";

interface ReviewerPanelProps {
  previewUrl: string | null;
  fileName?: string;
  onFile: (file: File) => void;
  onClear: () => void;
  stage: ReviewStage;
  onRunReview: () => void;
  result: ReviewResult | null;
  error: string | null;
}

export function ReviewerPanel({
  previewUrl,
  fileName,
  onFile,
  onClear,
  stage,
  onRunReview,
  result,
  error,
}: ReviewerPanelProps) {
  const attentionCount = result?.categories.filter((c) => c.status === "attention").length ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <label className="mb-3 block text-sm font-semibold">Upload a UI screenshot</label>
          <ImageDropzone previewUrl={previewUrl} fileName={fileName} onFile={onFile} onClear={onClear} />
          <div className="mt-5 flex items-center gap-3">
            <Button onClick={onRunReview} disabled={!previewUrl || stage === "loading"}>
              <ScanSearch className="h-4 w-4" />
              {result ? "Review Again" : "Review Design"}
            </Button>
            {result && (
              <Button variant="ghost" onClick={onClear}>
                <RotateCcw className="h-3.5 w-3.5" />
                Start over
              </Button>
            )}
          </div>
        </div>
      </div>

      <div>
        {stage === "loading" && <LoadingPanel message="Analyzing layout, contrast, spacing, and hierarchy..." />}
        {stage === "error" && <ErrorState message={error ?? "The design couldn't be reviewed."} />}
        {stage === "done" && result && (
          <div className="animate-fade-up space-y-4 rounded-2xl border border-border bg-card p-6 card-shadow">
            <div className="flex flex-col items-center gap-4 border-b border-border pb-6 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overall Score</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {attentionCount === 0
                    ? "No categories flagged for attention."
                    : `${attentionCount} of 9 categories flagged for attention.`}
                </p>
              </div>
              <ScoreRing score={result.score} label={result.grade} />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Evaluation by category
              </p>
              <div className="space-y-3">
                {result.categories.map((finding) => (
                  <CategoryCard key={finding.id} finding={finding} />
                ))}
              </div>
            </div>
          </div>
        )}
        {stage === "idle" && (
          <EmptyState
            icon={ScanSearch}
            title="Your usability audit will appear here"
            description="Upload a screenshot on the left and click Review Design for a category-by-category audit against Nielsen, WCAG 2.2 AA, and Material Design 3."
          />
        )}
      </div>
    </div>
  );
}
