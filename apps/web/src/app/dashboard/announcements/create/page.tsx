"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { API_URL } from "@/lib/api";

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", slug: "", content: "" });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const token = await getToken();
      const form = new FormData();
      form.append("title", formData.title);
      form.append("slug", formData.slug);
      form.append("content", formData.content);
      if (thumbnail) form.append("thumbnail", thumbnail);

      const response = await fetch(`${API_URL}/api/announcement/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to create announcement");
      }

      router.push("/dashboard/announcements");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error creating announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/announcements">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Announcement</h1>
          <p className="text-muted-foreground">Post a new announcement.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcement Details</CardTitle>
          <CardDescription>Fill in the information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-sm font-medium leading-none">Title</label>
                <input 
                  id="title"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
                  placeholder="e.g. Welcome to the New Semester"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="slug" className="text-sm font-medium leading-none">Slug (URL)</label>
                <input 
                  id="slug"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. welcome-new-semester"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="content" className="text-sm font-medium leading-none">Content</label>
                <textarea 
                  id="content"
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="The main text of the announcement..."
                  required
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </div>

            <hr className="border-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="thumbnail" className="text-sm font-medium leading-none">Thumbnail Image</label>
                <div className="flex items-center gap-4">
                  <input 
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    onChange={e => setThumbnail(e.target.files?.[0] || null)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Upload a cover image (Optional)</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              {errorMessage && <p className="mr-auto text-sm text-destructive">{errorMessage}</p>}
              <Link href="/dashboard/announcements">
                <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Post Announcement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
