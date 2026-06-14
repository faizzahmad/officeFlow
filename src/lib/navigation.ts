import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  Contact,
  DollarSign,
  LayoutDashboard,
  Settings,
  Target,
  UserCircle,
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
      { title: "My profile", href: "/profile", icon: UserCircle },
      { title: "Employee records", href: "/employee-records", icon: Contact },
      { title: "Employees", href: "/employees", icon: Users },
      { title: "Departments", href: "/departments", icon: Building2 },
      { title: "Attendance", href: "/attendance", icon: Clock },
      { title: "Leave", href: "/leave", icon: CalendarDays },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Organization settings", href: "/settings", icon: Settings },
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
