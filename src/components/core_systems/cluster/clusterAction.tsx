"use client";

import { useState } from "react";
import { DataTable, Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllClusters } from "@/hooks/core_systems/cluster/useAllClusters";
import { useDeleteCluster } from "@/hooks/core_systems/cluster/useDeleteCluster";
import { useUpdateCluster } from "@/hooks/core_systems/cluster/useUpdateCluster";
import { ClusterEdit } from "@/types/cluster";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";

export default function ClusterAction() {
  const { clusters, mutate } = useAllClusters();
  const [viewCluster, setViewCluster] = useState<ClusterEdit | null>(null);
  const [editCluster, setEditCluster] = useState<ClusterEdit | null>(null);
  const [deleteClusterTarget, setDeleteClusterTarget] =
    useState<ClusterEdit | null>(null);
  const [resetSelectionKey, setResetSelectionKey] = useState(0);
  const { deleteCluster } = useDeleteCluster();
  const { updateCluster } = useUpdateCluster();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
  const userName = useUserDetails();

  const handleDeleteCluster = async (cluster: ClusterEdit) => {
    try {
      await deleteCluster(cluster.id);
      setDeleteClusterTarget(null);
      setViewCluster(null);
      mutate();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateCluster = async (updated: ClusterEdit) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof ClusterEdit)
        )
      );

      // Add editBy to payload
      const finalPayload = {
        ...payload,
        editBy: userName,
      };

      await updateCluster(updated.id, finalPayload);
      setEditCluster(null);
      mutate();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const columns: Column<ClusterEdit>[] = [
    { key: "clusterName", label: "Cluster Name", type: "text" },
    { key: "vmIp", label: "VM IP", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isActive", label: "Is Active", type: "boolean" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/cluster-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create Cluster
          </Button>
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        key={resetSelectionKey}
        columns={columns}
        data={clusters}
        tableName="cluster_list"
        onView={(cluster) => setViewCluster(cluster)}
        onEdit={(cluster) => setEditCluster(cluster)}
        onDelete={(cluster) => setDeleteClusterTarget(cluster)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />

      {/* Modals */}
      {viewCluster && (
        <ViewModal
          row={viewCluster}
          columns={columns}
          onClose={() => setViewCluster(null)}
        />
      )}

      {editCluster && (
        <EditModal
          row={editCluster}
          columns={columns}
          open={!!editCluster}
          onClose={() => setEditCluster(null)}
          onSubmit={handleUpdateCluster}
        />
      )}

      {deleteClusterTarget && (
        <ConfirmDeleteDialog
          row={deleteClusterTarget}
          open={!!deleteClusterTarget}
          onClose={() => setDeleteClusterTarget(null)}
          onConfirm={handleDeleteCluster}
        />
      )}

      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deleteCluster(Number(id))));
              setBulkDeleteIds([]);
              setResetSelectionKey((prev) => prev + 1);
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
