// components/core_systems/filesystem/filesystemRegister.tsx
"use client";

import React, { useEffect, useMemo, useState, Fragment } from "react";
import DataLoader from "@/components/loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScanSearch } from "lucide-react";

import { useCreateFilesystem } from "@/hooks/core_systems/filesystem/useCreateFilesystem";
import { FilesystemReg } from "@/types/filesystem";

import { useDynamicSchema } from "@/hooks/dynamicHooks";
import type { UiSchemaField } from "@/types/dynamic";

type FieldConfig = {
  name: keyof FilesystemReg | string;
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

const TABLE_NAME = "filesystem_entity";

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
  const day = String(i + 1);
  return { value: day, label: `Day ${day}` };
});

// helpers to convert between UI array and stored string
const splitCsv = (s: string | undefined | null) =>
  (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const joinCsv = (v: any) => (Array.isArray(v) ? v.join(",") : v ?? "");

export function FilesystemRegister() {
  const { createFilesystem, loading } = useCreateFilesystem();
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

  const requiredFields: (keyof FilesystemReg)[] = [
    "application",
    "node",
    "ipAddress",
    "os",
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
  ];

  const initialState: FilesystemReg = {
    application: "",
    node: "",
    ipAddress: "",
    os: "",
    backupEnvironment: "",
    backupType: "",
    subClientName: "",
    contentDetails: "",
    scheduleType: "",
    backupSchedule: "", // <- stored as string in all cases
    storagePolicy: "",
    backupStartTime: "",
    backupEndTime: "",
    fullBackupSize: "",
    retention: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
    extras: {},
  };

  const [formData, setFormData] = useState<FilesystemReg>(initialState);
  const [extrasState, setExtrasState] = useState<Record<string, any>>({});

  // determine mode from schedule type
  const determineScheduleMode = (t: string | undefined) => {
    const val = (t || "").toLowerCase();
    if (val.includes("daily full")) return "DAILY";
    if (val.includes("weekly")) return "WEEKLY";
    if (val.includes("monthly")) return "MONTHLY";
    if (val.includes("yearly")) return "YEARLY";
    return "NONE";
  };

  const scheduleMode = useMemo(
    () => determineScheduleMode(formData.scheduleType),
    [formData.scheduleType]
  );

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;

    // special handling: backupSchedule should be saved as CSV string
    if (id === "backupSchedule") {
      const mode = determineScheduleMode(formData.scheduleType);
      if (mode === "WEEKLY" || mode === "MONTHLY") {
        // UI gives an array → store as "Mon, Tue, ..."
        setFormData((prev) => ({ ...prev, backupSchedule: joinCsv(value) }));
        return;
      }
      // DAILY (text) or YEARLY (date) → already string
      setFormData((prev) => ({ ...prev, backupSchedule: String(value ?? "") }));
      return;
    }

    if (id === "scheduleType") {
      // reset backupSchedule when schedule type changes
      setFormData((prev) => ({
        ...prev,
        scheduleType: value,
        backupSchedule: "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  function coerceUiValue(field: UiSchemaField, raw: any) {
    switch (field.uiType) {
      case "number":
        if (raw === "" || raw === null || raw === undefined) return undefined;
        if (typeof raw === "number") return raw;
        return Number.isFinite(Number(raw)) ? Number(raw) : undefined;
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
  }

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
          ? f.options.map((o) => ({ value: o.value, label: o.label }))
          : undefined,
    }));
  }, [schema]);

  // Static fields EXCEPT backupSchedule (we inject it right after scheduleType)
  const staticFieldConfigs: FieldConfig[] = [
    { name: "application", label: "Application", type: "text", required: true },
    { name: "node", label: "Node", type: "text", required: true },
    { name: "ipAddress", label: "IP Address", type: "text", required: true },
    { name: "os", label: "OS", type: "text", required: true },
    {
      name: "backupEnvironment",
      label: "Backup Environment",
      type: "text",
      required: true,
    },
    { name: "backupType", label: "Backup Type", type: "text", required: true },
    {
      name: "subClientName",
      label: "Sub Client Name",
      type: "text",
      required: true,
    },
    {
      name: "scheduleType",
      label: "Schedule Type",
      type: "select",
      required: true,
      options: [
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
      ],
    },
    {
      name: "storagePolicy",
      label: "Storage Policy",
      type: "text",
      required: true,
    },
    {
      name: "backupStartTime",
      label: "Backup Start Time",
      type: "time",
      required: true,
    },
    {
      name: "backupEndTime",
      label: "Backup End Time",
      type: "time",
      required: true,
    },
    {
      name: "fullBackupSize",
      label: "Full Backup Size",
      type: "text",
      required: true,
    },
    { name: "retention", label: "Retention", type: "text", required: true },
    {
      name: "contentDetails",
      label: "Content Details",
      type: "textarea",
      required: true,
    },
    { name: "isActive", label: "Is Active", type: "boolean" },
  ];

  // Decide how to render backupSchedule based on scheduleType
  const backupScheduleField: FieldConfig | undefined = useMemo(() => {
    switch (scheduleMode) {
      case "DAILY":
        return {
          name: "backupSchedule",
          label: "Full Backup",
          type: "text",
          required: true,
        };
      case "WEEKLY":
        return {
          name: "backupSchedule",
          label: "Full Backup",
          type: "multiselect",
          required: true,
          options: DAYS_OF_WEEK,
        };
      case "MONTHLY":
        return {
          name: "backupSchedule",
          label: "Full Backup",
          type: "multiselect",
          required: true,
          options: DAYS_OF_MONTH,
        };
      case "YEARLY":
        return {
          name: "backupSchedule",
          label: "Full Backup",
          type: "date",
          required: true,
        };
      default:
        return undefined;
    }
  }, [scheduleMode]);

  const handleDynamicChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setExtrasState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingStatic = requiredFields.filter(
      (field) =>
        formData[field] === undefined ||
        formData[field] === "" ||
        formData[field] === null
    );
    if (missingStatic.length > 0) {
      toast.warning(
        `Please fill in all required fields: ${missingStatic
          .map((f) => formatLabel(String(f)))
          .join(", ")}`
      );
      return;
    }

    const missingDynamic: string[] = [];
    schema?.fields.forEach((f) => {
      if (!f.required) return;
      const v = extrasState[f.name];
      if (
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0)
      ) {
        missingDynamic.push(f.label);
      }
    });
    if (missingDynamic.length > 0) {
      toast.warning(
        `Please fill required dynamic fields: ${missingDynamic.join(", ")}`
      );
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

    const payload: FilesystemReg = {
      ...formData, // backupSchedule is a string here (CSV for weekly/monthly)
      makeBy: userName,
      makeDate: new Date(),
      extras,
    };

    try {
      const ok = await createFilesystem(payload);
      console.log("Filesystem created:", payload);
      if (ok) {
        setFormData(initialState);
        setExtrasState({});
      }
    } catch {}
  };

  if (loading || schemaLoading) return <DataLoader />;

  // For WEEKLY/MONTHLY multiselect display, convert stored string → array
  const backupScheduleUIValue =
    scheduleMode === "WEEKLY" || scheduleMode === "MONTHLY"
      ? splitCsv(formData.backupSchedule)
      : formData.backupSchedule;

  return (
    <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Filesystem
      </h2>

      <div className="flex justify-end mb-4">
        <Link href="/core-systems/filesystem-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Filesystem Records
          </Button>
        </Link>
      </div>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* Static fields with backupSchedule inserted immediately after scheduleType */}
        {staticFieldConfigs.map(({ name, label, type, required, options }) => (
          <Fragment key={String(name)}>
            <EditField
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
              value={(formData as any)[name]}
              onChange={handleChange}
              options={options}
              className="text-[10px]"
            />

            {name === "scheduleType" && backupScheduleField && (
              <EditField
                key="backupSchedule"
                name="backupSchedule"
                label={
                  backupScheduleField.required ? (
                    <>
                      {backupScheduleField.label}{" "}
                      <span className="text-red-500">*</span>
                    </>
                  ) : (
                    backupScheduleField.label
                  )
                }
                type={backupScheduleField.type}
                // 👇 multiselect wants an array; we feed from backupScheduleUIValue
                value={backupScheduleUIValue}
                onChange={handleChange}
                options={backupScheduleField.options}
                className="text-[10px]"
              />
            )}
          </Fragment>
        ))}

        {/* Dynamic fields (from schema) */}
        {dynamicFieldConfigs.map(({ name, label, type, options }) => {
          const value = extrasState[name as string] ?? "";
          return (
            <EditField
              key={String(name)}
              name={name}
              label={label}
              type={type}
              value={value}
              onChange={(e: any) => handleDynamicChange(e)}
              options={options}
              className="text-[10px]"
            />
          );
        })}

        <div className="col-span-1 md:col-span-2">
          <UniversalButton type="submit">Submit &rarr;</UniversalButton>
        </div>
      </form>
    </div>
  );
}

function formatLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
