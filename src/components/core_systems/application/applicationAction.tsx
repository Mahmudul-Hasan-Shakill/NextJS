"use client";

import { useState } from "react";
import { DataTable, Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllApplications } from "@/hooks/core_systems/application/useAllApplications";
import { useDeleteApplication } from "@/hooks/core_systems/application/useDeleteApplication";
import { useUpdateApplication } from "@/hooks/core_systems/application/useUpdateApplication";
import { ApplicationEdit } from "@/types/application";
import { useOsIpAddresses } from "@/hooks/core_systems/vm/useOsIpAddresses";
import { useIpAddresses } from "@/hooks/core_systems/automation/useIpAddresses";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";

export default function ApplicationAction() {
  const { applications = [], mutate } = useAllApplications();
  const { osIpAddresses } = useOsIpAddresses();
  const { ipAddresses } = useIpAddresses();
  const [viewApplication, setViewApplication] =
    useState<ApplicationEdit | null>(null);
  const [editApplication, setEditApplication] =
    useState<ApplicationEdit | null>(null);
  const [deleteApplicationTarget, setDeleteApplicationTarget] =
    useState<ApplicationEdit | null>(null);
  const { deleteApplication } = useDeleteApplication();
  const { updateApplication } = useUpdateApplication();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  const handleDeleteApplication = async (application: ApplicationEdit) => {
    try {
      await deleteApplication(application.id);
      setDeleteApplicationTarget(null);
      setViewApplication(null);
      mutate();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateApplication = async (updated: ApplicationEdit) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof ApplicationEdit)
        )
      );
      await updateApplication(updated.id, payload);
      setEditApplication(null);
      mutate();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columns: Column<ApplicationEdit>[] = [
    { key: "environment", label: "Environment", type: "text" },
    { key: "serviceName", label: "Service Name", type: "text" },
    { key: "serviceOwner", label: "Service Owner", type: "text" },
    { key: "applicationCategory", label: "Application Category", type: "text" },
    { key: "appModule", label: "App Module", type: "text" },
    { key: "appOwner", label: "App Owner", type: "text" },
    { key: "appOwnerEmail", label: "App Owner Email", type: "text" },
    { key: "applicationUrl", label: "Application URL", type: "text" },
    {
      key: "applicationCertificateDetail",
      label: "Certificate Detail",
      type: "text",
    },
    {
      key: "certificationExpiryDate",
      label: "Certification Expiry Date",
      type: "date",
    },
    { key: "connectedApps", label: "Connected Apps", type: "text" },
    { key: "middlewareDetails", label: "Middleware Details", type: "text" },
    { key: "databaseDetails", label: "Database Details", type: "text" },
    {
      key: "loadBalancerDetails",
      label: "Load Balancer Details",
      type: "text",
    },
    { key: "buildLanguage", label: "Build Language", type: "text" },
    { key: "licenceType", label: "License Type", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isActive", label: "Is Active", type: "boolean" },
    {
      key: "vmIds",
      label: "VM IPs",
      type: "multiselect",
      options: osIpAddresses.map((vm: any) => ({
        value: vm.id,
        label: vm.osIpAddress,
      })),
    },
    {
      key: "automationIds",
      label: "Auto IPs",
      type: "multiselect",
      options: ipAddresses.map((auto: any) => ({
        value: auto.id,
        label: auto.ipAddress,
      })),
    },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/application-server-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Application
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        tableName="application_list"
        onView={(application) => setViewApplication(application)}
        onEdit={(application) => setEditApplication(application)}
        onDelete={(application) => setDeleteApplicationTarget(application)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />

      {viewApplication && (
        <ViewModal
          row={viewApplication}
          columns={columns}
          onClose={() => setViewApplication(null)}
        />
      )}

      {editApplication && (
        <EditModal
          row={editApplication}
          columns={columns}
          open={!!editApplication}
          onClose={() => setEditApplication(null)}
          onSubmit={handleUpdateApplication}
        />
      )}

      {deleteApplicationTarget && (
        <ConfirmDeleteDialog
          row={deleteApplicationTarget}
          open={!!deleteApplicationTarget}
          onClose={() => setDeleteApplicationTarget(null)}
          onConfirm={handleDeleteApplication}
        />
      )}

      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deleteApplication(Number(id))));
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
