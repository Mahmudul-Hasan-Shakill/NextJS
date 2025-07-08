"use client";

import { useState } from "react";
import { DataTable } from "../table/dataTable";
import { Column } from "../table/dataTable";
import { useAllUsers } from "@/hooks/useAllUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { ConfirmDeleteDialog } from "../table/confirmDeleteDialog";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useRoleNames } from "@/hooks/useRoleNames";
import { EditModal } from "../table/editModal";
import { Register } from "@/types/register";
import { ViewModal } from "../table/modalView";
import { useResetPassword } from "@/hooks/useResetPassword";
import MailLoader from "../loader/mailLoader";
import { Button } from "../ui/button";
import Link from "next/link";
import { ConfirmApproveDialog } from "../table/confirmApproveDialog";

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
            + Create User
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
    </div>
  );
}
