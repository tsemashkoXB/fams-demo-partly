import {
  BarChart3,
  CalendarClock,
  CarFront,
  Radar,
  Users,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: typeof CarFront;
};

export const navItems: NavItem[] = [
  {
    id: "vehicles",
    label: "Vehicles",
    href: "/vehicles",
    icon: CarFront,
  },
  {
    id: "users",
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    id: "scheduler",
    label: "Scheduler",
    href: "/scheduler",
    icon: CalendarClock,
  },
  {
    id: "radar",
    label: "Radar",
    href: "/radar",
    icon: Radar,
  },
  {
    id: "statistics",
    label: "Statistics",
    href: "/statistics",
    icon: BarChart3,
  },
];
