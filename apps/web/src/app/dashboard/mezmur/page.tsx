"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Music, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MezmurFilters } from "./_components/MezmurFilters";
import { MezmurCard } from "./_components/MezmurCard";
import { useFetch } from "@/hooks/use-fetch";
import { getMezmurs, getMezmurCategories } from "@/lib/api";
import { CardSkeleton } from "@/components/ui/loading-skeleton";

export default function MezmursPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: mezmurs, isLoading: isLoadingMezmurs, error: errorMezmurs } = useFetch(getMezmurs);
  const { data: categories, isLoading: isLoadingCategories } = useFetch(getMezmurCategories);

  const filteredMezmurs = useMemo(() => {
    let result = [...(mezmurs || [])];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((m) => m.categoryId.toString() === selectedCategory);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy, mezmurs]);

  if (errorMezmurs) {
    return <div className="p-8 text-red-500">Error loading mezmurs: {errorMezmurs}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ListMusic className="w-8 h-8 text-primary" />
            Mezmurs
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your mezmurs library. {mezmurs?.length || 0} total items.
          </p>
        </div>
        <Link href="/dashboard/mezmur/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Mezmur
          </Button>
        </Link>
      </div>

      {!isLoadingCategories && categories && (
        <MezmurFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />
      )}

      {isLoadingMezmurs ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredMezmurs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMezmurs.map((mezmur) => (
            <MezmurCard key={mezmur.id} mezmur={mezmur} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-xl">
          <Music className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No mezmurs found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 text-center">
            Try adjusting your search or category filters.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}