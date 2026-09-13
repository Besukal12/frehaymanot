"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadRemoteFile } from "@/lib/files";

export function PdfDownloadButton({
  url,
  filename,
  className,
  children,
}: {
  url?: string | null;
  filename: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!url) {
    return (
      <p className="text-sm text-muted-foreground">No PDF is attached to this item.</p>
    );
  }

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      await downloadRemoteFile(url, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not download the PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        className={className ?? "w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"}
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {children ?? (
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Download PDF Document
          </span>
        )}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
