// /components/device/deviceRegister.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataLoader from "@/components/loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScanSearch } from "lucide-react";

import { useCreateDevice } from "@/hooks/device/useDevice";
import type { DeviceReg } from "@/types/device";

import { useDynamicSchema } from "@/hooks/dynamicHooks";
import type { UiSchemaField } from "@/types/dynamic";
import { useMe } from "@/hooks/user/useMe";

const TABLE_NAME = "device_entity";

type FieldConfig = {
  name: keyof DeviceReg | string;
  label: string | React.ReactNode;
  type:
    | "text"
    | "select"
    | "multiselect"
    | "boolean"
    | "number"
    | "date"
    | "time"
    | "email"
    | "textarea"
    | "radio"
    | "checkbox"
    | "href";
  required?: boolean;
  options?: { value: any; label: string }[];
};

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

export function DeviceRegister() {
  const { me } = useMe();
  const isRoot = (me?.role || "").toLowerCase() === "root";

  const { createDevice, loading } = useCreateDevice();
  const userName = useUserDetails();

  const {
    data: schema,
    loading: schemaLoading,
    error: schemaError,
    load,
  } = useDynamicSchema();

  useEffect(() => {
    (async () => {
      const ok = await load(TABLE_NAME);
      if (!ok && schemaError) toast.error(schemaError);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requiredStatic: (keyof DeviceReg)[] = ["assetTag"];

  const initialState: DeviceReg = {
    deviceType: undefined,
    assetTag: "",
    serialNumber: "",
    brand: "",
    model: "",
    currentOwnerPin: "",
    currentOwnerName: "",
    currentOwnerEmail: "",
    unit: "", // 👈 now using unit
    site: "",
    locationNote: "",
    status: "in_stock",
    assignedDate: undefined,
    returnedDate: undefined,
    remarks: "",
    hostname: "",
    platform: "",
    osVersion: "",
    ipAddress: "",
    macAddress: "",
    purchaseOrderNo: "",
    vendor: "",
    purchaseDate: undefined,
    warrantyEnd: undefined,
    isActive: true,
    makeBy: userName,
    extras: {},
  };

  const [formData, setFormData] = useState<DeviceReg>(initialState);
  const [extrasState, setExtrasState] = useState<Record<string, any>>({});

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // dynamic schema → field config
  const dynamicFieldConfigs: FieldConfig[] = useMemo(() => {
    if (!schema?.fields) return [];
    const typeMap: Record<UiSchemaField["uiType"], FieldConfig["type"]> = {
      text: "text",
      number: "number",
      checkbox: "boolean",
      textarea: "textarea",
      datetime: "date",
      select: "select",
    };
    return schema.fields.map((f) => ({
      name: f.name,
      label: f.required ? (
        <>
          {f.label} <span className="text-red-500">*</span>
        </>
      ) : (
        f.label
      ),
      type: typeMap[f.uiType] ?? "text",
      required: f.required,
      options:
        f.uiType === "select"
          ? f.options?.map((o) => ({ value: o.value, label: o.label })) ?? []
          : undefined,
    }));
  }, [schema]);

  const staticFieldConfigs: FieldConfig[] = [
    { name: "assetTag", label: "Asset Tag", type: "text", required: true },
    {
      name: "deviceType",
      label: "Device Type",
      type: "select",
      options: DEVICE_TYPES,
    },
    { name: "serialNumber", label: "Serial Number", type: "text" },
    { name: "brand", label: "Brand", type: "text" },
    { name: "model", label: "Model", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: STATUS_OPTIONS,
    },
    { name: "currentOwnerPin", label: "Owner PIN", type: "text" },
    { name: "currentOwnerName", label: "Owner Name", type: "text" },
    { name: "currentOwnerEmail", label: "Owner Email", type: "email" },
    { name: "unit", label: "Unit", type: "text" }, // 👈 label + type; we enforce below
    { name: "site", label: "Site", type: "text" },
    { name: "locationNote", label: "Location Note", type: "textarea" },
    { name: "assignedDate", label: "Assigned Date", type: "date" },
    { name: "returnedDate", label: "Returned Date", type: "date" },
    { name: "hostname", label: "Hostname", type: "text" },
    { name: "platform", label: "Platform", type: "text" },
    { name: "osVersion", label: "OS Version", type: "text" },
    { name: "ipAddress", label: "IP Address", type: "text" },
    { name: "macAddress", label: "MAC Address", type: "text" },
    { name: "purchaseOrderNo", label: "PO Number", type: "text" },
    { name: "vendor", label: "Vendor", type: "text" },
    { name: "purchaseDate", label: "Purchase Date", type: "date" },
    { name: "warrantyEnd", label: "Warranty End", type: "date" },
    { name: "remarks", label: "Remarks", type: "textarea" },
    { name: "isActive", label: "Is Active", type: "boolean" },
  ];

  const handleDynamicChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setExtrasState((prev) => ({ ...prev, [id]: value }));
  };

  const coerceUiValue = (f: UiSchemaField, raw: any) => {
    switch (f.uiType) {
      case "number":
        if (raw === "" || raw == null) return undefined;
        if (typeof raw === "number") return raw;
        const n = Number(raw);
        return Number.isFinite(n) ? n : undefined;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = requiredStatic.filter(
      (k) =>
        formData[k] === undefined || formData[k] === null || formData[k] === ""
    );
    if (missing.length) {
      toast.warning(`Please fill required: ${missing.join(", ")}`);
      return;
    }

    const extras: Record<string, any> = {};
    schema?.fields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(extrasState, f.name)) {
        extras[f.name] = coerceUiValue(f, extrasState[f.name]);
      } else if (f.defaultValue != null && f.defaultValue !== "") {
        extras[f.name] = coerceUiValue(f, f.defaultValue);
      }
    });

    // 🔒 Enforce unit on the client side too (server also enforces)
    const payload: DeviceReg = {
      ...formData,
      unit: isRoot ? formData.unit : me?.unit || "", // non-root cannot set another unit
      makeBy: userName,
      makeDate: new Date(),
      extras,
    };

    const ok = await createDevice(payload);
    if (ok) {
      setFormData(initialState);
      setExtrasState({});
    }
  };

  if (loading || schemaLoading) return <DataLoader />;

  const noop = () => {};

  return (
    <div className="mx-auto w-full max-w-6xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Device
      </h2>

      <div className="flex justify-end mb-4">
        <Link href="/device-inventory/device-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Devices
          </Button>
        </Link>
      </div>

      <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {staticFieldConfigs.map(({ name, label, type, required, options }) => {
          const isUnitField = name === "unit";
          const value =
            isUnitField && !isRoot ? me?.unit ?? "" : (formData as any)[name];

          return (
            <EditField
              key={String(name)}
              name={String(name)}
              label={
                required ? (
                  <>
                    {label} <span className="text-red-500">*</span>
                  </>
                ) : (
                  label
                )
              }
              type={type}
              value={value}
              onChange={isUnitField && !isRoot ? (noop as any) : handleChange}
              options={options}
              className="text-[10px]"
            />
          );
        })}

        {dynamicFieldConfigs.map(({ name, label, type, options }) => (
          <EditField
            key={String(name)}
            name={String(name)}
            label={label}
            type={type}
            value={extrasState[String(name)] ?? ""}
            onChange={handleDynamicChange}
            options={options}
            className="text-[10px]"
          />
        ))}

        <div className="col-span-1 md:col-span-2">
          <UniversalButton type="submit">Submit &rarr;</UniversalButton>
        </div>
      </form>
    </div>
  );
}
