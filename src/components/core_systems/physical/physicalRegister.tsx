"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useCreatePhysical } from "@/hooks/useCreatePhysical";
import { EditField } from "@/components/table/editFields";
import { PhysicalData } from "@/types/physical";

export function PhysicalRegister() {
  const { createPhysical, loading } = useCreatePhysical();
  const userName = useUserDetails();

  const requiredFields: (keyof PhysicalData)[] = [
    "deviceCategory",
    "hostname",
    "primaryIdentificationName",
    "makeOrBrand",
    "serverModel",
    "serviceTag",
    "enclosureIp",
    "managementIp",
    "serviceIp",
    "zone",
    "os",
    "osVersion",
  ];

  const initialState: PhysicalData = {
    deviceCategory: "",
    hostname: "",
    primaryIdentificationName: "",
    makeOrBrand: "",
    serverModel: "",
    serviceTag: "",
    enclosureIp: "",
    managementIp: "",
    serviceIp: "",
    zone: "",
    os: "",
    osVersion: "",
    hypervisorEOSL: "",
    serverEOSL: "",
    purchasedDate: undefined,
    installationDate: undefined,
    purchasedFrom: "",
    workOrderNumber: "",
    warranty: "",
    underAMC: false,
    floorName: "",
    rack: "",
    row: "",
    uInformation: "",
    numberOfNICCards: undefined,
    numberOfNICPorts: undefined,
    numberOfHBACards: undefined,
    numberOfHBAPorts: undefined,
    numberOfSockets: undefined,
    coresPerSocket: undefined,
    isDecommissioned: false,
    physicalCores: undefined,
    physicalRamGb: undefined,
    physicalDiskSize: undefined,
    numberOfDisks: undefined,
    diskType: "",
    nicFirmwareVersion: "",
    sanFirmwareVersion: "",
    chasis: "",
    dualConnectivity: false,
    nicCapacity: "",
    switchUplink: "",
    serverUplink: "",
    uplinkPort: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: undefined,
    editBy: "",
    editDate: undefined,
    vmIds: [],
  };

  const [formData, setFormData] = useState<PhysicalData>(initialState);

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

    const numericFields: (keyof PhysicalData)[] = [
      "numberOfNICCards",
      "numberOfNICPorts",
      "numberOfHBACards",
      "numberOfHBAPorts",
      "numberOfSockets",
      "coresPerSocket",
      "physicalCores",
      "physicalRamGb",
      "physicalDiskSize",
      "numberOfDisks",
    ];

    // Create a new payload with numeric fields converted
    const payload: PhysicalData = {
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

    const success = await createPhysical(payload);

    if (success) {
      setFormData({ ...initialState, makeBy: userName });
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Physical Server
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
            name: "zone",
            label: "Zone",
            type: "select",
            options: [
              { value: "DMZ", label: "DMZ" },
              { value: "Internal", label: "Internal" },
              { value: "External", label: "External" },
            ],
          },
        ].map(({ name, label, type, options }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof PhysicalData) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof PhysicalData]}
            onChange={handleChange}
            options={options}
            className="text-[10px]"
          />
        ))}

        {/* Text and Number Fields */}
        {[
          { name: "hostname", label: "Hostname", type: "text" },
          {
            name: "primaryIdentificationName",
            label: "Primary ID Name",
            type: "text",
          },
          { name: "makeOrBrand", label: "Make or Brand", type: "text" },
          { name: "serverModel", label: "Server Model", type: "text" },
          { name: "serviceTag", label: "Service Tag", type: "text" },
          { name: "enclosureIp", label: "Enclosure IP", type: "text" },
          { name: "managementIp", label: "Management IP", type: "text" },
          { name: "serviceIp", label: "Service IP", type: "text" },
          { name: "os", label: "Operating System", type: "text" },
          { name: "osVersion", label: "OS Version", type: "text" },
          { name: "hypervisorEOSL", label: "Hypervisor EOSL", type: "text" },
          { name: "serverEOSL", label: "Server EOSL", type: "text" },
          { name: "purchasedFrom", label: "Purchased From", type: "text" },
          { name: "workOrderNumber", label: "Work Order Number", type: "text" },
          { name: "warranty", label: "Warranty", type: "text" },
          { name: "floorName", label: "Floor Name", type: "text" },
          { name: "rack", label: "Rack", type: "text" },
          { name: "row", label: "Row", type: "text" },
          { name: "uInformation", label: "U Information", type: "text" },
          { name: "numberOfNICCards", label: "NIC Cards", type: "number" },
          { name: "numberOfNICPorts", label: "NIC Ports", type: "number" },
          { name: "numberOfHBACards", label: "HBA Cards", type: "number" },
          { name: "numberOfHBAPorts", label: "HBA Ports", type: "number" },
          { name: "numberOfSockets", label: "Sockets", type: "number" },
          { name: "coresPerSocket", label: "Cores per Socket", type: "number" },
          {
            name: "physicalCores",
            label: "PhysicalData Cores",
            type: "number",
          },
          { name: "physicalRamGb", label: "RAM (GB)", type: "number" },
          { name: "physicalDiskSize", label: "Disk Size (GB)", type: "number" },
          { name: "numberOfDisks", label: "Number of Disks", type: "number" },
          { name: "diskType", label: "Disk Type", type: "text" },
          { name: "nicFirmwareVersion", label: "NIC Firmware", type: "text" },
          { name: "sanFirmwareVersion", label: "SAN Firmware", type: "text" },
          { name: "chasis", label: "Chasis", type: "text" },
          { name: "nicCapacity", label: "NIC Capacity", type: "text" },
          { name: "switchUplink", label: "Switch Uplink", type: "text" },
          { name: "serverUplink", label: "Server Uplink", type: "text" },
          { name: "uplinkPort", label: "Uplink Port", type: "text" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof PhysicalData) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof PhysicalData]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Boolean Fields */}
        {[
          { name: "underAMC", label: "Under AMC" },
          { name: "dualConnectivity", label: "Dual Connectivity" },
          { name: "isDecommissioned", label: "Is Decommissioned" },
          // { name: "isActive", label: "Is Active" },
        ].map(({ name, label }) => (
          <EditField
            key={name}
            name={name}
            label={label}
            type="boolean"
            value={formData[name as keyof PhysicalData]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Date Fields */}
        {[
          { name: "purchasedDate", label: "Purchased Date" },
          { name: "installationDate", label: "Installation Date" },
        ].map(({ name, label }) => (
          <EditField
            key={name}
            name={name}
            label={label}
            type="date"
            value={formData[name as keyof PhysicalData]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Remarks */}
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

        {/* Submit Button */}
        <button
          className="group/btn relative block col-span-1 md:col-span-2 mt-4 h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow dark:bg-zinc-800"
          type="submit"
        >
          Submit &rarr; <BottomGradient />
        </button>
      </form>
    </div>
  );
}

function formatLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
