"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  previewUrl: string | null;
  fileName?: string;
  onFile: (file: File) => void;
  onClear: () => void;
  className?: string;
  label?: string;
}

export function ImageDropzone({
  previewUrl,
  fileName,
  onFile,
  onClear,
  className,
  label = "Drop a UI screenshot here, or click to browse",
}: ImageDropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFile(file);
    }
  };

  if (previewUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-muted/30", className)}>
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove image"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-danger hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative flex max-h-[380px] items-center justify-center overflow-hidden bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt={fileName ?? "Uploaded design"} className="max-h-[340px] w-auto rounded-lg object-contain shadow-sm" />
        </div>
        {fileName && (
          <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground">{fileName}</div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors",
        isDragging ? "border-brand bg-brand/5" : "border-border hover:border-muted-foreground/40 hover:bg-accent/40",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <UploadCloud className="h-5 w-5" />
      </div>
      <p className="max-w-xs text-sm text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground/70">PNG, JPG, or WebP</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
