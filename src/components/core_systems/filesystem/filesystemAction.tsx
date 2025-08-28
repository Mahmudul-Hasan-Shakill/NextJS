"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/table/dataTable";
import { ViewModal } from "@/components/table/modalView";
import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
import { EditModal } from "@/components/table/editModal";

import { useAllFilesystems } from "@/hooks/core_systems/filesystem/useAllFilesystems";
import { useDeleteFilesystem } from "@/hooks/core_systems/filesystem/useDeleteFilesystem";
import { useUpdateFilesystem } from "@/hooks/core_systems/filesystem/useUpdateFilesystem";

import { useDynamicSchema } from "@/hooks/dynamicHooks";
import type { UiSchemaField } from "@/types/dynamic";
import type { FilesystemEdit } from "@/types/filesystem";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";

const TABLE_NAME = "filesystem_entity";

type FsRow = FilesystemEdit & { [key: string]: any };

const STATIC_KEYS: (keyof FilesystemEdit)[] = [
  "application",
  "node",
  "ipAddress",
  "backupEnvironment",
  "backupType",
  "subClientName",
  "contentDetails",
  "backupSchedule",
  "storagePolicy",
  "backupStartTime",
  "backupEndTime",
  "fullBackupSize",
  "retention",
  "isActive",
];

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
  const [editRow, setEditRow] = useState<FsRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<FsRow | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
  const [resetSelectionKey, setResetSelectionKey] = useState(0);

  useEffect(() => {
    loadSchema(TABLE_NAME).catch(() =>
      toast.error("Failed to load dynamic schema")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const staticColumns: Column<FsRow>[] = useMemo(
    () => [
      { key: "application", label: "Application", type: "text" },
      { key: "node", label: "Node", type: "text" },
      { key: "ipAddress", label: "IP Address", type: "text" },
      { key: "backupEnvironment", label: "Backup Environment", type: "text" },
      { key: "backupType", label: "Backup Type", type: "text" },
      { key: "subClientName", label: "Sub Client Name", type: "text" },
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

  const dynamicColumns: Column<FsRow>[] = useMemo(() => {
    if (!schema?.fields) return [];
    return schema.fields.map((f) => ({
      key: f.name as keyof FsRow,
      label: f.required ? `${f.label}` : f.label,
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

  const handleUpdate = async (updated: FsRow) => {
    const stat: Partial<FilesystemEdit> = {};
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
    await updateFilesystem(updated.id, payload);
    setEditRow(null);
    mutate();
  };

  const handleDelete = async (row: FsRow) => {
    await deleteFilesystem(row.id);
    setDeleteRow(null);
    setViewRow(null);
    setResetSelectionKey((k) => k + 1);
    mutate();
  };

  const handleBulkDelete = async (ids: (number | string)[]) => {
    await Promise.all(ids.map((id) => deleteFilesystem(Number(id))));
    setBulkDeleteIds([]);
    setResetSelectionKey((k) => k + 1); // ✅ clear "Delete Selected" state
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
        onEdit={(row) => setEditRow(row)}
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

      {editRow && (
        <EditModal<FsRow>
          row={editRow}
          columns={columns}
          open={!!editRow}
          onClose={() => setEditRow(null)}
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
