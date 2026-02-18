"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Home,
  Bell,
  Users,
  FileText,
  BookOpen,
  Repeat,
  UserCheck,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Folder,
  Mail,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  toggleSidebar: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

// Role-based links configuration
const LINKS: Record<string, any[]> = {
  ADMIN: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    {
      label: "User Management",
      icon: Users,
      dropdown: [
        { label: "Manage Users", href: "/users" },
        { label: "Create User", href: "/users/create" },
      ],
    },
    {
      label: "Documents",
      icon: FileText,
      dropdown: [
        { label: "All Documents", href: "/documents" },
        { label: "Upload", href: "/documents/upload" },
        { label: "Inbox", href: "/documents/inbox" },
        { label: "Outbox", href: "/documents/outbox" },
        { label: "Folders", href: "/documents/folders" },
        { label: "Trash", href: "/documents/trash" },
      ],
    },
    {
      label: "Catalog",
      icon: BookOpen,
      dropdown: [
        { label: "Books", href: "/catalog" },
        { label: "Add Book", href: "/catalog/add-book" },
      ],
    },
    {
      label: "Circulation",
      icon: Repeat,
      dropdown: [
        { label: "Overview", href: "/circulation" },
        { label: "Issue", href: "/circulation/issue" },
        { label: "Returns", href: "/circulation/returns" },
        { label: "Fines", href: "/circulation/fines" },
      ],
    },
    { label: "Members", icon: UserCheck, href: "/members" },
    { label: "Notifications", icon: Bell, href: "/notifications" },
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ],

  HEAD: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    {
      label: "Documents",
      icon: FileText,
      dropdown: [
        { label: "All Documents", href: "/documents" },
        { label: "Upload", href: "/documents/upload" },
        { label: "Inbox", href: "/documents/inbox" },
        { label: "Outbox", href: "/documents/outbox" },
        { label: "Folders", href: "/documents/folders" },
      ],
    },
    { label: "Members", icon: UserCheck, href: "/members" },
    { label: "Catalog", icon: BookOpen, href: "/catalog" },
    { label: "Circulation", icon: Repeat, href: "/circulation" },
    { label: "Notifications", icon: Bell, href: "/notifications" },
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ],

  STAFF: [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Members", icon: UserCheck, href: "/members" },
    { label: "Catalog", icon: BookOpen, href: "/catalog" },
    { label: "Circulation", icon: Repeat, href: "/circulation" },
    { label: "Loans", icon: Mail, href: "/loans" },
    { label: "Notifications", icon: Bell, href: "/notifications" },
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ],

  PATRON: [
    { label: "Home", icon: Home, href: "/portal" },
    { label: "Catalog", icon: BookOpen, href: "/portal/catalog" },
    { label: "Loans", icon: Mail, href: "/portal/loans" },
    { label: "My Books", icon: Folder, href: "/portal/my-books" },
    { label: "Reservations", icon: Mail, href: "/portal/reservations" },
    { label: "Notifications", icon: Bell, href: "/portal/notifications" },
    { label: "Profile", icon: UserCheck, href: "/portal/profile" },
    { label: "Settings", icon: Settings, href: "/portal/settings" },
  ],
};

export default function Sidebar({ isOpen, toggleSidebar, collapsed, setCollapsed }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownState, setDropdownState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const notifs = JSON.parse(localStorage.getItem("notifications") || "[]");
      const unread = notifs.filter((n: any) => n.unread).length;
      setUnreadCount(unread);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const go = (href: string) => {
    router.push(href);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const toggleDropdown = (label: string) => {
    setDropdownState((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const roleLinks = LINKS[user?.role || "PATRON"] || [];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={toggleSidebar} />}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen z-40 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 shadow-sm bg-background border-r"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h1 className="text-lg font-semibold">LibraryConnect</h1>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex">
            {collapsed ? "➡" : "⬅"}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            ✕
          </Button>
        </div>

        {!collapsed && (
          <div className="p-4 border-b">
            <div className="bg-card p-3 rounded text-sm">
              <p className="font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>
        )}

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {roleLinks.map((link) =>
            link.dropdown ? (
              <Dropdown
                key={link.label}
                label={link.label}
                icon={link.icon}
                collapsed={collapsed}
                open={dropdownState[link.label]}
                setOpen={() => toggleDropdown(link.label)}
              >
                {link.dropdown.map((sublink: any) => (
                  <SubLink key={sublink.href} href={sublink.href} label={sublink.label} />
                ))}
              </Dropdown>
            ) : (
              <NavItem
                key={link.href}
                active={pathname === link.href}
                onClick={() => go(link.href)}
                icon={link.icon}
                collapsed={collapsed}
                badge={link.href.includes("notifications") ? unreadCount : undefined}
                label={link.label}
              />
            )
          )}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              logout();
              router.replace("/auth/login");
            }}
            className="flex items-center gap-2 text-sm text-destructive cursor-pointer"
          >
            <LogOut size={18} /> {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

/* Reusable Components */
function Dropdown({ label, icon: Icon, open, setOpen, collapsed, children }: any) {
  return (
    <div>
      <button onClick={setOpen} className="flex w-full items-center justify-between px-3 py-2 rounded hover:bg-muted">
        <span className="flex items-center gap-3">
          <Icon size={18} /> {!collapsed && label}
        </span>
        {!collapsed && (open ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </button>
      {open && !collapsed && <div className="ml-6 space-y-1">{children}</div>}
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label, collapsed, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-3 px-3 py-2 rounded text-sm transition",
        active ? "bg-primary/10 text-primary" : "hover:bg-muted"
      )}
    >
      <Icon size={18} />
      {!collapsed && (
        <span className="flex items-center gap-2">
          {label}
          {badge > 0 && <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{badge}</span>}
        </span>
      )}
    </button>
  );
}

function SubLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="block w-full text-left px-2 py-1 rounded hover:bg-muted text-sm"
    >
      {label}
    </button>
  );
}
