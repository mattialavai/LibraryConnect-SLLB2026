"use client";

import { useState, useEffect, ReactNode } from "react";
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

/* ---------------- ROLE LINKS ---------------- */

const LINKS: Record<string, any[]> = {
  ADMIN: [
    { label: "Dashboard", icon: Home, href: "/admin/dashboard" },
    {
      label: "User Management",
      icon: Users,
      dropdown: [
        { label: "Manage Users", href: "/admin/users" },
        { label: "Create User", href: "/admin/users/create" },
      ],
    },
    {
      label: "Documents",
      icon: FileText,
      dropdown: [
        { label: "All Documents", href: "/admin/documents" },
        { label: "Upload", href: "/admin/documents/upload" },
        { label: "Inbox", href: "/admin/documents/inbox" },
        { label: "Outbox", href: "/admin/documents/outbox" },
        { label: "Folders", href: "/admin/documents/folders" },
        { label: "Trash", href: "/admin/documents/trash" },
      ],
    },
    {
      label: "Catalog",
      icon: BookOpen,
      dropdown: [
        { label: "Books", href: "/admin/catalog" },
        { label: "Add Book", href: "/admin/catalog/add-book" },
      ],
    },
    {
      label: "Circulation",
      icon: Repeat,
      dropdown: [
        { label: "Overview", href: "/admin/circulation" },
        { label: "Issue", href: "/admin/circulation/issue" },
        { label: "Returns", href: "/admin/circulation/returns" },
        { label: "Fines", href: "/admin/circulation/fines" },
      ],
    },
    { label: "Members", icon: UserCheck, href: "/admin/members" },
    { label: "Notifications", icon: Bell, href: "/admin/notifications" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ],

  HEAD: [ 
    { label: "Dashboard", icon: Home, href: "/head" }, 
    { label: "Documents", icon: FileText, dropdown: 
      [ { label: "All Documents", href: "/head/documents" }, 
        { label: "Upload", href: "/head/documents/upload" }, 
        { label: "Inbox", href: "/head/documents/inbox" }, 
        { label: "Outbox", href: "/head/documents/outbox" },
        { label: "Folders", href: "/head/documents/folders" }, 
      ], 
    }, 
    { label: "Members", icon: UserCheck, href: "/head/members" }, 
    { label: "Catalog", icon: BookOpen, href: "/head/catalog" }, 
    { label: "Circulation", icon: Repeat, href: "/head/circulation" }, 
    { label: "Notifications", icon: Bell, href: "/head/notifications" }, 
    { label: "Reports", icon: BarChart3, href: "/head/reports" }, 
    { label: "Settings", icon: Settings, href: "/head/settings" },
   ], 

   STAFF: [ 
    { label: "Dashboard", icon: Home, href: "/staff" }, 
    { label: "Members", icon: UserCheck, href: "/staff/members" }, 
    { label: "Catalog", icon: BookOpen, href: "/staff/catalog" }, 
    { label: "Circulation", icon: Repeat, href: "/staff/circulation" }, 
    { label: "Loans", icon: Mail, href: "/staff/loans" }, 
    { label: "Notifications", icon: Bell, href: "/staff/notifications" },
     { label: "Reports", icon: BarChart3, href: "/staff/reports" }, 
     { label: "Settings", icon: Settings, href: "/staff/settings" }, 
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

/* ---------------- COMPONENT ---------------- */

export default function Sidebar({ isOpen, toggleSidebar, collapsed, setCollapsed }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [hydrated, setHydrated] = useState(false);
  const [dropdownState, setDropdownState] = useState<Record<string, boolean>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => setHydrated(true), []);

  /* -------- notifications count -------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const notifs = JSON.parse(localStorage.getItem("notifications") || "[]");
      setUnreadCount(notifs.filter((n: any) => n.unread).length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated || !user) return null;

  const roleLinks = LINKS[user.role] || [];

  const go = (href: string) => {
    router.push(href);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const toggleDropdown = (label: string) =>
    setDropdownState((prev) => ({ ...prev, [label]: !prev[label] }));

  const isActive = (href: string) => pathname.startsWith(href);

  /* ---------------- UI ---------------- */

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={toggleSidebar} />}

      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen z-40 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 bg-background border-r"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h1 className="text-lg font-semibold">LibraryConnect</h1>}
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="hidden md:flex">
            {collapsed ? "➡" : "⬅"}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            ✕
          </Button>
        </div>

        {/* USER CARD */}
        {!collapsed && (
          <div className="p-4 border-b">
            <div className="bg-card p-3 rounded text-sm">
              <p className="font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {roleLinks.map((link) => {
            if (link.dropdown) {
              const parentActive = link.dropdown.some((s: any) => isActive(s.href));

              return (
                <Dropdown
                  key={link.label}
                  label={link.label}
                  icon={link.icon}
                  collapsed={collapsed}
                  active={parentActive}
                  open={dropdownState[link.label] || parentActive}
                  setOpen={() => toggleDropdown(link.label)}
                >
                  {link.dropdown.map((sublink: any) => (
                    <SubLink
                      key={sublink.href}
                      label={sublink.label}
                      active={isActive(sublink.href)}
                      onClick={() => go(sublink.href)}
                    />
                  ))}
                </Dropdown>
              );
            }

            return (
              <NavItem
                key={link.href}
                label={link.label}
                icon={link.icon}
                active={isActive(link.href)}
                onClick={() => go(link.href)}
                collapsed={collapsed}
                badge={link.href.includes("notifications") ? unreadCount : undefined}
              />
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              logout();
              router.replace("/auth/login");
            }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <LogOut size={18} /> {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ---------------- REUSABLES ---------------- */

function NavItem({ active, onClick, icon: Icon, label, collapsed, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative flex w-full items-center gap-3 px-3 py-2 rounded text-sm transition",
        active ? "text-primary bg-primary/10" : "hover:bg-muted"
      )}
    >
      {active && <span className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r" />}
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

function Dropdown({ label, icon: Icon, open, setOpen, collapsed, children, active }: any) {
  return (
    <div>
      <button
        onClick={setOpen}
        className={clsx(
          "relative flex w-full items-center justify-between px-3 py-2 rounded transition",
          active ? "bg-primary/10 text-primary" : "hover:bg-muted"
        )}
      >
        {active && <span className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r" />}
        <span className="flex items-center gap-3">
          <Icon size={18} /> {!collapsed && label}
        </span>
        {!collapsed && (open ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </button>

      {open && !collapsed && <div className="ml-6 mt-1 space-y-1">{children}</div>}
    </div>
  );
}

function SubLink({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "block w-full text-left px-2 py-1 rounded text-sm transition",
        active ? "bg-primary/10 text-primary" : "hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}
