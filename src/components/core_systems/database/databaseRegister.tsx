// "use client";

// import React, { useState } from "react";
// import DataLoader from "../../loader/dataLoader";
// import { toast } from "sonner";
// import { useUserDetails } from "@/hooks/user/useUserDetails";
// import { useCreateDatabase } from "@/hooks/core_systems/database/useCreateDatabase";
// import { DatabaseReg } from "@/types/database";
// import { EditField } from "@/components/table/editFields";
// import UniversalButton from "@/components/ui/universalButton";
// import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { ScanSearch } from "lucide-react";

// type FieldConfig = {
//   name: keyof DatabaseReg | string;
//   label: string;
//   type: string;
//   required?: boolean;
//   options?: { value: any; label: string }[];
// };

// export function DatabaseRegister() {
//   const { createDatabase, loading } = useCreateDatabase();
//   const userName = useUserDetails();
//   const { osIpAddresses } = useOsIpAddresses();

//   const requiredFields: (keyof DatabaseReg)[] = [
//     "dbName",
//     "virtualIp",
//     "dbInstance",
//     "dbVersion",
//     "rdbmsType",
//     "dbPort",
//     "dbStatus",
//     "dbType",
//     "dbOwnerEmail",
//     "vmIds",
//   ];

//   const numericFields: (keyof DatabaseReg)[] = ["dbPort"];

//   const initialState: DatabaseReg = {
//     dbName: "",
//     virtualIp: "",
//     additionalIp: "",
//     dbInstance: "",
//     dbVersion: "",
//     rdbmsType: "",
//     dbPort: 3306,
//     dbStatus: "",
//     dbType: "",
//     dbOwnerEmail: "",
//     remarks: "",
//     isActive: true,
//     makeBy: userName,
//     makeDate: undefined,
//     editBy: "",
//     editDate: undefined,
//     vmIds: [],
//   };

//   const [formData, setFormData] = useState<DatabaseReg>(initialState);

//   const handleChange = (
//     e: React.ChangeEvent<any> | { target: { id: string; value: any } }
//   ) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleVmChange = (selectedIds: number[]) => {
//     setFormData((prev) => ({ ...prev, vmIds: selectedIds }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const missingFields = requiredFields.filter(
//       (field) =>
//         formData[field] === undefined ||
//         formData[field] === "" ||
//         formData[field] === null
//     );

//     if (missingFields.length > 0) {
//       toast.warning(
//         `Please fill in all required fields: ${missingFields
//           .map((f) => formatLabel(f))
//           .join(", ")}`
//       );
//       return;
//     }

//     const payload: DatabaseReg = {
//       ...formData,
//       makeBy: userName,
//       makeDate: new Date(),
//     };

//     numericFields.forEach((field) => {
//       const value = formData[field];
//       if (typeof value === "string" && value.trim() !== "") {
//         const parsed = Number(value);
//         (payload as any)[field] = isNaN(parsed) ? undefined : parsed;
//       }
//     });

//     console.log("Payload:", payload);

//     try {
//       const success = await createDatabase(payload);
//       if (success) {
//         setFormData(initialState);
//       }
//     } catch (error) {}
//   };

//   if (loading) return <DataLoader />;

//   const fieldConfigs: FieldConfig[] = [
//     { name: "dbName", label: "Database Name", type: "text", required: true },
//     {
//       name: "vmIds",
//       label: "VM IDs",
//       type: "multiselect",
//       required: true,
//       options: osIpAddresses.map((vm: any) => ({
//         value: vm.id,
//         label: vm.osIpAddress,
//       })),
//     },
//     { name: "virtualIp", label: "Virtual IP", type: "text", required: true },
//     { name: "additionalIp", label: "Additional IP", type: "text" },
//     { name: "dbInstance", label: "DB Instance", type: "text", required: true },
//     { name: "dbVersion", label: "DB Version", type: "text", required: true },
//     { name: "rdbmsType", label: "RDBMS Type", type: "text", required: true },
//     { name: "dbPort", label: "DB Port", type: "number", required: true },
//     { name: "dbStatus", label: "DB Status", type: "text", required: true },
//     { name: "dbType", label: "DB Type", type: "text", required: true },
//     {
//       name: "dbOwnerEmail",
//       label: "DB Owner Email",
//       type: "text",
//       required: true,
//     },
//     { name: "remarks", label: "Remarks", type: "textarea" },
//     { name: "isActive", label: "Is Active", type: "boolean" },
//   ];

//   return (
//     <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
//       <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
//         Register Database
//       </h2>
//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/database-server-update">
//           <Button variant="default" size="sm" className="text-xs">
//             <ScanSearch className="h-4 w-4 mr-2" /> View Database Server
//           </Button>
//         </Link>
//       </div>
//       <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
//       >
//         {fieldConfigs.map(({ name, label, type, required, options }) => (
//           <EditField
//             key={name}
//             name={name}
//             label={
//               required ? (
//                 <>
//                   {label} <span className="text-red-500">*</span>
//                 </>
//               ) : (
//                 label
//               )
//             }
//             type={type}
//             value={formData[name as keyof DatabaseReg]}
//             onChange={
//               name === "vmIds"
//                 ? (e) => {
//                     const selected = Array.isArray(e.target.value)
//                       ? e.target.value.map((val: any) => Number(val))
//                       : [Number(e.target.value)];
//                     handleVmChange(selected);
//                   }
//                 : handleChange
//             }
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

"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateDatabase } from "@/hooks/core_systems/database/useCreateDatabase";
import { DatabaseReg } from "@/types/database";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScanSearch } from "lucide-react";
import { useDynamicSchema } from "@/hooks/dynamicHooks"; // from earlier dynamic module
import type { UiSchemaField } from "@/types/dynamic";

type FieldConfig = {
  name: keyof DatabaseReg | string;
  label: string | React.ReactNode;
  type: string;
  required?: boolean;
  options?: { value: any; label: string }[];
};

// This module targets the database table
const TABLE_NAME = "database_entity";

export function DatabaseRegister() {
  const { createDatabase, loading } = useCreateDatabase();
  const userName = useUserDetails();
  const { osIpAddresses } = useOsIpAddresses();

  // ---- Dynamic schema
  const {
    data: schema,
    loading: schemaLoading,
    error: schemaError,
    load,
  } = useDynamicSchema();
  useEffect(() => {
    // load schema for this table on mount
    (async () => {
      const d = await load(TABLE_NAME);
      if (!d && schemaError) toast.error(schemaError);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Required & numeric (static)
  const requiredFields: (keyof DatabaseReg)[] = [
    "dbName",
    "virtualIp",
    "dbInstance",
    "dbVersion",
    "rdbmsType",
    "dbPort",
    "dbStatus",
    "dbType",
    "dbOwnerEmail",
    "vmIds",
  ];
  const numericFields: (keyof DatabaseReg)[] = ["dbPort"];

  const initialState: DatabaseReg = {
    dbName: "",
    virtualIp: "",
    additionalIp: "",
    dbInstance: "",
    dbVersion: "",
    rdbmsType: "",
    dbPort: 3306,
    dbStatus: "",
    dbType: "",
    dbOwnerEmail: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
    vmIds: [],
    extras: {}, // ✅ start empty
  };

  const [formData, setFormData] = useState<DatabaseReg>(initialState);
  const [extrasState, setExtrasState] = useState<Record<string, any>>({}); // dynamic field values

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleVmChange = (selectedIds: number[]) => {
    setFormData((prev) => ({ ...prev, vmIds: selectedIds }));
  };

  // --- map dynamic uiType → EditField type, and coerce before submit
  function coerceUiValue(field: UiSchemaField, raw: any) {
    switch (field.uiType) {
      case "number":
        if (raw === "" || raw === null || raw === undefined) return undefined;
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
  }

  const dynamicRequired = useMemo(() => {
    const set = new Set<string>();
    schema?.fields.forEach((f) => {
      if (f.required) set.add(f.name);
    });
    return set;
  }, [schema]);

  // Static fields definition (unchanged)
  const fieldConfigs: FieldConfig[] = [
    { name: "dbName", label: "Database Name", type: "text", required: true },
    {
      name: "vmIds",
      label: "VM IDs",
      type: "multiselect",
      required: true,
      options: osIpAddresses.map((vm: any) => ({
        value: vm.id,
        label: vm.osIpAddress,
      })),
    },
    { name: "virtualIp", label: "Virtual IP", type: "text", required: true },
    { name: "additionalIp", label: "Additional IP", type: "text" },
    { name: "dbInstance", label: "DB Instance", type: "text", required: true },
    { name: "dbVersion", label: "DB Version", type: "text", required: true },
    { name: "rdbmsType", label: "RDBMS Type", type: "text", required: true },
    { name: "dbPort", label: "DB Port", type: "number", required: true },
    { name: "dbStatus", label: "DB Status", type: "text", required: true },
    { name: "dbType", label: "DB Type", type: "text", required: true },
    {
      name: "dbOwnerEmail",
      label: "DB Owner Email",
      type: "text",
      required: true,
    },
    { name: "remarks", label: "Remarks", type: "textarea" },
    { name: "isActive", label: "Is Active", type: "boolean" },
  ];

  // Dynamic fields → EditField rows
  const dynamicFieldConfigs: FieldConfig[] = useMemo(() => {
    if (!schema) return [];
    return schema.fields.map((f) => {
      const label = f.required ? (
        <>
          {f.label} <span className="text-red-500">*</span>
        </>
      ) : (
        f.label
      );

      // map ui types to your EditField types
      const typeMap: Record<string, string> = {
        text: "text",
        textarea: "textarea",
        number: "number",
        checkbox: "boolean",
        datetime: "datetime", // Ensure your EditField supports; else use "text" with type="datetime-local"
        select: "select",
      };

      const cfg: FieldConfig = {
        name: f.name, // dynamic key goes to extrasState[f.name]
        label,
        type: typeMap[f.uiType] ?? "text",
        required: f.required,
        options:
          f.uiType === "select"
            ? f.options.map((o) => ({ value: o.value, label: o.label }))
            : undefined,
      };
      return cfg;
    });
  }, [schema]);

  // handle dynamic changes
  const handleDynamicChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } },
    uiType?: UiSchemaField["uiType"]
  ) => {
    const { id, value } = e.target;
    setExtrasState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // static required
    const missingStatic = requiredFields.filter(
      (field) =>
        formData[field] === undefined ||
        formData[field] === "" ||
        formData[field] === null ||
        (Array.isArray(formData[field]) &&
          (formData[field] as any[]).length === 0)
    );
    if (missingStatic.length > 0) {
      toast.warning(
        `Please fill in all required fields: ${missingStatic
          .map((f) => formatLabel(f))
          .join(", ")}`
      );
      return;
    }

    // dynamic required
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

    // Build extras with proper coercion
    const extras: Record<string, any> = {};
    schema?.fields.forEach((f) => {
      if (extrasState.hasOwnProperty(f.name)) {
        extras[f.name] = coerceUiValue(f, extrasState[f.name]);
      } else if (f.defaultValue != null && f.defaultValue !== "") {
        // only apply defaults if user didn't provide
        extras[f.name] = coerceUiValue(f, f.defaultValue);
      }
    });

    const payload: DatabaseReg = {
      ...formData,
      makeBy: userName,
      makeDate: new Date(),
      extras, // ✅ send dynamic fields here
    };

    // coerce specific static numerics
    numericFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        (payload as any)[field] = isNaN(parsed) ? undefined : parsed;
      }
    });

    try {
      const success = await createDatabase(payload);
      if (success) {
        setFormData(initialState);
        setExtrasState({});
        // Refresh schema if you want (not necessary)
      }
    } catch {}
  };

  if (loading || schemaLoading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Database
      </h2>
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/database-server-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Database Server
          </Button>
        </Link>
      </div>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* ---- static fields */}
        {fieldConfigs.map(({ name, label, type, required, options }) => (
          <EditField
            key={String(name)}
            name={name}
            label={label}
            type={type}
            value={formData[name as keyof DatabaseReg]}
            onChange={
              name === "vmIds"
                ? (e) => {
                    const selected = Array.isArray(e.target.value)
                      ? e.target.value.map((val: any) => Number(val))
                      : [Number(e.target.value)];
                    handleVmChange(selected);
                  }
                : handleChange
            }
            options={options}
            className="text-[10px]"
          />
        ))}

        {/* ---- dynamic fields */}
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
