import {
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Music,
  Music2,
  BookOpen,
  FolderOpen,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    items: [
      {
        id: "overview",
        title: "Overview",
        url: "/dashboard/overview",
        icon: LayoutDashboard,
      },
      {
        id: "announcements",
        title: "Announcements",
        url: "/dashboard/announcements",
        icon: Megaphone,
      },
      {
        id: "feedback",
        title: "Feedback",
        url: "/dashboard/feedback",
        icon: MessageSquare,
      },
    ],
  },
  {
    id: 2,
    label: "Mezmur",
    items: [
      {
        id: "mezmur",
        title: "All Mezmurs",
        url: "/dashboard/mezmur",
        icon: Music,
      },
      {
        id: "mezmur-categories",
        title: "Categories",
        url: "/dashboard/mezmur/categories",
        icon: Music2,
      },
    ],
  },
  {
    id: 3,
    label: "Course",
    items: [
      {
        id: "course",
        title: "All Courses",
        url: "/dashboard/course",
        icon: BookOpen,
      },
      {
        id: "course-categories",
        title: "Categories",
        url: "/dashboard/course/categories",
        icon: FolderOpen,
      },
    ],
  },
];
