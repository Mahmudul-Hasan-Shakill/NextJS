"use client";

import { useState } from "react";
import { DataTable } from "../../table/dataTable";
import { Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllVms } from "@/hooks/core_systems/vm/useGetAllVms";
import { useDeleteVm } from "@/hooks/core_systems/vm/useDeleteVm";
import { useUpdateVm } from "@/hooks/core_systems/vm/useUpdateVm";
import { Vm } from "@/types/vm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VmAction() {
  const { vms, mutate } = useAllVms();
  const [viewVm, setViewVm] = useState<Vm | null>(null);
  const [editVm, setEditVm] = useState<Vm | null>(null);
  const [deleteVmTarget, setDeleteVmTarget] = useState<Vm | null>(null);
  const { deleteVm } = useDeleteVm();
  const { updateVm } = useUpdateVm();

  const handleDeleteVm = async (vm: Vm) => {
    try {
      await deleteVm(vm.id);
      setDeleteVmTarget(null);
      setViewVm(null);
      mutate();
    } catch (error) {}
  };

  const handleUpdateVm = async (updated: Vm) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof Vm)
        )
      );
      await updateVm(updated.id, payload);
      setEditVm(null);
      mutate();
    } catch (error) {}
  };

  const columns: Column<Vm>[] = [
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
      key: "serverType",
      label: "Server Type",
      type: "select",
      options: [
        { value: "VMware", label: "VMware" },
        { value: "KVM", label: "KVM" },
        { value: "LPAR", label: "LPAR" },
      ],
    },
    { key: "hostname", label: "Hostname", type: "text" },
    { key: "osIpAddress", label: "OS IP Address", type: "text" },
    { key: "sshPort", label: "SSH Port", type: "number" },
    { key: "osSubnetMask", label: "OS Subnet Mask", type: "text" },
    { key: "osDefaultGateway", label: "OS Default Gateway", type: "text" },
    { key: "volumeLabel", label: "Volume Label", type: "text" },
    { key: "volumeSize", label: "Volume Size", type: "number" },
    { key: "loginProtocol", label: "Login Protocol", type: "text" },
    { key: "patchVersion", label: "Patch Version", type: "text" },
    { key: "kernelVersion", label: "Kernel Version", type: "text" },
    { key: "platform", label: "Platform", type: "text" },
    { key: "osVersion", label: "OS Version", type: "text" },
    { key: "osClusterName", label: "OS Cluster Name", type: "text" },
    { key: "lastPatchingDate", label: "Last Patching Date", type: "date" },
    { key: "serverStatus", label: "Server Status", type: "text" },
    { key: "totalSocket", label: "Total Socket", type: "number" },
    { key: "vcpu", label: "vCPU", type: "number" },
    { key: "ramGb", label: "RAM (GB)", type: "number" },
    { key: "hddSize", label: "HDD Size (GB)", type: "number" },
    { key: "custodianInfo", label: "Custodian Info", type: "text" },
    { key: "rdpEnabled", label: "RDP Enabled", type: "boolean" },
    {
      key: "managementIpActive",
      label: "Management IP Active",
      type: "boolean",
    },
    { key: "backupAvailable", label: "Backup Available", type: "boolean" },
    { key: "backupType", label: "Backup Type", type: "text" },
    { key: "backupSchedule", label: "Backup Schedule", type: "text" },
    {
      key: "fileSystemBackupPath",
      label: "File System Backup Path",
      type: "text",
    },
    { key: "backupDbName", label: "Backup Database Name", type: "text" },
    { key: "backupRetention", label: "Backup Retention", type: "text" },
    { key: "databaseInfo", label: "Database Info", type: "text" },
    { key: "applicationInfo", label: "Application Info", type: "text" },
    { key: "physicalServer", label: "Physical Server", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isDecommissioned", label: "Is Decommissioned", type: "boolean" },
    { key: "isActive", label: "Is Active", type: "boolean" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/vm-creation">
          <Button variant="default" size="sm" className="text-xs">
            + Create VM
          </Button>
        </Link>
      </div>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={vms}
        tableName="vm_list"
        onView={(vm) => setViewVm(vm)}
        onEdit={(vm) => setEditVm(vm)}
        onDelete={(vm) => setDeleteVmTarget(vm)}
      />
      {viewVm && (
        <ViewModal
          row={viewVm}
          columns={columns}
          onClose={() => setViewVm(null)}
        />
      )}
      {editVm && (
        <EditModal
          row={editVm}
          columns={columns}
          open={!!editVm}
          onClose={() => setEditVm(null)}
          onSubmit={handleUpdateVm}
        />
      )}
      {deleteVmTarget && (
        <ConfirmDeleteDialog
          row={deleteVmTarget}
          open={!!deleteVmTarget}
          onClose={() => setDeleteVmTarget(null)}
          onConfirm={handleDeleteVm}
        />
      )}
    </div>
  );
}
