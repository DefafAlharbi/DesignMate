"use client";

import { ExtraBlockId, GeneratedDesign } from "@/lib/types";
import { cn } from "@/lib/utils";

function Placeholder({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("rounded-md bg-muted", className)} style={style} />;
}

const GRID_COLS_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

function NavBlock({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
        <Placeholder className="h-2.5 w-16" />
      </div>
      <div className="hidden items-center gap-4 sm:flex">
        <Placeholder className="h-2 w-10" />
        <Placeholder className="h-2 w-10" />
        <Placeholder className="h-2 w-10" />
      </div>
      <div className="h-7 w-20 rounded-md" style={{ backgroundColor: accent, opacity: 0.9 }} />
    </div>
  );
}

function SaasLanding({ design }: { design: GeneratedDesign }) {
  return (
    <div>
      <NavBlock accent={design.accent} />
      <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <Placeholder className="h-3 w-32" />
        <h3 className="max-w-md text-xl font-semibold leading-snug">{design.headline}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{design.subheadline}</p>
        <div className="mt-2 h-9 w-36 rounded-lg" style={{ backgroundColor: design.accent }} />
        <div className={cn("mt-6 grid w-full gap-3", GRID_COLS_CLASS[design.gridColumns])}>
          {Array.from({ length: design.gridColumns }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <Placeholder
                className="mb-2 h-6 w-6 rounded-md"
                style={{ backgroundColor: i % 2 === 0 ? `${design.accent}33` : `${design.secondaryAccent}33` }}
              />
              <Placeholder className="h-2 w-full" />
              <Placeholder className="mt-1.5 h-2 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ design }: { design: GeneratedDesign }) {
  return (
    <div className="flex">
      <div className="hidden w-32 shrink-0 flex-col gap-3 border-r border-border p-4 sm:flex">
        <Placeholder className="h-2.5 w-16" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: i === 0 ? design.accent : "hsl(var(--muted-foreground) / 0.3)" }}
            />
            <Placeholder className="h-2 w-14" />
          </div>
        ))}
      </div>
      <div className="flex-1 p-5">
        <h3 className="text-base font-semibold">{design.headline}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{design.subheadline}</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <Placeholder className="h-2 w-10" />
              <p
                className="mt-2 text-lg font-bold"
                style={{ color: i === 1 ? design.secondaryAccent : design.accent }}
              >
                {[42, 128, 87][i]}%
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-24 items-end gap-1.5 rounded-lg border border-border p-3">
          {[40, 65, 30, 80, 55, 90, 45, 70].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                backgroundColor: i % 3 === 0 ? design.secondaryAccent : design.accent,
                opacity: 0.3 + (h / 100) * 0.6,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Ecommerce({ design }: { design: GeneratedDesign }) {
  return (
    <div>
      <NavBlock accent={design.accent} />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between rounded-lg p-4" style={{ backgroundColor: `${design.accent}1A` }}>
          <div>
            <h3 className="text-base font-semibold">{design.headline}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{design.subheadline}</p>
          </div>
          <div className="h-8 w-24 shrink-0 rounded-md" style={{ backgroundColor: design.accent }} />
        </div>
        <div className={cn("grid gap-3", GRID_COLS_CLASS[design.gridColumns])}>
          {Array.from({ length: design.gridColumns }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-2.5">
              <Placeholder className="mb-2 aspect-square w-full" />
              <Placeholder className="h-2 w-full" />
              <Placeholder
                className="mt-1 h-2 w-1/2"
                style={{ backgroundColor: i % 2 === 0 ? undefined : `${design.secondaryAccent}55` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileApp({ design }: { design: GeneratedDesign }) {
  return (
    <div className="flex justify-center bg-muted/30 p-6">
      <div className="w-56 overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-sm">
        <div className="flex items-center justify-between px-4 pb-1 pt-2 text-[9px] text-muted-foreground">
          <span>9:41</span>
          <span>●●●</span>
        </div>
        <div className="flex flex-col items-center gap-3 px-5 py-6 text-center">
          <div className="h-14 w-14 rounded-2xl" style={{ backgroundColor: design.accent }} />
          <h3 className="text-sm font-semibold leading-snug">{design.headline}</h3>
          <p className="text-[11px] text-muted-foreground">{design.subheadline}</p>
          <div className="mt-2 h-9 w-full rounded-xl" style={{ backgroundColor: design.accent }} />
          <div className="h-9 w-full rounded-xl border border-border" />
        </div>
        <div className="flex justify-around border-t border-border py-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: i === 0 ? design.accent : "hsl(var(--muted-foreground) / 0.3)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Portfolio({ design }: { design: GeneratedDesign }) {
  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4">
        <Placeholder className="h-2.5 w-14" />
        <div className="flex gap-3">
          <Placeholder className="h-2 w-8" />
          <Placeholder className="h-2 w-8" />
          <Placeholder className="h-2 w-8" />
        </div>
      </div>
      <div className="px-6 py-8">
        <h3 className="max-w-md text-xl font-semibold leading-snug">{design.headline}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{design.subheadline}</p>
        <div
          className="mt-4 inline-block h-8 rounded-md px-4 text-center text-xs leading-8"
          style={{ backgroundColor: design.accent, color: "white" }}
        >
          {design.ctaLabel}
        </div>
        <div className={cn("mt-8 grid gap-3", GRID_COLS_CLASS[design.gridColumns])}>
          {Array.from({ length: design.gridColumns }).map((_, i) => (
            <Placeholder key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingBlock({ design }: { design: GeneratedDesign }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("rounded-lg border p-3", i === 1 ? "border-2" : "border-border")}
          style={i === 1 ? { borderColor: design.accent } : undefined}
        >
          <Placeholder className="h-2 w-10" />
          <p className="mt-2 text-sm font-bold" style={{ color: i === 1 ? design.accent : undefined }}>
            ${[9, 29, 99][i]}
          </p>
          <div className="mt-2 space-y-1">
            <Placeholder className="h-1.5 w-full" />
            <Placeholder className="h-1.5 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsBlock({ design }: { design: GeneratedDesign }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-lg border border-border p-3">
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: i === 0 ? design.accent : design.secondaryAccent, opacity: 0.7 }}
            />
            <Placeholder className="h-2 w-14" />
          </div>
          <Placeholder className="mt-2 h-1.5 w-full" />
          <Placeholder className="mt-1 h-1.5 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function SearchBlock({ design }: { design: GeneratedDesign }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
      <span className="h-3 w-3 shrink-0 rounded-full border-2" style={{ borderColor: design.accent }} />
      <Placeholder className="h-2 w-1/3" />
    </div>
  );
}

function ChatBlock({ design }: { design: GeneratedDesign }) {
  return (
    <div className="flex justify-end">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
        style={{ backgroundColor: design.accent }}
      >
        ●●●
      </div>
    </div>
  );
}

function BookingBlock({ design }: { design: GeneratedDesign }) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="aspect-square rounded"
          style={{
            backgroundColor: i === 5 ? design.accent : "hsl(var(--muted))",
          }}
        />
      ))}
    </div>
  );
}

function AnalyticsBlock({ design }: { design: GeneratedDesign }) {
  return (
    <div className="flex h-14 items-end gap-1">
      {[30, 55, 40, 70, 50, 85].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? design.accent : design.secondaryAccent, opacity: 0.7 }}
        />
      ))}
    </div>
  );
}

const EXTRA_BLOCK_RENDERERS: Record<ExtraBlockId, (props: { design: GeneratedDesign }) => React.ReactElement> = {
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  search: SearchBlock,
  chat: ChatBlock,
  booking: BookingBlock,
  analytics: AnalyticsBlock,
};

const EXTRA_BLOCK_TITLES: Record<ExtraBlockId, string> = {
  pricing: "Pricing",
  testimonials: "Testimonials",
  search: "Search",
  chat: "Chat",
  booking: "Booking",
  analytics: "Analytics",
};

function ExtraBlocks({ design }: { design: GeneratedDesign }) {
  if (design.extraBlocks.length === 0) return null;
  return (
    <div className="space-y-4 border-t border-border p-5">
      {design.extraBlocks.map((id) => {
        const Renderer = EXTRA_BLOCK_RENDERERS[id];
        return (
          <div key={id}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {EXTRA_BLOCK_TITLES[id]}
            </p>
            <Renderer design={design} />
          </div>
        );
      })}
    </div>
  );
}

const RENDERERS: Record<string, (props: { design: GeneratedDesign }) => React.ReactElement> = {
  "saas-landing": SaasLanding,
  dashboard: Dashboard,
  ecommerce: Ecommerce,
  "mobile-app": MobileApp,
  portfolio: Portfolio,
};

export function DesignMockup({ design }: { design: GeneratedDesign }) {
  const Renderer = RENDERERS[design.templateId] ?? SaasLanding;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card card-shadow">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-danger/70" />
        <span className="h-2 w-2 rounded-full bg-warning/70" />
        <span className="h-2 w-2 rounded-full bg-success/70" />
        <span className="ml-3 text-[11px] text-muted-foreground">{design.templateName}</span>
      </div>
      <Renderer design={design} />
      <ExtraBlocks design={design} />
    </div>
  );
}
