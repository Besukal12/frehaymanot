"use client";

import Image from "next/image";
import Link from "next/link";
import { Music, FileText, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Mezmur } from "../page";

export function MezmurCard({ mezmur }: { mezmur: Mezmur }) {
  const dateStr =
    mezmur.createdAt instanceof Date
      ? mezmur.createdAt.toLocaleDateString()
      : new Date(mezmur.createdAt).toLocaleDateString();

  return (
    <div className="group relative flex flex-col bg-card border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <Link href={`/dashboard/mezmur/${mezmur.id}`} className="block relative aspect-[4/3] bg-muted/30 w-full overflow-hidden">
        {mezmur.thumbnailUrl ? (
          <Image
            src={mezmur.thumbnailUrl}
            alt={mezmur.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 bg-muted/50">
            <Music className="w-16 h-16" />
          </div>
        )}
        
        {mezmur.pdfUrl && (
          <div className="absolute top-3 left-3 bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded shadow-sm flex items-center gap-1 backdrop-blur-sm">
            <FileText className="w-3 h-3" />
            PDF
          </div>
        )}

        <div className="absolute bottom-3 left-3 bg-amber-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
          {mezmur.category.name}
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link href={`/dashboard/mezmur/${mezmur.id}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-semibold text-lg line-clamp-1">{mezmur.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
          {mezmur.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {dateStr}
          </div>
          
          <div className="flex items-center gap-1">
            <Link 
              href={`/dashboard/mezmur/${mezmur.id}`}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <Link 
              href={`/dashboard/mezmur/${mezmur.id}/edit`}
              className="p-1.5 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button 
              className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
