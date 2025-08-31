// // /components/device/deviceAction.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { DataTable, type Column } from "@/components/table/dataTable";
// import { ViewModal } from "@/components/table/modalView";
// import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
// import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
// import { EditModal } from "@/components/table/editModal";

// import {
//   useAllDevices,
//   useDeleteDevice,
//   useUpdateDevice,
// } from "@/hooks/device/useDevice";
// import { useDynamicSchema } from "@/hooks/dynamicHooks";
// import type { UiSchemaField } from "@/types/dynamic";
// import type { DeviceEdit } from "@/types/device";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { FilePlus2 } from "lucide-react";
// import { toast } from "sonner";
// import { useMe } from "@/hooks/user/useMe";

// const TABLE_NAME = "device_entity";

// type Row = DeviceEdit & { [key: string]: any };

// const DEVICE_TYPES = [
//   "Laptop",
//   "Desktop",
//   "Monitor",
//   "Printer",
//   "Scanner",
//   "Router",
//   "Switch",
//   "Access Point",
//   "Server",
//   "Storage",
//   "UPS",
//   "Phone",
//   "Tablet",
//   "Other",
// ].map((v) => ({ value: v, label: v }));

// const STATUS_OPTIONS = [
//   { value: "in_use", label: "In Use" },
//   { value: "in_stock", label: "In Stock" },
//   { value: "under_repair", label: "Under Repair" },
//   { value: "retired", label: "Retired" },
//   { value: "disposed", label: "Disposed" },
// ];

// // (Optional) if you want unit as a select in the grid editor
// const UNIT_OPTIONS = [
//   "Core System",
//   "Network",
//   "DBA",
//   "App",
//   "Security",
//   "Ops",
// ].map((u) => ({ value: u, label: u }));

// const STATIC_KEYS: (keyof DeviceEdit)[] = [
//   "assetTag",
//   "deviceType",
//   "serialNumber",
//   "brand",
//   "model",
//   "status",
//   "currentOwnerPin",
//   "currentOwnerName",
//   "currentOwnerEmail",
//   "unit", // 👈 use unit
//   "site",
//   "locationNote",
//   "assignedDate",
//   "returnedDate",
//   "hostname",
//   "platform",
//   "osVersion",
//   "ipAddress",
//   "macAddress",
//   "purchaseOrderNo",
//   "vendor",
//   "purchaseDate",
//   "warrantyEnd",
//   "remarks",
//   "isActive",
// ];

// export default function DeviceAction() {
//   const { me } = useMe();
//   const isRoot = (me?.role || "").toLowerCase() === "root";

//   const { devices, mutate } = useAllDevices();
//   const { updateDevice } = useUpdateDevice();
//   const { deleteDevice } = useDeleteDevice();

//   const { data: schema, load: loadSchema } = useDynamicSchema();
//   const [resetKey, setResetKey] = useState(0);

//   useEffect(() => {
//     loadSchema(TABLE_NAME).catch(() => toast.error("Failed to load schema"));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const [viewRow, setViewRow] = useState<Row | null>(null);
//   const [editRow, setEditRow] = useState<Row | null>(null);
//   const [deleteRow, setDeleteRow] = useState<Row | null>(null);
//   const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

//   const staticColumns: Column<Row>[] = useMemo(
//     () => [
//       { key: "assetTag", label: "Asset Tag", type: "text" },
//       {
//         key: "deviceType",
//         label: "Device Type",
//         type: "select",
//         options: DEVICE_TYPES,
//       },
//       { key: "serialNumber", label: "Serial", type: "text" },
//       { key: "brand", label: "Brand", type: "text" },
//       { key: "model", label: "Model", type: "text" },
//       {
//         key: "status",
//         label: "Status",
//         type: "select",
//         options: STATUS_OPTIONS,
//       },
//       { key: "currentOwnerPin", label: "Owner PIN", type: "text" },
//       { key: "currentOwnerName", label: "Owner Name", type: "text" },
//       { key: "currentOwnerEmail", label: "Owner Email", type: "email" },
//       { key: "unit", label: "Unit", type: "select", options: UNIT_OPTIONS }, // 👈
//       { key: "site", label: "Site", type: "text" },
//       { key: "locationNote", label: "Location", type: "textarea" },
//       { key: "assignedDate", label: "Assigned Date", type: "date" },
//       { key: "returnedDate", label: "Returned Date", type: "date" },
//       { key: "hostname", label: "Hostname", type: "text" },
//       { key: "platform", label: "Platform", type: "text" },
//       { key: "osVersion", label: "OS Version", type: "text" },
//       { key: "ipAddress", label: "IP Address", type: "text" },
//       { key: "macAddress", label: "MAC Address", type: "text" },
//       { key: "purchaseOrderNo", label: "PO No", type: "text" },
//       { key: "vendor", label: "Vendor", type: "text" },
//       { key: "purchaseDate", label: "Purchase Date", type: "date" },
//       { key: "warrantyEnd", label: "Warranty End", type: "date" },
//       { key: "remarks", label: "Remarks", type: "textarea" },
//       { key: "isActive", label: "Active", type: "boolean" },
//     ],
//     []
//   );

//   const dynamicColumns: Column<Row>[] = useMemo(() => {
//     if (!schema?.fields?.length) return [];
//     const mapType = (ui: UiSchemaField["uiType"]): Column<Row>["type"] => {
//       switch (ui) {
//         case "number":
//           return "number";
//         case "checkbox":
//           return "boolean";
//         case "textarea":
//           return "textarea";
//         case "datetime":
//           return "date";
//         case "select":
//           return "select";
//         case "text":
//         default:
//           return "text";
//       }
//     };
//     return schema.fields.map((f) => ({
//       key: f.name as keyof Row,
//       label: f.label,
//       type: mapType(f.uiType),
//       options:
//         f.uiType === "select"
//           ? f.options?.map((o) => ({ value: o.value, label: o.label })) ?? []
//           : undefined,
//     }));
//   }, [schema]);

//   const columns: Column<Row>[] = useMemo(
//     () => [...staticColumns, ...dynamicColumns],
//     [staticColumns, dynamicColumns]
//   );

//   // flatten extras
//   const flattened: Row[] = useMemo(
//     () => (devices || []).map((d: any) => ({ ...d, ...(d.extras || {}) })),
//     [devices]
//   );

//   // filter by unit for non-root
//   const tableData: Row[] = useMemo(() => {
//     if (!me || isRoot) return flattened;
//     return flattened.filter((r) => r.unit === me.unit);
//   }, [flattened, me, isRoot]);

//   const canModifyRow = (r: Row) => isRoot || (!!me?.unit && r.unit === me.unit);

//   const guardEdit = (r: Row) => {
//     if (!canModifyRow(r)) {
//       toast.error("You cannot edit devices from another unit.");
//       return;
//     }
//     setEditRow(r);
//   };

//   const guardDelete = (r: Row) => {
//     if (!canModifyRow(r)) {
//       toast.error("You cannot delete devices from another unit.");
//       return;
//     }
//     setDeleteRow(r);
//   };

//   const dynamicNames = useMemo(
//     () => new Set((schema?.fields || []).map((f) => f.name)),
//     [schema]
//   );

//   const coerceByUi = (f: UiSchemaField, raw: any) => {
//     switch (f.uiType) {
//       case "number": {
//         if (raw === "" || raw == null) return undefined;
//         const n = Number(raw);
//         return Number.isFinite(n) ? n : undefined;
//       }
//       case "checkbox":
//         if (typeof raw === "boolean") return raw;
//         if (raw === "true") return true;
//         if (raw === "false") return false;
//         return Boolean(raw);
//       case "datetime": {
//         if (!raw) return undefined;
//         const d = new Date(raw);
//         return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
//       }
//       case "select":
//       case "text":
//       case "textarea":
//       default:
//         return raw ?? "";
//     }
//   };

//   const handleUpdate = async (updated: Row) => {
//     if (!canModifyRow(updated)) {
//       toast.error("You cannot edit devices from another unit.");
//       return;
//     }

//     const stat: Partial<DeviceEdit> = {};
//     for (const k of STATIC_KEYS) {
//       if (updated[k] !== undefined) (stat as any)[k] = updated[k];
//     }

//     // non-root cannot change unit
//     if (!isRoot) {
//       (stat as any).unit = me?.unit ?? updated.unit;
//       if (updated.unit && updated.unit !== me?.unit) {
//         toast.error("Cannot move device to another unit.");
//         return;
//       }
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

//     await updateDevice(updated.id, payload);
//     setEditRow(null);
//     mutate();
//   };

//   const handleDelete = async (row: Row) => {
//     if (!canModifyRow(row)) {
//       toast.error("You cannot delete devices from another unit.");
//       return;
//     }
//     await deleteDevice(row.id);
//     setDeleteRow(null);
//     setViewRow(null);
//     mutate();
//   };

//   const handleBulkDeleteRequest = (ids: (number | string)[]) => {
//     if (!isRoot) {
//       const invalid = flattened
//         .filter((d: any) => ids.includes(d.id))
//         .some((d: any) => d.unit !== me?.unit);
//       if (invalid) {
//         toast.error("Bulk delete includes records from another unit.");
//         return;
//       }
//     }
//     setBulkDeleteIds(ids);
//   };

//   const handleBulkDeleteConfirm = async (ids: (number | string)[]) => {
//     await Promise.all(ids.map((id) => deleteDevice(Number(id))));
//     setBulkDeleteIds([]);
//     mutate();
//     setResetKey((k) => k + 1); // clears selection state
//   };

//   return (
//     <div className="w-full p-4 text-[10px]">
//       <div className="flex justify-end mb-4">
//         <Link href="/device-inventory/device-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create Device
//           </Button>
//         </Link>
//       </div>

//       <DataTable<Row>
//         key={resetKey}
//         columns={columns}
//         data={tableData}
//         tableName="device_list"
//         onView={(r) => setViewRow(r)}
//         onEdit={guardEdit}
//         onDelete={guardDelete}
//         onBulkDelete={handleBulkDeleteRequest}
//       />

//       {viewRow && (
//         <ViewModal<Row>
//           row={viewRow}
//           columns={columns}
//           onClose={() => setViewRow(null)}
//         />
//       )}

//       {editRow && (
//         <EditModal<Row>
//           row={editRow}
//           columns={columns}
//           open={!!editRow}
//           onClose={() => setEditRow(null)}
//           onSubmit={handleUpdate}
//         />
//       )}

//       {deleteRow && (
//         <ConfirmDeleteDialog<Row>
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
//           onConfirm={handleBulkDeleteConfirm}
//         />
//       )}
//     </div>
//   );
// }

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
    await Promise.all(ids.map((id) => deleteDevice(Number(id))));
    setBulkDeleteIds([]);
    setResetKey((k) => k + 1); // clear selection
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
    </div>
  );
}
