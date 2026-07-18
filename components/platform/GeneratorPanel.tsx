"use client";

import { Wand2, RotateCcw } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { ClarificationAnswers, ClarificationQuestion, GeneratedDesign } from "@/lib/types";
import { ClarificationQuestions } from "./ClarificationQuestions";
import { DesignMockup } from "./DesignMockup";
import { DesignProposalDetails } from "./DesignProposalDetails";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingPanel } from "./LoadingPanel";

export type GenStage = "idle" | "clarify" | "loading" | "done" | "error";

const EXAMPLE_PROMPTS = [
  "A minimal SaaS landing page for a project management tool aimed at small teams",
  "A mobile onboarding flow for a calm, friendly meditation app for beginners",
  "An analytics dashboard for a B2B logistics company to track shipments",
];

interface GeneratorPanelProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  stage: GenStage;
  clarifyQuestions: ClarificationQuestion[];
  clarifyAnswers: ClarificationAnswers;
  onAnswerChange: (id: string, value: string) => void;
  onSubmit: () => void;
  onBackFromClarify: () => void;
  onReset: () => void;
  result: GeneratedDesign | null;
  error: string | null;
}

export function GeneratorPanel({
  description,
  onDescriptionChange,
  stage,
  clarifyQuestions,
  clarifyAnswers,
  onAnswerChange,
  onSubmit,
  onBackFromClarify,
  onReset,
  result,
  error,
}: GeneratorPanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <label className="mb-2 block text-sm font-semibold">Describe your app idea</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={stage === "clarify" || stage === "loading"}
            rows={6}
            placeholder="e.g. A minimal SaaS landing page for a project management tool aimed at small remote teams..."
            className="w-full resize-none rounded-lg border border-input bg-background px-3.5 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => onDescriptionChange(p)}
                disabled={stage === "clarify" || stage === "loading"}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground disabled:opacity-50"
              >
                {p.length > 46 ? p.slice(0, 46) + "…" : p}
              </button>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button onClick={onSubmit} disabled={!description.trim() || stage === "clarify" || stage === "loading"} className="group">
              <Wand2 className="h-4 w-4" />
              {result ? "Generate Again" : "Generate Design"}
            </Button>
            {result && (
              <Button variant="ghost" onClick={onReset}>
                <RotateCcw className="h-3.5 w-3.5" />
                Start over
              </Button>
            )}
          </div>
        </div>

        {stage === "clarify" && (
          <ClarificationQuestions
            questions={clarifyQuestions}
            answers={clarifyAnswers}
            onChange={onAnswerChange}
            onSubmit={onSubmit}
            onBack={onBackFromClarify}
          />
        )}
      </div>

      <div>
        {stage === "loading" && <LoadingPanel message="Generating your UI proposal..." />}
        {stage === "error" && <ErrorState message={error ?? "The design couldn't be generated."} />}
        {stage === "done" && result && (
          <div className="animate-fade-up space-y-4">
            <DesignMockup design={result} />
            <DesignProposalDetails design={result} />
          </div>
        )}
        {stage === "idle" && (
          <EmptyState
            icon={Wand2}
            title="Your UI proposal will appear here"
            description="Describe your app idea on the left and click Generate for a full proposal — layout, sections, color palette, typography, and components. If details are missing, I'll ask a couple quick questions first."
          />
        )}
        {stage === "clarify" && (
          <EmptyState
            icon={Wand2}
            title="Almost ready"
            description="Answer the quick questions on the left so the generated design fits your idea better."
          />
        )}
      </div>
    </div>
  );
}
