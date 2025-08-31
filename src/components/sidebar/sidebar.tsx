"use client";

import {
  Home,
  Network,
  Server,
  Settings,
  MonitorCog,
  Laptop,
} from "lucide-react";
import { SidebarDesktop } from "./sidebar-desktop";
import { SidebarItems } from "@/types/types";

const sidebarItems: SidebarItems = {
  links: [
    { href: "/home", icon: Home, label: "Dashboard" },
    {
      href: "/admin-settings",
      icon: Settings,
      label: "Admin Settings",
    },
    {
      href: "/core-systems",
      icon: Server,
      label: "Core Systems",
    },
    // {
    //   href: "/core-systems",
    //   icon: Network,
    //   label: "Network Solutions",
    // },
    // {
    //   href: "/core-systems",
    //   icon: MonitorCog,
    //   label: "System Administration",
    // },
    {
      href: "/device-inventory",
      icon: Laptop,
      label: "Device Inventory",
    },
  ],
};

export function Sidebar() {
  return <SidebarDesktop sidebarItems={sidebarItems} />;
}
