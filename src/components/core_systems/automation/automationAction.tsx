"use client";

import { useState } from "react";
import { DataTable } from "../../table/dataTable";
import { Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllAutomations } from "@/hooks/core_systems/automation/useAllAutomations";
import { useDeleteAutomation } from "@/hooks/core_systems/automation/useDeleteAutomation";
import { useUpdateAutomation } from "@/hooks/core_systems/automation/useUpdateAutomation";
import { AutomationEdit } from "@/types/automation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";

export default function AutomationAction() {
  const { automations, mutate } = useAllAutomations();
  const [resetSelectionKey, setResetSelectionKey] = useState(0);
  const [viewAutomation, setViewAutomation] = useState<AutomationEdit | null>(
    null
  );
  const [editAutomation, setEditAutomation] = useState<AutomationEdit | null>(
    null
  );
  const [deleteAutomationTarget, setDeleteAutomationTarget] =
    useState<AutomationEdit | null>(null);
  const { deleteAutomation } = useDeleteAutomation();
  const { updateAutomation } = useUpdateAutomation();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  const handleDeleteAutomation = async (automation: AutomationEdit) => {
    try {
      await deleteAutomation(automation.id);
      setDeleteAutomationTarget(null);
      setViewAutomation(null);
      mutate();
    } catch (error) {
      console.error("Failed to delete automation:", error);
    }
  };

  const handleUpdateAutomation = async (updated: AutomationEdit) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof AutomationEdit)
        )
      );
      await updateAutomation(updated.id, payload);
      setEditAutomation(null);
      mutate();
    } catch (error) {
      console.error("Failed to update automation:", error);
    }
  };

  const columns: Column<AutomationEdit>[] = [
    {
      key: "serverEnvironment",
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
      key: "serverPlatform",
      label: "Server Platform",
      type: "select",
      options: [
        { value: "Linux", label: "Linux" },
        { value: "Windows", label: "Windows" },
        { value: "AIX", label: "AIX" },
        { value: "Solaris", label: "Solaris" },
      ],
    },
    { key: "hostname", label: "Hostname", type: "text" },
    { key: "ipAddress", label: "IP Address", type: "text" },
    { key: "cpuPhysicalCores", label: "CPU Physical Cores", type: "number" },
    { key: "cpuVirtualCores", label: "CPU Virtual Cores", type: "number" },
    { key: "cpuModel", label: "CPU Model", type: "text" },
    { key: "totalRam", label: "Total RAM", type: "text" },
    { key: "totalDiskSize", label: "Total Disk Size", type: "text" },
    { key: "osVersion", label: "OS Version", type: "text" },
    { key: "kernelVersion", label: "Kernel Version", type: "text" },
    { key: "serialNumber", label: "Serial Number", type: "text" },
    { key: "sshPort", label: "SSH Port", type: "number" },
    { key: "sockets", label: "Sockets", type: "number" },
    { key: "lastPatchInstalled", label: "Last Patch Installed", type: "date" },
    { key: "systemUptime", label: "System Uptime", type: "text" },
    {
      key: "falconInstalled",
      label: "Falcon Installed",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    { key: "falconVersion", label: "Falcon Version", type: "text" },
    { key: "falconInstallDate", label: "Falcon Install Date", type: "date" },
    { key: "falconStatus", label: "Falcon Status", type: "text" },
    {
      key: "qualysInstalled",
      label: "Qualys Installed",
      type: "select",
      options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ],
    },
    { key: "qualysVersion", label: "Qualys Version", type: "text" },
    { key: "qualysInstallDate", label: "Qualys Install Date", type: "date" },
    { key: "qualysStatus", label: "Qualys Status", type: "text" },
    { key: "diskTotalSize", label: "Disk Total Size", type: "text" },
    { key: "diskUsed", label: "Disk Used", type: "text" },
    { key: "diskFree", label: "Disk Free", type: "text" },
    { key: "subnetMask", label: "Subnet Mask", type: "text" },
    { key: "gateway", label: "Gateway", type: "text" },
    { key: "networkIp", label: "Network IP", type: "text" },
    { key: "ntpService", label: "NTP Service", type: "text" },
    { key: "ntpServers", label: "NTP Servers", type: "text" },
    { key: "ntpSyncSource", label: "NTP Sync Source", type: "text" },
    { key: "systemUsersCount", label: "System Users Count", type: "number" },
    { key: "sudoUsers", label: "Sudo Users", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isActive", label: "Is Active", type: "boolean" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/automatic-server-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Automation Server
          </Button>
        </Link>
      </div>
      {/* Data Table */}
      <DataTable
        key={resetSelectionKey}
        columns={columns}
        data={automations}
        tableName="automation_list"
        onView={(automation) => setViewAutomation(automation)}
        onEdit={(automation) => setEditAutomation(automation)}
        onDelete={(automation) => setDeleteAutomationTarget(automation)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />
      {viewAutomation && (
        <ViewModal
          row={viewAutomation}
          columns={columns}
          onClose={() => setViewAutomation(null)}
        />
      )}
      {editAutomation && (
        <EditModal
          row={editAutomation}
          columns={columns}
          open={!!editAutomation}
          onClose={() => setEditAutomation(null)}
          onSubmit={handleUpdateAutomation}
        />
      )}
      {deleteAutomationTarget && (
        <ConfirmDeleteDialog
          row={deleteAutomationTarget}
          open={!!deleteAutomationTarget}
          onClose={() => setDeleteAutomationTarget(null)}
          onConfirm={handleDeleteAutomation}
        />
      )}
      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deleteAutomation(Number(id))));
              setBulkDeleteIds([]);
              setResetSelectionKey((prev) => prev + 1); // ✅ Trigger reset
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
