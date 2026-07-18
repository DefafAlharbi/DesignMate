"use client";

import * as React from "react";
import { PlatformNav } from "@/components/platform/PlatformNav";
import { AgentTabs } from "@/components/platform/AgentTabs";
import { GeneratorPanel, type GenStage } from "@/components/platform/GeneratorPanel";
import { ReviewerPanel, type ReviewStage } from "@/components/platform/ReviewerPanel";
import { RecommendationPanel, type RecommendStage } from "@/components/platform/RecommendationPanel";
import { getAgent } from "@/lib/agents";
import { needsClarification, mergeAnswersIntoBrief } from "@/lib/clarify";
import { fileToBase64, requestGenerate, requestReview } from "@/lib/api-client";
import { buildRecommendations } from "@/lib/recommend";
import {
  AgentId,
  ClarificationAnswers,
  ClarificationQuestion,
  GeneratedDesign,
  RecommendationResult,
  ReviewResult,
} from "@/lib/types";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function PlatformPage() {
  const [activeAgent, setActiveAgent] = React.useState<AgentId>("generate");
  const agent = getAgent(activeAgent);

  // Generator state
  const [description, setDescription] = React.useState("");
  const [genStage, setGenStage] = React.useState<GenStage>("idle");
  const [clarifyQuestions, setClarifyQuestions] = React.useState<ClarificationQuestion[]>([]);
  const [clarifyAnswers, setClarifyAnswers] = React.useState<ClarificationAnswers>({});
  const [genResult, setGenResult] = React.useState<GeneratedDesign | null>(null);
  const [genError, setGenError] = React.useState<string | null>(null);

  // Reviewer state
  const [reviewFile, setReviewFile] = React.useState<File | null>(null);
  const [reviewPreview, setReviewPreview] = React.useState<string | null>(null);
  const [reviewStage, setReviewStage] = React.useState<ReviewStage>("idle");
  const [reviewResult, setReviewResult] = React.useState<ReviewResult | null>(null);
  const [reviewError, setReviewError] = React.useState<string | null>(null);

  // Recommendation state (second stage — derived locally from the review)
  const [recommendStage, setRecommendStage] = React.useState<RecommendStage>("idle");
  const [recommendResult, setRecommendResult] = React.useState<RecommendationResult | null>(null);

  const handleGenerateSubmit = async () => {
    if (genStage === "idle") {
      const questions = needsClarification(description);
      if (questions.length > 0) {
        setClarifyQuestions(questions);
        setGenStage("clarify");
        return;
      }
    }
    setGenError(null);
    setGenStage("loading");
    try {
      const brief = mergeAnswersIntoBrief(description, clarifyAnswers);
      const design = await requestGenerate(brief);
      setGenResult(design);
      setGenStage("done");
    } catch (error) {
      setGenError(errorMessage(error));
      setGenStage("error");
    }
  };

  const handleGenerateReset = () => {
    setDescription("");
    setGenStage("idle");
    setClarifyQuestions([]);
    setClarifyAnswers({});
    setGenResult(null);
    setGenError(null);
  };

  // A fresh or cleared review invalidates any recommendations built from it.
  const resetRecommendations = () => {
    setRecommendResult(null);
    setRecommendStage("idle");
  };

  const handleReviewFile = (file: File) => {
    setReviewFile(file);
    setReviewPreview(URL.createObjectURL(file));
    setReviewResult(null);
    setReviewError(null);
    setReviewStage("idle");
    resetRecommendations();
  };

  const handleReviewClear = () => {
    setReviewFile(null);
    setReviewPreview(null);
    setReviewResult(null);
    setReviewError(null);
    setReviewStage("idle");
    resetRecommendations();
  };

  const handleRunReview = async () => {
    if (!reviewFile || !reviewPreview) return;
    setReviewError(null);
    setReviewStage("loading");
    try {
      const base64 = await fileToBase64(reviewFile);
      const result = await requestReview(base64, reviewFile.type || "image/png", reviewPreview);
      setReviewResult(result);
      setReviewStage("done");
      resetRecommendations();
    } catch (error) {
      setReviewError(errorMessage(error));
      setReviewStage("error");
    }
  };

  // Recommendation agent: transforms the review output locally, no Gemini call.
  const handleGenerateRecommendations = () => {
    if (!reviewResult) return;
    setRecommendStage("analyzing");
    // Brief, honest local processing pause so the pipeline step reads clearly.
    window.setTimeout(() => {
      setRecommendResult(buildRecommendations(reviewResult));
      setRecommendStage("done");
    }, 450);
  };

  return (
    <div className="min-h-screen">
      <PlatformNav />
      <main className="container px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">AI Design Workspace</h1>
          <p className="mt-1.5 text-muted-foreground">{agent.description}</p>
        </div>

        <div className="mb-8">
          <AgentTabs active={activeAgent} onChange={setActiveAgent} />
        </div>

        {activeAgent === "generate" && (
          <GeneratorPanel
            description={description}
            onDescriptionChange={setDescription}
            stage={genStage}
            clarifyQuestions={clarifyQuestions}
            clarifyAnswers={clarifyAnswers}
            onAnswerChange={(id, value) => setClarifyAnswers((prev) => ({ ...prev, [id]: value }))}
            onSubmit={handleGenerateSubmit}
            onBackFromClarify={() => setGenStage("idle")}
            onReset={handleGenerateReset}
            result={genResult}
            error={genError}
          />
        )}

        {activeAgent === "review" && (
          <ReviewerPanel
            previewUrl={reviewPreview}
            fileName={reviewFile?.name}
            onFile={handleReviewFile}
            onClear={handleReviewClear}
            stage={reviewStage}
            onRunReview={handleRunReview}
            result={reviewResult}
            error={reviewError}
          />
        )}

        {activeAgent === "recommend" && (
          <RecommendationPanel
            review={reviewResult}
            stage={recommendStage}
            onGenerate={handleGenerateRecommendations}
            onReset={resetRecommendations}
            onGoToReview={() => setActiveAgent("review")}
            result={recommendResult}
          />
        )}
      </main>
    </div>
  );
}
