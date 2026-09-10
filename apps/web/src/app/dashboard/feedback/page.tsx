import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";

export default function FeedbackPage() {
  const feedbacks = [
    { id: 1, user: "Abebe Kebede", message: "Great course content!", date: "2026-09-07", status: "Read" },
    { id: 2, user: "Sara Tesfaye", message: "Can we have more videos?", date: "2026-09-08", status: "Unread" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Feedback</h1>
          <p className="text-muted-foreground">View and manage feedback from students.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>A list of feedback submissions.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="bg-muted/50 [&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50/50">
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">User</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Message</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {feedbacks.map((fb) => (
                  <tr key={fb.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 align-middle font-semibold text-primary">{fb.user}</td>
                    <td className="px-6 py-4 align-middle max-w-[200px] truncate text-muted-foreground">{fb.message}</td>
                    <td className="px-6 py-4 align-middle text-muted-foreground">{fb.date}</td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${fb.status === 'Unread' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                        {fb.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 shadow-none hidden sm:flex">
                          View
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 sm:hidden">
                          <Eye className="h-4 w-4" />
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