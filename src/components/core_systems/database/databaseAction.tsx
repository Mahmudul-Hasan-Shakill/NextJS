// "use client";

// import { useState } from "react";
// import { DataTable } from "../../table/dataTable";
// import { Column } from "../../table/dataTable";
// import { ViewModal } from "../../table/modalView";
// import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
// import { EditModal } from "../../table/editModal";
// import { useAllDatabases } from "@/hooks/core_systems/database/useAllDatabases";
// import { useDeleteDatabase } from "@/hooks/core_systems/database/useDeleteDatabase";
// import { useUpdateDatabase } from "@/hooks/core_systems/database/useUpdateDatabase";
// import { DatabaseEdit } from "@/types/database";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
// import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";
// import { FilePlus2 } from "lucide-react";

// export default function DatabaseAction() {
//   const { databases, mutate } = useAllDatabases();
//   const { osIpAddresses } = useOsIpAddresses();
//   const [viewDatabase, setViewDatabase] = useState<DatabaseEdit | null>(null);
//   const [editDatabase, setEditDatabase] = useState<DatabaseEdit | null>(null);
//   const [deleteDatabaseTarget, setDeleteDatabaseTarget] =
//     useState<DatabaseEdit | null>(null);
//   const { deleteDatabase } = useDeleteDatabase();
//   const { updateDatabase } = useUpdateDatabase();
//   const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

//   const handleDeleteDatabase = async (database: DatabaseEdit) => {
//     try {
//       await deleteDatabase(database.id);
//       setDeleteDatabaseTarget(null);
//       setViewDatabase(null);
//       mutate();
//     } catch (error) {
//       console.error("Error deleting database:", error);
//     }
//   };

//   const handleUpdateDatabase = async (updated: DatabaseEdit) => {
//     try {
//       const editableKeys = columns.map((col) => col.key);
//       const payload = Object.fromEntries(
//         Object.entries(updated).filter(([key]) =>
//           editableKeys.includes(key as keyof DatabaseEdit)
//         )
//       );
//       await updateDatabase(updated.id, payload);
//       setEditDatabase(null);
//       mutate();
//     } catch (error) {
//       console.error("Error updating database:", error);
//     }
//   };

//   const columns: Column<DatabaseEdit>[] = [
//     { key: "dbName", label: "Database Name", type: "text" },
//     { key: "virtualIp", label: "Virtual IP", type: "text" },
//     { key: "additionalIp", label: "Additional IP", type: "text" },
//     { key: "dbInstance", label: "DB Instance", type: "text" },
//     { key: "dbVersion", label: "DB Version", type: "text" },
//     { key: "rdbmsType", label: "RDBMS Type", type: "text" },
//     { key: "dbPort", label: "DB Port", type: "number" },
//     { key: "dbStatus", label: "DB Status", type: "text" },
//     { key: "dbType", label: "DB Type", type: "text" },
//     { key: "dbOwnerEmail", label: "DB Owner Email", type: "text" },
//     { key: "remarks", label: "Remarks", type: "textarea" },
//     { key: "isActive", label: "Is Active", type: "boolean" },
//     {
//       key: "vmIds",
//       label: "VM IPs",
//       type: "multiselect",
//       options: osIpAddresses.map((vm: any) => ({
//         value: vm.id,
//         label: vm.osIpAddress,
//       })),
//     },
//   ];

//   return (
//     <div className="w-full p-4 text-[10px]">
//       {/* Header with button */}
//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/database-server-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2"/> Create Database
//           </Button>
//         </Link>
//       </div>
//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={databases}
//         tableName="database_list"
//         onView={(database) => setViewDatabase(database)}
//         onEdit={(database) => setEditDatabase(database)}
//         onDelete={(database) => setDeleteDatabaseTarget(database)}
//         onBulkDelete={(ids) => setBulkDeleteIds(ids)}
//       />
//       {viewDatabase && (
//         <ViewModal
//           row={viewDatabase}
//           columns={columns}
//           onClose={() => setViewDatabase(null)}
//         />
//       )}
//       {editDatabase && (
//         <EditModal
//           row={editDatabase}
//           columns={columns}
//           open={!!editDatabase}
//           onClose={() => setEditDatabase(null)}
//           onSubmit={handleUpdateDatabase}
//         />
//       )}
//       {deleteDatabaseTarget && (
//         <ConfirmDeleteDialog
//           row={deleteDatabaseTarget}
//           open={!!deleteDatabaseTarget}
//           onClose={() => setDeleteDatabaseTarget(null)}
//           onConfirm={handleDeleteDatabase}
//         />
//       )}
//       {bulkDeleteIds.length > 0 && (
//         <ConfirmBulkDeleteDialog
//           ids={bulkDeleteIds}
//           open={bulkDeleteIds.length > 0}
//           onClose={() => setBulkDeleteIds([])}
//           onConfirm={async (ids) => {
//             try {
//               await Promise.all(ids.map((id) => deleteDatabase(Number(id))));
//               setBulkDeleteIds([]);
//               mutate();
//             } catch (error) {
//               console.error("Bulk delete failed:", error);
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, type Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";

import { useAllDatabases } from "@/hooks/core_systems/database/useAllDatabases";
import { useDeleteDatabase } from "@/hooks/core_systems/database/useDeleteDatabase";
import { useUpdateDatabase } from "@/hooks/core_systems/database/useUpdateDatabase";
import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";

import { useDynamicSchema } from "@/hooks/dynamicHooks";
import type { UiSchemaField } from "@/types/dynamic";
import type { DatabaseEdit } from "@/types/database";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";

const TABLE_NAME = "database_entity";

/** Widen local row type so dynamic keys are allowed by Column<T> */
type DbRow = DatabaseEdit & { [key: string]: any };

const STATIC_KEYS: (keyof DatabaseEdit)[] = [
  "dbName",
  "virtualIp",
  "additionalIp",
  "dbInstance",
  "dbVersion",
  "rdbmsType",
  "dbPort",
  "dbStatus",
  "dbType",
  "dbOwnerEmail",
  "remarks",
  "isActive",
  "vmIds",
];

export default function DatabaseAction() {
  const { databases, mutate } = useAllDatabases();
  const { osIpAddresses } = useOsIpAddresses();
  const { updateDatabase } = useUpdateDatabase();
  const { deleteDatabase } = useDeleteDatabase();

  // force-remount DataTable to clear internal selection after delete/bulk-delete
  const [resetSelectionKey, setResetSelectionKey] = useState(0);

  // Load dynamic schema once
  const { data: schema, load: loadSchema } = useDynamicSchema();
  useEffect(() => {
    loadSchema(TABLE_NAME).catch(() =>
      toast.error("Failed to load dynamic schema")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [viewRow, setViewRow] = useState<DbRow | null>(null);
  const [editRow, setEditRow] = useState<DbRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<DbRow | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  /* ----------------------------- Columns ----------------------------- */

  const staticColumns: Column<DbRow>[] = useMemo(
    () => [
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
    ],
    [osIpAddresses]
  );

  const dynamicColumns: Column<DbRow>[] = useMemo(() => {
    if (!schema?.fields?.length) return [];
    const mapType = (ui: UiSchemaField["uiType"]): Column<DbRow>["type"] => {
      switch (ui) {
        case "number":
          return "number";
        case "checkbox":
          return "boolean";
        case "textarea":
          return "textarea";
        case "datetime":
          return "date"; // DataTable/EditField supports 'date' (not 'datetime')
        case "select":
          return "select";
        case "text":
        default:
          return "text";
      }
    };

    return schema.fields.map((f) => ({
      key: f.name as keyof DbRow,
      label: f.required ? `${f.label}` : f.label,
      type: mapType(f.uiType),
      options:
        f.uiType === "select"
          ? f.options.map((o) => ({ value: o.value, label: o.label }))
          : undefined,
    }));
  }, [schema]);

  const columns: Column<DbRow>[] = useMemo(
    () => [...staticColumns, ...dynamicColumns],
    [staticColumns, dynamicColumns]
  );

  /* ------------------------------- Data ------------------------------ */

  // Flatten extras → top-level so DataTable/Modals can read dynamic keys
  const tableData: DbRow[] = useMemo(
    () => (databases || []).map((d: any) => ({ ...d, ...(d.extras || {}) })),
    [databases]
  );

  /* ------------------------------ Helpers ---------------------------- */

  const coerceByUi = (f: UiSchemaField, raw: any) => {
    switch (f.uiType) {
      case "number": {
        if (raw === "" || raw == null) return undefined;
        const n = Number(raw);
        return Number.isFinite(n) ? n : undefined;
      }
      case "checkbox":
        if (typeof raw === "boolean") return raw;
        if (raw === "true") return true;
        if (raw === "false") return false;
        return Boolean(raw);
      case "datetime": {
        if (!raw) return undefined;
        const d = new Date(raw);
        return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
      }
      case "select":
      case "text":
      case "textarea":
      default:
        return raw ?? "";
    }
  };

  /* ------------------------------ Actions ---------------------------- */

  const handleUpdate = async (updated: DbRow) => {
    // Split static vs dynamic from the flattened row
    const stat: Partial<DatabaseEdit> = {};
    for (const k of STATIC_KEYS) {
      if (updated[k] !== undefined) stat[k] = updated[k] as any;
    }

    const extras: Record<string, any> = {};
    (schema?.fields || []).forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(updated, f.name)) {
        extras[f.name] = coerceByUi(f, (updated as any)[f.name]);
      }
    });

    const payload = {
      ...stat,
      ...(Object.keys(extras).length ? { extras } : {}),
    };

    await updateDatabase(updated.id, payload);
    setEditRow(null);
    mutate();
  };

  const handleDelete = async (row: DbRow) => {
    await deleteDatabase(row.id);
    setDeleteRow(null);
    setViewRow(null);
    setResetSelectionKey((k) => k + 1); // clear possible selection UI
    mutate();
  };

  const handleBulkDelete = async (ids: (number | string)[]) => {
    await Promise.all(ids.map((id) => deleteDatabase(Number(id))));
    setBulkDeleteIds([]);
    setResetSelectionKey((k) => k + 1); // ✅ force DataTable remount → clears "Delete Selected"
    mutate();
  };

  /* -------------------------------- UI ------------------------------- */

  return (
    <div className="w-full p-4 text-[10px]">
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/database-server-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Database
          </Button>
        </Link>
      </div>

      <DataTable<DbRow>
        key={resetSelectionKey} // 🔑 remount to reset internal selection after (bulk) deletes
        columns={columns}
        data={tableData}
        tableName="database_list"
        onView={(row) => setViewRow(row)}
        onEdit={(row) => setEditRow(row)}
        onDelete={(row) => setDeleteRow(row)}
        onBulkDelete={setBulkDeleteIds}
      />

      {viewRow && (
        <ViewModal<DbRow>
          row={viewRow}
          columns={columns}
          onClose={() => setViewRow(null)}
        />
      )}

      {editRow && (
        <EditModal<DbRow>
          row={editRow}
          columns={columns}
          open={!!editRow}
          onClose={() => setEditRow(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteRow && (
        <ConfirmDeleteDialog<DbRow>
          row={deleteRow}
          open={!!deleteRow}
          onClose={() => setDeleteRow(null)}
          onConfirm={handleDelete}
        />
      )}

      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={handleBulkDelete}
        />
      )}
    </div>
  );
}
