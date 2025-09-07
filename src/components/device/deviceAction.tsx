// /components/device/deviceAction.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { DataTable, type Column } from "@/components/table/dataTable";
import { ViewModal } from "@/components/table/modalView";
import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { EditModal } from "@/components/table/editModal";

import {
  useAllDevices,
  useBulkDeleteDevices,
  useBulkUpdateDevices,
  useDeleteDevice,
  useUpdateDevice,
} from "@/hooks/device/useDevice";
import { useDynamicSchema } from "@/hooks/dynamicHooks";
import type { UiSchemaField } from "@/types/dynamic";
import type { DeviceEdit } from "@/types/device";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { toast } from "sonner";
import { BulkEditModal } from "../table/bulkEditModal";

const TABLE_NAME = "device_entity";

type Row = DeviceEdit & { [key: string]: any };

const DEVICE_TYPES = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Printer",
  "Scanner",
  "Router",
  "Switch",
  "Access Point",
  "Server",
  "Storage",
  "UPS",
  "Phone",
  "Tablet",
  "Other",
].map((v) => ({ value: v, label: v }));

const STATUS_OPTIONS = [
  { value: "in_use", label: "In Use" },
  { value: "in_stock", label: "In Stock" },
  { value: "under_repair", label: "Under Repair" },
  { value: "retired", label: "Retired" },
  { value: "disposed", label: "Disposed" },
];

const STATIC_KEYS: (keyof DeviceEdit)[] = [
  "assetTag",
  "deviceType",
  "serialNumber",
  "brand",
  "model",
  "status",
  "currentOwnerPin",
  "currentOwnerName",
  "currentOwnerEmail",
  "unit",
  "site",
  "locationNote",
  "assignedDate",
  "returnedDate",
  "hostname",
  "platform",
  "osVersion",
  "ipAddress",
  "macAddress",
  "purchaseOrderNo",
  "vendor",
  "purchaseDate",
  "warrantyEnd",
  "remarks",
  "isActive",
];

export default function DeviceAction() {
  const { devices, mutate } = useAllDevices(); // ✅ server-scoped
  const { updateDevice } = useUpdateDevice();
  const { deleteDevice } = useDeleteDevice();
  const { bulkDelete } = useBulkDeleteDevices();
  const { bulkUpdate } = useBulkUpdateDevices();

  // dynamic schema
  const { data: schema, load: loadSchema } = useDynamicSchema();
  useEffect(() => {
    loadSchema(TABLE_NAME).catch(() => toast.error("Failed to load schema"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // modals / selection
  const [viewRow, setViewRow] = useState<Row | null>(null);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
  const [bulkEditIds, setBulkEditIds] = useState<(number | string)[]>([]); // 🆕
  const [bulkEditOpen, setBulkEditOpen] = useState(false); // 🆕
  const [resetKey, setResetKey] = useState(0); // to clear table selection after bulk delete

  // static columns
  const staticColumns: Column<Row>[] = useMemo(
    () => [
      { key: "assetTag", label: "Asset Tag", type: "text" },
      {
        key: "deviceType",
        label: "Device Type",
        type: "select",
        options: DEVICE_TYPES,
      },
      { key: "serialNumber", label: "Serial", type: "text" },
      { key: "brand", label: "Brand", type: "text" },
      { key: "model", label: "Model", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: STATUS_OPTIONS,
      },
      { key: "currentOwnerPin", label: "Owner PIN", type: "text" },
      { key: "currentOwnerName", label: "Owner Name", type: "text" },
      { key: "currentOwnerEmail", label: "Owner Email", type: "email" },
      { key: "unit", label: "Unit", type: "text" },
      { key: "site", label: "Site", type: "text" },
      { key: "locationNote", label: "Location", type: "textarea" },
      { key: "assignedDate", label: "Assigned Date", type: "date" },
      { key: "returnedDate", label: "Returned Date", type: "date" },
      { key: "hostname", label: "Hostname", type: "text" },
      { key: "platform", label: "Platform", type: "text" },
      { key: "osVersion", label: "OS Version", type: "text" },
      { key: "ipAddress", label: "IP Address", type: "text" },
      { key: "macAddress", label: "MAC Address", type: "text" },
      { key: "purchaseOrderNo", label: "PO No", type: "text" },
      { key: "vendor", label: "Vendor", type: "text" },
      { key: "purchaseDate", label: "Purchase Date", type: "date" },
      { key: "warrantyEnd", label: "Warranty End", type: "date" },
      { key: "remarks", label: "Remarks", type: "textarea" },
      { key: "isActive", label: "Active", type: "boolean" },
    ],
    []
  );

  // dynamic columns
  const dynamicColumns: Column<Row>[] = useMemo(() => {
    if (!schema?.fields?.length) return [];
    const mapType = (ui: UiSchemaField["uiType"]): Column<Row>["type"] => {
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
        case "text":
        default:
          return "text";
      }
    };
    return schema.fields.map((f) => ({
      key: f.name as keyof Row,
      label: f.label,
      type: mapType(f.uiType),
      options:
        f.uiType === "select"
          ? f.options?.map((o) => ({ value: o.value, label: o.label })) ?? []
          : undefined,
    }));
  }, [schema]);

  const columns: Column<Row>[] = useMemo(
    () => [...staticColumns, ...dynamicColumns],
    [staticColumns, dynamicColumns]
  );

  // table data already flattened by the hook (no client filter!)
  const tableData: Row[] = devices as Row[];

  // helpers
  const coerceByUi = (f: UiSchemaField, raw: any) => {
    switch (f.uiType) {
      case "number":
        if (raw === "" || raw == null) return undefined;
        const n = Number(raw);
        return Number.isFinite(n) ? n : undefined;
      case "checkbox":
        if (typeof raw === "boolean") return raw;
        if (raw === "true") return true;
        if (raw === "false") return false;
        return Boolean(raw);
      case "datetime":
        if (!raw) return undefined;
        const d = new Date(raw);
        return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
      case "select":
      case "text":
      case "textarea":
      default:
        return raw ?? "";
    }
  };

  const handleUpdate = async (updated: Row) => {
    const stat: Partial<DeviceEdit> = {};
    for (const k of STATIC_KEYS) {
      if (updated[k] !== undefined) (stat as any)[k] = updated[k];
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
    await updateDevice(updated.id, payload);
    setEditRow(null);
    mutate();
  };

  const handleDelete = async (row: Row) => {
    await deleteDevice(row.id);
    setDeleteRow(null);
    setViewRow(null);
    mutate();
  };

  const handleBulkDelete = async (ids: (number | string)[]) => {
    await bulkDelete(ids); // ✅ single toast
    setBulkDeleteIds([]);
    setResetKey((k) => k + 1);
    mutate();
  };

  const handleBulkEdit = (ids: (number | string)[]) => {
    setBulkEditIds(ids);
    setBulkEditOpen(true);
  };

  const submitBulkEdit = async (patch: Partial<Row>) => {
    await bulkUpdate(bulkEditIds, patch); // ✅ single toast
    setBulkEditIds([]);
    setBulkEditOpen(false);
    setResetKey((k) => k + 1);
    mutate();
  };

  return (
    <div className="w-full p-4 text-[10px]">
      <div className="flex justify-end mb-4">
        <Link href="/device-inventory/device-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Device
          </Button>
        </Link>
      </div>

      <DataTable<Row>
        key={resetKey}
        columns={columns}
        data={tableData}
        tableName="device_list"
        onView={(r) => setViewRow(r)}
        onEdit={(r) => setEditRow(r)}
        onDelete={(r) => setDeleteRow(r)}
        onBulkDelete={setBulkDeleteIds}
        onBulkEdit={handleBulkEdit}
      />

      {viewRow && (
        <ViewModal<Row>
          row={viewRow}
          columns={columns}
          onClose={() => setViewRow(null)}
        />
      )}

      {editRow && (
        <EditModal<Row>
          row={editRow}
          columns={columns}
          open={!!editRow}
          onClose={() => setEditRow(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteRow && (
        <ConfirmDeleteDialog<Row>
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

      {/* 🆕 Bulk Edit Modal */}
      <BulkEditModal<Row>
        open={bulkEditOpen}
        onClose={() => {
          setBulkEditOpen(false);
          setBulkEditIds([]);
        }}
        columns={columns}
        onSubmit={submitBulkEdit}
        title={`Bulk Update (${bulkEditIds.length} selected)`}
      />
    </div>
  );
}
