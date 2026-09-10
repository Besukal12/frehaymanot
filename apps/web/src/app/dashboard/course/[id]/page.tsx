import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  User, 
  Download,
  FileText,
  FolderOpen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock fetch function
async function getCourseDetails(id: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: parseInt(id),
    title: "Introduction to Dogmatic Theology",
    description: "A comprehensive overview of foundational theological concepts in the Orthodox tradition. Covers Christology, Pneumatology, and Trinitarian theology. This course is designed for first-year seminary students and provides a rigorous examination of patristic sources and conciliar definitions.\n\nStudents will explore how the early Church articulated its faith in response to various challenges, learning to read primary texts with theological sensitivity. The course includes weekly readings, two major papers, and a final examination covering all dogmatic material.",
    grade: 1,
    thumbnailUrl: null, // intentionally null to show placeholder
    pdfUrl: "https://example.com/syllabus.pdf",
    category: { id: 1, name: "Theology" },
    uploadedById: "Fr. John Smith",
    createdAt: new Date("2024-01-15T08:30:00Z"),
    updatedAt: new Date("2024-02-20T14:45:00Z"),
  };
}

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const course = await getCourseDetails(id);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/course">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Course Details</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Link href="/dashboard/course" className="hover:text-foreground transition-colors">Courses</Link>
              <span>/</span>
              <span>{course.title}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/course/edit/${course.id}`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Course
            </Button>
          </Link>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Media & Resources (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-video w-full bg-muted/40 flex items-center justify-center">
              {course.thumbnailUrl ? (
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-blue-300 dark:text-blue-800 p-6">
                  <BookOpen className="h-24 w-24 mb-4 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">No Thumbnail Provided</p>
                </div>
              )}
            </div>
          </Card>

          {course.pdfUrl && (
            <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Course Material
                </CardTitle>
                <CardDescription>Download the official curriculum PDF</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                  <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download PDF Document
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Content & Metadata (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 flex items-center gap-1.5">
                <FolderOpen className="h-3.5 w-3.5" />
                {course.category.name}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                Grade {course.grade}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
              {course.title}
            </h1>
            
            <div className="prose prose-blue dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                {course.description}
              </p>
            </div>
          </div>

          <Separator className="my-8" />

          <div>
            <h3 className="text-lg font-semibold mb-4">Course Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-start gap-3">
                <FolderOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{course.category.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Target Grade</p>
                  <p className="text-sm text-muted-foreground">Grade {course.grade}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Uploaded By</p>
                  <p className="text-sm text-muted-foreground">{course.uploadedById}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(course.createdAt), "PPP 'at' p")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <Edit className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(course.updatedAt), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
