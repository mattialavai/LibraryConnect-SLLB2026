"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useAuthStore } from "@/features/auth/store";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Prevent hydration mismatch (zustand persistence)
  useEffect(() => setHydrated(true), []);

  // Auth + role guard
  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role === "PATRON") {
      router.replace("/portal");
    }
  }, [user, hydrated, router]);

  if (!hydrated || !user) return null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* CONTENT WRAPPER */}
      <div
        className={`
          flex-1 flex flex-col transition-all
          ${collapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <Header toggleSidebar={() => setIsOpen(!isOpen)} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
