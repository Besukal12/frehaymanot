"use client";

import { BookOpen, Megaphone, MessageSquare, Music } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/use-fetch";
import { getAnnouncements, getCourses, getFeedbackList, getMezmurs } from "@/lib/api";
import { CardSkeleton, ErrorState } from "@/components/ui/loading-skeleton";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  const { getToken } = useAuth();
  const mezmurs = useFetch(getMezmurs);
  const courses = useFetch(getCourses);
  const announcements = useFetch(getAnnouncements);
  const feedback = useFetch(async () => {
    const token = await getToken();
    return getFeedbackList(token, { limit: 1 });
  });

  const isLoading = mezmurs.isLoading || courses.isLoading || announcements.isLoading;
  const error = mezmurs.error || courses.error || announcements.error;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const cards = [
    {
      label: "Mezmurs",
      value: mezmurs.data?.length ?? 0,
      href: "/dashboard/mezmur",
      icon: Music,
    },
    {
      label: "Courses",
      value: courses.data?.length ?? 0,
      href: "/dashboard/course",
      icon: BookOpen,
    },
    {
      label: "Announcements",
      value: announcements.data?.length ?? 0,
      href: "/dashboard/announcements",
      icon: Megaphone,
    },
    {
      label: "Feedback",
      value: feedback.data?.pagination.total ?? 0,
      href: "/dashboard/feedback",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Live counts from mezmurs, courses, announcements, and feedback.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <card.icon className="size-4" />
                  {card.label}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-3xl leading-none tracking-tight">{card.value}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
