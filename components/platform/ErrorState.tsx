import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-danger/30 bg-danger/5 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      <p className="mt-3 text-xs text-muted-foreground">Adjust your input and try again.</p>
    </div>
  );
}
