// "use client";

// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { Skeleton } from "../ui/skeleton";
// import { Card, CardHeader, CardContent } from "../ui/card";
// import { Separator } from "../ui/separator";
// import { Badge } from "../ui/badge";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Checkbox } from "../ui/checkbox";
// import { Button } from "../ui/button";
// import { toast } from "sonner";
// import { useGuiNames } from "@/hooks/role/useGuiNames";
// import { useCreateRoles } from "@/hooks/role/useCreateRoles";
// import { useRolesData } from "@/hooks/role/useRolesData";
// import { useUserDetails } from "@/hooks/user/useUserDetails";
// import { ScanSearch } from "lucide-react";
// import Link from "next/link";

// // Types
// interface Role {
//   roleName: string;
//   hrefGui: string;
//   isActive: boolean;
//   makeBy: string;
//   makeDate: string;
// }

// // Utility to format GUI paths into readable labels
// function formatGuiLabel(path: string): string {
//   const segments = path.split("/").filter(Boolean);
//   if (segments.length === 0) return "Home";

//   return segments
//     .map((segment) =>
//       segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
//     )
//     .join(" → ");
// }

// const InsertRole: React.FC = () => {
//   const [roleName, setRoleName] = useState("");
//   const [selectedHrefGuis, setSelectedHrefGuis] = useState<string[]>([]);
//   const [isActive, setIsActive] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [roles, setRoles] = useState<Role[]>([]);

//   const userName = useUserDetails();
//   const hrefOptions = useGuiNames();
//   const { rolesData } = useRolesData();
//   const { createRoles, loading } = useCreateRoles();

//   useEffect(() => {
//     setRoles(rolesData);
//   }, [rolesData]);

//   const handleHrefGuiChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     setSelectedHrefGuis((prev) =>
//       checked ? [...prev, value] : prev.filter((gui) => gui !== value)
//     );
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!roleName) {
//       toast.warning("Please enter a role name.");
//       return;
//     }

//     if (selectedHrefGuis.length === 0) {
//       toast.warning("Please select at least one GUI path.");
//       return;
//     }

//     const makeDate = new Date().toISOString().split("T")[0];
//     const newRoles: Role[] = selectedHrefGuis.map((hrefGui) => ({
//       roleName,
//       hrefGui,
//       isActive,
//       makeBy: userName,
//       makeDate,
//     }));

//     setIsSubmitting(true);

//     const response = await createRoles(newRoles);

//     if (response?.isSuccessful) {
//       toast.success(response.message);
//       setRoleName("");
//       setSelectedHrefGuis([]);
//       setIsActive(true);
//       setRoles((prev) => [...prev, ...newRoles]);
//     } else {
//       toast.error(response?.message || "Failed to create roles.");
//     }

//     setIsSubmitting(false);
//   };

//   if (loading || !hrefOptions.length) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-10 w-full" />
//         <Skeleton className="h-40 w-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 p-6">
//       <div className="flex justify-end mb-4">
//         <Link href="/admin-settings/role-update">
//           <Button variant="default" size="sm" className="text-xs">
//             <ScanSearch className="h-4 w-4 mr-2" /> Edit Roles
//           </Button>
//         </Link>
//       </div>
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Create New Role</h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Role Name */}
//             <div className="space-y-2">
//               <Label htmlFor="roleName">Role Name</Label>
//               <Input
//                 id="roleName"
//                 value={roleName}
//                 onChange={(e) => setRoleName(e.target.value)}
//                 placeholder="Enter role name..."
//                 required
//               />
//             </div>

//             {/* GUI Paths */}
//             <div className="space-y-2">
//               <Label>GUI Paths</Label>
//               <Separator />
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                 {hrefOptions.map((option) => (
//                   <div key={option} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={option}
//                       value={option}
//                       checked={selectedHrefGuis.includes(option)}
//                       onCheckedChange={(checked) =>
//                         handleHrefGuiChange({
//                           target: {
//                             value: option,
//                             checked: checked as boolean,
//                           },
//                         } as ChangeEvent<HTMLInputElement>)
//                       }
//                     />
//                     {/* <Label htmlFor={option}>{option}</Label> */}
//                     <Label className="text-xs" htmlFor={option}>
//                       {formatGuiLabel(option)}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Role List */}
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Existing Roles</h2>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {roles.length === 0 ? (
//             <p className="text-muted-foreground">No roles available.</p>
//           ) : (
//             roles.map((role, index) => (
//               <div key={index} className="space-y-1">
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium">{role.roleName}</span>
//                   <Badge variant={role.isActive ? "default" : "secondary"}>
//                     {role.isActive ? "Active" : "Inactive"}
//                   </Badge>
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   GUI: {role.hrefGui}
//                 </div>
//                 <Separator />
//               </div>
//             ))
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default InsertRole;
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useGuiNames } from "@/hooks/role/useGuiNames";
import { useCreateRoles } from "@/hooks/role/useCreateRoles";
import { useRolesData } from "@/hooks/role/useRolesData";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { PermissionActions } from "@/common/permission";
import { ScanSearch } from "lucide-react";
import Link from "next/link";
import type { GuiPermissions } from "@/types/role"; // Make sure this is imported

const CRUD_ACTIONS: PermissionActions[] = [
  PermissionActions.READ,
  PermissionActions.CREATE,
  PermissionActions.UPDATE,
  PermissionActions.DELETE,
];

const DEFAULT_PERMISSIONS = (): GuiPermissions =>
  Object.fromEntries(CRUD_ACTIONS.map((action) => [action, false])) as GuiPermissions;

function formatGuiLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" → ");
}

const InsertRole: React.FC = () => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Record<string, GuiPermissions>>({});
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  const userName = useUserDetails();
  const { data: hrefOptions = [], isLoading: guiLoading } = useGuiNames();
  const { rolesData } = useRolesData();
  const { createRoles, loading } = useCreateRoles();

  useEffect(() => {
    setRoles(rolesData);
  }, [rolesData]);

  // Handle permission toggle for a specific GUI and action
  const handlePermissionChange = (
    hrefGui: string,
    action: PermissionActions
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [hrefGui]: {
        ...prev[hrefGui],
        [action]: !(prev[hrefGui]?.[action] ?? false),
      },
    }));
  };

  // Allow "select all" CRUD for a GUI
  const handleSelectAll = (hrefGui: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [hrefGui]: {
        [PermissionActions.READ]: checked,
        [PermissionActions.CREATE]: checked,
        [PermissionActions.UPDATE]: checked,
        [PermissionActions.DELETE]: checked,
      },
    }));
  };

  // On submit, build one role object per GUI with correct permission shape
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.warning("Please enter a role name.");
      return;
    }

    // Only GUIs with at least one CRUD selected
    const selectedGuiEntries = Object.entries(permissions).filter(([, perms]) =>
      CRUD_ACTIONS.some((action) => perms[action])
    );

    if (selectedGuiEntries.length === 0) {
      toast.warning("Please assign at least one permission to a GUI path.");
      return;
    }

    const makeDate = new Date().toISOString();
    const newRoles = selectedGuiEntries.map(([hrefGui, perms]) => ({
      roleName,
      hrefGui,
      permissions: perms,   // <--- FLAT CRUD object only
      isActive,
      makeBy: userName,
      makeDate,
    }));

    setIsSubmitting(true);

    const response = await createRoles(newRoles);

    if (response?.isSuccessful) {
      toast.success(response.message);
      setRoleName("");
      setPermissions({});
      setIsActive(true);
      setRoles((prev) => [...prev, ...newRoles]);
    } else {
      toast.error(response?.message || "Failed to create roles.");
    }

    setIsSubmitting(false);
  };

  if (loading || guiLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 px-16 w-full mx-auto">
      <div className="flex justify-end mb-4">
        <Link href="/admin-settings/role-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> Edit Roles
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Role</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name..."
                required
                className="w-full"
              />
            </div>
            {/* GUI Paths with CRUD permissions */}
            <div className="space-y-2">
              <Label>GUI Path Permissions</Label>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hrefOptions.map((hrefGui) => {
                  const perms = permissions[hrefGui] || DEFAULT_PERMISSIONS();
                  const isAllSelected = CRUD_ACTIONS.every((a) => perms[a]);
                  return (
                    <Card key={hrefGui} className="p-3 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-primary">
                          {formatGuiLabel(hrefGui)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={(checked) =>
                              handleSelectAll(hrefGui, !!checked)
                            }
                            id={`select-all-${hrefGui}`}
                          />
                          <Label
                            htmlFor={`select-all-${hrefGui}`}
                            className="text-xs font-normal"
                          >
                            All
                          </Label>
                        </div>
                      </div>
                      <div className="flex gap-4 flex-wrap mt-2">
                        {CRUD_ACTIONS.map((action) => (
                          <label
                            key={action}
                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg cursor-pointer ${
                              perms[action]
                                ? "bg-blue-50 text-blue-600"
                                : "bg-muted"
                            }`}
                          >
                            <Checkbox
                              checked={!!perms[action]}
                              onCheckedChange={() =>
                                handlePermissionChange(hrefGui, action)
                              }
                              id={`${hrefGui}-${action}`}
                            />
                            <span className="capitalize">{action}</span>
                          </label>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
            {/* Active toggle (applies to all new GUIs in this role) */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Role List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Existing Roles</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.length === 0 ? (
            <p className="text-muted-foreground">No roles available.</p>
          ) : (
            roles.map((role, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{role.roleName}</span>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  GUI: {role.hrefGui}
                </div>
                <Separator />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsertRole;
