"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useFetch } from "@/hooks/use-fetch";
import { getCourseCategories, API_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function CreateCoursePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: categories } = useFetch(getCourseCategories);

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    grade: "",
    description: "",
  });
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const token = await getToken();
      const form = new FormData();
      form.append("title", formData.title);
      form.append("categoryId", formData.categoryId);
      form.append("grade", formData.grade);
      if (formData.description) form.append("description", formData.description);
      if (thumbnail) form.append("thumbnail", thumbnail);
      if (pdf) form.append("pdf", pdf);

      const response = await fetch(`${API_URL}/api/course/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to create course");
      }

      router.push("/dashboard/course");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Error creating course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 pb-4 border-b">
        <Link href="/dashboard/course">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create New Course</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new educational resource to the platform
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the primary details for the course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Introduction to Dogmatic Theology" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">Target Grade</Label>
                    <Select required onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="Select a grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                          <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide a detailed overview of the course content and objectives..." 
                    className="min-h-[150px] resize-y"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Media & Attachments */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Media</CardTitle>
                <CardDescription>Upload files for this course.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Thumbnail Upload */}
                <div className="space-y-3">
                  <Label>Thumbnail Image</Label>
                  <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group block">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium mb-1">{thumbnail ? thumbnail.name : "Click to upload image"}</p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} required />
                  </label>
                </div>

                <Separator />

                {/* PDF Upload */}
                <div className="space-y-3">
                  <Label>Course PDF</Label>
                  <label className="border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-blue-50/30 dark:bg-blue-950/20 hover:bg-blue-50/80 dark:hover:bg-blue-900/30 transition-colors cursor-pointer group block">
                    <div className="bg-blue-100 dark:bg-blue-900/60 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium mb-1 text-blue-900 dark:text-blue-300">{pdf ? pdf.name : "Upload PDF Material"}</p>
                    <p className="text-xs text-muted-foreground">PDF document (max. 10MB)</p>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdf(e.target.files?.[0] || null)} required />
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t">
          {errorMessage && <p className="mr-auto text-sm text-destructive">{errorMessage}</p>}
          <Link href="/dashboard/course">
            <Button variant="outline" type="button" disabled={isSubmitting}>Cancel</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
}
