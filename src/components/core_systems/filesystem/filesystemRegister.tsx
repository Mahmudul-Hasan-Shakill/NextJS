// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import DataLoader from "@/components/loader/dataLoader";
// import { toast } from "sonner";
// import { useUserDetails } from "@/hooks/user/useUserDetails";
// import { EditField } from "@/components/table/editFields";
// import UniversalButton from "@/components/ui/universalButton";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ScanSearch } from "lucide-react";

// import { useCreateFilesystem } from "@/hooks/core_systems/filesystem/useCreateFilesystem";
// import { FilesystemReg } from "@/types/filesystem";

// import { useDynamicSchema } from "@/hooks/dynamicHooks";
// import type { UiSchemaField } from "@/types/dynamic";

// type FieldConfig = {
//   name: keyof FilesystemReg | string;
//   label: string | React.ReactNode;
//   type:
//     | "text"
//     | "select"
//     | "multiselect"
//     | "boolean"
//     | "number"
//     | "date"
//     | "email"
//     | "textarea"
//     | "radio"
//     | "checkbox"
//     | "href";
//   required?: boolean;
//   options?: { value: any; label: string }[];
// };

// const TABLE_NAME = "filesystem_entity";

// export function FilesystemRegister() {
//   const { createFilesystem, loading } = useCreateFilesystem();
//   const userName = useUserDetails();

//   // ---- Dynamic schema
//   const {
//     data: schema,
//     loading: schemaLoading,
//     error: schemaError,
//     load,
//   } = useDynamicSchema();

//   useEffect(() => {
//     (async () => {
//       const ok = await load(TABLE_NAME);
//       if (!ok && schemaError) toast.error(schemaError);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---- Required (static)
//   const requiredFields: (keyof FilesystemReg)[] = [
//     "application",
//     "node",
//     "ipAddress",
//     "backupEnvironment",
//     "backupType",
//     "subClientName",
//     "contentDetails",
//     "backupSchedule",
//     "storagePolicy",
//     "backupStartTime",
//     "backupEndTime",
//     "fullBackupSize",
//     "retention",
//   ];

//   const initialState: FilesystemReg = {
//     application: "",
//     node: "",
//     ipAddress: "",
//     backupEnvironment: "",
//     backupType: "FileSystem",
//     subClientName: "",
//     contentDetails: "",
//     backupSchedule: "",
//     storagePolicy: "",
//     backupStartTime: "",
//     backupEndTime: "",
//     fullBackupSize: "",
//     retention: "",
//     isActive: true,
//     makeBy: userName,
//     makeDate: undefined,
//     editBy: "",
//     editDate: undefined,
//     extras: {}, // ✅ dynamic goes here
//   };

//   const [formData, setFormData] = useState<FilesystemReg>(initialState);
//   const [extrasState, setExtrasState] = useState<Record<string, any>>({});

//   const handleChange = (
//     e: React.ChangeEvent<any> | { target: { id: string; value: any } }
//   ) => {
//     const { id, value } = e.target;
//     // id is always a string key of FilesystemReg
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   // --- map dynamic uiType → EditField type, and coerce before submit
//   function coerceUiValue(field: UiSchemaField, raw: any) {
//     switch (field.uiType) {
//       case "number":
//         if (raw === "" || raw === null || raw === undefined) return undefined;
//         if (typeof raw === "number") return raw;
//         {
//           const n = Number(raw);
//           return Number.isFinite(n) ? n : undefined;
//         }
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
//   }

//   const dynamicFieldConfigs: FieldConfig[] = useMemo(() => {
//     if (!schema?.fields) return [];
//     const typeMap: Record<UiSchemaField["uiType"], FieldConfig["type"]> = {
//       text: "text",
//       number: "number",
//       checkbox: "boolean",
//       textarea: "textarea",
//       datetime: "date", // 🛠 EditField supports 'date', not 'datetime'
//       select: "select",
//     };
//     return schema.fields.map((f) => ({
//       name: f.name, // string key
//       label: f.required ? (
//         <>
//           {f.label} <span className="text-red-500">*</span>
//         </>
//       ) : (
//         f.label
//       ),
//       type: typeMap[f.uiType] ?? "text",
//       required: f.required,
//       options:
//         f.uiType === "select"
//           ? f.options.map((o) => ({ value: o.value, label: o.label }))
//           : undefined,
//     }));
//   }, [schema]);

//   const staticFieldConfigs: FieldConfig[] = [
//     { name: "application", label: "Application", type: "text", required: true },
//     { name: "node", label: "Node", type: "text", required: true },
//     { name: "ipAddress", label: "IP Address", type: "text", required: true },
//     {
//       name: "backupEnvironment",
//       label: "Backup Environment",
//       type: "text",
//       required: true,
//     },
//     { name: "backupType", label: "Backup Type", type: "text", required: true },
//     {
//       name: "subClientName",
//       label: "Sub Client Name",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "contentDetails",
//       label: "Content Details",
//       type: "textarea",
//       required: true,
//     },
//     {
//       name: "backupSchedule",
//       label: "Backup Schedule",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "storagePolicy",
//       label: "Storage Policy",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "backupStartTime",
//       label: "Backup Start Time",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "backupEndTime",
//       label: "Backup End Time",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "fullBackupSize",
//       label: "Full Backup Size",
//       type: "text",
//       required: true,
//     },
//     { name: "retention", label: "Retention", type: "text", required: true },
//     { name: "isActive", label: "Is Active", type: "boolean" },
//   ];

//   const handleDynamicChange = (
//     e: React.ChangeEvent<any> | { target: { id: string; value: any } }
//   ) => {
//     const { id, value } = e.target; // id is dynamic field key (string)
//     setExtrasState((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // static required
//     const missingStatic = requiredFields.filter(
//       (field) =>
//         formData[field] === undefined ||
//         formData[field] === "" ||
//         formData[field] === null
//     );
//     if (missingStatic.length > 0) {
//       toast.warning(
//         `Please fill in all required fields: ${missingStatic
//           .map((f) => formatLabel(String(f)))
//           .join(", ")}`
//       );
//       return;
//     }

//     // dynamic required from schema
//     const missingDynamic: string[] = [];
//     schema?.fields.forEach((f) => {
//       if (!f.required) return;
//       const v = extrasState[f.name];
//       if (
//         v === undefined ||
//         v === null ||
//         v === "" ||
//         (Array.isArray(v) && v.length === 0)
//       ) {
//         missingDynamic.push(f.label);
//       }
//     });
//     if (missingDynamic.length > 0) {
//       toast.warning(
//         `Please fill required dynamic fields: ${missingDynamic.join(", ")}`
//       );
//       return;
//     }

//     // Build extras with proper coercion
//     const extras: Record<string, any> = {};
//     schema?.fields.forEach((f) => {
//       if (Object.prototype.hasOwnProperty.call(extrasState, f.name)) {
//         extras[f.name] = coerceUiValue(f, extrasState[f.name]);
//       } else if (f.defaultValue != null && f.defaultValue !== "") {
//         extras[f.name] = coerceUiValue(f, f.defaultValue);
//       }
//     });

//     const payload: FilesystemReg = {
//       ...formData,
//       makeBy: userName,
//       makeDate: new Date(),
//       extras,
//     };

//     try {
//       const success = await createFilesystem(payload);
//       if (success) {
//         setFormData(initialState);
//         setExtrasState({});
//       }
//     } catch {}
//   };

//   if (loading || schemaLoading) return <DataLoader />;

//   return (
//     <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
//       <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
//         Register Filesystem
//       </h2>

//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/filesystem-update">
//           <Button variant="default" size="sm" className="text-xs">
//             <ScanSearch className="h-4 w-4 mr-2" /> View Filesystem Records
//           </Button>
//         </Link>
//       </div>

//       <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
//       >
//         {/* ---- static fields */}
//         {staticFieldConfigs.map(({ name, label, type, required, options }) => (
//           <EditField
//             key={String(name)}
//             name={String(name)} // ✅ always a string
//             label={label}
//             type={type}
//             value={(formData as any)[name]}
//             onChange={handleChange}
//             options={options}
//             className="text-[10px]"
//           />
//         ))}

//         {/* ---- dynamic fields */}
//         {dynamicFieldConfigs.map(({ name, label, type, required, options }) => (
//           <EditField
//             key={String(name)}
//             name={String(name)} // ✅ always a string
//             label={label}
//             type={type}
//             value={extrasState[String(name)] ?? ""}
//             onChange={handleDynamicChange}
//             options={options}
//             className="text-[10px]"
//           />
//         ))}

//         <div className="col-span-1 md:col-span-2">
//           <UniversalButton type="submit">Submit &rarr;</UniversalButton>
//         </div>
//       </form>
//     </div>
//   );
// }

// function formatLabel(field: string): string {
//   return field
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (str) => str.toUpperCase());
// }

// components/core_systems/filesystem/filesystemRegister.tsx
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
    | "time" // 👈 NEW
    | "email"
    | "textarea"
    | "radio"
    | "checkbox"
    | "href";
  required?: boolean;
  options?: { value: any; label: string }[];
};

const TABLE_NAME = "filesystem_entity";

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
  ];

  const initialState: FilesystemReg = {
    application: "",
    node: "",
    ipAddress: "",
    backupEnvironment: "",
    backupType: "FileSystem",
    subClientName: "",
    contentDetails: "",
    backupSchedule: "",
    storagePolicy: "",
    backupStartTime: "", // "HH:mm"
    backupEndTime: "", // "HH:mm"
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

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  function coerceUiValue(field: UiSchemaField, raw: any) {
    switch (field.uiType) {
      case "number":
        if (raw === "" || raw === null || raw === undefined) return undefined;
        if (typeof raw === "number") return raw;
        {
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
  }

  const dynamicFieldConfigs: FieldConfig[] = useMemo(() => {
    if (!schema?.fields) return [];
    const typeMap: Record<UiSchemaField["uiType"], FieldConfig["type"]> = {
      text: "text",
      number: "number",
      checkbox: "boolean",
      textarea: "textarea",
      datetime: "date", // keep date for dynamic 'datetime'
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

  const staticFieldConfigs: FieldConfig[] = [
    { name: "application", label: "Application", type: "text", required: true },
    { name: "node", label: "Node", type: "text", required: true },
    { name: "ipAddress", label: "IP Address", type: "text", required: true },
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
      name: "backupSchedule",
      label: "Backup Schedule",
      type: "text",
      required: true,
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
      type: "time", // 👈 use time picker
      required: true,
    },
    {
      name: "backupEndTime",
      label: "Backup End Time",
      type: "time", // 👈 use time picker
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
      ...formData,
      makeBy: userName,
      makeDate: new Date(),
      extras,
    };

    try {
      const ok = await createFilesystem(payload);
      if (ok) {
        setFormData(initialState);
        setExtrasState({});
      }
    } catch {}
  };

  if (loading || schemaLoading) return <DataLoader />;

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
        {/* Static fields */}
        {staticFieldConfigs.map(({ name, label, type, required, options }) => (
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
            value={(formData as any)[name]}
            onChange={handleChange}
            options={options}
            className="text-[10px]"
          />
        ))}

        {/* Dynamic fields */}
        {dynamicFieldConfigs.map(({ name, label, type, options }) => {
          const value = extrasState[name as string] ?? "";
          // For datetime, if your EditField expects `datetime-local`, you might want to convert ISO to local input format here.

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
