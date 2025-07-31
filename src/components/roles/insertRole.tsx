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
import { ScanSearch } from "lucide-react";
import Link from "next/link";
import { AppModules, PermissionActions } from "@/common/permission";
import {
  CreateRoleDtoFrontend,
  Permissions,
  RoleBackendResponse,
} from "@/types/role";

function formatGuiLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" → ");
}

function getModuleFromHref(hrefGui: string): AppModules | undefined {
  if (hrefGui.startsWith("/core/vm")) return AppModules.VM;
  if (hrefGui.startsWith("/admin-settings/user")) return AppModules.USER;
  if (hrefGui.startsWith("/admin-settings/role")) return AppModules.ROLE;
  const firstSegment = hrefGui.split("/").filter(Boolean)[0];
  if (firstSegment) {
    const module = Object.values(AppModules).find(
      (m) => m === firstSegment.toLowerCase()
    );
    if (module) return module;
  }
  return undefined;
}

const InsertRole: React.FC = () => {
  const [roleName, setRoleName] = useState("");
  const [selectedHrefGuis, setSelectedHrefGuis] = useState<string[]>([]);
  const [guiPermissions, setGuiPermissions] = useState<
    Record<string, Permissions>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<RoleBackendResponse[]>([]);

  const userName = useUserDetails();
  const { data: hrefOptions, isLoading: loadingHrefOptions } = useGuiNames();
  const { rolesData } = useRolesData();
  const { createRoles, loading: loadingCreateRoles } = useCreateRoles();

  useEffect(() => {
    setRoles(rolesData);
  }, [rolesData]);

  const handleHrefGuiChange = (href: string, checked: boolean) => {
    setSelectedHrefGuis((prev) => {
      const newSelected = checked
        ? [...prev, href]
        : prev.filter((gui) => gui !== href);

      setGuiPermissions((prevPermissions) => {
        const newGuiPermissions = { ...prevPermissions };
        if (checked) {
          const module = getModuleFromHref(href);
          if (module) {
            newGuiPermissions[href] = {
              [module]: {
                [PermissionActions.CREATE]: true,
                [PermissionActions.UPDATE]: true,
                [PermissionActions.DELETE]: true,
              },
            };
          } else {
            newGuiPermissions[href] = {};
          }
        } else {
          delete newGuiPermissions[href];
        }
        return newGuiPermissions;
      });
      return newSelected;
    });
  };

  const handlePermissionChange = (
    href: string,
    module: AppModules,
    action: PermissionActions,
    checked: boolean
  ) => {
    setGuiPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      if (!newPermissions[href]) {
        newPermissions[href] = {};
      }
      if (!newPermissions[href][module]) {
        newPermissions[href][module] = {};
      }
      newPermissions[href][module][action] = checked;
      return newPermissions;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roleName) {
      toast.warning("Please enter a role name.");
      return;
    }

    if (selectedHrefGuis.length === 0) {
      toast.warning("Please select at least one GUI path.");
      return;
    }

    const makeDate = new Date().toISOString();
    const newRoles: CreateRoleDtoFrontend[] = selectedHrefGuis.map(
      (hrefGui) => {
        const module = getModuleFromHref(hrefGui);

        const permissionsForThisGui: Permissions = {};
        if (
          module &&
          guiPermissions[hrefGui] &&
          guiPermissions[hrefGui][module]
        ) {
          permissionsForThisGui[module] = guiPermissions[hrefGui][module];
        }

        return {
          roleName,
          hrefGui,
          permissions: permissionsForThisGui,
          makeBy: userName,
          makeDate,
          isActive: true,
        };
      }
    );

    setIsSubmitting(true);
    const response = await createRoles(newRoles);

    if (response?.isSuccessful) {
      toast.success(response.message);
      setRoleName("");
      setSelectedHrefGuis([]);
      setGuiPermissions({});
    } else {
      toast.error(response?.message || "Failed to create roles.");
    }
    setIsSubmitting(false);
  };

  const loading = loadingHrefOptions || loadingCreateRoles;

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
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
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>GUI Paths & Permissions</Label>
              <Separator />
              <div className="grid grid-cols-1 gap-4">
                {hrefOptions?.map((option: string) => (
                  <Card key={option} className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={option}
                        value={option}
                        checked={selectedHrefGuis.includes(option)}
                        onCheckedChange={(checked) =>
                          handleHrefGuiChange(option, checked as boolean)
                        }
                      />
                      <Label className="text-sm font-medium" htmlFor={option}>
                        {formatGuiLabel(option)} ({option})
                      </Label>
                    </div>

                    {selectedHrefGuis.includes(option) &&
                      getModuleFromHref(option) && (
                        <div className="ml-6 mt-2 space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Permissions for{" "}
                            {getModuleFromHref(option)?.toUpperCase()} Module:
                          </Label>
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {Object.values(PermissionActions).map((action) => {
                              if (action === PermissionActions.READ)
                                return null;

                              const module = getModuleFromHref(option)!;
                              const isChecked =
                                guiPermissions[option]?.[module]?.[action] ??
                                true;

                              return (
                                <div
                                  key={`${option}-${action}`}
                                  className="flex items-center space-x-1"
                                >
                                  <Checkbox
                                    id={`${option}-${action}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(
                                        option,
                                        module,
                                        action,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`${option}-${action}`}
                                    className="text-xs"
                                  >
                                    {action.toUpperCase()}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                  </Card>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Existing Roles</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.length === 0 ? (
            <p className="text-muted-foreground">No roles available.</p>
          ) : (
            roles.map((role) => (
              <div key={role.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{role.roleName}</span>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  GUI: {role.hrefGui}
                </div>
                {Object.keys(role.permissions).length > 0 && (
                  <div className="text-xs text-muted-foreground ml-2">
                    Permissions:
                    {Object.entries(role.permissions).map(
                      ([module, actions]) => (
                        <span key={module} className="block ml-2">
                          <strong>{module.toUpperCase()}:</strong>{" "}
                          {Object.entries(actions)
                            .filter(([, active]) => active)
                            .map(([action]) => action.toUpperCase())
                            .join(", ")}
                        </span>
                      )
                    )}
                  </div>
                )}
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
