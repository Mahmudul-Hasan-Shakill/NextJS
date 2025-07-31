"use client";

import { useState } from "react";
import { DataTable } from "../../table/dataTable";
import { Column } from "../../table/dataTable";
import { ViewModal } from "../../table/modalView";
import { ConfirmDeleteDialog } from "../../table/confirmDeleteDialog";
import { EditModal } from "../../table/editModal";
import { useAllAmcs } from "@/hooks/core_systems/amc/useAllAmcs";
import { useDeleteAmc } from "@/hooks/core_systems/amc/useDeleteAmc";
import { useUpdateAmc } from "@/hooks/core_systems/amc/useUpdateAmc";
import { AmcEdit } from "@/types/amc";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { FilePlus2 } from "lucide-react";

export default function AmcAction() {
  const { amcs, mutate } = useAllAmcs();
  const [viewAmc, setViewAmc] = useState<AmcEdit | null>(null);
  const [editAmc, setEditAmc] = useState<AmcEdit | null>(null);
  const [deleteAmcTarget, setDeleteAmcTarget] = useState<AmcEdit | null>(null);
  const { deleteAmc } = useDeleteAmc();
  const { updateAmc } = useUpdateAmc();
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);

  const handleDeleteAmc = async (amc: AmcEdit) => {
    try {
      await deleteAmc(amc.id);
      setDeleteAmcTarget(null);
      setViewAmc(null);
      mutate();
    } catch (error) {}
  };

  const handleUpdateAmc = async (updated: AmcEdit) => {
    try {
      const editableKeys = columns.map((col) => col.key);
      const payload = Object.fromEntries(
        Object.entries(updated).filter(([key]) =>
          editableKeys.includes(key as keyof AmcEdit)
        )
      );
      await updateAmc(updated.id, payload);
      setEditAmc(null);
      mutate();
    } catch (error) {}
  };

  const columns: Column<AmcEdit>[] = [
    { key: "item", label: "Item", type: "text" },
    { key: "productName", label: "Product Name", type: "text" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "eolOrEosl", label: "EOL/EOSL", type: "boolean" },
    { key: "declaredEolOrEosl", label: "Declared EOL/EOSL", type: "date" },
    { key: "underAmc", label: "Under AMC", type: "boolean" },
    { key: "supportType", label: "Support Type", type: "text" },
    { key: "amcStart", label: "AMC Start", type: "date" },
    { key: "amcEnd", label: "AMC End", type: "date" },
    { key: "warrantyStart", label: "Warranty Start", type: "date" },
    { key: "warrantyEnd", label: "Warranty End", type: "date" },
    { key: "vendorName", label: "Vendor Name", type: "text" },
    { key: "oem", label: "OEM", type: "text" },
    { key: "remarks", label: "Remarks", type: "textarea" },
    { key: "isActive", label: "Is Active", type: "boolean" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header with button */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/amc-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create AMC
          </Button>
        </Link>
      </div>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={amcs}
        tableName="amc_list"
        onView={(amc) => setViewAmc(amc)}
        onEdit={(amc) => setEditAmc(amc)}
        onDelete={(amc) => setDeleteAmcTarget(amc)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />
      {viewAmc && (
        <ViewModal
          row={viewAmc}
          columns={columns}
          onClose={() => setViewAmc(null)}
        />
      )}
      {editAmc && (
        <EditModal
          row={editAmc}
          columns={columns}
          open={!!editAmc}
          onClose={() => setEditAmc(null)}
          onSubmit={handleUpdateAmc}
        />
      )}
      {deleteAmcTarget && (
        <ConfirmDeleteDialog
          row={deleteAmcTarget}
          open={!!deleteAmcTarget}
          onClose={() => setDeleteAmcTarget(null)}
          onConfirm={handleDeleteAmc}
        />
      )}
      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            try {
              await Promise.all(ids.map((id) => deleteAmc(Number(id))));
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
