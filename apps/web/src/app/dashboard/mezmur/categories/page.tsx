"use client";

import { useState } from "react";
import { Music, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { getMezmurCategories } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/loading-skeleton";

export default function MezmurCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories, isLoading, error } = useFetch(getMezmurCategories);

  const filteredCategories = (categories || []).filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            Mezmur Categories
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage categories to organize your mezmur library.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      <div className="mb-6 relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-4"><TableSkeleton /></div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">Error loading categories: {error}</div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Category</th>
                  <th scope="col" className="px-6 py-4 font-medium hidden md:table-cell">Description</th>
                  <th scope="col" className="px-6 py-4 font-medium text-center">Mezmurs</th>
                  <th scope="col" className="px-6 py-4 font-medium hidden lg:table-cell">Created</th>
                  <th scope="col" className="px-6 py-4 font-medium hidden lg:table-cell">Updated</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            <Music className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-base">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell truncate max-w-[200px] xl:max-w-[300px]">
                        {cat.description}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-semibold rounded-full">
                          {cat._count?.Mezmurs || 0} items
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">
                        {new Date(cat.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <Music className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p>No categories found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
