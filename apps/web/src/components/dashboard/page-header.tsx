import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPageHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  actions,
}: {
  title: string;
  description?: ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {backHref && (
          <Link href={backHref}>
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" aria-label={backLabel}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
