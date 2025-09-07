"use client";

import { useState } from "react";
import { DataTable, Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";

import { useUserDetails } from "@/hooks/user/useUserDetails";
import { usePhysicalHost } from "@/hooks/core_systems/physical_host/physicalHostHooks";
import type { PhysicalHostEdit } from "@/types/physical-host";
import { useClusterNames } from "@/hooks/core_systems/cluster/useClusterNames";

export default function PhysicalHostAction() {
  const {
    physicalHosts,
    hostsLoading,
    hostsError,
    updatePhysicalHost,
    deletePhysicalHost,
    refreshHosts,
  } = usePhysicalHost();
  const { clusterNames } = useClusterNames();

  const [viewHost, setViewHost] = useState<PhysicalHostEdit | null>(null);
  const [editHost, setEditHost] = useState<PhysicalHostEdit | null>(null);
  const [deleteHostTarget, setDeleteHostTarget] =
    useState<PhysicalHostEdit | null>(null);
  const [resetSelectionKey, setResetSelectionKey] = useState(0);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
  const userName = useUserDetails();

  const handleDeleteHost = async (host: PhysicalHostEdit) => {
    try {
      await deletePhysicalHost(host.id);
      setDeleteHostTarget(null);
      setViewHost(null);
      refreshHosts();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateHost = async (updated: PhysicalHostEdit) => {
    try {
      // Only send editable keys defined in `columns`
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof PhysicalHostEdit)
        )
      );

      // Attach editor
      const finalPayload = {
        ...payload,
        editBy: userName,
      };

      await updatePhysicalHost(updated.id, finalPayload);
      setEditHost(null);
      refreshHosts();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columns: Column<PhysicalHostEdit>[] = [
    { key: "hostname", label: "Hostname", type: "text" },
    { key: "physicalIp", label: "Physical IP", type: "text" },
    {
      key: "clusterName",
      label: "Cluster",
      type: "select",
      options: clusterNames.map((cluster) => ({
        value: cluster,
        label: cluster,
      })),
    },
    { key: "location", label: "Location", type: "text" },
    { key: "brand", label: "Brand", type: "text" },
    { key: "model", label: "Model", type: "text" },
    { key: "serialNumber", label: "Serial Number", type: "text" },
    { key: "assetTag", label: "Asset Tag", type: "text" },
    { key: "cpuModel", label: "CPU Model", type: "text" },
    { key: "cpuCoresTotal", label: "CPU Cores", type: "number" },
    { key: "ramTotalGb", label: "RAM (GB)", type: "number" },
    { key: "storageTotalTb", label: "Storage (TB)", type: "number" },
    { key: "storageType", label: "Storage Type", type: "text" },
    { key: "powerSupply", label: "Power Supply", type: "text" },
    { key: "networkPorts", label: "Network Ports", type: "text" },
    { key: "osInstalled", label: "OS Installed", type: "text" },
    { key: "osVersion", label: "OS Version", type: "text" },
    { key: "hypervisorType", label: "Hypervisor Type", type: "text" },
    { key: "hypervisorVersion", label: "Hypervisor Version", type: "text" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
        { value: "Retired", label: "Retired" },
        { value: "Maintenance", label: "Maintenance" },
      ],
    },
    { key: "warrantyExpiry", label: "Warranty Expiry", type: "date" },
    { key: "assignedToTeam", label: "Assigned To Team", type: "text" },
    { key: "isActive", label: "Is Active", type: "boolean" },
  ];

  if (hostsLoading)
    return <div className="w-full p-4">Loading physical hosts...</div>;
  if (hostsError)
    return (
      <div className="w-full p-4 text-red-500">
        Error loading physical hosts
      </div>
    );

  return (
    <div className="w-full p-4 text-[10px]">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Physical Host Inventory
      </h2>
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/physical-host-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Physical Host
          </Button>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        key={resetSelectionKey}
        columns={columns}
        data={physicalHosts}
        tableName="physical_host_list"
        onView={(row) => setViewHost(row as PhysicalHostEdit)}
        onEdit={(row) => setEditHost(row as PhysicalHostEdit)}
        onDelete={(row) => setDeleteHostTarget(row as PhysicalHostEdit)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />

      {/* Modals */}
      {viewHost && (
        <ViewModal
          row={viewHost}
          columns={columns}
          onClose={() => setViewHost(null)}
        />
      )}

      {editHost && (
        <EditModal
          row={editHost}
          columns={columns}
          open={!!editHost}
          onClose={() => setEditHost(null)}
          onSubmit={handleUpdateHost}
        />
      )}

      {deleteHostTarget && (
        <ConfirmDeleteDialog
          row={deleteHostTarget}
          open={!!deleteHostTarget}
          onClose={() => setDeleteHostTarget(null)}
          onConfirm={handleDeleteHost}
        />
      )}

      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(
                ids.map((id) => deletePhysicalHost(Number(id)))
              );
              setBulkDeleteIds([]);
              setResetSelectionKey((prev) => prev + 1);
              refreshHosts();
            } catch (error) {
              console.error("Bulk delete failed:", error);
            }
          }}
        />
      )}
    </div>
  );
}
