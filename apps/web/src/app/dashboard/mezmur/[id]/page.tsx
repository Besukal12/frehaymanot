import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag, Clock, FileText, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export type MezmurDetail = {
  id: number;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  pdfUrl?: string | null;
  category: { id: number; name: string };
  uploadedById: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

const mockFetchMezmur = async (id: string): Promise<MezmurDetail> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    id: Number(id),
    title: "Awde Amet Yihunlin",
    description: "A beautiful New Year mezmur welcoming the Ethiopian New Year. This mezmur is often sung during the month of September (Meskerem) to celebrate the transition and the blooming of the Adey Abeba flower.",
    thumbnailUrl: null,
    pdfUrl: "/mock/mezmur1.pdf",
    category: { id: 1, name: "New Year" },
    uploadedById: "user1",
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-05"),
  };
};

function MetaItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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

export default async function MezmurDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const mezmur = await mockFetchMezmur(id);

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
          <Button variant="destructive" size="sm" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
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
              <Button size="sm" variant="secondary" className="flex items-center gap-2">
                Open <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Right Column - Info */}
        <div className="lg:col-span-3 space-y-8">
          <div>
            <div className="inline-flex px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-semibold rounded-full mb-4">
              {mezmur.category.name}
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
            <MetaItem icon={Tag} label="Category" value={mezmur.category.name} />
            <MetaItem icon={User} label="Uploaded By" value={mezmur.uploadedById} />
            <MetaItem icon={Calendar} label="Created At" value={createdDate} />
            <MetaItem icon={Clock} label="Last Updated" value={updatedDate} />
          </div>

          <div className="flex items-center gap-4 pt-4">
             {mezmur.pdfUrl && (
               <Button className="flex items-center gap-2 flex-1 sm:flex-none">
                 <FileText className="w-4 h-4" />
                 View Document
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
