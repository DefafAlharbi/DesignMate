"use client";

import { HelpCircle } from "lucide-react";
import { ClarificationAnswers, ClarificationQuestion } from "@/lib/types";
import { Button } from "@/components/shared/Button";

export function ClarificationQuestions({
  questions,
  answers,
  onChange,
  onSubmit,
  onBack,
}: {
  questions: ClarificationQuestion[];
  answers: ClarificationAnswers;
  onChange: (id: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 card-shadow animate-fade-up">
      <div className="mb-4 flex items-center gap-2 text-brand">
        <HelpCircle className="h-4.5 w-4.5" />
        <p className="text-sm font-semibold">A few quick questions before I generate</p>
      </div>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id}>
            <label className="mb-1.5 block text-sm text-foreground/90">
              {i + 1}. {q.question}
            </label>
            <input
              value={answers[q.id] ?? ""}
              onChange={(e) => onChange(q.id, e.target.value)}
              placeholder="Type a short answer..."
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={onSubmit}>Generate Design</Button>
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
