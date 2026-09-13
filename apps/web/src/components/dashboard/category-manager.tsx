"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton, ErrorState, EmptyState } from "@/components/ui/loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog";
import { useAuth } from "@clerk/nextjs";

export type CategoryRecord = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  count: number;
};

export function CategoryManager({
  title,
  description,
  backHref,
  itemNoun,
  categories,
  isLoading,
  error,
  refetch,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string;
  description: string;
  backHref: string;
  itemNoun: string;
  categories: CategoryRecord[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  onCreate: (payload: { name: string; description: string }, token?: string | null) => Promise<unknown>;
  onUpdate: (
    id: number,
    payload: { name: string; description: string },
    token?: string | null,
  ) => Promise<unknown>;
  onDelete: (id: number, token?: string | null) => Promise<unknown>;
}) {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CategoryRecord | null>(null);
  const [name, setName] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = (categories || []).filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescriptionValue("");
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (cat: CategoryRecord) => {
    setEditing(cat);
    setName(cat.name);
    setDescriptionValue(cat.description);
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
        await onUpdate(editing.id, { name, description: descriptionValue }, token);
      } else {
        await onCreate({ name, description: descriptionValue }, token);
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
    setFormError(null);
    try {
      const token = await getToken();
      await onDelete(pendingDelete.id, token);
      setPendingDelete(null);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not delete category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Link href={backHref}>
              <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8 text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          </div>
          <p className="ml-8 text-muted-foreground">
            {description} ({categories?.length || 0} total)
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-card p-4 shadow-sm">
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
                <TableHead className="w-[120px] text-center">{itemNoun}</TableHead>
                <TableHead className="w-[150px]">Created At</TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((category) => (
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
                      <Badge variant="secondary">{category.count}</Badge>
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
                      description={`Create a category to organize ${itemNoun.toLowerCase()}.`}
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
              value={descriptionValue}
              onChange={(e) => setDescriptionValue(e.target.value)}
              placeholder="Description"
              required
            />
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-blue-600 text-white hover:bg-blue-700">
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete category?"
        description={
          pendingDelete
            ? `${pendingDelete.name} will be removed if it has no attached ${itemNoun.toLowerCase()}.`
            : ""
        }
        loading={saving}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
