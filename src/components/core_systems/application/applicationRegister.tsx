"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateApplication } from "@/hooks/core_systems/application/useCreateApplication";
import { ApplicationReg } from "@/types/application";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";
import { useIpAddresses } from "@/hooks/core_systems/automation/useIpAddresses";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

type FieldConfig = {
  name: keyof ApplicationReg | string;
  label: string;
  type: string;
  required?: boolean;
  options?: { value: any; label: string }[];
};

export function ApplicationRegister() {
  const { createApplication, loading } = useCreateApplication();
  const userName = useUserDetails();
  const { osIpAddresses } = useOsIpAddresses();
  const { ipAddresses } = useIpAddresses();

  const requiredFields: (keyof ApplicationReg)[] = [
    "environment",
    "serviceName",
    "serviceOwner",
    "applicationCategory",
    "appModule",
    "appOwner",
    "appOwnerEmail",
    "vmIds",
    "automationIds",
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
    vmIds: [],
    automationIds: [],
  };

  const [formData, setFormData] = useState<ApplicationReg>(initialState);

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleVmChange = (selectedIds: number[]) => {
    setFormData((prev) => ({ ...prev, vmIds: selectedIds }));
  };

  const handleAutomationChange = (selectedIds: number[]) => {
    setFormData((prev) => ({ ...prev, automationIds: selectedIds }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const missingFields = requiredFields.filter(
      (field) =>
        formData[field] === undefined ||
        formData[field] === "" ||
        formData[field] === null ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
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

  const fieldConfigs: FieldConfig[] = [
    // Required fields
    // ...requiredFields.map(
    //   (field): FieldConfig => ({
    //     name: field,
    //     label: formatLabel(field),
    //     type: field === "vmIds" ? "multiselect" : "text",
    //     required: true,
    //     options:
    //       field === "vmIds"
    //         ? osIpAddresses.map((vm: any) => ({
    //             value: vm.id,
    //             label: vm.osIpAddress,
    //           }))
    //         : undefined,
    //   })
    // ),
    ...requiredFields.map(
      (field): FieldConfig => ({
        name: field,
        label: formatLabel(field),
        type:
          field === "vmIds" || field === "automationIds"
            ? "multiselect"
            : "text",
        required: true,
        options:
          field === "vmIds"
            ? osIpAddresses.map((vm: any) => ({
                value: vm.id,
                label: vm.osIpAddress,
              }))
            : field === "automationIds"
            ? ipAddresses.map((auto: any) => ({
                value: auto.id,
                label: auto.ipAddress,
              }))
            : undefined,
      })
    ),

    // Optional fields
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
    { name: "middlewareDetails", label: "Middleware Details", type: "text" },
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
  ];

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Application
      </h2>
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/application-server-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Application Server
          </Button>
        </Link>
      </div>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {fieldConfigs.map(({ name, label, type, required, options }) => (
          <EditField
            key={name}
            name={name}
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
            value={formData[name as keyof ApplicationReg]}
            // onChange={
            //   name === "vmIds"
            //     ? (e) => {
            //         const selected = Array.isArray(e.target.value)
            //           ? e.target.value.map((val: any) => Number(val))
            //           : [Number(e.target.value)];
            //         handleVmChange(selected);
            //       }
            //     : handleChange
            // }
            onChange={
              name === "vmIds"
                ? (e) => {
                    const selected = Array.isArray(e.target.value)
                      ? e.target.value.map((val: any) => Number(val))
                      : [Number(e.target.value)];
                    handleVmChange(selected);
                  }
                : name === "automationIds"
                ? (e) => {
                    const selected = Array.isArray(e.target.value)
                      ? e.target.value.map((val: any) => Number(val))
                      : [Number(e.target.value)];
                    handleAutomationChange(selected);
                  }
                : handleChange
            }
            options={options}
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
