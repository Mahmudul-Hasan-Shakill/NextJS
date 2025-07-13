"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateDatabase } from "@/hooks/core_systems/database/useCreateDatabase";
import { DatabaseReg } from "@/types/database";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";

export function DatabaseRegister() {
  const { createDatabase, loading } = useCreateDatabase();
  const userName = useUserDetails();

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
  ];

  const numericFields: (keyof DatabaseReg)[] = ["dbPort"];

  const initialState: DatabaseReg = {
    dbName: "",
    virtualIp: "",
    additionalIp: "",
    dbInstance: "",
    dbVersion: "",
    rdbmsType: "",
    dbPort: 3306, // Default port for MySQL, adjust as necessary
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
  };

  const [formData, setFormData] = useState<DatabaseReg>(initialState);

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingFields = requiredFields.filter(
      (field) =>
        formData[field] === undefined ||
        formData[field] === "" ||
        formData[field] === null
    );

    if (missingFields.length > 0) {
      toast.warning(
        `Please fill in all required fields: ${missingFields
          .map((f) => formatLabel(f))
          .join(", ")}`
      );
      return;
    }

    const payload: DatabaseReg = {
      ...formData,
      makeBy: userName,
      makeDate: new Date(),
    };

    numericFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        (payload as any)[field] = isNaN(parsed) ? undefined : parsed;
      }
    });

    console.log("Payload:", payload);

    const success = await createDatabase(payload);

    if (success) {
      setFormData({ ...initialState, makeBy: userName });
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Database
      </h2>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {[
          { name: "dbName", label: "Database Name", type: "text" },
          { name: "virtualIp", label: "Virtual IP", type: "text" },
          { name: "additionalIp", label: "Additional IP", type: "text" },
          { name: "dbInstance", label: "DB Instance", type: "text" },
          { name: "dbVersion", label: "DB Version", type: "text" },
          { name: "rdbmsType", label: "RDBMS Type", type: "text" },
          { name: "dbPort", label: "DB Port", type: "number" },
          { name: "dbStatus", label: "DB Status", type: "text" },
          { name: "dbType", label: "DB Type", type: "text" },
          { name: "dbOwnerEmail", label: "DB Owner Email", type: "text" },
          { name: "remarks", label: "Remarks", type: "textarea" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof DatabaseReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof DatabaseReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}
        {[{ name: "isActive", label: "Is Active" }].map(({ name, label }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof DatabaseReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type="boolean"
            value={formData[name as keyof DatabaseReg]}
            onChange={handleChange}
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

function formatLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
