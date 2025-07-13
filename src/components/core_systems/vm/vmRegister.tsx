"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateVm } from "@/hooks/core_systems/vm/useCreateVm";
import { VmData } from "@/types/vm";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";

export function VmRegister() {
  const { createVm, loading } = useCreateVm();
  const userName = useUserDetails();

  const requiredFields: (keyof VmData)[] = [
    "deviceCategory",
    "hostname",
    "osIpAddress",
    "sshPort",
    "platform",
    "osVersion",
    "serverStatus",
  ];

  const numericFields: (keyof VmData)[] = [
    "sshPort",
    "volumeSize",
    "totalSocket",
    "vcpu",
    "ramGb",
    "hddSize",
    "physicalId",
  ];

  const initialState: VmData = {
    deviceCategory: "",
    hostname: "",
    osIpAddress: "",
    sshPort: 22,
    osSubnetMask: "",
    osDefaultGateway: "",
    serverType: "",
    volumeLabel: "",
    volumeSize: undefined,
    loginProtocol: "",
    patchVersion: "",
    kernelVersion: "",
    platform: "",
    osVersion: "",
    osClusterName: "",
    lastPatchingDate: undefined,
    serverStatus: "",
    isDecommissioned: false,
    totalSocket: undefined,
    vcpu: undefined,
    ramGb: undefined,
    hddSize: undefined,
    custodianInfo: "",
    rdpEnabled: false,
    managementIpActive: false,
    backupAvailable: false,
    backupType: "",
    backupSchedule: "",
    fileSystemBackupPath: "",
    backupDbName: "",
    backupRetention: "",
    databaseInfo: "",
    applicationInfo: "",
    physicalServer: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
    applicationIds: [],
    databaseIds: [],
    physicalId: undefined,
  };

  const [formData, setFormData] = useState<VmData>(initialState);

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

    const payload: VmData = {
      ...formData,
      makeBy: userName,
      makeDate: new Date(),
    }; // Convert numeric fields to actual numbers

    numericFields.forEach((field) => {
      const value = formData[field];
      if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        (payload as any)[field] = isNaN(parsed) ? undefined : parsed;
      }
    });

    console.log("Payload:", payload);

    const success = await createVm(payload);

    if (success) {
      setFormData({ ...initialState, makeBy: userName });
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Virtual Machine
      </h2>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* Select Fields */}
        {[
          {
            name: "deviceCategory",
            label: "Device Category",
            type: "select",
            options: [
              { value: "Server", label: "Server" },
              { value: "Storage", label: "Storage" },
              { value: "Backup", label: "Backup" },
              { value: "Switch", label: "Switch" },
            ],
          },
          {
            name: "serverType",
            label: "Server Type",
            type: "select",
            options: [
              { value: "VMware", label: "VMware" },
              { value: "KVM", label: "KVM" },
              { value: "LPAR", label: "LPAR" },
            ],
          },
        ].map(({ name, label, type, options }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof VmData) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof VmData]}
            onChange={handleChange}
            options={options}
            className="text-[10px]"
          />
        ))}
        {[
          // { name: "deviceCategory", label: "Device Category", type: "text" },
          { name: "hostname", label: "Hostname", type: "text" },
          { name: "osIpAddress", label: "OS IP Address", type: "text" },
          { name: "sshPort", label: "SSH Port", type: "number" },
          { name: "osSubnetMask", label: "OS Subnet Mask", type: "text" },
          {
            name: "osDefaultGateway",
            label: "OS Default Gateway",
            type: "text",
          },
          // { name: "serverType", label: "Server Type", type: "text" },
          { name: "volumeLabel", label: "Volume Label", type: "text" },
          { name: "volumeSize", label: "Volume Size", type: "number" },
          { name: "loginProtocol", label: "Login Protocol", type: "text" },
          { name: "patchVersion", label: "Patch Version", type: "text" },
          { name: "kernelVersion", label: "Kernel Version", type: "text" },
          { name: "platform", label: "Platform", type: "text" },
          { name: "osVersion", label: "OS Version", type: "text" },
          { name: "osClusterName", label: "OS Cluster Name", type: "text" },
          {
            name: "lastPatchingDate",
            label: "Last Patching Date",
            type: "date",
          },
          { name: "serverStatus", label: "Server Status", type: "text" },
          { name: "totalSocket", label: "Total Socket", type: "number" },
          { name: "vcpu", label: "vCPU", type: "number" },
          { name: "ramGb", label: "RAM (GB)", type: "number" },
          { name: "hddSize", label: "HDD Size (GB)", type: "number" },
          { name: "custodianInfo", label: "Custodian Info", type: "text" },
          { name: "backupType", label: "Backup Type", type: "text" },
          { name: "backupSchedule", label: "Backup Schedule", type: "text" },
          {
            name: "fileSystemBackupPath",
            label: "File System Backup Path",
            type: "text",
          },
          { name: "backupDbName", label: "Backup Database Name", type: "text" },
          { name: "backupRetention", label: "Backup Retention", type: "text" },
          { name: "databaseInfo", label: "Database Info", type: "text" },
          { name: "applicationInfo", label: "Application Info", type: "text" },
          { name: "physicalServer", label: "Physical Server", type: "text" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof VmData) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof VmData]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}
        {[
          { name: "isDecommissioned", label: "Is Decommissioned" },
          { name: "rdpEnabled", label: "RDP Enabled" },
          { name: "managementIpActive", label: "Management IP Active" },
          { name: "backupAvailable", label: "Backup Available" },
          { name: "isActive", label: "Is Active" },
        ].map(({ name, label }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof VmData) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type="boolean"
            value={formData[name as keyof VmData]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}
        <div className="col-span-1 md:col-span-2">
          <EditField
            name="remarks"
            label="Remarks"
            type="textarea"
            value={formData.remarks}
            onChange={handleChange}
            className="text-[10px]"
          />
        </div>
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

