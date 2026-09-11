"use client";

import { useState } from "react";
import { Eye, Trash2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton, ErrorState, EmptyState } from "@/components/ui/loading-skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { deleteFeedback, getFeedbackList, type Feedback } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function FeedbackPage() {
  const { getToken } = useAuth();
  const { data, isLoading, error, refetch } = useFetch(async () => {
    const token = await getToken();
    return getFeedbackList(token, { sort: "desc", limit: 50 });
  });

  const [selected, setSelected] = useState<Feedback | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Feedback | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const feedbacks = data?.feedbacks ?? [];

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      const token = await getToken();
      await deleteFeedback(pendingDelete.id, token);
      setActionSuccess("Feedback deleted.");
      setPendingDelete(null);
      setSelected(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete feedback");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Feedback</h1>
        <p className="text-muted-foreground">View and manage feedback from students.</p>
      </div>

      {actionSuccess && (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          {actionSuccess}
        </p>
      )}
      {actionError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionError}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>A list of feedback submissions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : error ? (
            <div className="p-4">
              <ErrorState message={error} onRetry={refetch} />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-4">
              <EmptyState
                title="No feedback yet"
                description="When visitors submit feedback, it will appear here."
              />
            </div>
          ) : (
            <div className="overflow-x-auto border-t">
              <table className="w-full caption-bottom text-left text-sm">
                <thead className="bg-muted/50 [&_tr]:border-b">
                  <tr className="border-b">
                    <th className="h-12 px-6 font-medium text-muted-foreground">User</th>
                    <th className="h-12 px-6 font-medium text-muted-foreground">Message</th>
                    <th className="h-12 px-6 font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-6 text-right font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((fb) => (
                    <tr key={fb.id} className="border-b hover:bg-muted/30">
                      <td className="px-6 py-4 align-middle">
                        <div className="font-semibold text-primary">{fb.name}</div>
                        <div className="text-xs text-muted-foreground">{fb.email}</div>
                      </td>
                      <td className="max-w-[240px] truncate px-6 py-4 align-middle text-muted-foreground">
                        {fb.message}
                      </td>
                      <td className="px-6 py-4 align-middle text-muted-foreground">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden h-8 shadow-none sm:flex"
                            onClick={() => setSelected(fb)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:hidden"
                            onClick={() => setSelected(fb)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setPendingDelete(fb)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback details
            </DialogTitle>
            <DialogDescription>
              {selected?.name} · {selected?.email}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{selected?.message}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            {selected && (
              <Button
                variant="destructive"
                onClick={() => {
                  setPendingDelete(selected);
                }}
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this feedback?</DialogTitle>
            <DialogDescription>
              This cannot be undone. The submission from {pendingDelete?.name} will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
