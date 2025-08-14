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
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useRoleNames } from "@/hooks/role/useRoleNames";
import { useGuiByRoleName } from "@/hooks/role/useGuiByRoleName";
import { useUpdateRole } from "@/hooks/role/useUpdateRole";
import { useCreateRoles } from "@/hooks/role/useCreateRoles";
import { FilePlus2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { PermissionActions } from "@/common/permission";
import { useGuiNames } from "@/hooks/role/useGuiNames";
import type { GuiPermissions, CreateRoleDtoFrontend } from "@/types/role";

const CRUD_ACTIONS: PermissionActions[] = [
  PermissionActions.READ,
  PermissionActions.CREATE,
  PermissionActions.UPDATE,
  PermissionActions.DELETE,
];

const DEFAULT_PERMISSIONS = (): GuiPermissions =>
  Object.fromEntries(
    CRUD_ACTIONS.map((action) => [action, false])
  ) as GuiPermissions;

function formatGuiLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";
  return segments
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" → ");
}

const EditRole: React.FC = () => {
  const { roleNames } = useRoleNames();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  // Assigned GUI permissions
  const [permissionsByGui, setPermissionsByGui] = useState<
    Record<string, GuiPermissions>
  >({});
  // Unassigned GUI for "Add"
  const [addingGui, setAddingGui] = useState<string | null>(null);
  const [addGuiPermissions, setAddGuiPermissions] = useState<GuiPermissions>(
    DEFAULT_PERMISSIONS()
  );
  // Confirm modals
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = useUserDetails();
  const { updateRole } = useUpdateRole();
  const { createRoles } = useCreateRoles();

  const { data: guiData } = useGuiByRoleName(selectedRoleName);
  const { data: allGuiNames = [] } = useGuiNames();

  // Build assigned and unassigned GUIs
  const assignedGuiNames = (guiData || []).map((g) => g.hrefGui);
  const assignedGuiData = (guiData || []).reduce((acc, gui) => {
    acc[gui.hrefGui] = {
      [PermissionActions.READ]: gui.permissions?.read ?? false,
      [PermissionActions.CREATE]: gui.permissions?.create ?? false,
      [PermissionActions.UPDATE]: gui.permissions?.update ?? false,
      [PermissionActions.DELETE]: gui.permissions?.delete ?? false,
    };
    return acc;
  }, {} as Record<string, GuiPermissions>);
  const unassignedGuiNames = allGuiNames.filter(
    (gui) => !assignedGuiNames.includes(gui)
  );

  // On change, keep permissions in sync for assigned GUIs only
  useEffect(() => {
    setPermissionsByGui(assignedGuiData);
  }, [selectedRoleName, guiData]);

  // Edit assigned GUI permissions
  const handlePermissionChange = (
    hrefGui: string,
    action: PermissionActions
  ) => {
    setPermissionsByGui((prev) => ({
      ...prev,
      [hrefGui]: {
        ...prev[hrefGui],
        [action]: !(prev[hrefGui]?.[action] ?? false),
      },
    }));
  };

  const handleSelectAll = (hrefGui: string, checked: boolean) => {
    setPermissionsByGui((prev) => ({
      ...prev,
      [hrefGui]: {
        [PermissionActions.READ]: checked,
        [PermissionActions.CREATE]: checked,
        [PermissionActions.UPDATE]: checked,
        [PermissionActions.DELETE]: checked,
      },
    }));
  };

  // Edit: update assigned GUI permissions
  const handleSubmit = async () => {
    if (!selectedRoleName) {
      toast.warning("Please select a role name.");
      return;
    }
    const editBy = userName;
    const editDate = new Date().toISOString();
    const guiEntries = Object.entries(permissionsByGui);
    const guiPermissions = guiEntries.map(([hrefGui, perms]) => {
      const atLeastOne = CRUD_ACTIONS.some((action) => perms[action]);
      return {
        hrefGui,
        isActive: atLeastOne,
        permissions: perms,
        editBy,
        editDate,
      };
    });

    const roleData = {
      roleName: selectedRoleName,
      guiPermissions,
    };

    setIsSubmitting(true);
    try {
      const result = await updateRole(roleData);
      if (result?.isSuccessful) {
        toast.success(result.message);
        setShowConfirm(false);
        // Soft-reload: clear and re-select role to refresh GUIs
        setSelectedRoleName("");
        setTimeout(() => {
          setSelectedRoleName(roleData.roleName);
          setIsSubmitting(false);
        }, 100);
      } else {
        toast.error(result?.message);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Unexpected error occurred.";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Add unassigned GUI to this role
  const handleAddGui = (gui: string) => {
    setAddingGui(gui);
    setAddGuiPermissions(DEFAULT_PERMISSIONS());
    setShowAddConfirm(true);
  };
  const handleAddGuiPermChange = (action: PermissionActions) => {
    setAddGuiPermissions((prev) => ({
      ...prev,
      [action]: !prev[action],
    }));
  };
  const handleAddGuiSelectAll = (checked: boolean) => {
    setAddGuiPermissions({
      [PermissionActions.READ]: checked,
      [PermissionActions.CREATE]: checked,
      [PermissionActions.UPDATE]: checked,
      [PermissionActions.DELETE]: checked,
    });
  };

  const handleConfirmAddGui = async () => {
    if (!selectedRoleName || !addingGui) {
      setShowAddConfirm(false);
      return;
    }
    const makeBy = userName;
    const makeDate = new Date().toISOString();
    const newRole: CreateRoleDtoFrontend = {
      roleName: selectedRoleName,
      hrefGui: addingGui,
      permissions: addGuiPermissions,
      isActive: CRUD_ACTIONS.some((action) => addGuiPermissions[action]),
      makeBy,
      makeDate,
    };

    setIsSubmitting(true);
    try {
      const response = await createRoles([newRole]);
      if (response?.isSuccessful) {
        toast.success("GUI added to role!");
        setShowAddConfirm(false);
        setAddingGui(null);
        // Soft-reload: clear and re-select role to refresh GUIs
        setSelectedRoleName("");
        setTimeout(() => {
          setSelectedRoleName(newRole.roleName);
          setIsSubmitting(false);
        }, 100);
      } else {
        toast.error(response?.message || "Failed to add GUI.");
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Unexpected error occurred.");
      setIsSubmitting(false);
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
              setShowConfirm(true);
            }}
            className="space-y-6"
          >
            {/* Role Name Dropdown */}
            <div className="space-y-2">
              <Label className="py-4">Select Role Name</Label>
              <Select
                value={selectedRoleName}
                onValueChange={setSelectedRoleName}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {roleNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned GUI permissions */}
            <div className="space-y-2">
              <Label>Assigned GUI Permissions</Label>
              <div className="-mx-6 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(permissionsByGui).length === 0 ? (
                    <span className="text-muted-foreground">
                      No assigned GUI yet.
                    </span>
                  ) : (
                    Object.entries(permissionsByGui).map(([hrefGui, perms]) => {
                      const isAllSelected = CRUD_ACTIONS.every((a) => perms[a]);
                      return (
                        <Card
                          key={hrefGui}
                          className="p-4 rounded-2xl shadow-sm min-w-[260px]"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-primary text-sm">
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
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
          {/* Unassigned GUIs - add new */}
          <div className="space-y-2 pt-8">
            <Label>Unassigned GUIs</Label>
            <div className="-mx-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {unassignedGuiNames.length === 0 ? (
                  <span className="text-muted-foreground">
                    All GUIs assigned.
                  </span>
                ) : (
                  unassignedGuiNames.map((gui) => (
                    <Card
                      key={gui}
                      className="p-4 rounded-2xl shadow min-w-[260px] flex items-center justify-between"
                    >
                      <span className="font-semibold text-primary">
                        {formatGuiLabel(gui)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Add to role"
                        onClick={() => handleAddGui(gui)}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Confirm Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the role{" "}
              <strong>{selectedRoleName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConfirm(false);
                handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Yes, Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add GUI to Role Modal */}
      <Dialog open={showAddConfirm} onOpenChange={setShowAddConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign GUI to{" "}
              <span className="text-primary">{selectedRoleName}</span>
            </DialogTitle>
            <DialogDescription>
              Set permissions for{" "}
              <strong>{formatGuiLabel(addingGui || "")}</strong>
            </DialogDescription>
          </DialogHeader>
          {/* Permissions for the new GUI */}
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Permissions</span>
            <div className="flex items-center gap-1">
              <Checkbox
                checked={CRUD_ACTIONS.every((a) => addGuiPermissions[a])}
                onCheckedChange={(checked) => handleAddGuiSelectAll(!!checked)}
                id="addgui-select-all"
              />
              <Label
                htmlFor="addgui-select-all"
                className="text-xs font-normal"
              >
                All
              </Label>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap mb-2">
            {CRUD_ACTIONS.map((action) => (
              <label
                key={action}
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg cursor-pointer ${
                  addGuiPermissions[action]
                    ? "bg-blue-50 text-blue-600"
                    : "bg-muted"
                }`}
              >
                <Checkbox
                  checked={!!addGuiPermissions[action]}
                  onCheckedChange={() => handleAddGuiPermChange(action)}
                  id={`addgui-${action}`}
                />
                <span className="capitalize">{action}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddGui}
              disabled={
                isSubmitting || !CRUD_ACTIONS.some((a) => addGuiPermissions[a])
              }
            >
              {isSubmitting ? "Adding..." : "Add GUI to Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditRole;
