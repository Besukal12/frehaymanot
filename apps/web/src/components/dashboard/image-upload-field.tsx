"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Replace, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isImageFile, MAX_DASHBOARD_FILE_BYTES } from "@/lib/files";
import { cn } from "cn";

type ImageUploadFieldProps = {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
};

export function ImageUploadField({
  label = "Thumbnail Image",
  value,
  onChange,
  existingUrl,
  required,
  disabled,
  hint = "PNG, JPG, WEBP or GIF (max. 10MB)",
}: ImageUploadFieldProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const shownUrl = previewUrl || existingUrl || null;

  const handleSelect = (file: File | null) => {
    setError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!isImageFile(file)) {
      setError("Please choose a valid image file.");
      onChange(null);
      return;
    }
    if (file.size > MAX_DASHBOARD_FILE_BYTES) {
      setError("Image must be 10MB or smaller.");
      onChange(null);
      return;
    }
    onChange(file);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>{label}</Label>
      {shownUrl ? (
        <div className="overflow-hidden rounded-lg border bg-muted/20">
          <div className="relative aspect-video w-full">
            {previewUrl ? (
              // Local object URLs are not valid next/image remote hosts.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Selected thumbnail preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Image src={shownUrl} alt="Selected thumbnail preview" fill className="object-cover" />
            )}
          </div>
          <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
            <p className="truncate text-xs text-muted-foreground">
              {value ? value.name : "Current image"}
            </p>
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
                  aria-label="Clear selected image"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/20 p-6 text-center transition-colors hover:bg-muted/50",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <div className="mb-3 rounded-full bg-blue-100 p-3 dark:bg-blue-900/40">
            <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mb-1 text-sm font-medium">Click to upload image</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/*"
        className="sr-only"
        required={required && !shownUrl}
        disabled={disabled}
        onChange={(event) => handleSelect(event.target.files?.[0] || null)}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
