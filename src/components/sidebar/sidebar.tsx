"use client";

import { Home, Server, Settings } from "lucide-react";
import { SidebarDesktop } from "./sidebar-desktop";
import { SidebarItems } from "@/types/types";

const sidebarItems: SidebarItems = {
  links: [
    { href: "/home", icon: Home, label: "Home" },
    {
      href: "/admin-settings",
      icon: Settings,
      label: "Admin-Settings",
    },
    {
      href: "/core-systems",
      icon: Server,
      label: "Core Systems",
    },
  ],
};

export function Sidebar() {
  return <SidebarDesktop sidebarItems={sidebarItems} />;
}
