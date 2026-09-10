"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";
import Loader from "@/components/loader";
import { useFetch } from "@/hooks/use-fetch";
import { getAnnouncements, API_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function AnnouncementsPage() {
  const { getToken } = useAuth();
  const { data: announcements, isLoading, error, refetch } = useFetch(getAnnouncements);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/announcement/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Delete failed");
      refetch();
    } catch (error) {
      console.error(error);
      alert("Failed to delete announcement");
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

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>A list of all published announcements.</CardDescription>
        </CardHeader>
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader /></div>
        ) : error ? (
          <div className="p-8 text-red-500">Error loading announcements: {error}</div>
        ) : (
          <CardContent className="p-0">
            <div className="border-t">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="bg-muted/50 [&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50/50">
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Title</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Slug</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Assets</th>
                    <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {announcements && announcements.length > 0 ? (
                    announcements.map((item) => (
                      <tr key={item.id} className="border-b transition-colors hover:bg-muted/30">
                        <td className="px-6 py-4 align-middle font-semibold text-primary">{item.title}</td>
                        <td className="px-6 py-4 align-middle text-muted-foreground">{item.slug}</td>
                        <td className="px-6 py-4 align-middle">{new Date(item.postedAt || item.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex gap-2 text-muted-foreground">
                            {item.thumbnailUrl && <ImageIcon className="h-4 w-4" />}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8 shadow-none hidden sm:flex">Edit</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No announcements found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
