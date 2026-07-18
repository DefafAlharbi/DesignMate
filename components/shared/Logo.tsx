import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-violet-400 text-brand-foreground shadow-sm">
        <Sparkles className="h-4 w-4" strokeWidth={2.5} />
      </span>
      <span className="text-[17px]">DesignMate</span>
    </div>
  );
}
