"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFetch } from "@/hooks/use-fetch";
import {
  createCourseCategory,
  deleteCourseCategory,
  getCourseCategories,
  updateCourseCategory,
  type CourseCategory,
} from "@/lib/api";
import { TableSkeleton, ErrorState, EmptyState } from "@/components/ui/loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";

export default function CourseCategoriesPage() {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories, isLoading, error, refetch } = useFetch(getCourseCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CourseCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CourseCategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCategories = (categories || []).filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (cat: CourseCategory) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setFormError(null);
    setFormOpen(true);
  };

  const saveCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const token = await getToken();
      if (editing) {
        await updateCourseCategory(editing.id, { name, description }, token);
      } else {
        await createCourseCategory({ name, description }, token);
      }
      setFormOpen(false);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save category");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      const token = await getToken();
      await deleteCourseCategory(pendingDelete.id, token);
      setPendingDelete(null);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not delete category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Link href="/dashboard/course">
              <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Course Categories</h2>
          </div>
          <p className="ml-8 text-muted-foreground">
            Manage categories for organizing courses ({categories?.length || 0} total)
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-t-lg border border-b-0 bg-card p-4 shadow-sm">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="bg-background pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-b-lg border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[120px] text-center">Courses</TableHead>
                <TableHead className="w-[150px]">Created At</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900/50">
                          <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] text-muted-foreground">
                      {category.description}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{category._count?.courses || 0}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPendingDelete(category)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <EmptyState
                      title="No categories found"
                      description="Create a category to organize courses."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <form onSubmit={saveCategory} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
              <DialogDescription>Name and description are required.</DialogDescription>
            </DialogHeader>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              {pendingDelete?.name} will be removed if it has no attached courses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
