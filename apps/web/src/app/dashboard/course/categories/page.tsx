"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  FolderOpen,
  ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_CATEGORIES = [
  { id: 1, name: "Theology", description: "Dogmatics, patristics, and foundational doctrines.", courseCount: 12, createdAt: "2023-11-10" },
  { id: 2, name: "Biblical Studies", description: "Old and New Testament exegesis, hermeneutics.", courseCount: 8, createdAt: "2023-11-12" },
  { id: 3, name: "History", description: "Church history, ecumenical councils, hagiography.", courseCount: 5, createdAt: "2023-12-05" },
  { id: 4, name: "Ethics", description: "Moral theology, social teachings, ascetics.", courseCount: 4, createdAt: "2024-01-20" },
  { id: 5, name: "Liturgics", description: "Study of the Divine Liturgy, sacraments, and typikon.", courseCount: 9, createdAt: "2024-02-15" },
];

export default function CourseCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = MOCK_CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard/course">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Course Categories</h2>
          </div>
          <p className="text-muted-foreground ml-8">
            Manage categories for organizing courses ({MOCK_CATEGORIES.length} total)
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center justify-between bg-card p-4 rounded-t-lg border border-b-0 shadow-sm mt-6">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-b-lg overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center w-[120px]">Courses</TableHead>
              <TableHead className="w-[150px]">Created At</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <TableRow key={category.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md">
                        <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground line-clamp-1 max-w-[300px] mt-2.5">
                    {category.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono">
                      {category.courseCount}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <FolderOpen className="h-8 w-8 mb-2 opacity-50" />
                    <p>No categories found matching "{searchQuery}"</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
