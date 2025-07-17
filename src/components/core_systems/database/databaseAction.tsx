"use client";

import { useState } from "react";
import { DataTable } from "../../table/dataTable";
import { Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllDatabases } from "@/hooks/core_systems/database/useAllDatabases";
import { useDeleteDatabase } from "@/hooks/core_systems/database/useDeleteDatabase";
import { useUpdateDatabase } from "@/hooks/core_systems/database/useUpdateDatabase";
import { DatabaseEdit } from "@/types/database";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";
import { FilePlus2 } from "lucide-react";

export default function DatabaseAction() {
  const { databases, mutate } = useAllDatabases();
  const { osIpAddresses } = useOsIpAddresses();
  const [viewDatabase, setViewDatabase] = useState<DatabaseEdit | null>(null);
  const [editDatabase, setEditDatabase] = useState<DatabaseEdit | null>(null);
  const [deleteDatabaseTarget, setDeleteDatabaseTarget] =
    useState<DatabaseEdit | null>(null);
  const { deleteDatabase } = useDeleteDatabase();
  const { updateDatabase } = useUpdateDatabase();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  const handleDeleteDatabase = async (database: DatabaseEdit) => {
    try {
      await deleteDatabase(database.id);
      setDeleteDatabaseTarget(null);
      setViewDatabase(null);
      mutate();
    } catch (error) {
      console.error("Error deleting database:", error);
    }
  };

  const handleUpdateDatabase = async (updated: DatabaseEdit) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof DatabaseEdit)
        )
      );
      await updateDatabase(updated.id, payload);
      setEditDatabase(null);
      mutate();
    } catch (error) {
      console.error("Error updating database:", error);
    }
  };

  const columns: Column<DatabaseEdit>[] = [
    { key: "dbName", label: "Database Name", type: "text" },
    { key: "virtualIp", label: "Virtual IP", type: "text" },
    { key: "additionalIp", label: "Additional IP", type: "text" },
    { key: "dbInstance", label: "DB Instance", type: "text" },
    { key: "dbVersion", label: "DB Version", type: "text" },
    { key: "rdbmsType", label: "RDBMS Type", type: "text" },
    { key: "dbPort", label: "DB Port", type: "number" },
    { key: "dbStatus", label: "DB Status", type: "text" },
    { key: "dbType", label: "DB Type", type: "text" },
    { key: "dbOwnerEmail", label: "DB Owner Email", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isActive", label: "Is Active", type: "boolean" },
    {
      key: "vmIds",
      label: "VM IPs",
      type: "multiselect",
      options: osIpAddresses.map((vm: any) => ({
        value: vm.id,
        label: vm.osIpAddress,
      })),
    },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/database-server-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2"/> Create Database
          </Button>
        </Link>
      </div>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={databases}
        tableName="database_list"
        onView={(database) => setViewDatabase(database)}
        onEdit={(database) => setEditDatabase(database)}
        onDelete={(database) => setDeleteDatabaseTarget(database)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />
      {viewDatabase && (
        <ViewModal
          row={viewDatabase}
          columns={columns}
          onClose={() => setViewDatabase(null)}
        />
      )}
      {editDatabase && (
        <EditModal
          row={editDatabase}
          columns={columns}
          open={!!editDatabase}
          onClose={() => setEditDatabase(null)}
          onSubmit={handleUpdateDatabase}
        />
      )}
      {deleteDatabaseTarget && (
        <ConfirmDeleteDialog
          row={deleteDatabaseTarget}
          open={!!deleteDatabaseTarget}
          onClose={() => setDeleteDatabaseTarget(null)}
          onConfirm={handleDeleteDatabase}
        />
      )}
      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deleteDatabase(Number(id))));
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
