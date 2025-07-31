// "use client";

// import React, { useState, useEffect, FormEvent } from "react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";

// import { useUserDetails } from "@/hooks/user/useUserDetails";
// import { useRoleNames } from "@/hooks/role/useRoleNames";
// import { useGuiByRoleName } from "@/hooks/role/useGuiByRoleName";
// import { useUpdateRole } from "@/hooks/role/useUpdateRole";
// import { FilePlus2 } from "lucide-react";
// import Link from "next/link";

// interface HrefGui {
//   hrefGui: string;
//   isActive: boolean;
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

// const EditRole: React.FC = () => {
//   const { roleNames } = useRoleNames();
//   const [selectedRoleName, setSelectedRoleName] = useState("");
//   const [hrefGuis, setHrefGuis] = useState<HrefGui[]>([]);
//   const { updateRole } = useUpdateRole();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const userName = useUserDetails();

//   const guiData = useGuiByRoleName(selectedRoleName);

//   useEffect(() => {
//     if (selectedRoleName && Array.isArray(guiData)) {
//       setHrefGuis(guiData);
//     }
//   }, [selectedRoleName, guiData]);

//   const handleCheckboxChange = (href: string) => {
//     setHrefGuis((prev) =>
//       prev.map((item) =>
//         item.hrefGui === href ? { ...item, isActive: !item.isActive } : item
//       )
//     );
//   };

//   const handleSubmit = async () => {
//     if (!selectedRoleName) {
//       toast.warning("Please select a role name.");
//       return;
//     }

//     const editBy = userName;
//     const editDate = new Date().toISOString();

//     const roleData = {
//       roleName: selectedRoleName,
//       hrefGui: hrefGuis.map((item) => ({
//         hrefGui: item.hrefGui,
//         isActive: item.isActive,
//         editBy,
//         editDate,
//       })),
//     };

//     setIsSubmitting(true);

//     try {
//       const result = await updateRole(roleData);
//       if (result?.isSuccessful) {
//         toast.success(result.message);
//         setTimeout(() => {
//           setIsSubmitting(false);
//           window.location.reload();
//         }, 2000);
//       } else {
//         toast.error(result?.message);
//         setIsSubmitting(false);
//       }
//     } catch {
//       toast.error("Unexpected error occurred.");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-end mb-4">
//         <Link href="/admin-settings/role-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create New Role
//           </Button>
//         </Link>
//       </div>
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Edit Role</h2>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={(e: FormEvent<HTMLFormElement>) => {
//               e.preventDefault();
//               setShowConfirm(true);
//             }}
//             className="space-y-6"
//           >
//             {/* Role Name Dropdown */}
//             <div className="space-y-2">
//               <Label className="py-4">Select Role Name</Label>
//               <Select
//                 value={selectedRoleName}
//                 onValueChange={setSelectedRoleName}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select role..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {roleNames.map((name) => (
//                     <SelectItem key={name} value={name}>
//                       {name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* GUI Path Checkboxes */}
//             <div className="space-y-2">
//               <Label>GUI Paths</Label>
//               <div className="py-4 grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {hrefGuis.map((href) => (
//                   <div
//                     key={href.hrefGui}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={href.hrefGui}
//                       checked={href.isActive}
//                       onCheckedChange={() => handleCheckboxChange(href.hrefGui)}
//                     />
//                     <Label className="text-xs" htmlFor={href.hrefGui}>
//                       {formatGuiLabel(href.hrefGui)}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end">
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Confirmation Modal */}
//       <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Update</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to update the role{" "}
//               <strong>{selectedRoleName}</strong>?
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setShowConfirm(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 setShowConfirm(false);
//                 handleSubmit();
//               }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Updating..." : "Yes, Update"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default EditRole;

// "use client";

// import React, { useState, useEffect, FormEvent } from "react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";

// import { useUserDetails } from "@/hooks/user/useUserDetails";
// import { useRoleNames } from "@/hooks/role/useRoleNames";
// import { useGuiByRoleName } from "@/hooks/role/useGuiByRoleName";
// import { useUpdateRole } from "@/hooks/role/useUpdateRole";
// import { useDeleteRoleByName } from "@/hooks/role/useDeleteRoleByName";
// import { FilePlus2, Trash2 } from "lucide-react";
// import Link from "next/link";

// interface HrefGui {
//   hrefGui: string;
//   isActive: boolean;
// }

// function formatGuiLabel(path: string): string {
//   const segments = path.split("/").filter(Boolean);
//   if (segments.length === 0) return "Home";

//   return segments
//     .map((segment) =>
//       segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
//     )
//     .join(" → ");
// }

// const EditRole: React.FC = () => {
//   const { roleNames } = useRoleNames();
//   const [selectedRoleName, setSelectedRoleName] = useState("");
//   const [hrefGuis, setHrefGuis] = useState<HrefGui[]>([]);
//   const { updateRole } = useUpdateRole();
//   const { deleteRoleByName } = useDeleteRoleByName();
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
//   const [loadingUpdate, setLoadingUpdate] = useState(false);
//   const [loadingDelete, setLoadingDelete] = useState(false);
//   const userName = useUserDetails();

//   const guiData = useGuiByRoleName(selectedRoleName);

//   useEffect(() => {
//     if (selectedRoleName && Array.isArray(guiData)) {
//       setHrefGuis(guiData);
//     }
//   }, [selectedRoleName, guiData]);

//   const handleCheckboxChange = (href: string) => {
//     setHrefGuis((prev) =>
//       prev.map((item) =>
//         item.hrefGui === href ? { ...item, isActive: !item.isActive } : item
//       )
//     );
//   };

//   const handleSubmit = async () => {
//     const editBy = userName;
//     const editDate = new Date().toISOString();

//     const roleData = {
//       roleName: selectedRoleName,
//       hrefGui: hrefGuis.map((item) => ({
//         hrefGui: item.hrefGui,
//         isActive: item.isActive,
//         editBy,
//         editDate,
//       })),
//     };

//     setLoadingUpdate(true);

//     try {
//       const result = await updateRole(roleData);
//       if (result?.isSuccessful) {
//         toast.success(result.message);
//         setTimeout(() => {
//           window.location.reload();
//         }, 2000);
//       } else {
//         toast.error(result?.message);
//       }
//     } catch {
//       toast.error("Unexpected error occurred.");
//     } finally {
//       setLoadingUpdate(false);
//     }
//   };

//   const confirmDeleteRole = (roleName: string) => {
//     setRoleToDelete(roleName);
//     setShowConfirm(true);
//   };

//   const handleDelete = async () => {
//     if (!roleToDelete) return;
//     setLoadingDelete(true);

//     try {
//       const result = await deleteRoleByName(roleToDelete);
//       if (result?.isSuccessful) {
//         toast.success(result.message);
//         setTimeout(() => {
//           window.location.reload();
//         }, 2000);
//       } else {
//         toast.error(result?.message);
//       }
//     } catch {
//       toast.error("Failed to delete role.");
//     } finally {
//       setLoadingDelete(false);
//       setShowConfirm(false);
//       setRoleToDelete(null);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-end mb-4">
//         <Link href="/admin-settings/role-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create New Role
//           </Button>
//         </Link>
//       </div>

//       {/* Edit Role Section */}
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Edit Role</h2>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={(e: FormEvent<HTMLFormElement>) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//             className="space-y-6"
//           >
//             <div className="space-y-2">
//               <Label className="py-4">Select Role Name</Label>
//               <Select
//                 value={selectedRoleName}
//                 onValueChange={setSelectedRoleName}
//               >
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select role..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {roleNames.map((name) => (
//                     <SelectItem key={name} value={name}>
//                       {name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>GUI Paths</Label>
//               <div className="py-4 grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {hrefGuis.map((href) => (
//                   <div
//                     key={href.hrefGui}
//                     className="flex items-center space-x-2"
//                   >
//                     <Checkbox
//                       id={href.hrefGui}
//                       checked={href.isActive}
//                       onCheckedChange={() => handleCheckboxChange(href.hrefGui)}
//                     />
//                     <Label className="text-xs" htmlFor={href.hrefGui}>
//                       {formatGuiLabel(href.hrefGui)}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 type="submit"
//                 disabled={loadingUpdate || !selectedRoleName}
//               >
//                 {loadingUpdate ? "Updating..." : "Submit"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Delete Role Table */}
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold text-red-600">Delete Roles</h2>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {roleNames.map((role) => (
//               <div
//                 key={role}
//                 className="flex items-center justify-between border rounded px-4 py-2"
//               >
//                 <span className="font-medium">{role}</span>
//                 <Button
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => confirmDeleteRole(role)}
//                   disabled={loadingDelete}
//                 >
//                   <Trash2 className="w-4 h-4 mr-1" />
//                   Delete
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Confirm Delete Dialog */}
//       <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Confirm Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to{" "}
//               <strong className="text-red-600">delete</strong> the role{" "}
//               <strong>{roleToDelete}</strong>?
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setShowConfirm(false)}>
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDelete}
//               disabled={loadingDelete}
//             >
//               {loadingDelete ? "Deleting..." : "Yes, Delete"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default EditRole;

"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useRoleNames } from "@/hooks/role/useRoleNames";
import { useGuiByRoleName } from "@/hooks/role/useGuiByRoleName";
import { useUpdateRole } from "@/hooks/role/useUpdateRole";
import { useDeleteRoleByName } from "@/hooks/role/useDeleteRoleByName";
import { FilePlus2, Trash2 } from "lucide-react";
import Link from "next/link";
import { AppModules, PermissionActions } from "@/common/permission";
import {
  GuiByRoleNameResponse,
  Permissions,
  UpdateRoleDtoFrontend,
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

const EditRole: React.FC = () => {
  const { roleNames } = useRoleNames();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [hrefGuis, setHrefGuis] = useState<GuiByRoleNameResponse[]>([]);
  const { updateRole } = useUpdateRole();
  const { deleteRoleByName } = useDeleteRoleByName();
  const [showConfirm, setShowConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const userName = useUserDetails();

  const { data: guiData, isLoading: isLoadingGuiData } =
    useGuiByRoleName(selectedRoleName);

  useEffect(() => {
    if (selectedRoleName && Array.isArray(guiData)) {
      setHrefGuis(guiData);
    } else {
      setHrefGuis([]);
    }
  }, [selectedRoleName, guiData]);

  const handleGuiActiveChange = (href: string) => {
    setHrefGuis((prev) =>
      prev.map((item) =>
        item.hrefGui === href ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handlePermissionChange = (
    href: string,
    module: AppModules,
    action: PermissionActions,
    checked: boolean
  ) => {
    setHrefGuis((prevGuis) =>
      prevGuis.map((gui) => {
        if (gui.hrefGui === href) {
          const newPermissions: Permissions = { ...gui.permissions };
          if (!newPermissions[module]) {
            newPermissions[module] = {};
          }
          newPermissions[module][action] = checked;
          return { ...gui, permissions: newPermissions };
        }
        return gui;
      })
    );
  };

  const handleSubmit = async () => {
    const editBy = userName;
    const editDate = new Date().toISOString();

    const updatedHrefGuis = hrefGuis.map((item) => ({
      hrefGui: item.hrefGui,
      isActive: item.isActive,
      editBy,
      editDate,
    }));

    const aggregatedPermissions: Permissions = {};
    hrefGuis.forEach((gui) => {
      const module = getModuleFromHref(gui.hrefGui);
      if (module && gui.permissions?.[module]) {
        aggregatedPermissions[module] = {
          ...aggregatedPermissions[module],
          ...gui.permissions[module],
        };
      }
    });

    const roleData: UpdateRoleDtoFrontend = {
      roleName: selectedRoleName,
      hrefGui: updatedHrefGuis,
      permissions: aggregatedPermissions,
    };

    setLoadingUpdate(true);
    try {
      const result = await updateRole(roleData);
      if (result?.isSuccessful) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || "Failed to update role.");
      }
    } catch (error) {
      toast.error("Unexpected error occurred.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const confirmDeleteRole = (roleName: string) => {
    setRoleToDelete(roleName);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    setLoadingDelete(true);

    try {
      const result = await deleteRoleByName(roleToDelete);
      if (result?.isSuccessful) {
        toast.success(result.message);
        setSelectedRoleName("");
        setHrefGuis([]);
      } else {
        toast.error(result?.message || "Failed to delete role.");
      }
    } catch (error) {
      toast.error("Failed to delete role.");
    } finally {
      setLoadingDelete(false);
      setShowConfirm(false);
      setRoleToDelete(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end mb-4">
        <Link href="/admin-settings/role-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create New Role
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Edit Role</h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="py-4">Select Role Name</Label>
              <Select
                value={selectedRoleName}
                onValueChange={setSelectedRoleName}
                disabled={!roleNames || roleNames.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {roleNames?.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoleName && (
              <div className="space-y-2">
                <Label>GUI Paths & Permissions</Label>
                <Separator />
                {isLoadingGuiData ? (
                  <Skeleton className="h-40 w-full" />
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {hrefGuis.map((hrefItem) => {
                      const module = getModuleFromHref(hrefItem.hrefGui);
                      return (
                        <Card key={hrefItem.hrefGui} className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={hrefItem.hrefGui}
                              checked={hrefItem.isActive}
                              onCheckedChange={(checked) =>
                                handleGuiActiveChange(hrefItem.hrefGui)
                              }
                            />
                            <Label
                              className="text-sm font-medium"
                              htmlFor={hrefItem.hrefGui}
                            >
                              {formatGuiLabel(hrefItem.hrefGui)} (
                              {hrefItem.hrefGui})
                            </Label>
                          </div>

                          {module && (
                            <div className="ml-6 mt-2 space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Permissions for {module.toUpperCase()} Module:
                              </Label>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {Object.values(PermissionActions).map(
                                  (action) => {
                                    const isChecked =
                                      hrefItem.permissions?.[module]?.[
                                        action
                                      ] ?? false;
                                    const isDisabled =
                                      action === PermissionActions.READ;

                                    return (
                                      <div
                                        key={`${hrefItem.hrefGui}-${action}`}
                                        className="flex items-center space-x-1"
                                      >
                                        <Checkbox
                                          id={`${hrefItem.hrefGui}-${action}`}
                                          checked={isChecked}
                                          onCheckedChange={(checked) =>
                                            handlePermissionChange(
                                              hrefItem.hrefGui,
                                              module,
                                              action,
                                              checked as boolean
                                            )
                                          }
                                          disabled={isDisabled}
                                        />
                                        <Label
                                          htmlFor={`${hrefItem.hrefGui}-${action}`}
                                          className="text-xs"
                                        >
                                          {action.toUpperCase()}
                                        </Label>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  loadingUpdate || !selectedRoleName || isLoadingGuiData
                }
              >
                {loadingUpdate ? "Updating..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-red-600">Delete Roles</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roleNames?.map((role) => (
              <div
                key={role}
                className="flex items-center justify-between border rounded px-4 py-2"
              >
                <span className="font-medium">{role}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => confirmDeleteRole(role)}
                  disabled={loadingDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              <strong className="text-red-600">delete</strong> the role{" "}
              <strong>{roleToDelete}</strong>? This will delete all associated
              GUI paths and permissions for this role.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditRole;
