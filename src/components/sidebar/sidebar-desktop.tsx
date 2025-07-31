// "use client";

// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";
// import { MoreHorizontal, RotateCcwKey, UserRoundPen } from "lucide-react";
// import { SidebarButton } from "./sidebar-button";
// import { SidebarItems } from "@/types/types";
// import { Separator } from "../ui/separator";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Button } from "../ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import RoleBasedAccess from "../roles/roleBasedAccess";
// import { ModeToggle } from "../theme-button";
// import { useUserDetails } from "@/hooks/user/useUserDetails";
// import { useRolesData } from "@/hooks/role/useRolesData";
// import Logo from "@/../public/images/common/logo.png";
// import LogoutButton from "../auth/logout";

// interface SidebarDesktopProps {
//   sidebarItems: SidebarItems;
// }

// export function SidebarDesktop({ sidebarItems }: SidebarDesktopProps) {
//   const userName = useUserDetails();

//   const { getRolesForHref } = useRolesData();

//   const pathname = usePathname();

//   const allowedRolesForSettings = getRolesForHref("/user-profile");

//   return (
//     // <aside className="w-[250px] max-w-xs h-screen fixed left-0 top-0 z-40 border-r bg-gray-300 dark:bg-gray-900">
//     <aside className="w-[250px] h-full bg-gray-300 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75">
//       <div className="h-full flex flex-col px-2 py-4 ">
//         {/* Header */}
//         <div className="flex items-center justify-start mb-8">
//           <Link href="/home" className="flex ms-2 md:me-24">
//             <Image
//               src={Logo}
//               alt="App Logo"
//               width={20}
//               height={20}
//               className="me-3"
//               priority
//             />
//             <span
//               className="self-center text-[8px] font-semibold sm:text-[8px] lg:text-[10px] text-sky-900 dark:text-yellow-400 max-w-[120px] truncate"
//               title={userName || "Loading..."}
//             >
//               Hi, <span className="truncate">{userName || "Loading..."}</span>
//             </span>
//           </Link>
//         </div>

//         <Separator className="absolute top-12 left-0 w-full bg-gray-400 dark:bg-gray-600" />

//         {/* Sidebar Links */}
//         <div className="flex-1 mt-0 overflow-y-auto scrollbar-hide">
//           <div className="flex flex-col gap-2 w-full">
//             {sidebarItems.links.map((link, index) => {
//               const allowedRoles = getRolesForHref(link.href);
//               return (
//                 <RoleBasedAccess allowedRoles={allowedRoles} key={index}>
//                   <Link href={link.href}>
//                     <SidebarButton
//                       // variant={pathname === link.href ? "secondary" : "ghost"}
//                       variant={
//                         pathname.startsWith(link.href) ? "secondary" : "ghost"
//                       }
//                       icon={link.icon}
//                       className="w-full text-xs"
//                     >
//                       {link.label}
//                     </SidebarButton>
//                   </Link>
//                 </RoleBasedAccess>
//               );
//             })}
//             {sidebarItems.extras}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-auto px-0 pt-2">
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="ghost" className="w-full justify-start">
//                 <div className="flex justify-between items-center w-full">
//                   <div className="flex gap-1 items-center">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage src="" alt="User Image" />
//                       <AvatarFallback>
//                         <FaUserCircle className="h-4 w-4" />
//                       </AvatarFallback>
//                     </Avatar>
//                   </div>
//                   <span
//                     className="text-[8px] truncate max-w-[100px] inline-block"
//                     title={userName || "Loading..."}
//                   >
//                     {userName || "Loading..."}
//                   </span>
//                   <MoreHorizontal size={20} />
//                 </div>
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="sm:mb-0 sm:ml-[20px] lg:mb-[-40px] lg:ml-[250px] w-44 p-4 rounded-[10px] bg-gray-100 dark:bg-gray-950">
//               <div className="space-y-1">
//                 <RoleBasedAccess allowedRoles={allowedRolesForSettings}>
//                   <Link href="/user-profile">
//                     <SidebarButton
//                       size="sm"
//                       icon={UserRoundPen}
//                       className="w-full text-xs p-2"
//                     >
//                       My Profile
//                     </SidebarButton>
//                   </Link>
//                 </RoleBasedAccess>
//                 <Link href="/change-password">
//                   <SidebarButton
//                     size="sm"
//                     icon={RotateCcwKey}
//                     className="w-full text-xs p-2"
//                   >
//                     Change Password
//                   </SidebarButton>
//                 </Link>
//                 <ModeToggle />
//                 <LogoutButton />
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     </aside>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { MoreHorizontal, RotateCcwKey, UserRoundPen } from "lucide-react";
import { SidebarButton } from "./sidebar-button";
import { SidebarItems } from "@/types/types";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import RoleBasedAccess from "../roles/roleBasedAccess";
import { ModeToggle } from "../theme-button";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useRolesData } from "@/hooks/role/useRolesData";
import Logo from "@/../public/images/common/logo.png";
import LogoutButton from "../auth/logout";

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop({ sidebarItems }: SidebarDesktopProps) {
  const userName = useUserDetails();
  const { getRolesForHref } = useRolesData();
  const pathname = usePathname();
  const allowedRolesForSettings = getRolesForHref("/user-profile");

  return (
    <aside className="w-[250px] h-full bg-gray-300 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75">
      <div className="h-full flex flex-col px-2 py-4">
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
            <span
              className="self-center text-[8px] font-semibold sm:text-[8px] lg:text-[10px] text-sky-900 dark:text-yellow-400 max-w-[120px] truncate"
              title={userName || "Loading..."}
            >
              Hi, <span className="truncate">{userName || "Loading..."}</span>
            </span>
          </Link>
        </div>

        <Separator className="absolute top-12 left-0 w-full bg-gray-400 dark:bg-gray-600" />

        {/* Sidebar Links */}
        <div className="flex-1 mt-0 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-2 w-full">
            {sidebarItems.links.map((link, index) => {
              const allowedRoles = getRolesForHref(link.href);
              return (
                <RoleBasedAccess allowedRoles={allowedRoles} key={index}>
                  <Link href={link.href}>
                    <SidebarButton
                      variant={
                        pathname.startsWith(link.href) ? "secondary" : "ghost"
                      }
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
                  </div>
                  <span
                    className="text-[8px] truncate max-w-[100px] inline-block"
                    title={userName || "Loading..."}
                  >
                    {userName || "Loading..."}
                  </span>
                  <MoreHorizontal size={20} />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="sm:mb-0 sm:ml-[20px] lg:mb-[-40px] lg:ml-[250px] w-44 p-4 rounded-[10px] bg-gray-100 dark:bg-gray-950">
              <div className="space-y-1">
                <RoleBasedAccess allowedRoles={allowedRolesForSettings}>
                  <Link href="/user-profile">
                    <SidebarButton
                      size="sm"
                      icon={UserRoundPen}
                      className="w-full text-xs p-2"
                    >
                      My Profile
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
