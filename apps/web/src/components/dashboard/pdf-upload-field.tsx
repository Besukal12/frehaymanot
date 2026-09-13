"use client";

import { useId, useState } from "react";
import { FileText, Replace, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isPdfFile, MAX_DASHBOARD_FILE_BYTES } from "@/lib/files";
import { cn } from "cn";

type PdfUploadFieldProps = {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
  existingName?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
};

export function PdfUploadField({
  label = "PDF Document",
  value,
  onChange,
  existingUrl,
  existingName = "Current PDF",
  required,
  disabled,
  hint = "PDF document (max. 10MB)",
}: PdfUploadFieldProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const hasExisting = Boolean(existingUrl);
  const selected = value || (hasExisting && !value ? { name: existingName } : null);

  const handleSelect = (file: File | null) => {
    setError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!isPdfFile(file)) {
      setError("Please choose a PDF file.");
      onChange(null);
      return;
    }
    if (file.size > MAX_DASHBOARD_FILE_BYTES) {
      setError("PDF must be 10MB or smaller.");
      onChange(null);
      return;
    }
    onChange(file);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>{label}</Label>
      {selected ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/60">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{value ? value.name : existingName}</p>
              <p className="text-xs text-muted-foreground">
                {value ? `${Math.max(1, Math.round(value.size / 1024))} KB` : "Saved document"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => document.getElementById(inputId)?.click()}
            >
              <Replace className="h-3.5 w-3.5" />
              Replace
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled}
                onClick={() => handleSelect(null)}
                aria-label="Clear selected PDF"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 p-6 text-center transition-colors hover:bg-blue-50/80 dark:border-blue-900/50 dark:bg-blue-950/20 dark:hover:bg-blue-900/30",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900/60">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mb-1 text-sm font-medium text-blue-900 dark:text-blue-300">Upload PDF Material</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        required={required && !hasExisting && !value}
        disabled={disabled}
        onChange={(event) => handleSelect(event.target.files?.[0] || null)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
