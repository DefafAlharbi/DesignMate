"use client";

import { cn } from "@/lib/utils";

function toneForScore(score: number) {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-brand";
  if (score >= 60) return "text-warning";
  return "text-danger";
}

export function ScoreRing({
  score,
  label,
  size = 116,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const tone = toneForScore(score);

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} strokeWidth="10" className="stroke-muted" fill="none" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", tone)}
            stroke="currentColor"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold", tone)}>{score}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
      </div>
      {label && <p className={cn("mt-2 text-sm font-medium", tone)}>{label}</p>}
    </div>
  );
}
