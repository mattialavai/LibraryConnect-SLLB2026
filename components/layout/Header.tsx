"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/hooks/useAuth";
import clsx from "clsx";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications =
    JSON.parse(localStorage.getItem("notifications") || "[]") || [];

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target))
        setShowNotifications(false);

      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={clsx(
        "px-4 py-3 flex justify-between items-center sticky top-0 z-30",
        "bg-background border-b"
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden">
          ☰
        </button>
        <h1 className="font-semibold">SLLB</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-60 bg-card rounded shadow p-2 text-sm border">
              {notifications.length === 0 && (
                <p className="text-muted-foreground">No notifications</p>
              )}
              {notifications.map((n: any) => (
                <div key={n.id} className="py-1 px-2 hover:bg-muted rounded">
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            {user?.email?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card rounded shadow p-2 border">
              <div className="px-2 py-2 border-b">
                <p className="font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>

              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-2 w-full px-2 py-2 hover:bg-muted rounded"
              >
                <Settings size={16} /> Settings
              </button>

              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="flex items-center gap-2 w-full px-2 py-2 text-destructive hover:bg-muted rounded"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
