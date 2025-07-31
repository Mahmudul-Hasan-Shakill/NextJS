"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreateAutomation } from "@/hooks/core_systems/automation/useCreateAutomation";
import { AutomationReg } from "@/types/automation";
import { EditField } from "@/components/table/editFields";
import UniversalButton from "@/components/ui/universalButton";
import { ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AutomationFileParserUploader from "@/components/utility/fileParsingUpload";
import { useAutomationFileParser } from "@/hooks/utility/useAutomatedParser";

export function AutomationRegister() {
  const { createAutomation, loading } = useCreateAutomation();
  const userName = useUserDetails();

  const requiredFields: (keyof AutomationReg)[] = [
    "hostname",
    "ipAddress",
    "serverEnvironment",
    "osVersion",
    "serverPlatform",
    "sshPort",
  ];

  const numericFields: (keyof AutomationReg)[] = [
    "cpuPhysicalCores",
    "cpuVirtualCores",
    "sshPort",
    "sockets",
    "systemUsersCount",
  ];

  const initialState: AutomationReg = {
    hostname: "",
    ipAddress: "",
    serverEnvironment: "",
    cpuPhysicalCores: undefined,
    cpuVirtualCores: undefined,
    cpuModel: "",
    totalRam: "",
    totalDiskSize: "",
    osVersion: "",
    kernelVersion: "",
    serverPlatform: "",
    serialNumber: "",
    sshPort: "",
    sockets: undefined,
    lastPatchInstalled: undefined,
    systemUptime: "",
    falconInstalled: "",
    falconVersion: "",
    falconInstallDate: undefined,
    falconStatus: "",
    qualysInstalled: "",
    qualysVersion: "",
    qualysInstallDate: undefined,
    qualysStatus: "",
    diskTotalSize: "",
    diskUsed: "",
    diskFree: "",
    subnetMask: "",
    gateway: "",
    networkIp: "",
    ntpService: "",
    ntpServers: "",
    ntpSyncSource: "",
    systemUsersCount: undefined,
    sudoUsers: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
    applicationIds: [],
    databaseIds: [],
  };

  const [formData, setFormData] = useState<AutomationReg>(initialState);

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

    const payload: AutomationReg = {
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

    const success = await createAutomation(payload);

    if (success) {
      setFormData({ ...initialState, makeBy: userName });
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Automation Server
      </h2>
      <div>
        <AutomationFileParserUploader useParserHook={useAutomationFileParser} />
      </div>

      <div className="flex justify-end mb-4">
        <Link href="/core-systems/automatic-server-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Automation Servers
          </Button>
        </Link>
      </div>
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
      >
        {/* Select Fields */}
        {[
          {
            name: "serverEnvironment",
            label: "Server Environment",
            type: "select",
            options: [
              { value: "Production", label: "Production" },
              { value: "Staging", label: "Staging" },
              { value: "Development", label: "Development" },
              { value: "Testing", label: "Testing" },
            ],
          },
          {
            name: "serverPlatform",
            label: "Server Platform",
            type: "select",
            options: [
              { value: "Linux", label: "Linux" },
              { value: "Windows", label: "Windows" },
              { value: "AIX", label: "AIX" },
              { value: "Solaris", label: "Solaris" },
            ],
          },
          {
            name: "falconInstalled",
            label: "Falcon Installed",
            type: "select",
            options: [
              { value: "Installed", label: "Installed" },
              { value: "Not installed", label: "Not installed" },
            ],
          },
          {
            name: "qualysInstalled",
            label: "Qualys Installed",
            type: "select",
            options: [
              { value: "Installed", label: "Installed" },
              { value: "Not installed", label: "Not installed" },
            ],
          },
        ].map(({ name, label, type, options }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof AutomationReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof AutomationReg]}
            onChange={handleChange}
            options={options}
            className="text-[10px]"
          />
        ))}

        {/* Text and Number Fields */}
        {[
          { name: "hostname", label: "Hostname", type: "text" },
          { name: "ipAddress", label: "IP Address", type: "text" },
          {
            name: "cpuPhysicalCores",
            label: "CPU Physical Cores",
            type: "number",
          },
          {
            name: "cpuVirtualCores",
            label: "CPU Virtual Cores",
            type: "number",
          },
          { name: "cpuModel", label: "CPU Model", type: "text" },
          { name: "totalRam", label: "Total RAM", type: "text" },
          { name: "totalDiskSize", label: "Total Disk Size", type: "text" },
          { name: "osVersion", label: "OS Version", type: "text" },
          { name: "kernelVersion", label: "Kernel Version", type: "text" },
          { name: "serialNumber", label: "Serial Number", type: "text" },
          { name: "sshPort", label: "SSH Port", type: "text" },
          { name: "sockets", label: "Sockets", type: "number" },
          { name: "systemUptime", label: "System Uptime", type: "text" },
          { name: "falconStatus", label: "Falcon Status", type: "text" },
          { name: "falconVersion", label: "Falcon Version", type: "text" },
          { name: "qualysStatus", label: "Qualys Status", type: "text" },
          { name: "qualysVersion", label: "Qualys Version", type: "text" },
          { name: "diskTotalSize", label: "Mounted Disk Size", type: "text" },
          { name: "diskUsed", label: "Disk Used", type: "text" },
          { name: "diskFree", label: "Disk Free", type: "text" },
          { name: "subnetMask", label: "Subnet Mask", type: "text" },
          { name: "gateway", label: "Gateway", type: "text" },
          { name: "networkIp", label: "Network IP", type: "text" },
          { name: "ntpService", label: "NTP Service", type: "text" },
          { name: "ntpServers", label: "NTP Servers", type: "text" },
          { name: "ntpSyncSource", label: "NTP Sync Source", type: "text" },
          {
            name: "systemUsersCount",
            label: "System Users Count",
            type: "number",
          },
          { name: "sudoUsers", label: "Sudo Users", type: "text" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof AutomationReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof AutomationReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Date Fields */}
        {[
          { name: "lastPatchInstalled", label: "Last Patch Installed" },
          { name: "falconInstallDate", label: "Falcon Install Date" },
          { name: "qualysInstallDate", label: "Qualys Install Date" },
        ].map(({ name, label }) => (
          <EditField
            key={name}
            name={name}
            label={label}
            type="date"
            value={formData[name as keyof AutomationReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Boolean Fields */}
        {[{ name: "isActive", label: "Is Active" }].map(({ name, label }) => (
          <EditField
            key={name}
            name={name}
            label={label}
            type="boolean"
            value={formData[name as keyof AutomationReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Textarea Field */}
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
