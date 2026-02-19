"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

import logo from "@/app/assets/logo.png";
import { useAuthStore } from "@/features/auth/store";

type Props = {
  toggleSidebar?: () => void;
};

export default function Header({ toggleSidebar }: Props) {
  const router = useRouter();

  // ✅ Zustand auth
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ✅ Load notifications once + interval refresh
  useEffect(() => {
    const load = () => {
      const data = JSON.parse(localStorage.getItem("notifications") || "[]");
      setNotifications(data);
    };
    load();

    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node))
        setShowNotifications(false);

      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfileMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={clsx(
        "px-4 py-3 flex justify-between items-center sticky top-0 z-30",
        "bg-background border-b backdrop-blur"
      )}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {toggleSidebar && (
          <button onClick={toggleSidebar} className="md:hidden">
            ☰
          </button>
        )}

        <div
          onClick={() => router.push("/staff/dashboard")}
          className="cursor-pointer flex items-center"
        >
          <Image src={logo} alt="SLLB Logo" width={32} height={32} priority />
        </div>
        <span className="font-semibold tracking-tight">SLLB</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* 🔔 Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications((p) => !p)}
            className="relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-card border rounded shadow p-2 text-sm">
              {notifications.length === 0 ? (
                <p className="text-muted-foreground">No notifications</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    className="py-1.5 px-2 rounded hover:bg-muted"
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((p) => !p)}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium"
          >
            {user?.email?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-card border rounded shadow text-sm">
              <div className="px-3 py-3 border-b">
                <p className="font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>

              <button
                onClick={() => router.push("/staff/settings")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted"
              >
                <Settings size={16} /> Settings
              </button>

              <button
                onClick={() => {
                  logout();
                  router.replace("/auth/login");
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-destructive hover:bg-muted"
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
