// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { DataTable, type Column } from "@/components/table/dataTable";
// import { ViewModal } from "@/components/table/modalView";
// import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
// import { EditModal } from "@/components/table/editModal";

// import { useAllFilesystems } from "@/hooks/core_systems/filesystem/useAllFilesystems";
// import { useDeleteFilesystem } from "@/hooks/core_systems/filesystem/useDeleteFilesystem";
// import { useUpdateFilesystem } from "@/hooks/core_systems/filesystem/useUpdateFilesystem";

// import { useDynamicSchema } from "@/hooks/dynamicHooks";
// import type { UiSchemaField } from "@/types/dynamic";
// import type { FilesystemEdit } from "@/types/filesystem";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
// import { FilePlus2 } from "lucide-react";
// import { toast } from "sonner";

// const TABLE_NAME = "filesystem_entity";

// type FsRow = FilesystemEdit & { [key: string]: any };

// const STATIC_KEYS: (keyof FilesystemEdit)[] = [
//   "application",
//   "node",
//   "ipAddress",
//   "backupEnvironment",
//   "backupType",
//   "subClientName",
//   "contentDetails",
//   "scheduleType",
//   "backupSchedule",
//   "storagePolicy",
//   "backupStartTime",
//   "backupEndTime",
//   "fullBackupSize",
//   "retention",
//   "isActive",
// ];

// const mapUiType = (ui: UiSchemaField["uiType"]): Column<FsRow>["type"] => {
//   switch (ui) {
//     case "number":
//       return "number";
//     case "checkbox":
//       return "boolean";
//     case "textarea":
//       return "textarea";
//     case "datetime":
//       return "date";
//     case "select":
//       return "select";
//     default:
//       return "text";
//   }
// };

// const coerceByUi = (f: UiSchemaField, raw: any) => {
//   switch (f.uiType) {
//     case "number": {
//       if (raw === "" || raw == null) return undefined;
//       const n = Number(raw);
//       return Number.isFinite(n) ? n : undefined;
//     }
//     case "checkbox":
//       if (typeof raw === "boolean") return raw;
//       if (raw === "true") return true;
//       if (raw === "false") return false;
//       return Boolean(raw);
//     case "datetime": {
//       if (!raw) return undefined;
//       const d = new Date(raw);
//       return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
//     }
//     default:
//       return raw ?? "";
//   }
// };

// export default function FilesystemAction() {
//   const { filesystems, mutate } = useAllFilesystems();
//   const { updateFilesystem } = useUpdateFilesystem();
//   const { deleteFilesystem } = useDeleteFilesystem();
//   const { data: schema, load: loadSchema } = useDynamicSchema();

//   const [viewRow, setViewRow] = useState<FsRow | null>(null);
//   const [editRow, setEditRow] = useState<FsRow | null>(null);
//   const [deleteRow, setDeleteRow] = useState<FsRow | null>(null);
//   const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
//   const [resetSelectionKey, setResetSelectionKey] = useState(0);

//   useEffect(() => {
//     loadSchema(TABLE_NAME).catch(() =>
//       toast.error("Failed to load dynamic schema")
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const staticColumns: Column<FsRow>[] = useMemo(
//     () => [
//       { key: "application", label: "Application", type: "text" },
//       { key: "node", label: "Node", type: "text" },
//       { key: "ipAddress", label: "IP Address", type: "text" },
//       { key: "backupEnvironment", label: "Backup Environment", type: "text" },
//       { key: "backupType", label: "Backup Type", type: "text" },
//       { key: "subClientName", label: "Sub Client Name", type: "text" },
//       { key: "scheduleType", label: "Schedule Type", type: "text" },
//       { key: "backupSchedule", label: "Full Backup", type: "text" },
//       { key: "storagePolicy", label: "Storage Policy", type: "text" },
//       { key: "backupStartTime", label: "Backup Start", type: "time" },
//       { key: "backupEndTime", label: "Backup End", type: "time" },
//       { key: "fullBackupSize", label: "Full Backup Size", type: "text" },
//       { key: "retention", label: "Retention", type: "text" },
//       { key: "contentDetails", label: "Content Details", type: "textarea" },
//       { key: "isActive", label: "Is Active", type: "boolean" },
//     ],
//     []
//   );

//   const dynamicColumns: Column<FsRow>[] = useMemo(() => {
//     if (!schema?.fields) return [];
//     return schema.fields.map((f) => ({
//       key: f.name as keyof FsRow,
//       label: f.required ? `${f.label}` : f.label,
//       type: mapUiType(f.uiType),
//       options:
//         f.uiType === "select"
//           ? f.options.map((o) => ({ value: o.value, label: o.label }))
//           : undefined,
//     }));
//   }, [schema]);

//   const columns: Column<FsRow>[] = useMemo(
//     () => [...staticColumns, ...dynamicColumns],
//     [staticColumns, dynamicColumns]
//   );

//   const tableData: FsRow[] = useMemo(
//     () => (filesystems || []).map((r: any) => ({ ...r, ...(r.extras || {}) })),
//     [filesystems]
//   );

//   const handleUpdate = async (updated: FsRow) => {
//     const stat: Partial<FilesystemEdit> = {};
//     for (const k of STATIC_KEYS) {
//       if (updated[k] !== undefined) stat[k] = updated[k] as any;
//     }

//     const extras: Record<string, any> = {};
//     (schema?.fields || []).forEach((f) => {
//       if (Object.prototype.hasOwnProperty.call(updated, f.name)) {
//         extras[f.name] = coerceByUi(f, (updated as any)[f.name]);
//       }
//     });

//     const payload = {
//       ...stat,
//       ...(Object.keys(extras).length ? { extras } : {}),
//     };
//     await updateFilesystem(updated.id, payload);
//     setEditRow(null);
//     mutate();
//   };

//   const handleDelete = async (row: FsRow) => {
//     await deleteFilesystem(row.id);
//     setDeleteRow(null);
//     setViewRow(null);
//     setResetSelectionKey((k) => k + 1);
//     mutate();
//   };

//   const handleBulkDelete = async (ids: (number | string)[]) => {
//     await Promise.all(ids.map((id) => deleteFilesystem(Number(id))));
//     setBulkDeleteIds([]);
//     setResetSelectionKey((k) => k + 1); // ✅ clear "Delete Selected" state
//     mutate();
//   };

//   return (
//     <div className="w-full p-4 text-[10px]">
//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/filesystem-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create Filesystem
//           </Button>
//         </Link>
//       </div>

//       <DataTable<FsRow>
//         key={resetSelectionKey}
//         columns={columns}
//         data={tableData}
//         tableName="filesystem_list"
//         onView={(row) => setViewRow(row)}
//         onEdit={(row) => setEditRow(row)}
//         onDelete={(row) => setDeleteRow(row)}
//         onBulkDelete={setBulkDeleteIds}
//       />

//       {viewRow && (
//         <ViewModal<FsRow>
//           row={viewRow}
//           columns={columns}
//           onClose={() => setViewRow(null)}
//         />
//       )}

//       {editRow && (
//         <EditModal<FsRow>
//           row={editRow}
//           columns={columns}
//           open={!!editRow}
//           onClose={() => setEditRow(null)}
//           onSubmit={handleUpdate}
//         />
//       )}

//       {deleteRow && (
//         <ConfirmDeleteDialog<FsRow>
//           row={deleteRow}
//           open={!!deleteRow}
//           onClose={() => setDeleteRow(null)}
//           onConfirm={handleDelete}
//         />
//       )}

//       {bulkDeleteIds.length > 0 && (
//         <ConfirmBulkDeleteDialog
//           ids={bulkDeleteIds}
//           open={bulkDeleteIds.length > 0}
//           onClose={() => setBulkDeleteIds([])}
//           onConfirm={handleBulkDelete}
//         />
//       )}
//     </div>
//   );
// }

// // /components/core_systems/filesystem/filesystemAction.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { DataTable, type Column } from "@/components/table/dataTable";
// import { ViewModal } from "@/components/table/modalView";
// import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
// import { EditModal } from "@/components/table/editModal";
// import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";

// import { useAllFilesystems } from "@/hooks/core_systems/filesystem/useAllFilesystems";
// import { useDeleteFilesystem } from "@/hooks/core_systems/filesystem/useDeleteFilesystem";
// import { useUpdateFilesystem } from "@/hooks/core_systems/filesystem/useUpdateFilesystem";

// import { useDynamicSchema } from "@/hooks/dynamicHooks";
// import type { UiSchemaField } from "@/types/dynamic";
// import type { FilesystemEdit } from "@/types/filesystem";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { FilePlus2 } from "lucide-react";
// import { toast } from "sonner";

// const TABLE_NAME = "filesystem_entity";

// type FsRow = FilesystemEdit & { [key: string]: any };

// // --- helpers for CSV<->array (weekly/monthly)
// const splitCsv = (s: string | undefined | null) =>
//   (s ?? "")
//     .split(",")
//     .map((x) => x.trim())
//     .filter(Boolean);

// const joinCsv = (v: any) => (Array.isArray(v) ? v.join(",") : v ?? "");

// // Days
// const DAYS_OF_WEEK = [
//   { value: "Monday", label: "Monday" },
//   { value: "Tuesday", label: "Tuesday" },
//   { value: "Wednesday", label: "Wednesday" },
//   { value: "Thursday", label: "Thursday" },
//   { value: "Friday", label: "Friday" },
//   { value: "Saturday", label: "Saturday" },
//   { value: "Sunday", label: "Sunday" },
// ];
// const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => {
//   const d = String(i + 1);
//   return { value: d, label: `Day ${d}` };
// });

// const scheduleModeFrom = (t?: string) => {
//   const v = (t || "").toLowerCase();
//   if (v.includes("weekly")) return "WEEKLY";
//   if (v.includes("monthly")) return "MONTHLY";
//   if (v.includes("yearly")) return "YEARLY";
//   if (v.includes("daily full")) return "DAILY";
//   return "NONE";
// };

// const STATIC_KEYS: (keyof FilesystemEdit)[] = [
//   "application",
//   "node",
//   "ipAddress",
//   "backupEnvironment",
//   "backupType",
//   "subClientName",
//   "contentDetails",
//   "scheduleType",
//   "backupSchedule",
//   "storagePolicy",
//   "backupStartTime",
//   "backupEndTime",
//   "fullBackupSize",
//   "retention",
//   "isActive",
// ];

// // map UI for dynamic extras
// const mapUiType = (ui: UiSchemaField["uiType"]): Column<FsRow>["type"] => {
//   switch (ui) {
//     case "number":
//       return "number";
//     case "checkbox":
//       return "boolean";
//     case "textarea":
//       return "textarea";
//     case "datetime":
//       return "date";
//     case "select":
//       return "select";
//     default:
//       return "text";
//   }
// };

// const coerceByUi = (f: UiSchemaField, raw: any) => {
//   switch (f.uiType) {
//     case "number": {
//       if (raw === "" || raw == null) return undefined;
//       const n = Number(raw);
//       return Number.isFinite(n) ? n : undefined;
//     }
//     case "checkbox":
//       if (typeof raw === "boolean") return raw;
//       if (raw === "true") return true;
//       if (raw === "false") return false;
//       return Boolean(raw);
//     case "datetime": {
//       if (!raw) return undefined;
//       const d = new Date(raw);
//       return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
//     }
//     default:
//       return raw ?? "";
//   }
// };

// export default function FilesystemAction() {
//   const { filesystems, mutate } = useAllFilesystems();
//   const { updateFilesystem } = useUpdateFilesystem();
//   const { deleteFilesystem } = useDeleteFilesystem();
//   const { data: schema, load: loadSchema } = useDynamicSchema();

//   const [viewRow, setViewRow] = useState<FsRow | null>(null);
//   const [editRow, setEditRow] = useState<FsRow | null>(null);
//   const [deleteRow, setDeleteRow] = useState<FsRow | null>(null);
//   const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
//   const [resetSelectionKey, setResetSelectionKey] = useState(0);

//   useEffect(() => {
//     loadSchema(TABLE_NAME).catch(() =>
//       toast.error("Failed to load dynamic schema")
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Table display columns (keep backupSchedule as text in the grid)
//   const staticColumns: Column<FsRow>[] = useMemo(
//     () => [
//       { key: "application", label: "Application", type: "text" },
//       { key: "node", label: "Node", type: "text" },
//       { key: "ipAddress", label: "IP Address", type: "text" },
//       { key: "backupEnvironment", label: "Backup Environment", type: "text" },
//       { key: "backupType", label: "Backup Type", type: "text" },
//       { key: "subClientName", label: "Sub Client Name", type: "text" },
//       { key: "scheduleType", label: "Schedule Type", type: "text" },
//       { key: "backupSchedule", label: "Backup Schedule", type: "text" },
//       { key: "storagePolicy", label: "Storage Policy", type: "text" },
//       { key: "backupStartTime", label: "Backup Start", type: "time" },
//       { key: "backupEndTime", label: "Backup End", type: "time" },
//       { key: "fullBackupSize", label: "Full Backup Size", type: "text" },
//       { key: "retention", label: "Retention", type: "text" },
//       { key: "contentDetails", label: "Content Details", type: "textarea" },
//       { key: "isActive", label: "Is Active", type: "boolean" },
//     ],
//     []
//   );

//   // Dynamic columns (extras)
//   const dynamicColumns: Column<FsRow>[] = useMemo(() => {
//     if (!schema?.fields) return [];
//     return schema.fields.map((f) => ({
//       key: f.name as keyof FsRow,
//       label: f.label,
//       type: mapUiType(f.uiType),
//       options:
//         f.uiType === "select"
//           ? f.options.map((o) => ({ value: o.value, label: o.label }))
//           : undefined,
//     }));
//   }, [schema]);

//   const columns: Column<FsRow>[] = useMemo(
//     () => [...staticColumns, ...dynamicColumns],
//     [staticColumns, dynamicColumns]
//   );

//   const tableData: FsRow[] = useMemo(
//     () => (filesystems || []).map((r: any) => ({ ...r, ...(r.extras || {}) })),
//     [filesystems]
//   );

//   // Build columns specifically for the edit modal to switch the editor for backupSchedule
//   const columnsForEditModal: Column<FsRow>[] = useMemo(() => {
//     if (!editRow) return columns;

//     const mode = scheduleModeFrom(editRow.scheduleType);
//     const overrideBackupSchedule: Column<FsRow> | null =
//       mode === "WEEKLY"
//         ? {
//             key: "backupSchedule",
//             label: "Backup Day (Weekly)",
//             type: "multiselect",
//             options: DAYS_OF_WEEK,
//           }
//         : mode === "MONTHLY"
//         ? {
//             key: "backupSchedule",
//             label: "Backup Day of Month",
//             type: "multiselect",
//             options: DAYS_OF_MONTH,
//           }
//         : mode === "YEARLY"
//         ? {
//             key: "backupSchedule",
//             label: "Backup Date (Yearly)",
//             type: "date",
//           }
//         : mode === "DAILY"
//         ? {
//             key: "backupSchedule",
//             label: "Full Backup",
//             type: "text",
//           }
//         : null;

//     if (!overrideBackupSchedule) return columns;

//     // replace only the backupSchedule column for the modal
//     return columns.map((c) =>
//       c.key === "backupSchedule" ? overrideBackupSchedule : c
//     );
//   }, [columns, editRow]);

//   // Normalize row for modal (multiselect expects an array when WEEKLY/MONTHLY)
//   const editRowNormalized: FsRow | null = useMemo(() => {
//     if (!editRow) return null;
//     const mode = scheduleModeFrom(editRow.scheduleType);
//     if (mode === "WEEKLY" || mode === "MONTHLY") {
//       return {
//         ...editRow,
//         backupSchedule: splitCsv(editRow.backupSchedule as any) as any,
//       };
//     }
//     return editRow;
//   }, [editRow]);

//   const handleUpdate = async (updated: FsRow) => {
//     // Ensure backupSchedule is a CSV string in payload
//     const mode = scheduleModeFrom(updated.scheduleType as any);
//     let bs: any = updated.backupSchedule as any;
//     if (mode === "WEEKLY" || mode === "MONTHLY") {
//       bs = joinCsv(bs);
//     } else if (bs == null) {
//       bs = "";
//     } else {
//       bs = String(bs);
//     }

//     // split static & dynamic
//     const stat: Partial<FilesystemEdit> = {};
//     for (const k of STATIC_KEYS) {
//       if (updated[k] !== undefined) (stat as any)[k] = updated[k];
//     }
//     (stat as any).backupSchedule = bs;

//     const extras: Record<string, any> = {};
//     (schema?.fields || []).forEach((f) => {
//       if (Object.prototype.hasOwnProperty.call(updated, f.name)) {
//         extras[f.name] = coerceByUi(f, (updated as any)[f.name]);
//       }
//     });

//     const payload = {
//       ...stat,
//       ...(Object.keys(extras).length ? { extras } : {}),
//     };

//     await updateFilesystem(updated.id, payload);
//     setEditRow(null);
//     mutate();
//   };

//   const handleDelete = async (row: FsRow) => {
//     await deleteFilesystem(row.id);
//     setDeleteRow(null);
//     setViewRow(null);
//     setResetSelectionKey((k) => k + 1);
//     mutate();
//   };

//   const handleBulkDelete = async (ids: (number | string)[]) => {
//     await Promise.all(ids.map((id) => deleteFilesystem(Number(id))));
//     setBulkDeleteIds([]);
//     setResetSelectionKey((k) => k + 1);
//     mutate();
//   };

//   return (
//     <div className="w-full p-4 text-[10px]">
//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/filesystem-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create Filesystem
//           </Button>
//         </Link>
//       </div>

//       <DataTable<FsRow>
//         key={resetSelectionKey}
//         columns={columns}
//         data={tableData}
//         tableName="filesystem_list"
//         onView={(row) => setViewRow(row)}
//         onEdit={(row) => setEditRow(row)}
//         onDelete={(row) => setDeleteRow(row)}
//         onBulkDelete={setBulkDeleteIds}
//       />

//       {viewRow && (
//         <ViewModal<FsRow>
//           row={viewRow}
//           columns={columns}
//           onClose={() => setViewRow(null)}
//         />
//       )}

//       {editRow && (
//         <EditModal<FsRow>
//           row={editRowNormalized ?? editRow}
//           columns={columnsForEditModal}
//           open={!!editRow}
//           onClose={() => setEditRow(null)}
//           onSubmit={handleUpdate}
//         />
//       )}

//       {deleteRow && (
//         <ConfirmDeleteDialog<FsRow>
//           row={deleteRow}
//           open={!!deleteRow}
//           onClose={() => setDeleteRow(null)}
//           onConfirm={handleDelete}
//         />
//       )}

//       {bulkDeleteIds.length > 0 && (
//         <ConfirmBulkDeleteDialog
//           ids={bulkDeleteIds}
//           open={bulkDeleteIds.length > 0}
//           onClose={() => setBulkDeleteIds([])}
//           onConfirm={handleBulkDelete}
//         />
//       )}
//     </div>
//   );
// }

///components/core_systems/filesystem/filesystemAction.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/table/dataTable";
import { ViewModal } from "@/components/table/modalView";
import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
import { EditModal } from "@/components/table/editModal";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";

import { useAllFilesystems } from "@/hooks/core_systems/filesystem/useAllFilesystems";
import { useDeleteFilesystem } from "@/hooks/core_systems/filesystem/useDeleteFilesystem";
import { useUpdateFilesystem } from "@/hooks/core_systems/filesystem/useUpdateFilesystem";

import { useDynamicSchema } from "@/hooks/dynamicHooks";
import type { UiSchemaField } from "@/types/dynamic";
import type { FilesystemEdit } from "@/types/filesystem";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";

const TABLE_NAME = "filesystem_entity";

/** 👇 Allow array during edit (local to this page only) */
type FsRow = Omit<FilesystemEdit, "backupSchedule"> & {
  backupSchedule: string | string[];
} & { [key: string]: any };

// --- helpers for CSV<->array
const splitCsv = (s: string | undefined | null) =>
  (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const joinCsv = (v: any) => (Array.isArray(v) ? v.join(",") : v ?? "");

// Schedule options
const SCHEDULE_TYPES = [
  { value: "Daily Full", label: "Daily Full" },
  { value: "Weekly Full", label: "Weekly Full" },
  { value: "Monthly Full", label: "Monthly Full" },
  { value: "Yearly Full", label: "Yearly Full" },
  {
    value: "Daily Incremental + Weekly Full",
    label: "Daily Incremental + Weekly Full",
  },
  {
    value: "Daily Incremental + Monthly Full",
    label: "Daily Incremental + Monthly Full",
  },
  {
    value: "Daily Incremental + Yearly Full",
    label: "Daily Incremental + Yearly Full",
  },
];

// Days
const DAYS_OF_WEEK = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => {
  const d = String(i + 1);
  return { value: d, label: `Day ${d}` };
});

const scheduleModeFrom = (t?: string) => {
  const v = (t || "").toLowerCase();
  if (v.includes("weekly")) return "WEEKLY";
  if (v.includes("monthly")) return "MONTHLY";
  if (v.includes("yearly")) return "YEARLY";
  if (v.includes("daily full")) return "DAILY";
  return "NONE";
};

const STATIC_KEYS: (keyof FilesystemEdit)[] = [
  "application",
  "node",
  "ipAddress",
  "backupEnvironment",
  "backupType",
  "subClientName",
  "contentDetails",
  "scheduleType",
  "backupSchedule",
  "storagePolicy",
  "backupStartTime",
  "backupEndTime",
  "fullBackupSize",
  "retention",
  "isActive",
];

// map UI for dynamic extras
const mapUiType = (ui: UiSchemaField["uiType"]): Column<FsRow>["type"] => {
  switch (ui) {
    case "number":
      return "number";
    case "checkbox":
      return "boolean";
    case "textarea":
      return "textarea";
    case "datetime":
      return "date";
    case "select":
      return "select";
    default:
      return "text";
  }
};

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
    default:
      return raw ?? "";
  }
};

export default function FilesystemAction() {
  const { filesystems, mutate } = useAllFilesystems();
  const { updateFilesystem } = useUpdateFilesystem();
  const { deleteFilesystem } = useDeleteFilesystem();
  const { data: schema, load: loadSchema } = useDynamicSchema();

  const [viewRow, setViewRow] = useState<FsRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<FsRow | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
  const [resetSelectionKey, setResetSelectionKey] = useState(0);

  // edit modal state
  const [editRow, setEditRow] = useState<FsRow | null>(null);
  const [editDraft, setEditDraft] = useState<FsRow | null>(null);

  useEffect(() => {
    loadSchema(TABLE_NAME).catch(() =>
      toast.error("Failed to load dynamic schema")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Grid columns (simple render; edits are handled in modal columns)
  const staticColumns: Column<FsRow>[] = useMemo(
    () => [
      { key: "application", label: "Application", type: "text" },
      { key: "node", label: "Node", type: "text" },
      { key: "ipAddress", label: "IP Address", type: "text" },
      { key: "backupEnvironment", label: "Backup Environment", type: "text" },
      { key: "backupType", label: "Backup Type", type: "text" },
      { key: "subClientName", label: "Sub Client Name", type: "text" },
      { key: "scheduleType", label: "Schedule Type", type: "text" },
      { key: "backupSchedule", label: "Backup Schedule", type: "text" },
      { key: "storagePolicy", label: "Storage Policy", type: "text" },
      { key: "backupStartTime", label: "Backup Start", type: "time" },
      { key: "backupEndTime", label: "Backup End", type: "time" },
      { key: "fullBackupSize", label: "Full Backup Size", type: "text" },
      { key: "retention", label: "Retention", type: "text" },
      { key: "contentDetails", label: "Content Details", type: "textarea" },
      { key: "isActive", label: "Is Active", type: "boolean" },
    ],
    []
  );

  // Dynamic (extras)
  const dynamicColumns: Column<FsRow>[] = useMemo(() => {
    if (!schema?.fields) return [];
    return schema.fields.map((f) => ({
      key: f.name as keyof FsRow,
      label: f.label,
      type: mapUiType(f.uiType),
      options:
        f.uiType === "select"
          ? f.options.map((o) => ({ value: o.value, label: o.label }))
          : undefined,
    }));
  }, [schema]);

  const columns: Column<FsRow>[] = useMemo(
    () => [...staticColumns, ...dynamicColumns],
    [staticColumns, dynamicColumns]
  );

  const tableData: FsRow[] = useMemo(
    () => (filesystems || []).map((r: any) => ({ ...r, ...(r.extras || {}) })),
    [filesystems]
  );

  /** Prepare draft when opening edit */
  const openEdit = (row: FsRow) => {
    const mode = scheduleModeFrom(row.scheduleType);
    const draft =
      mode === "WEEKLY" || mode === "MONTHLY"
        ? ({
            ...row,
            backupSchedule: splitCsv(row.backupSchedule as string),
          } as FsRow)
        : ({ ...row } as FsRow);
    setEditRow(row);
    setEditDraft(draft);
  };

  /** Live columns for edit based on draft.scheduleType */
  const columnsForEditModal: Column<FsRow>[] = useMemo(() => {
    const base = columns.map((c) => ({ ...c }));

    // override scheduleType and backupSchedule for editing
    const idxScheduleType = base.findIndex((c) => c.key === "scheduleType");
    if (idxScheduleType >= 0) {
      base[idxScheduleType] = {
        key: "scheduleType",
        label: "Schedule Type",
        type: "select",
        options: SCHEDULE_TYPES,
      };
    }

    const mode = scheduleModeFrom(
      editDraft?.scheduleType as string | undefined
    );
    const idxBackup = base.findIndex((c) => c.key === "backupSchedule");
    if (idxBackup >= 0) {
      if (mode === "WEEKLY") {
        base[idxBackup] = {
          key: "backupSchedule",
          label: "Backup Day (Weekly)",
          type: "multiselect",
          options: DAYS_OF_WEEK,
        };
      } else if (mode === "MONTHLY") {
        base[idxBackup] = {
          key: "backupSchedule",
          label: "Backup Day of Month",
          type: "multiselect",
          options: DAYS_OF_MONTH,
        };
      } else if (mode === "YEARLY") {
        base[idxBackup] = {
          key: "backupSchedule",
          label: "Backup Date (Yearly)",
          type: "date",
        };
      } else {
        base[idxBackup] = {
          key: "backupSchedule",
          label: "Full Backup",
          type: "text",
        };
      }
    }
    return base;
  }, [columns, editDraft?.scheduleType]);

  /** Receive changes from modal (field-level) */
  const handleModalChange = (next: FsRow) => {
    if (next.scheduleType !== editDraft?.scheduleType) {
      const mode = scheduleModeFrom(next.scheduleType as string);
      let bs: any = "";
      if (mode === "WEEKLY" || mode === "MONTHLY") bs = [];
      if (mode === "YEARLY") bs = ""; // date input returns string
      setEditDraft({ ...next, backupSchedule: bs });
      return;
    }
    setEditDraft(next);
  };

  /** Submit update */
  const handleUpdate = async () => {
    if (!editDraft) return;

    const mode = scheduleModeFrom(editDraft.scheduleType as string);
    let bs: any = editDraft.backupSchedule;
    if (mode === "WEEKLY" || mode === "MONTHLY") {
      bs = joinCsv(bs);
    } else if (bs == null) {
      bs = "";
    } else {
      bs = String(bs);
    }

    const updatedForSave: FsRow = { ...editDraft, backupSchedule: bs };

    // split static + dynamic
    const stat: Partial<FilesystemEdit> = {};
    for (const k of STATIC_KEYS) {
      if (updatedForSave[k] !== undefined) (stat as any)[k] = updatedForSave[k];
    }

    const extras: Record<string, any> = {};
    (schema?.fields || []).forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(updatedForSave, f.name)) {
        extras[f.name] = coerceByUi(f, (updatedForSave as any)[f.name]);
      }
    });

    const payload = {
      ...stat,
      ...(Object.keys(extras).length ? { extras } : {}),
    };

    await updateFilesystem((updatedForSave as any).id, payload);
    setEditRow(null);
    setEditDraft(null);
    mutate();
  };

  const handleDelete = async (row: FsRow) => {
    await deleteFilesystem((row as any).id);
    setDeleteRow(null);
    setViewRow(null);
    setResetSelectionKey((k) => k + 1);
    mutate();
  };

  const handleBulkDelete = async (ids: (number | string)[]) => {
    await Promise.all(ids.map((id) => deleteFilesystem(Number(id))));
    setBulkDeleteIds([]);
    setResetSelectionKey((k) => k + 1);
    mutate();
  };

  return (
    <div className="w-full p-4 text-[10px]">
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/filesystem-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Filesystem
          </Button>
        </Link>
      </div>

      <DataTable<FsRow>
        key={resetSelectionKey}
        columns={columns}
        data={tableData}
        tableName="filesystem_list"
        onView={(row) => setViewRow(row)}
        onEdit={(row) => openEdit(row)}
        onDelete={(row) => setDeleteRow(row)}
        onBulkDelete={setBulkDeleteIds}
      />

      {viewRow && (
        <ViewModal<FsRow>
          row={viewRow}
          columns={columns}
          onClose={() => setViewRow(null)}
        />
      )}

      {editRow && editDraft && (
        <EditModal<FsRow>
          row={editDraft}
          columns={columnsForEditModal}
          open={!!editRow}
          onClose={() => {
            setEditRow(null);
            setEditDraft(null);
          }}
          onChange={handleModalChange}
          onSubmit={handleUpdate}
        />
      )}

      {deleteRow && (
        <ConfirmDeleteDialog<FsRow>
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
