import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, GraduationCap, FileText, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Course } from "@/lib/api";

export function CourseCard({ course }: { course: Course }) {
  const formattedDate = typeof course.createdAt === 'string' 
    ? new Date(course.createdAt).toLocaleDateString()
    : new Date(course.createdAt).toLocaleDateString(); // Fallback if somehow date

  return (
    <Card className="group overflow-hidden flex flex-col transition-all hover:shadow-md border-muted bg-card">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/50 dark:bg-blue-950/20 text-blue-300 dark:text-blue-800 transition-transform group-hover:scale-105">
            <BookOpen className="h-12 w-12" />
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm flex items-center gap-1 hover:bg-background/90 text-foreground">
            <GraduationCap className="w-3 h-3 text-blue-500" />
            <span>Grade {course.grade}</span>
          </Badge>
        </div>

        {course.pdfUrl && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="destructive" className="bg-red-500/90 backdrop-blur-sm shadow-sm hover:bg-red-500/100 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <span>PDF</span>
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-col flex-grow p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50">
            {course.category?.name || "Unknown"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 text-muted-foreground">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>
                <Link href={`/dashboard/course/${course.id}`} className="cursor-pointer flex items-center">
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/course/edit/${course.id}`} className="cursor-pointer flex items-center">
                  <Edit className="mr-2 h-4 w-4" /> Edit Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer flex items-center">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Link href={`/dashboard/course/${course.id}`} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <h3 className="font-semibold text-lg line-clamp-1 mb-1" title={course.title}>
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {course.description || "No description provided for this course."}
        </p>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t bg-muted/10 text-xs text-muted-foreground flex justify-between items-center">
        <span>Added {formattedDate}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/dashboard/course/${course.id}`}>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={`/dashboard/course/edit/${course.id}`}>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
