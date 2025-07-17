"use client";

import { useState } from "react";
import { DataTable } from "../../table/dataTable";
import { Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllPhysicals } from "@/hooks/core_systems/physical/useAllPhysicals";
import { useDeletePhysical } from "@/hooks/core_systems/physical/useDeletePhysical";
import { useUpdatePhysical } from "@/hooks/core_systems/physical/useUpdatePhysical";
import { PhysicalEdit } from "@/types/physical";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";

// export default function PhysicalAction() {
//   const { physicals, mutate } = useAllPhysicals();
//   const [viewPhysical, setViewPhysical] = useState<PhysicalEdit | null>(null);
//   const [editPhysical, setEditPhysical] = useState<PhysicalEdit | null>(null);
//   const [deletePhysicalTarget, setDeletePhysicalTarget] =
//     useState<PhysicalEdit | null>(null);
//   const { deletePhysical } = useDeletePhysical();
//   const { updatePhysical } = useUpdatePhysical();
//   const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

//   const handleDeletePhysical = async (physical: PhysicalEdit) => {
//     try {
//       await deletePhysical(physical.id);
//       setDeletePhysicalTarget(null);
//       setViewPhysical(null);
//       mutate();
//     } catch (error) {}
//   };

//   const handleUpdatePhysical = async (updated: PhysicalEdit) => {
//     try {
//       const editableKeys = columns.map((col) => col.key);
//       const payload = Object.fromEntries(
//         Object.entries(updated).filter(([key]) =>
//           editableKeys.includes(key as keyof PhysicalEdit)
//         )
//       );
//       await updatePhysical(updated.id, payload);
//       setEditPhysical(null);
//       mutate();
//     } catch (error) {}
//   };

//   const columns: Column<PhysicalEdit>[] = [
//     {
//       key: "deviceCategory",
//       label: "Device Category",
//       type: "select",
//       options: [
//         { value: "Server", label: "Server" },
//         { value: "Storage", label: "Storage" },
//         { value: "Backup", label: "Backup" },
//         { value: "Switch", label: "Switch" },
//       ],
//     },
//     { key: "hostname", label: "Hostname", type: "text" },
//     {
//       key: "primaryIdentificationName",
//       label: "Primary ID Name",
//       type: "text",
//     },
//     { key: "makeOrBrand", label: "Make or Brand", type: "text" },
//     { key: "serverModel", label: "Server Model", type: "text" },
//     { key: "serviceTag", label: "Service Tag", type: "text" },
//     { key: "enclosureIp", label: "Enclosure IP", type: "text" },
//     { key: "managementIp", label: "Management IP", type: "text" },
//     { key: "serviceIp", label: "Service IP", type: "text" },
//     { key: "zone", label: "Zone", type: "text" },
//     { key: "os", label: "Operating System", type: "text" },
//     { key: "osVersion", label: "OS Version", type: "text" },
//     { key: "hypervisorEOSL", label: "Hypervisor EOSL", type: "text" },
//     { key: "serverEOSL", label: "Server EOSL", type: "text" },
//     { key: "purchasedDate", label: "Purchased Date", type: "date" },
//     { key: "installationDate", label: "Installation Date", type: "date" },
//     { key: "purchasedFrom", label: "Purchased From", type: "text" },
//     { key: "workOrderNumber", label: "Work Order Number", type: "text" },
//     { key: "warranty", label: "Warranty", type: "text" },
//     { key: "underAMC", label: "Under AMC", type: "boolean" },
//     { key: "floorName", label: "Floor Name", type: "text" },
//     { key: "rack", label: "Rack", type: "text" },
//     { key: "row", label: "Row", type: "text" },
//     { key: "uInformation", label: "U Information", type: "text" },
//     { key: "numberOfNICCards", label: "NIC Cards", type: "number" },
//     { key: "numberOfNICPorts", label: "NIC Ports", type: "number" },
//     { key: "numberOfHBACards", label: "HBA Cards", type: "number" },
//     { key: "numberOfHBAPorts", label: "HBA Ports", type: "number" },
//     { key: "numberOfSockets", label: "Sockets", type: "number" },
//     { key: "coresPerSocket", label: "Cores per Socket", type: "number" },
//     { key: "physicalCores", label: "Physical Cores", type: "number" },
//     { key: "physicalRamGb", label: "RAM (GB)", type: "number" },
//     { key: "physicalDiskSize", label: "Disk Size (GB)", type: "number" },
//     { key: "numberOfDisks", label: "Number of Disks", type: "number" },
//     { key: "diskType", label: "Disk Type", type: "text" },
//     { key: "nicFirmwareVersion", label: "NIC Firmware", type: "text" },
//     { key: "sanFirmwareVersion", label: "SAN Firmware", type: "text" },
//     { key: "chasis", label: "Chasis", type: "text" },
//     { key: "dualConnectivity", label: "Dual Connectivity", type: "boolean" },
//     { key: "nicCapacity", label: "NIC Capacity", type: "text" },
//     { key: "switchUplink", label: "Switch Uplink", type: "text" },
//     { key: "serverUplink", label: "Server Uplink", type: "text" },
//     { key: "uplinkPort", label: "Uplink Port", type: "text" },
//     { key: "remarks", label: "Remarks", type: "textarea" },
//     { key: "isDecommissioned", label: "Is Decommissioned", type: "boolean" },
//     { key: "isActive", label: "Is Active", type: "boolean" },
//   ];

//   return (
//     <div className="w-full p-4 text-[10px]">
//       {/* Header with button */}
//       <div className="flex justify-end mb-4">
//         <Link href="/core-systems/physical-server-creation">
//           <Button variant="default" size="sm" className="text-xs">
//             <FilePlus2 className="h-4 w-4 mr-2" /> Create Physical Server
//           </Button>
//         </Link>
//       </div>

//       {/* Data Table */}
//       <DataTable
//         columns={columns}
//         data={physicals}
//         tableName="physical_list"
//         onView={(row) => setViewPhysical(row)}
//         onEdit={(row) => setEditPhysical(row)}
//         onDelete={(row) => setDeletePhysicalTarget(row)}
//         onBulkDelete={(ids) => setBulkDeleteIds(ids)}
//       />

//       {viewPhysical && (
//         <ViewModal
//           row={viewPhysical}
//           columns={columns}
//           onClose={() => setViewPhysical(null)}
//         />
//       )}

//       {editPhysical && (
//         <EditModal
//           row={editPhysical}
//           columns={columns}
//           open={!!editPhysical}
//           onClose={() => setEditPhysical(null)}
//           onSubmit={handleUpdatePhysical}
//         />
//       )}

//       {deletePhysicalTarget && (
//         <ConfirmDeleteDialog
//           row={deletePhysicalTarget}
//           open={!!deletePhysicalTarget}
//           onClose={() => setDeletePhysicalTarget(null)}
//           onConfirm={handleDeletePhysical}
//         />
//       )}
//       {bulkDeleteIds.length > 0 && (
//         <ConfirmBulkDeleteDialog
//           ids={bulkDeleteIds}
//           open={bulkDeleteIds.length > 0}
//           onClose={() => setBulkDeleteIds([])}
//           onConfirm={async (ids) => {
//             try {
//               await Promise.all(ids.map((id) => deletePhysical(Number(id))));
//               setBulkDeleteIds([]);
//               mutate();
//             } catch (error) {
//               console.error("Bulk delete failed:", error);
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }

export default function PhysicalAction() {
  const { physicals, mutate } = useAllPhysicals();
  const [viewPhysical, setViewPhysical] = useState<PhysicalEdit | null>(null);
  const [editPhysical, setEditPhysical] = useState<PhysicalEdit | null>(null);
  const [deletePhysicalTarget, setDeletePhysicalTarget] =
    useState<PhysicalEdit | null>(null);
  const { deletePhysical } = useDeletePhysical();
  const { updatePhysical } = useUpdatePhysical();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  const handleDeletePhysical = async (physical: PhysicalEdit) => {
    try {
      await deletePhysical(physical.id);
      setDeletePhysicalTarget(null);
      setViewPhysical(null);
      mutate();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdatePhysical = async (updated: PhysicalEdit) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof PhysicalEdit)
        )
      );
      await updatePhysical(updated.id, payload);
      setEditPhysical(null);
      mutate();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columns: Column<PhysicalEdit>[] = [
    // Select Fields
    {
      key: "deviceCategory",
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
      key: "dcZone",
      label: "DC Zone",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    {
      key: "drZone",
      label: "DR Zone",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },

    // Server Information
    { key: "hostname", label: "Hostname", type: "text" },
    { key: "makeOrBrand", label: "Make or Brand", type: "text" },
    { key: "serverModel", label: "Server Model", type: "text" },
    { key: "enclosureIp", label: "Enclosure IP", type: "text" },
    {
      key: "managementIp",
      label: "Management IP",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    { key: "serviceIp", label: "Service IP", type: "text" },
    { key: "loginProtocol", label: "Login Protocol", type: "text" },
    {
      key: "serverStatus",
      label: "Server Status",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    {
      key: "serverType",
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
    { key: "serverMacAddress", label: "Server MAC Address", type: "text" },
    { key: "os", label: "Operating System", type: "text" },
    { key: "osClusterName", label: "OS Cluster Name", type: "text" },
    { key: "latestPatchVersion", label: "Latest Patch Version", type: "text" },
    { key: "osIpAddress", label: "OS IP Address", type: "text" },
    { key: "subnetMask", label: "Subnet Mask", type: "text" },
    { key: "defaultGateway", label: "Default Gateway", type: "text" },
    { key: "serviceVlan", label: "Service VLAN", type: "text" },
    { key: "onmIpGateway", label: "ONM IP Gateway", type: "text" },
    { key: "onmIpMask", label: "ONM IP Mask", type: "text" },
    { key: "onmVlan", label: "ONM VLAN", type: "text" },
    { key: "primaryDns", label: "Primary DNS", type: "text" },
    { key: "secondaryDns", label: "Secondary DNS", type: "text" },

    // Database Information
    { key: "dbName", label: "DB Name", type: "text" },
    { key: "dbVirtualIp", label: "DB Virtual IP", type: "text" },
    { key: "dbAdditionalIp", label: "DB Additional IP", type: "text" },
    { key: "dbInstance", label: "DB Instance", type: "text" },
    { key: "dbVersion", label: "DB Version", type: "text" },
    { key: "rdmsType", label: "RDMS Type", type: "text" },
    { key: "dbPort", label: "DB Port", type: "text" },
    { key: "dbStatus", label: "DB Status", type: "text" },
    { key: "dbType", label: "DB Type", type: "text" },
    { key: "dbOwnerEmail", label: "DB Owner Email", type: "text" },

    // Environment and Service Information
    { key: "environmentCategory", label: "Environment Category", type: "text" },
    { key: "serviceName", label: "Service Name", type: "text" },
    { key: "middlewareDetails", label: "Middleware Details", type: "text" },
    {
      key: "loadBalancerDetails",
      label: "Load Balancer Details",
      type: "text",
    },
    { key: "oem", label: "OEM", type: "text" },
    { key: "maintenanceVendor", label: "Maintenance Vendor", type: "text" },

    // Backup and Power Information
    {
      key: "backupAvailable",
      label: "Backup Available",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },

    { key: "backupType", label: "Backup Type", type: "text" },
    { key: "backupSchedule", label: "Backup Schedule", type: "text" },
    { key: "powerConnectivity", label: "Power Connectivity", type: "text" },
    { key: "powerRedundancy", label: "Power Redundancy", type: "text" },
    {
      key: "powerRedundancyMethodology",
      label: "Redundancy Methodology",
      type: "text",
    },
    { key: "inputPowerType", label: "Input Power Type", type: "text" },
    { key: "powerPhase", label: "Power Phase", type: "text" },
    {
      key: "powerConsumptionVa",
      label: "Power Consumption (VA)",
      type: "number",
    },

    // Monitoring and Status
    { key: "infraMonitoring", label: "Infra Monitoring", type: "boolean" },
    { key: "appMonitoring", label: "App Monitoring", type: "boolean" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isActive", label: "Is Active", type: "boolean" },

    // Additional Information
    { key: "vmIds", label: "VM IDs", type: "multiselect" },
    { key: "floorName", label: "Floor Name", type: "text" },
    { key: "rack", label: "Rack", type: "text" },
    { key: "dimensionMm", label: "Dimension (mm)", type: "text" },
    { key: "dimensionRackU", label: "Rack U", type: "number" },
    { key: "totalVcpu", label: "Total vCPU", type: "number" },
    { key: "custodianInformation", label: "Custodian Info", type: "text" },
    { key: "numberOfNICPorts", label: "NIC Ports", type: "text" },
    { key: "numberOfHBAPorts", label: "HBA Ports", type: "text" },
    { key: "numberOfSockets", label: "Sockets", type: "number" },
    { key: "coresPerSocket", label: "Cores per Socket", type: "number" },
    { key: "physicalRamGb", label: "RAM (GB)", type: "number" },
    {
      key: "dualConnectivity",
      label: "Dual Connectivity",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    { key: "nicCapacity", label: "NIC Capacity", type: "text" },
    { key: "switchUplink", label: "Switch Uplink", type: "text" },
    { key: "serverUplink", label: "Server Uplink", type: "text" },
    { key: "uplinkPort", label: "Uplink Port", type: "text" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/physical-server-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Physical Server
          </Button>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={physicals}
        tableName="physical_list"
        onView={(row) => setViewPhysical(row)}
        onEdit={(row) => setEditPhysical(row)}
        onDelete={(row) => setDeletePhysicalTarget(row)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />

      {viewPhysical && (
        <ViewModal
          row={viewPhysical}
          columns={columns}
          onClose={() => setViewPhysical(null)}
        />
      )}

      {editPhysical && (
        <EditModal
          row={editPhysical}
          columns={columns}
          open={!!editPhysical}
          onClose={() => setEditPhysical(null)}
          onSubmit={handleUpdatePhysical}
        />
      )}

      {deletePhysicalTarget && (
        <ConfirmDeleteDialog
          row={deletePhysicalTarget}
          open={!!deletePhysicalTarget}
          onClose={() => setDeletePhysicalTarget(null)}
          onConfirm={handleDeletePhysical}
        />
      )}

      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deletePhysical(Number(id))));
              setBulkDeleteIds([]);
              mutate();
            } catch (error) {
              console.error("Bulk delete failed:", error);
            }
          }}
        />
      )}
    </div>
  );
}
