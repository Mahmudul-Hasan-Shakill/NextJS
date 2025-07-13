"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateApplication } from "@/hooks/core_systems/application/useCreateApplication";
import { ApplicationReg } from "@/types/application";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";

export function ApplicationRegister() {
  const { createApplication, loading } = useCreateApplication();
  const userName = useUserDetails();

  const requiredFields: (keyof ApplicationReg)[] = [
    "environment",
    "serviceName",
    "serviceOwner",
    "applicationCategory",
    "appModule",
    "appOwner",
    "appOwnerEmail",
  ];

  const initialState: ApplicationReg = {
    environment: "",
    serviceName: "",
    serviceOwner: "",
    applicationCategory: "",
    appModule: "",
    appOwner: "",
    appOwnerEmail: "",
    applicationUrl: "",
    applicationCertificateDetail: "",
    certificationExpiryDate: undefined,
    connectedApps: "",
    middlewareDetails: "",
    databaseDetails: "",
    loadBalancerDetails: "",
    buildLanguage: "",
    licenceType: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
  };

  const [formData, setFormData] = useState<ApplicationReg>(initialState);

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

    const payload: ApplicationReg = {
      ...formData,
      makeBy: userName,
      makeDate: new Date(),
    };

    console.log("Payload:", payload);

    const success = await createApplication(payload);

    if (success) {
      setFormData(initialState);
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Application
      </h2>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* Required Fields */}
        {requiredFields.map((field) => (
          <EditField
            key={field}
            name={field}
            label={
              <>
                {formatLabel(field)} <span className="text-red-500">*</span>
              </>
            }
            type="text"
            value={formData[field]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Optional Fields */}
        {[
          { name: "applicationUrl", label: "Application URL", type: "text" },
          {
            name: "applicationCertificateDetail",
            label: "Certificate Detail",
            type: "text",
          },
          {
            name: "certificationExpiryDate",
            label: "Certification Expiry Date",
            type: "date",
          },
          { name: "connectedApps", label: "Connected Apps", type: "text" },
          {
            name: "middlewareDetails",
            label: "Middleware Details",
            type: "text",
          },
          { name: "databaseDetails", label: "Database Details", type: "text" },
          {
            name: "loadBalancerDetails",
            label: "Load Balancer Details",
            type: "text",
          },
          { name: "buildLanguage", label: "Build Language", type: "text" },
          { name: "licenceType", label: "License Type", type: "text" },
          { name: "remarks", label: "Remarks", type: "textarea" },
          { name: "isActive", label: "Is Active", type: "boolean" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={label}
            type={type}
            value={formData[name as keyof ApplicationReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        <UniversalButton type="submit">Submit &rarr;</UniversalButton>
      </form>
    </div>
  );
}

function formatLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
