"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-background">
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* CONTENT WRAPPER */}
      <div
        className={`min-h-screen transition-all duration-300 flex flex-col ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header toggleSidebar={() => setIsOpen(!isOpen)} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
