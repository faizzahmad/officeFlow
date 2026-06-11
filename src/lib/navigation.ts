import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  DollarSign,
  LayoutDashboard,
  Target,
  Users,
} from "lucide-react";

export const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Reports", href: "/reports", icon: BarChart3 },
      { title: "Notifications", href: "/notifications", icon: Bell },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Employees", href: "/employees", icon: Users },
      { title: "Departments", href: "/departments", icon: Building2 },
      { title: "Attendance", href: "/attendance", icon: Clock },
      { title: "Leave", href: "/leave", icon: CalendarDays },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Payroll", href: "/payroll", icon: DollarSign },
      { title: "Tasks", href: "/tasks", icon: ClipboardList },
      { title: "Projects", href: "/projects", icon: Briefcase },
      { title: "Performance", href: "/performance", icon: Target },
    ],
  },
] as const;

export const mainNav = navGroups.flatMap((group) => [...group.items]);
