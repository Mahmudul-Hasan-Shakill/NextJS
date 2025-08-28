"use client";

import React, { useState } from "react";
import DataLoader from "../../loader/dataLoader";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useCreatePhysical } from "@/hooks/core_systems/physical/useCreatePhysical";
import { EditField } from "@/components/table/editFields";
import { PhysicalReg } from "@/types/physical";
import UniversalButton from "@/components/ui/universalButton";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

// export function PhysicalRegister() {
//   const { createPhysical, loading } = useCreatePhysical();
//   const userName = useUserDetails();

//   const requiredFields: (keyof PhysicalReg)[] = [
//     "deviceCategory",
//     "hostname",
//     "primaryIdentificationName",
//     "makeOrBrand",
//     "serverModel",
//     "serviceTag",
//     "enclosureIp",
//     "managementIp",
//     "serviceIp",
//     "zone",
//     "os",
//     "osVersion",
//   ];

//   const initialState: PhysicalReg = {
//     deviceCategory: "",
//     hostname: "",
//     primaryIdentificationName: "",
//     makeOrBrand: "",
//     serverModel: "",
//     serviceTag: "",
//     enclosureIp: "",
//     managementIp: "",
//     serviceIp: "",
//     zone: "",
//     os: "",
//     osVersion: "",
//     hypervisorEOSL: "",
//     serverEOSL: "",
//     purchasedDate: undefined,
//     installationDate: undefined,
//     purchasedFrom: "",
//     workOrderNumber: "",
//     warranty: "",
//     underAMC: false,
//     floorName: "",
//     rack: "",
//     row: "",
//     uInformation: "",
//     numberOfNICCards: undefined,
//     numberOfNICPorts: undefined,
//     numberOfHBACards: undefined,
//     numberOfHBAPorts: undefined,
//     numberOfSockets: undefined,
//     coresPerSocket: undefined,
//     isDecommissioned: false,
//     physicalCores: undefined,
//     physicalRamGb: undefined,
//     physicalDiskSize: undefined,
//     numberOfDisks: undefined,
//     diskType: "",
//     nicFirmwareVersion: "",
//     sanFirmwareVersion: "",
//     chasis: "",
//     dualConnectivity: false,
//     nicCapacity: "",
//     switchUplink: "",
//     serverUplink: "",
//     uplinkPort: "",
//     remarks: "",
//     isActive: true,
//     makeBy: userName,
//     makeDate: undefined,
//     editBy: "",
//     editDate: undefined,
//     vmIds: [],
//   };

//   const [formData, setFormData] = useState<PhysicalReg>(initialState);

//   const handleChange = (
//     e: React.ChangeEvent<any> | { target: { id: string; value: any } }
//   ) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
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

//     const numericFields: (keyof PhysicalReg)[] = [
//       "numberOfNICCards",
//       "numberOfNICPorts",
//       "numberOfHBACards",
//       "numberOfHBAPorts",
//       "numberOfSockets",
//       "coresPerSocket",
//       "physicalCores",
//       "physicalRamGb",
//       "physicalDiskSize",
//       "numberOfDisks",
//     ];

//     // Create a new payload with numeric fields converted
//     const payload: PhysicalReg = {
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

//     const success = await createPhysical(payload);

//     if (success) {
//       setFormData({ ...initialState, makeBy: userName });
//     }
//   };

//   if (loading) return <DataLoader />;

//   return (
//     <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
//       <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
//         Register Physical Server
//       </h2>
//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/physical-server-update">
//           <Button variant="default" size="sm" className="text-xs">
//             <ScanSearch className="h-4 w-4 mr-2" /> View Physical Server
//           </Button>
//         </Link>
//       </div>
//       <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]"
//       >
//         {/* Select Fields */}
//         {[
//           {
//             name: "deviceCategory",
//             label: "Device Category",
//             type: "select",
//             options: [
//               { value: "Backup", label: "Backup" },
//               { value: "HSM", label: "HSM" },
//               { value: "Power Server", label: "Power Server" },
//               { value: "Server Blade", label: "Server Blade" },
//               { value: "Server Rack", label: "Server Rack" },
//               { value: "Storage", label: "Storage" },
//               { value: "Switch", label: "Switch" },
//             ],
//           },
//           {
//             name: "zone",
//             label: "Zone",
//             type: "select",
//             options: [
//               { value: "DR DMZ", label: "DR DMZ" },
//               { value: "DR MZ", label: "DR MZ" },
//               { value: "PROD DMZ", label: "PROD DMZ" },
//               { value: "PROD MZ", label: "PROD MZ" },
//               { value: "TEST DMZ", label: "TEST DMZ" },
//               { value: "TEST MZ", label: "TEST MZ" },
//             ],
//           },
//         ].map(({ name, label, type, options }) => (
//           <EditField
//             key={name}
//             name={name}
//             label={
//               requiredFields.includes(name as keyof PhysicalReg) ? (
//                 <>
//                   {label} <span className="text-red-500">*</span>
//                 </>
//               ) : (
//                 label
//               )
//             }
//             type={type}
//             value={formData[name as keyof PhysicalReg]}
//             onChange={handleChange}
//             options={options}
//             className="text-[10px]"
//           />
//         ))}

//         {/* Text and Number Fields */}
//         {[
//           { name: "hostname", label: "Hostname", type: "text" },
//           {
//             name: "primaryIdentificationName",
//             label: "Primary ID Name",
//             type: "text",
//           },
//           { name: "makeOrBrand", label: "Make or Brand", type: "text" },
//           { name: "serverModel", label: "Server Model", type: "text" },
//           { name: "serviceTag", label: "Service Tag", type: "text" },
//           { name: "enclosureIp", label: "Enclosure IP", type: "text" },
//           { name: "managementIp", label: "Management IP", type: "text" },
//           { name: "serviceIp", label: "Service IP", type: "text" },
//           { name: "os", label: "Operating System", type: "text" },
//           { name: "osVersion", label: "OS Version", type: "text" },
//           { name: "hypervisorEOSL", label: "Hypervisor EOSL", type: "text" },
//           { name: "serverEOSL", label: "Server EOSL", type: "text" },
//           { name: "purchasedFrom", label: "Purchased From", type: "text" },
//           { name: "workOrderNumber", label: "Work Order Number", type: "text" },
//           { name: "warranty", label: "Warranty", type: "text" },
//           { name: "floorName", label: "Floor Name", type: "text" },
//           { name: "rack", label: "Rack", type: "text" },
//           { name: "row", label: "Row", type: "text" },
//           { name: "uInformation", label: "U Information", type: "text" },
//           { name: "numberOfNICCards", label: "NIC Cards", type: "number" },
//           { name: "numberOfNICPorts", label: "NIC Ports", type: "number" },
//           { name: "numberOfHBACards", label: "HBA Cards", type: "number" },
//           { name: "numberOfHBAPorts", label: "HBA Ports", type: "number" },
//           { name: "numberOfSockets", label: "Sockets", type: "number" },
//           { name: "coresPerSocket", label: "Cores per Socket", type: "number" },
//           {
//             name: "physicalCores",
//             label: "PhysicalData Cores",
//             type: "number",
//           },
//           { name: "physicalRamGb", label: "RAM (GB)", type: "number" },
//           { name: "physicalDiskSize", label: "Disk Size (GB)", type: "number" },
//           { name: "numberOfDisks", label: "Number of Disks", type: "number" },
//           { name: "diskType", label: "Disk Type", type: "text" },
//           { name: "nicFirmwareVersion", label: "NIC Firmware", type: "text" },
//           { name: "sanFirmwareVersion", label: "SAN Firmware", type: "text" },
//           { name: "chasis", label: "Chasis", type: "text" },
//           { name: "nicCapacity", label: "NIC Capacity", type: "text" },
//           { name: "switchUplink", label: "Switch Uplink", type: "text" },
//           { name: "serverUplink", label: "Server Uplink", type: "text" },
//           { name: "uplinkPort", label: "Uplink Port", type: "text" },
//         ].map(({ name, label, type }) => (
//           <EditField
//             key={name}
//             name={name}
//             label={
//               requiredFields.includes(name as keyof PhysicalReg) ? (
//                 <>
//                   {label} <span className="text-red-500">*</span>
//                 </>
//               ) : (
//                 label
//               )
//             }
//             type={type}
//             value={formData[name as keyof PhysicalReg]}
//             onChange={handleChange}
//             className="text-[10px]"
//           />
//         ))}

//         {/* Boolean Fields */}
//         {[
//           { name: "underAMC", label: "Under AMC" },
//           { name: "dualConnectivity", label: "Dual Connectivity" },
//           { name: "isDecommissioned", label: "Is Decommissioned" },
//           // { name: "isActive", label: "Is Active" },
//         ].map(({ name, label }) => (
//           <EditField
//             key={name}
//             name={name}
//             label={label}
//             type="boolean"
//             value={formData[name as keyof PhysicalReg]}
//             onChange={handleChange}
//             className="text-[10px]"
//           />
//         ))}

//         {/* Date Fields */}
//         {[
//           { name: "purchasedDate", label: "Purchased Date" },
//           { name: "installationDate", label: "Installation Date" },
//         ].map(({ name, label }) => (
//           <EditField
//             key={name}
//             name={name}
//             label={label}
//             type="date"
//             value={formData[name as keyof PhysicalReg]}
//             onChange={handleChange}
//             className="text-[10px]"
//           />
//         ))}

//         {/* Remarks */}
//         <div className="col-span-1 md:col-span-2">
//           <EditField
//             name="remarks"
//             label="Remarks"
//             type="textarea"
//             value={formData.remarks}
//             onChange={handleChange}
//             className="text-[10px]"
//           />
//         </div>

//         {/* Submit Button */}
//         <UniversalButton type="submit">Submit &rarr;</UniversalButton>
//       </form>
//     </div>
//   );
// }

export function PhysicalRegister() {
  const { createPhysical, loading } = useCreatePhysical();
  const userName = useUserDetails();

  const requiredFields: (keyof PhysicalReg)[] = [
    "deviceCategory",
    "hostname",
    "os",
  ];

  const initialState: PhysicalReg = {
    deviceCategory: "",
    hostname: "",
    makeOrBrand: "",
    serverModel: "",
    enclosureIp: "",
    managementIp: "",
    serviceIp: "",
    dcZone: "",
    drZone: "",
    rack: "",
    floorName: "",
    dimensionMm: "",
    dimensionRackU: undefined,
    uInformation: "",
    numberOfNICPorts: "",
    numberOfHBAPorts: "",
    numberOfSockets: undefined,
    coresPerSocket: undefined,
    totalVcpu: undefined,
    physicalRamGb: undefined,
    custodianInformation: "",
    os: "",
    osClusterName: "",
    latestPatchVersion: "",
    osIpAddress: "",
    subnetMask: "",
    defaultGateway: "",
    serviceVlan: "",
    onmIpGateway: "",
    onmIpMask: "",
    onmVlan: "",
    primaryDns: "",
    secondaryDns: "",
    dualConnectivity: "",
    nicCapacity: "",
    rdpEnabled: false,
    switchUplink: "",
    serverUplink: "",
    uplinkPort: "",
    dbName: "",
    dbVirtualIp: "",
    dbAdditionalIp: "",
    dbInstance: "",
    dbVersion: "",
    rdmsType: "",
    dbPort: "",
    dbStatus: "",
    dbType: "",
    dbOwnerEmail: "",
    environmentCategory: "",
    serviceName: "",
    middlewareDetails: "",
    loadBalancerDetails: "",
    oem: "",
    maintenanceVendor: "",
    eolDate: undefined,
    eosDate: undefined,
    backupAvailable: "",
    backupType: "",
    backupSchedule: "",
    powerConnectivity: "",
    powerRedundancy: "",
    powerRedundancyMethodology: "",
    inputPowerType: "",
    powerPhase: "",
    powerConsumptionVa: "",
    infraMonitoring: false,
    appMonitoring: false,
    loginProtocol: "",
    serverStatus: "",
    serverType: "",
    serverMacAddress: "",
    remarks: "",
    isActive: true,
    makeBy: userName,
    makeDate: new Date(),
    editBy: "",
    editDate: undefined,
    vmIds: [],
  };

  const [formData, setFormData] = useState<PhysicalReg>(initialState);

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

    const numericFields: (keyof PhysicalReg)[] = [
      "dimensionRackU",
      "numberOfSockets",
      "coresPerSocket",
      "totalVcpu",
      "physicalRamGb",
      "vmIds",
    ];

    // Create a new payload with numeric fields converted
    const payload: PhysicalReg = {
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
    <div className="mx-auto w-full max-w-6xl bg-gray-100 p-6 rounded-lg shadow-md dark:bg-zinc-950 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register Physical Server
      </h2>
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/physical-server-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Physical Server
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
            name: "deviceCategory",
            label: "Device Category",
            type: "select",
            options: [
              { value: "Database", label: "Database" },
              { value: "Backup", label: "Backup" },
              { value: "Server", label: "Server" },
              { value: "Storage", label: "Storage" },
            ],
          },
          {
            name: "dcZone",
            label: "DC Zone",
            type: "select",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          },
          {
            name: "drZone",
            label: "DR Zone",
            type: "select",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          },
          {
            name: "managementIp",
            label: "Management IP",
            type: "select",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          },
          {
            name: "dualConnectivity",
            label: "Dual Connectivity",
            type: "select",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
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
              { value: "LDOM", label: "LDOM" },
              { value: "Physical", label: "Physical" },
            ],
          },
          {
            name: "serverStatus",
            label: "Server Status",
            type: "select",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          },
          {
            name: "backupAvailable",
            label: "Backup Available",
            type: "select",
            options: [
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ],
          },
        ].map(({ name, label, type, options }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof PhysicalReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof PhysicalReg]}
            onChange={handleChange}
            options={options}
            className="text-[10px]"
          />
        ))}

        {/* Text and Number Fields */}
        {[
          // Server Information
          { name: "hostname", label: "Hostname", type: "text" },
          { name: "makeOrBrand", label: "Make or Brand", type: "text" },
          { name: "serverModel", label: "Server Model", type: "text" },
          { name: "enclosureIp", label: "Enclosure IP", type: "text" },
          { name: "serviceIp", label: "Service IP", type: "text" },
          { name: "loginProtocol", label: "Login Protocol", type: "text" },

          {
            name: "serverMacAddress",
            label: "Server MacAddress",
            type: "text",
          },
          { name: "os", label: "Operating System", type: "text" },
          { name: "osClusterName", label: "OS Cluster Name", type: "text" },
          {
            name: "latestPatchVersion",
            label: "Latest Patch Version",
            type: "text",
          },
          { name: "osIpAddress", label: "OS IP Address", type: "text" },
          { name: "subnetMask", label: "Subnet Mask", type: "text" },
          { name: "defaultGateway", label: "Default Gateway", type: "text" },
          { name: "serviceVlan", label: "Service VLAN", type: "text" },
          { name: "onmIpGateway", label: "ONM IP Gateway", type: "text" },
          { name: "onmIpMask", label: "ONM IP Mask", type: "text" },
          { name: "onmVlan", label: "ONM VLAN", type: "text" },
          { name: "primaryDns", label: "Primary DNS", type: "text" },
          { name: "secondaryDns", label: "Secondary DNS", type: "text" },
          { name: "nicCapacity", label: "NIC Capacity", type: "text" },
          { name: "switchUplink", label: "Switch Uplink", type: "text" },
          { name: "serverUplink", label: "Server Uplink", type: "text" },
          { name: "uplinkPort", label: "Uplink Port", type: "text" },

          // Database Information
          { name: "dbName", label: "DB Name", type: "text" },
          { name: "dbVirtualIp", label: "DB Virtual IP", type: "text" },
          { name: "dbAdditionalIp", label: "DB Additional IP", type: "text" },
          { name: "dbInstance", label: "DB Instance", type: "text" },
          { name: "dbVersion", label: "DB Version", type: "text" },
          { name: "rdmsType", label: "RDBMS Type", type: "text" },
          { name: "dbPort", label: "DB Port", type: "text" },
          { name: "dbStatus", label: "DB Status", type: "text" },
          { name: "dbType", label: "DB Type", type: "text" },
          { name: "dbOwnerEmail", label: "DB Owner Email", type: "text" },

          // Environment and Service Information
          {
            name: "environmentCategory",
            label: "Environment Category",
            type: "text",
          },
          { name: "serviceName", label: "Service Name", type: "text" },
          {
            name: "middlewareDetails",
            label: "Middleware Details",
            type: "text",
          },
          {
            name: "loadBalancerDetails",
            label: "Load Balancer Details",
            type: "text",
          },
          { name: "oem", label: "OEM", type: "text" },
          {
            name: "maintenanceVendor",
            label: "Maintenance Vendor",
            type: "text",
          },

          // Backup and Power Information

          { name: "backupType", label: "Backup Type", type: "text" },
          { name: "backupSchedule", label: "Backup Schedule", type: "text" },
          {
            name: "powerConnectivity",
            label: "Power Connectivity",
            type: "text",
          },
          { name: "powerRedundancy", label: "Power Redundancy", type: "text" },
          {
            name: "powerRedundancyMethodology",
            label: "Power Redundancy Methodology",
            type: "text",
          },
          { name: "inputPowerType", label: "Input Power Type", type: "text" },
          { name: "powerPhase", label: "Power Phase", type: "text" },
          {
            name: "powerConsumptionVa",
            label: "Power Consumption (VA)",
            type: "text",
          },

          // Monitoring and Status
          {
            name: "infraMonitoring",
            label: "Infra Monitoring",
            type: "boolean",
          },
          { name: "appMonitoring", label: "App Monitoring", type: "boolean" },
          { name: "remarks", label: "Remarks", type: "textarea" },
          { name: "isActive", label: "Is Active", type: "boolean" },
        ].map(({ name, label, type }) => (
          <EditField
            key={name}
            name={name}
            label={
              requiredFields.includes(name as keyof PhysicalReg) ? (
                <>
                  {label} <span className="text-red-500">*</span>
                </>
              ) : (
                label
              )
            }
            type={type}
            value={formData[name as keyof PhysicalReg]}
            onChange={handleChange}
            className="text-[10px]"
          />
        ))}

        {/* Submit Button */}
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
