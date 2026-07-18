import { DesignPrinciple } from "@/lib/types";
import { cn } from "@/lib/utils";

const FRAMEWORK_STYLE: Record<DesignPrinciple["framework"], string> = {
  Nielsen: "bg-blue-500/10 text-blue-500",
  "WCAG 2.2 AA": "bg-emerald-500/10 text-emerald-500",
  "Material Design 3": "bg-purple-500/10 text-purple-500",
};

export function PrincipleTag({ principle, className }: { principle: DesignPrinciple; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
        FRAMEWORK_STYLE[principle.framework],
        className
      )}
    >
      <span className="font-semibold">{principle.framework}</span>
      <span className="opacity-70">·</span>
      <span className="opacity-90">{principle.reference}</span>
    </span>
  );
}
