"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";
import { TableSkeleton, ErrorState } from "@/components/ui/loading-skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { deleteAnnouncement, getAnnouncements } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AnnouncementsPage() {
  const { getToken } = useAuth();
  const { data: announcements, isLoading, error, refetch } = useFetch(getAnnouncements);
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (pendingDelete === null) return;
    setDeleting(true);
    setActionError(null);
    try {
      const token = await getToken();
      await deleteAnnouncement(pendingDelete, token);
      setActionSuccess("Announcement deleted.");
      setPendingDelete(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete announcement");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Manage school-wide announcements.</p>
        </div>
        <Link href="/dashboard/announcements/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </Link>
      </div>

      {actionSuccess && <p className="text-sm text-green-700 dark:text-green-400">{actionSuccess}</p>}
      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>A list of all published announcements.</CardDescription>
        </CardHeader>
        {isLoading ? (
          <div className="p-8">
            <TableSkeleton />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto border-t">
              <table className="w-full caption-bottom text-left text-sm">
                <thead className="bg-muted/50 [&_tr]:border-b">
                  <tr className="border-b">
                    <th className="h-12 px-6 font-medium text-muted-foreground">Title</th>
                    <th className="h-12 px-6 font-medium text-muted-foreground">Slug</th>
                    <th className="h-12 px-6 font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-6 font-medium text-muted-foreground">Assets</th>
                    <th className="h-12 px-6 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements && announcements.length > 0 ? (
                    announcements.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/30">
                        <td className="px-6 py-4 font-semibold text-primary">{item.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">{item.slug}</td>
                        <td className="px-6 py-4">
                          {new Date(item.postedAt || item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {item.thumbnailUrl && <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="hidden h-8 sm:flex" disabled>
                              <Edit className="mr-1 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => setPendingDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No announcements found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      <Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete announcement?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
