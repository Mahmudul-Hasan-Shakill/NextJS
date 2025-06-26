"use client";

import { Home, ClipboardPen, Sheet } from "lucide-react";
import { SidebarDesktop } from "./sidebar-desktop";
import { SidebarItems } from "@/types/types";

const sidebarItems: SidebarItems = {
  links: [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/reports", icon: Sheet, label: "Report Portal" },
    {
      href: "/task-manager",
      icon: ClipboardPen,
      label: "Task Manager",
    },
    {
      href: "/task-editor",
      icon: ClipboardPen,
      label: "Task Editor",
    },
  ],
};

export function Sidebar() {
  return <SidebarDesktop sidebarItems={sidebarItems} />;
}
