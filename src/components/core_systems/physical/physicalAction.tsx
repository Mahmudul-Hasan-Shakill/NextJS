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
import { Physical } from "@/types/physical";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PhysicalAction() {
  const { physicals, mutate } = useAllPhysicals();
  const [viewPhysical, setViewPhysical] = useState<Physical | null>(null);
  const [editPhysical, setEditPhysical] = useState<Physical | null>(null);
  const [deletePhysicalTarget, setDeletePhysicalTarget] =
    useState<Physical | null>(null);
  const { deletePhysical } = useDeletePhysical();
  const { updatePhysical } = useUpdatePhysical();

  const handleDeletePhysical = async (physical: Physical) => {
    try {
      await deletePhysical(physical.id);
      setDeletePhysicalTarget(null);
      setViewPhysical(null);
      mutate();
    } catch (error) {}
  };

  const handleUpdatePhysical = async (updated: Physical) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof Physical)
        )
      );
      await updatePhysical(updated.id, payload);
      setEditPhysical(null);
      mutate();
    } catch (error) {}
  };

  const columns: Column<Physical>[] = [
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
    { key: "hostname", label: "Hostname", type: "text" },
    {
      key: "primaryIdentificationName",
      label: "Primary ID Name",
      type: "text",
    },
    { key: "makeOrBrand", label: "Make or Brand", type: "text" },
    { key: "serverModel", label: "Server Model", type: "text" },
    { key: "serviceTag", label: "Service Tag", type: "text" },
    { key: "enclosureIp", label: "Enclosure IP", type: "text" },
    { key: "managementIp", label: "Management IP", type: "text" },
    { key: "serviceIp", label: "Service IP", type: "text" },
    { key: "zone", label: "Zone", type: "text" },
    { key: "os", label: "Operating System", type: "text" },
    { key: "osVersion", label: "OS Version", type: "text" },
    { key: "hypervisorEOSL", label: "Hypervisor EOSL", type: "text" },
    { key: "serverEOSL", label: "Server EOSL", type: "text" },
    { key: "purchasedDate", label: "Purchased Date", type: "date" },
    { key: "installationDate", label: "Installation Date", type: "date" },
    { key: "purchasedFrom", label: "Purchased From", type: "text" },
    { key: "workOrderNumber", label: "Work Order Number", type: "text" },
    { key: "warranty", label: "Warranty", type: "text" },
    { key: "underAMC", label: "Under AMC", type: "boolean" },
    { key: "floorName", label: "Floor Name", type: "text" },
    { key: "rack", label: "Rack", type: "text" },
    { key: "row", label: "Row", type: "text" },
    { key: "uInformation", label: "U Information", type: "text" },
    { key: "numberOfNICCards", label: "NIC Cards", type: "number" },
    { key: "numberOfNICPorts", label: "NIC Ports", type: "number" },
    { key: "numberOfHBACards", label: "HBA Cards", type: "number" },
    { key: "numberOfHBAPorts", label: "HBA Ports", type: "number" },
    { key: "numberOfSockets", label: "Sockets", type: "number" },
    { key: "coresPerSocket", label: "Cores per Socket", type: "number" },
    { key: "physicalCores", label: "Physical Cores", type: "number" },
    { key: "physicalRamGb", label: "RAM (GB)", type: "number" },
    { key: "physicalDiskSize", label: "Disk Size (GB)", type: "number" },
    { key: "numberOfDisks", label: "Number of Disks", type: "number" },
    { key: "diskType", label: "Disk Type", type: "text" },
    { key: "nicFirmwareVersion", label: "NIC Firmware", type: "text" },
    { key: "sanFirmwareVersion", label: "SAN Firmware", type: "text" },
    { key: "chasis", label: "Chasis", type: "text" },
    { key: "dualConnectivity", label: "Dual Connectivity", type: "boolean" },
    { key: "nicCapacity", label: "NIC Capacity", type: "text" },
    { key: "switchUplink", label: "Switch Uplink", type: "text" },
    { key: "serverUplink", label: "Server Uplink", type: "text" },
    { key: "uplinkPort", label: "Uplink Port", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isDecommissioned", label: "Is Decommissioned", type: "boolean" },
    { key: "isActive", label: "Is Active", type: "boolean" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/physical-creation">
          <Button variant="default" size="sm" className="text-xs">
            + Create Physical
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
    </div>
  );
}
