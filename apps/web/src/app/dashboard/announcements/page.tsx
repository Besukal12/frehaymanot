import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AnnouncementsPage() {
  const announcements = [
    { id: 1, title: "Welcome to the New Semester", slug: "welcome-new-semester", thumbnail: true, date: "2026-09-01" },
    { id: 2, title: "Holiday Schedule Update", slug: "holiday-schedule-update", thumbnail: false, date: "2026-09-15" },
  ];

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
                {announcements.map((item) => (
                  <tr key={item.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 align-middle font-semibold text-primary">{item.title}</td>
                    <td className="px-6 py-4 align-middle text-muted-foreground">{item.slug}</td>
                    <td className="px-6 py-4 align-middle">{item.date}</td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex gap-2 text-muted-foreground">
                        {item.thumbnail && <ImageIcon className="h-4 w-4" title="Thumbnail Available" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 shadow-none hidden sm:flex">
                          Edit
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}