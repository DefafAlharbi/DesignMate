import { Sparkles } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { GeneratedDesign } from "@/lib/types";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

export function DesignProposalDetails({ design }: { design: GeneratedDesign }) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6 card-shadow">
      <div>
        <FieldLabel>Layout Structure</FieldLabel>
        <p className="text-sm text-muted-foreground">{design.layoutStructure}</p>
      </div>

      <div>
        <FieldLabel>Main Sections</FieldLabel>
        <div className="space-y-1.5">
          {design.mainSections.map((section) => (
            <div key={section} className="flex items-center gap-2 text-sm text-foreground/90">
              <span className="h-1 w-1 shrink-0 rounded-full bg-brand" />
              {section}
            </div>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Design Style</FieldLabel>
        <p className="text-sm text-muted-foreground">{design.designStyle}</p>
      </div>

      <div>
        <FieldLabel>Color Palette</FieldLabel>
        <div className="flex flex-wrap gap-3">
          {design.colorPalette.map((swatch) => (
            <div key={swatch.role} className="flex items-center gap-2">
              <span
                className="h-6 w-6 shrink-0 rounded-md border border-border"
                style={{ backgroundColor: swatch.hex }}
              />
              <div className="leading-tight">
                <p className="text-xs font-medium">{swatch.role}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{swatch.hex.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Typography</FieldLabel>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground/90">Heading — </span>
            {design.typography.heading}
          </p>
          <p>
            <span className="font-medium text-foreground/90">Body — </span>
            {design.typography.body}
          </p>
          <p>
            <span className="font-medium text-foreground/90">Scale — </span>
            {design.typography.scale}
          </p>
        </div>
      </div>

      <div>
        <FieldLabel>Recommended Components</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {design.components.map((component) => (
            <Badge key={component} tone="neutral">
              {component}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <div className="mb-1.5 flex items-center gap-2 text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          <p className="text-xs font-semibold uppercase tracking-wide">Design Rationale</p>
        </div>
        <p className="text-sm text-muted-foreground">{design.rationale}</p>
      </div>
    </div>
  );
}
