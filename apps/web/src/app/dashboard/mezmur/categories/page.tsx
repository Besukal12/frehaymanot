"use client";

import { useState } from "react";
import { Music, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import {
  createMezmurCategory,
  deleteMezmurCategory,
  getMezmurCategories,
  updateMezmurCategory,
  type MezmurCategory,
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

export default function MezmurCategoriesPage() {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: categories, isLoading, error, refetch } = useFetch(getMezmurCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MezmurCategory | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MezmurCategory | null>(null);
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

  const openEdit = (cat: MezmurCategory) => {
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
        await updateMezmurCategory(editing.id, { name, description }, token);
      } else {
        await createMezmurCategory({ name, description }, token);
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
      await deleteMezmurCategory(pendingDelete.id, token);
      setPendingDelete(null);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not delete category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Music className="h-8 w-8 text-primary" />
            Mezmur Categories
          </h2>
          <p className="mt-1 text-muted-foreground">
            Manage categories to organize your mezmur library.
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="relative mb-6 w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : error ? (
          <div className="p-4">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b bg-muted/50 text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="hidden px-6 py-4 font-medium md:table-cell">Description</th>
                  <th className="px-6 py-4 text-center font-medium">Mezmurs</th>
                  <th className="hidden px-6 py-4 font-medium lg:table-cell">Created</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-semibold">{cat.name}</td>
                      <td className="hidden max-w-[300px] truncate px-6 py-4 text-muted-foreground md:table-cell">
                        {cat.description}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {cat._count?.Mezmurs || 0} items
                      </td>
                      <td className="hidden px-6 py-4 text-muted-foreground lg:table-cell">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setPendingDelete(cat)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8">
                      <EmptyState
                        title="No categories found"
                        description="Create a category to start organizing mezmurs."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
              {pendingDelete?.name} will be removed if it has no attached mezmurs.
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
