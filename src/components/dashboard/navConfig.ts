import { Home, Users, BookOpen, Briefcase, BarChart3, Settings, LayoutDashboard, ClipboardList, LineChart } from "lucide-react";

export type NavItem = { label: string; href: string; icon: any };

export const userNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Mentors", href: "/dashboard/mentors", icon: Users },
  { label: "Tasks", href: "/tasks", icon: ClipboardList },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Career Path", href: "/career-path", icon: Briefcase },
  { label: "Market", href: "/market", icon: LineChart },
];

export const adminNav: NavItem[] = [
  { label: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Tasks", href: "/mentor/tasks", icon: ClipboardList },
  { label: "Courses", href: "/mentor/courses", icon: BookOpen },
  { label: "Skills", href: "/admin/skills", icon: BarChart3 },
  { label: "Market", href: "/market", icon: LineChart },
  { label: "Settings", href: "/settings", icon: Settings },
];

