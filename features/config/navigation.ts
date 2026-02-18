import {
  Home,
  Users,
  Folder,
  Bell,
  Settings,
  Book,
  FileText,
} from "lucide-react";

export const staffNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/catalog", label: "Catalog", icon: Book },
  { href: "/members", label: "Members", icon: Users },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/reports", label: "Reports", icon: Folder },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const portalNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/catalog", label: "Catalog", icon: Book },
  { href: "/my-books", label: "My Books", icon: FileText },
  { href: "/reservations", label: "Reservations", icon: Folder },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: Users },
];
