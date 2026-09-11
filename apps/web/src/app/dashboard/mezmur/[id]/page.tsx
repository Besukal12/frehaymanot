"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag, Clock, FileText, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { getMezmurById, deleteMezmur } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { DetailSkeleton, ErrorState } from "@/components/ui/loading-skeleton";
import { useState } from "react";

import type { LucideIcon } from "lucide-react";

function MetaItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex flex-col p-3 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="font-medium text-sm">
        {value}
      </div>
    </div>
  );
}

export default function MezmurDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: mezmur, isLoading, error } = useFetch(() => getMezmurById(id), [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this mezmur?")) return;
    
    setIsDeleting(true);
    try {
      const token = await getToken();
      await deleteMezmur(id, token);
      router.push("/dashboard/mezmur");
    } catch (err) {
      console.error(err);
      alert("Failed to delete mezmur");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 p-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !mezmur) {
    return (
      <div className="p-8">
        <ErrorState message={error || "Mezmur not found"} />
      </div>
    );
  }

  const createdDate = new Date(mezmur.createdAt).toLocaleDateString();
  const updatedDate = new Date(mezmur.updatedAt).toLocaleDateString();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <Link href="/dashboard/mezmur">
          <Button variant="ghost" className="flex items-center gap-2 -ml-4 hover:bg-muted/50">
            <ArrowLeft className="w-4 h-4" />
            Back to Mezmurs
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/mezmur/${mezmur.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Column - Media */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-square w-full rounded-2xl bg-muted overflow-hidden border shadow-sm">
            {mezmur.thumbnailUrl ? (
              <Image
                src={mezmur.thumbnailUrl}
                alt={mezmur.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 bg-muted/50">
                <Music className="w-24 h-24 mb-4" />
                <span className="text-sm font-medium">No Thumbnail</span>
              </div>
            )}
          </div>

          {mezmur.pdfUrl && (
            <div className="bg-card border rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Mezmur PDF</h4>
                  <p className="text-xs text-muted-foreground">Document attached</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="flex items-center gap-2" asChild>
                <a href={mezmur.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Info */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <div className="inline-flex px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-semibold rounded-full mb-4">
              {mezmur.category?.name || "Unknown Category"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {mezmur.title}
            </h1>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {mezmur.description || "No description provided for this mezmur."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <MetaItem icon={Tag} label="Category" value={mezmur.category?.name || "Unknown"} />
            <MetaItem icon={User} label="Uploaded By" value={mezmur.uploadedById} />
            <MetaItem icon={Calendar} label="Created At" value={createdDate} />
            <MetaItem icon={Clock} label="Last Updated" value={updatedDate} />
          </div>

          <div className="flex items-center gap-4 pt-4">
             {mezmur.pdfUrl && (
               <Button className="flex items-center gap-2 flex-1 sm:flex-none" asChild>
                 <a href={mezmur.pdfUrl} target="_blank" rel="noopener noreferrer">
                   <FileText className="w-4 h-4" />
                   View Document
                 </a>
               </Button>
             )}
             <Link href={`/dashboard/mezmur/${mezmur.id}/edit`} className="flex-1 sm:flex-none">
               <Button variant="outline" className="w-full flex items-center gap-2">
                 <Edit className="w-4 h-4" />
                 Edit Details
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
