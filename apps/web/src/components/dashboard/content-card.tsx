"use client";

import Link from "next/link";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Eye, Edit, Trash2, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ContentCard({
  href,
  editHref,
  title,
  description,
  thumbnailUrl,
  categoryName,
  hasPdf,
  createdAt,
  fallbackIcon: FallbackIcon,
  overlay,
  onDelete,
}: {
  href: string;
  editHref: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  categoryName?: string;
  hasPdf?: boolean;
  createdAt: string;
  fallbackIcon: LucideIcon;
  overlay?: React.ReactNode;
  onDelete?: () => void;
}) {
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <Card className="group flex flex-col overflow-hidden border-muted bg-card transition-all hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted/30">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 text-blue-300 transition-transform group-hover:scale-105 dark:bg-blue-950/20 dark:text-blue-800">
            <FallbackIcon className="h-12 w-12" />
          </div>
        )}
        {overlay && <div className="absolute top-2 left-2 flex flex-col gap-2">{overlay}</div>}
        {hasPdf && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="destructive" className="flex items-center gap-1 bg-red-500/90 shadow-sm backdrop-blur-sm hover:bg-red-500">
              <FileText className="h-3 w-3" />
              PDF
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-grow flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-400"
          >
            {categoryName || "Uncategorized"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="-mt-2 -mr-2 h-8 w-8 text-muted-foreground" />
              }
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem render={<Link href={href} />}>
                <Eye className="h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={editHref} />}>
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link href={href} className="transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          <h3 className="mb-1 line-clamp-1 text-lg font-semibold" title={title}>
            {title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {description || "No description provided."}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
        <span>Added {formattedDate}</span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Link href={href}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/50"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={editHref}>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
