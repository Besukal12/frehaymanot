"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, BookOpen, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseCard } from "./_components/CourseCard";
import { cn } from "cn";
import { useFetch } from "@/hooks/use-fetch";
import { getCourses, getCourseCategories } from "@/lib/api";
import { CardSkeleton, ErrorState } from "@/components/ui/loading-skeleton";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  const { data: courses, isLoading: isLoadingCourses, error: errorCourses } = useFetch(getCourses);
  const { data: categories } = useFetch(getCourseCategories);

  // Filtering and sorting logic
  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null || course.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "grade":
        return a.grade - b.grade;
      default:
        return 0;
    }
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground mt-1">
            Manage educational materials and course curriculum (
            {courses?.length || 0} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/course/categories">
            <Button
              variant="outline"
              className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-900 dark:hover:bg-blue-900/50"
            >
              <Filter className="w-4 h-4" />
              Categories
            </Button>
          </Link>
          <Link href="/dashboard/course/create">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-lg shadow-sm">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9 bg-background w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={cn(
                "cursor-pointer",
                selectedCategory === null
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "",
              )}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories?.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className={cn(
                  "cursor-pointer",
                  selectedCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "",
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value !== null) {
                setSortBy(value);
              }
            }}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="grade">Grade (Low-High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid */}
      {errorCourses ? (
        <div className="p-8">
          <ErrorState message={`Error loading courses: ${errorCourses}`} />
        </div>
      ) : isLoadingCourses ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-card/50 border-dashed">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
            <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any courses matching your current filters. Try
            adjusting your search or category selection.
          </p>
          <Button
            variant="outline"
            className="mt-6 text-blue-600 border-blue-200"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
