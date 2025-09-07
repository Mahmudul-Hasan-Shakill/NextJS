"use client";

import { useState } from "react";
import { DataTable } from "../table/dataTable";
import { Column } from "../table/dataTable";
import { useAllUsers } from "@/hooks/user/useAllUsers";
import { useDeleteUser } from "@/hooks/user/useDeleteUser";
import { ConfirmDeleteDialog } from "../table/confirmDeleteDialog";
import { useUpdateUser } from "@/hooks/user/useUpdateUser";
import { useRoleNames } from "@/hooks/role/useRoleNames";
import { EditModal } from "../table/editModal";
import { Register } from "@/types/register";
import { ViewModal } from "../table/modalView";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import MailLoader from "../loader/mailLoader";
import { Button } from "../ui/button";
import Link from "next/link";
import { ConfirmApproveDialog } from "../table/confirmApproveDialog";
import { ConfirmBulkDeleteDialog } from "../table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";

export default function UserAction() {
  const { users, mutate } = useAllUsers();
  const { resetPassword } = useResetPassword();
  const [viewUser, setViewUser] = useState<Register | null>(null);
  const [editUser, setEditUser] = useState<Register | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<Register | null>(
    null
  );
  const [approveUserTarget, setApproveUserTarget] = useState<Register | null>(
    null
  );
  const { deleteUser } = useDeleteUser();
  const { roleNames } = useRoleNames();
  const { updateUser } = useUpdateUser();
  const [showAnimation, setShowAnimation] = useState(false);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  const handleResetPassword = async (user: Register) => {
    setShowAnimation(true);
    try {
      await resetPassword(user.pin);
      mutate();
      setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  const handleApproveUser = async (user: Register) => {
    if (!user.isActive) {
      try {
        await updateUser(user.id, { isActive: true });
        setApproveUserTarget(null);
        mutate();
      } catch (error) {
        console.error("Approval error:", error);
      }
    }
  };

  const handleDeleteUser = async (user: Register) => {
    try {
      await deleteUser(user.id);
      setDeleteUserTarget(null);
      setViewUser(null);
      mutate();
    } catch (error) {}
  };

  const handleUpdateUser = async (updated: Register) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof Register)
        )
      );
      await updateUser(updated.id, payload);
      setEditUser(null);
      mutate();
    } catch (error) {}
  };

  const columns: Column<Register>[] = [
    { key: "pin", label: "Pin", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "unit", label: "Unit", type: "text" },
    {
      key: "userRole",
      label: "Role",
      type: "select",
      fetchOptions: async () => {
        return (
          roleNames?.map((role: string) => ({
            label: role,
            value: role,
          })) ?? []
        );
      },
    },
    { key: "isActive", label: "Active Status", type: "boolean" },
    { key: "isLocked", label: "Lock Status", type: "boolean" },
    { key: "isReset", label: "Reset Status", type: "boolean" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/admin-settings/user-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create User
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={users}
        tableName="user_list"
        onView={(user) => setViewUser(user)}
        onEdit={(user) => setEditUser(user)}
        onDelete={(user) => setDeleteUserTarget(user)}
        showReset={true}
        onReset={handleResetPassword}
        showApprove={true}
        onApprove={(user) => setApproveUserTarget(user)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />

      {viewUser && (
        <ViewModal
          row={viewUser}
          columns={columns}
          onClose={() => setViewUser(null)}
        />
      )}

      {approveUserTarget && (
        <ConfirmApproveDialog
          row={approveUserTarget}
          open={!!approveUserTarget}
          onClose={() => setApproveUserTarget(null)}
          onConfirm={handleApproveUser}
        />
      )}

      {showAnimation && <MailLoader />}

      {editUser && (
        <EditModal
          row={editUser}
          columns={columns}
          open={!!editUser}
          onClose={() => setEditUser(null)}
          onSubmit={handleUpdateUser}
        />
      )}

      {deleteUserTarget && (
        <ConfirmDeleteDialog
          row={deleteUserTarget}
          open={!!deleteUserTarget}
          onClose={() => setDeleteUserTarget(null)}
          onConfirm={handleDeleteUser}
        />
      )}

      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deleteUser(Number(id))));
              setBulkDeleteIds([]);
              mutate();
            } catch (error) {
              console.error("Bulk delete failed:", error);
            }
          }}
        />
      )}
    </div>
  );
}

// /components/user/userAction.tsx
// "use client";

// import { useMemo, useState } from "react";
// import { DataTable, type Column } from "../table/dataTable";
// import { useAllUsers } from "@/hooks/user/useAllUsers";
// import { useDeleteUser } from "@/hooks/user/useDeleteUser";
// import { useUpdateUser } from "@/hooks/user/useUpdateUser";
// import { useRoleNames } from "@/hooks/role/useRoleNames";
// import { useResetPassword } from "@/hooks/auth/useResetPassword";
// import { useUserByPin } from "@/hooks/user/useUserByPin";

// import { ViewModal } from "../table/modalView";
// import { EditModal } from "../table/editModal";
// import { ConfirmDeleteDialog } from "../table/confirmDeleteDialog";
// import { ConfirmApproveDialog } from "../table/confirmApproveDialog";
// import { ConfirmBulkDeleteDialog } from "../table/confirmBulkDeleteDialog";

// import { Button } from "../ui/button";
// import Link from "next/link";
// import { FilePlus2 } from "lucide-react";
// import MailLoader from "../loader/mailLoader";
// import { toast } from "sonner";

// import type { Register } from "@/types/register";

// export default function UserAction() {
//   const { users, mutate } = useAllUsers();
//   const { resetPassword } = useResetPassword();
//   const { deleteUser } = useDeleteUser();
//   const { roleNames } = useRoleNames();
//   const { updateUser } = useUpdateUser();

//   // current logged-in user
//   const me = useUserByPin(); // { id, pin, userRole, unit, ... }

//   // local UI state
//   const [viewUser, setViewUser] = useState<Register | null>(null);
//   const [editUser, setEditUser] = useState<Register | null>(null);
//   const [deleteUserTarget, setDeleteUserTarget] = useState<Register | null>(
//     null
//   );
//   const [approveUserTarget, setApproveUserTarget] = useState<Register | null>(
//     null
//   );
//   const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
//   const [showAnimation, setShowAnimation] = useState(false);

//   /** helpers */
//   const isRootRole = (role?: string) =>
//     (role ?? "").trim().toLowerCase() === "root";
//   const iAmRoot = isRootRole(me?.userRole);
//   const isSelf = (row: any) => me?.id && row?.id === me.id;
//   const isRootRow = (row: any) => isRootRole(row?.userRole);

//   /** client-side visibility guard (extra safety/UX):
//    * - Non-root users must NOT see any root users in the grid
//    * - Root sees all
//    */
//   const safeUsers: Register[] = useMemo(() => {
//     if (!users) return [];
//     if (iAmRoot) return users;
//     return users.filter((u) => !isRootRow(u));
//   }, [users, iAmRoot]);

//   /** columns */
//   const columns: Column<Register>[] = useMemo(
//     () => [
//       { key: "pin", label: "Pin", type: "text" },
//       { key: "name", label: "Name", type: "text" },
//       { key: "email", label: "Email", type: "email" },
//       {
//         key: "userRole",
//         label: "Role",
//         type: "select",
//         fetchOptions: async () =>
//           (roleNames ?? []).map((role: string) => ({
//             label: role,
//             value: role,
//           })),
//       },
//       { key: "isActive", label: "Active Status", type: "boolean" },
//       { key: "isLocked", label: "Lock Status", type: "boolean" },
//       { key: "isReset", label: "Reset Status", type: "boolean" },
//     ],
//     [roleNames]
//   );

//   /** action guards with friendly messages */
//   const guardNotSelf = (row: Register, action: string) => {
//     if (isSelf(row)) {
//       toast.info(
//         `You cannot ${action} your own account here. Use the Profile page.`
//       );
//       return false;
//     }
//     return true;
//   };
//   const guardNotRootWhenNonRoot = (row: Register, action: string) => {
//     if (!iAmRoot && isRootRow(row)) {
//       toast.warning(`Only root can ${action} a root user.`);
//       return false;
//     }
//     return true;
//   };

//   /** handlers */
//   const handleResetPassword = async (user: Register) => {
//     if (!guardNotSelf(user, "reset password")) return;
//     if (!guardNotRootWhenNonRoot(user, "reset password for")) return;

//     setShowAnimation(true);
//     try {
//       await resetPassword(user.pin);
//       mutate();
//     } catch (error) {
//       console.error("Reset failed:", error);
//     } finally {
//       setTimeout(() => setShowAnimation(false), 1200);
//     }
//   };

//   const handleApproveUser = async (user: Register) => {
//     if (!guardNotSelf(user, "approve")) return;
//     if (!guardNotRootWhenNonRoot(user, "approve")) return;

//     if (!user.isActive) {
//       try {
//         await updateUser(user.id, { isActive: true });
//         setApproveUserTarget(null);
//         mutate();
//       } catch (error) {
//         console.error("Approval error:", error);
//       }
//     } else {
//       toast.info("User is already active.");
//     }
//   };

//   const handleDeleteUser = async (user: Register) => {
//     if (!guardNotSelf(user, "delete")) return;
//     if (!guardNotRootWhenNonRoot(user, "delete")) return;

//     try {
//       await deleteUser(user.id);
//       setDeleteUserTarget(null);
//       setViewUser(null);
//       mutate();
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   };

//   const handleUpdateUser = async (updated: Register) => {
//     if (!guardNotSelf(updated, "update")) return;
//     if (!guardNotRootWhenNonRoot(updated, "update")) return;

//     try {
//       const editableKeys = columns.map((c) => c.key);
//       const payload = Object.fromEntries(
//         Object.entries(updated).filter(([key]) =>
//           editableKeys.includes(key as keyof Register)
//         )
//       );
//       await updateUser(updated.id, payload);
//       setEditUser(null);
//       mutate();
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   /** bulk delete: filter out self and (if non-root) any root IDs */
//   const handleBulkDeleteConfirm = async (ids: (number | string)[]) => {
//     // We may only have IDs; derive rows to enforce rules
//     const idSet = new Set(ids);
//     const targetRows = safeUsers.filter((u) => idSet.has(u.id));

//     const blocked: number[] = [];
//     const allowedIds: number[] = [];

//     for (const row of targetRows) {
//       if (!guardNotSelf(row, "bulk-delete")) {
//         blocked.push(row.id);
//         continue;
//       }
//       if (!guardNotRootWhenNonRoot(row, "bulk-delete")) {
//         blocked.push(row.id);
//         continue;
//       }
//       allowedIds.push(row.id);
//     }

//     if (blocked.length) {
//       toast.warning(
//         `Some users were skipped (self/root protected): ${blocked.join(", ")}`
//       );
//     }

//     if (!allowedIds.length) {
//       setBulkDeleteIds([]);
//       return;
//     }

//     try {
//       // delete in parallel
//       await Promise.all(allowedIds.map((id) => deleteUser(Number(id))));
//       toast.success(`Deleted ${allowedIds.length} user(s).`);
//       setBulkDeleteIds([]);
//       mutate();
//     } catch (error) {
//       console.error("Bulk delete failed:", error);
//     }
//   };

//   return (
//     <div className="w-full p-4 text-[10px]">
//       {/* Header with button */}
//       <div className="flex justify-end mb-4">
//         <Link href="/admin-settings/user-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create User
//           </Button>
//         </Link>
//       </div>

//       <DataTable<Register>
//         columns={columns}
//         data={safeUsers}
//         tableName="user_list"
//         onView={(user) => setViewUser(user)}
//         onEdit={(user) => {
//           if (!guardNotSelf(user, "edit")) return;
//           if (!guardNotRootWhenNonRoot(user, "edit")) return;
//           setEditUser(user);
//         }}
//         onDelete={(user) => {
//           if (!guardNotSelf(user, "delete")) return;
//           if (!guardNotRootWhenNonRoot(user, "delete")) return;
//           setDeleteUserTarget(user);
//         }}
//         showReset={true}
//         onReset={(user) => handleResetPassword(user)}
//         showApprove={true}
//         onApprove={(user) => setApproveUserTarget(user)}
//         onBulkDelete={(ids) => setBulkDeleteIds(ids)}
//       />

//       {viewUser && (
//         <ViewModal<Register>
//           row={viewUser}
//           columns={columns}
//           onClose={() => setViewUser(null)}
//         />
//       )}

//       {approveUserTarget && (
//         <ConfirmApproveDialog<Register>
//           row={approveUserTarget}
//           open={!!approveUserTarget}
//           onClose={() => setApproveUserTarget(null)}
//           onConfirm={handleApproveUser}
//         />
//       )}

//       {showAnimation && <MailLoader />}

//       {editUser && (
//         <EditModal<Register>
//           row={editUser}
//           columns={columns}
//           open={!!editUser}
//           onClose={() => setEditUser(null)}
//           onSubmit={handleUpdateUser}
//         />
//       )}

//       {deleteUserTarget && (
//         <ConfirmDeleteDialog<Register>
//           row={deleteUserTarget}
//           open={!!deleteUserTarget}
//           onClose={() => setDeleteUserTarget(null)}
//           onConfirm={handleDeleteUser}
//         />
//       )}

//       {bulkDeleteIds.length > 0 && (
//         <ConfirmBulkDeleteDialog
//           ids={bulkDeleteIds}
//           open={bulkDeleteIds.length > 0}
//           onClose={() => setBulkDeleteIds([])}
//           onConfirm={handleBulkDeleteConfirm}
//         />
//       )}
//     </div>
//   );
// }
