"use client";

import { useState } from "react";
import { DataTable } from "./table";
import { Column } from "./table";
import { useAllUsers, User } from "@/hooks/useAllUsers";
import { ViewModal } from "./viewModal";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { useRoleNames } from "@/hooks/useRoleNames";
import { EditModal } from "./EditModal";

export default function UsersPage() {
  const { users, mutate } = useAllUsers();
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);
  const { deleteUser } = useDeleteUser();
  const { roleNames } = useRoleNames();
  const { updateUser, loading } = useUpdateUser();

  const handleDeleteUser = async (user: User) => {
    try {
      await deleteUser(user.id);
      setDeleteUserTarget(null);
      setViewUser(null);
      mutate();
    } catch (error) {}
  };

  const handleUpdateUser = async (updated: User) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof User)
        )
      );
      await updateUser(updated.id, payload);
      setEditUser(null);
      mutate();
    } catch (error) {}
  };

  const columns: Column<User>[] = [
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
    <div className="w-full px-4 py-6">
      <DataTable
        columns={columns}
        data={users}
        tableName="user_list"
        onView={(user) => setViewUser(user)}
        onEdit={(user) => setEditUser(user)}
        onDelete={(user) => setDeleteUserTarget(user)}
      />

      {viewUser && (
        <ViewModal
          row={viewUser}
          columns={columns}
          onClose={() => setViewUser(null)}
        />
      )}

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
