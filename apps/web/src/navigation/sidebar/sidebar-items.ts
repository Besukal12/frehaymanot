import {
  Banknote,
  Calendar,
  ChartBar,
  CheckSquare,
  Fingerprint,
  FolderOpen,
  Forklift,
  Gauge,
  GraduationCap,
  HeartPulse,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  Server,
  ShoppingBag,
  SquareArrowUpRight,
  UserRound,
  Users,
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
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "announcements",
        title: "Announcements",
        url: "/dashboard/announcements",
        icon: Forklift,
      },
      {
        id: "feedback",
        title: "Feedback",
        url: "/dashboard/feedback",
        icon: Server,
      },
    ],
  },
  {
    id: 2,
    label: "Mezmur",
    items: [
      {
        id: "mezmur-category",
        title: "Mezmur Category",
        url: "/dashboard/mezmur-category",
        icon: ShoppingBag,
      },
      {
        id: "mezmur",
        title: "Mezmur",
        url: "/dashboard/mezmur",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: 3,
    label: "Course",
    items: [
      {
        id: "course-category",
        title: "Course Category",
        url: "/dashboard/course-category",
        icon: ShoppingBag,
      },
      {
        id: "course",
        title: "Course",
        url: "/dashboard/course",
        icon: GraduationCap,
      },
    ],
  },
];
