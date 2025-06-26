"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MoreHorizontal, Settings, RotateCcwKey } from "lucide-react";
import { SidebarButton } from "./sidebar-button";
import { SidebarItems } from "@/types/types";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RoleBasedAccess from "../roles/roleBasedAccess";
import { ModeToggle } from "../theme-button";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useRolesData } from "@/hooks/useRolesData";
import Logo from "@/../public/images/common/logo.png";
import LogoutButton from "../auth/logout";

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

const getRolesForHref = (rolesData: any[], href: string): string[] => {
  return rolesData
    .filter((role) =>
      role.hrefGui?.toLowerCase().startsWith(href.toLowerCase())
    )
    .map((role) => role.roleName.toLowerCase());
};

export function SidebarDesktop({ sidebarItems }: SidebarDesktopProps) {
  const userName = useUserDetails();
  const rolesData = useRolesData();
  const pathname = usePathname();

  const allowedRolesForSettings = getRolesForHref(
    rolesData,
    "/account-settings"
  );

  return (
    <aside className="w-[250px] max-w-xs h-screen fixed left-0 top-0 z-40 border-r bg-gray-300 dark:bg-gray-900">
      <div className="h-full flex flex-col px-2 py-4 ">
        {/* Header */}
        <div className="flex items-center justify-start mb-8">
          <Link href="/home" className="flex ms-2 md:me-24">
            <Image
              src={Logo}
              alt="App Logo"
              width={20}
              height={20}
              className="me-3"
              priority
            />
            <span className="self-center text-xs font-semibold sm:text-xs whitespace-nowrap text-black dark:text-white">
              Hi, <span>{userName || "Loading..."}</span>
            </span>
          </Link>
        </div>

        <Separator className="absolute top-12 left-0 w-full bg-gray-400 dark:bg-gray-600" />

        {/* Sidebar Links */}
        <div className="flex-1 mt-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-2 w-full">
            {sidebarItems.links.map((link, index) => {
              const allowedRoles = getRolesForHref(rolesData, link.href);
              return (
                <RoleBasedAccess allowedRoles={allowedRoles} key={index}>
                  <Link href={link.href}>
                    <SidebarButton
                      variant={pathname === link.href ? "secondary" : "ghost"}
                      icon={link.icon}
                      className="w-full text-xs"
                    >
                      {link.label}
                    </SidebarButton>
                  </Link>
                </RoleBasedAccess>
              );
            })}
            {sidebarItems.extras}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-0 pt-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-1 items-center">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="" alt="User Image" />
                      <AvatarFallback>
                        <FaUserCircle className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[8px]">
                      {userName || "Loading..."}
                    </span>
                  </div>
                  <MoreHorizontal size={20} />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mb-2 w-56 p-3 rounded-[1rem] bg-gray-100 dark:bg-gray-950">
              <div className="space-y-1">
                <RoleBasedAccess allowedRoles={allowedRolesForSettings}>
                  <Link href="/account-settings">
                    <SidebarButton
                      size="sm"
                      icon={Settings}
                      className="w-full text-xs p-2"
                    >
                      Account Settings
                    </SidebarButton>
                  </Link>
                </RoleBasedAccess>
                <Link href="/change-password">
                  <SidebarButton
                    size="sm"
                    icon={RotateCcwKey}
                    className="w-full text-xs p-2"
                  >
                    Change Password
                  </SidebarButton>
                </Link>
                <ModeToggle />
                <LogoutButton />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </aside>
  );
}
