import { Loader2 } from "lucide-react";

export function LoadingPanel({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-10 text-center card-shadow">
      <Loader2 className="h-6 w-6 animate-spin text-brand" />
      <p className="text-sm font-medium text-foreground/90">{message}</p>
      <div className="w-full max-w-xs space-y-2">
        <div className="h-2 w-full rounded-full shimmer-bg animate-shimmer" />
        <div className="h-2 w-4/5 rounded-full shimmer-bg animate-shimmer" />
        <div className="h-2 w-3/5 rounded-full shimmer-bg animate-shimmer" />
      </div>
    </div>
  );
}
