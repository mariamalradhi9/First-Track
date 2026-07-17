"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { NavItem } from "@/lib/nav-config";

interface Props {
  navItems: NavItem[];
  userName: string;
  userRole: string;
  children: ReactNode;
}

export function AppShell({ navItems, userName, userRole, children }: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={navItems} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} userName={userName} userRole={userRole} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
