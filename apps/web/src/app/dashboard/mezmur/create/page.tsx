"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, FileText, Image as ImageIcon, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockCategories = [
  { id: 1, name: "New Year" },
  { id: 2, name: "Fasting" },
  { id: 3, name: "Easter" },
  { id: 4, name: "Meskel" },
];

export default function CreateMezmurPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    router.push("/dashboard/mezmur");
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/mezmur">
          <Button variant="ghost" size="icon" className="hover:bg-muted/50 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            Add New Mezmur
          </h2>
          <p className="text-muted-foreground mt-1">
            Create a new mezmur entry with an optional PDF document.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Mezmur Title *
              </label>
              <Input
                id="title"
                placeholder="e.g. Awde Amet Yihunlin"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <select
                id="category"
                required
                className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="" disabled>Select a category</option>
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Provide some details or background about this mezmur..."
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        {/* Uploads Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">Media & Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Thumbnail Image</h4>
              <p className="text-xs text-muted-foreground mb-4">
                JPEG, PNG or WEBP (Max 2MB)
              </p>
              <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                <Upload className="w-3 h-3 mr-2" />
                Select Image
              </Button>
            </div>

            <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm mb-1">PDF Document</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Upload lyrics or music sheet PDF
              </p>
              <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                <Upload className="w-3 h-3 mr-2" />
                Select PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t mt-8">
          <Link href="/dashboard/mezmur">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                Creating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Create Mezmur
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
