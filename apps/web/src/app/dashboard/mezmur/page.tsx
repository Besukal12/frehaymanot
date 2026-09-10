"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Music, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MezmurFilters } from "./_components/MezmurFilters";
import { MezmurCard } from "./_components/MezmurCard";

export type Mezmur = {
  id: number;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  pdfUrl?: string | null;
  category: { id: number; name: string };
  uploadedById: string;
  createdAt: string | Date;
};

// Mock data
const mockCategories = [
  { id: 1, name: "New Year" },
  { id: 2, name: "Fasting" },
  { id: 3, name: "Easter" },
  { id: 4, name: "Meskel" },
];

const mockMezmurs: Mezmur[] = [
  {
    id: 1,
    title: "Awde Amet Yihunlin",
    description: "A beautiful New Year mezmur welcoming the Ethiopian New Year.",
    thumbnailUrl: null,
    pdfUrl: "/mock/mezmur1.pdf",
    category: mockCategories[0],
    uploadedById: "user1",
    createdAt: new Date("2024-09-01"),
  },
  {
    id: 2,
    title: "Tsom Tsom",
    description: "A contemplative fasting season mezmur.",
    thumbnailUrl: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=800&auto=format&fit=crop&q=60",
    pdfUrl: null,
    category: mockCategories[1],
    uploadedById: "user2",
    createdAt: new Date("2024-03-15"),
  },
  {
    id: 3,
    title: "Tinsae",
    description: "Joyful Easter celebration mezmur.",
    thumbnailUrl: null,
    pdfUrl: "/mock/tinsae.pdf",
    category: mockCategories[2],
    uploadedById: "user1",
    createdAt: new Date("2024-04-20"),
  },
  {
    id: 4,
    title: "Meskel Keber",
    description: "Meskel holiday special mezmur collection.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&auto=format&fit=crop&q=60",
    pdfUrl: "/mock/meskel.pdf",
    category: mockCategories[3],
    uploadedById: "user3",
    createdAt: new Date("2024-09-27"),
  },
  {
    id: 5,
    title: "Abet Enkwan Des Alen",
    description: "Another beautiful new year song for the season.",
    thumbnailUrl: null,
    pdfUrl: null,
    category: mockCategories[0],
    uploadedById: "user1",
    createdAt: new Date("2024-08-30"),
  },
  {
    id: 6,
    title: "Kidanetsigenina",
    description: "Traditional fasting chant and mezmur.",
    thumbnailUrl: null,
    pdfUrl: "/mock/kidan.pdf",
    category: mockCategories[1],
    uploadedById: "user2",
    createdAt: new Date("2024-02-28"),
  },
];

export default function MezmursPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredMezmurs = useMemo(() => {
    let result = [...mockMezmurs];

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
      result = result.filter((m) => m.category.id.toString() === selectedCategory);
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
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ListMusic className="w-8 h-8 text-primary" />
            Mezmurs
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your mezmurs library. {mockMezmurs.length} total items.
          </p>
        </div>
        <Link href="/dashboard/mezmur/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Mezmur
          </Button>
        </Link>
      </div>

      <MezmurFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={mockCategories}
      />

      {filteredMezmurs.length > 0 ? (
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