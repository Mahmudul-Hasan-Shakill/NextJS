"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/table/dataTable";
import { ViewModal } from "@/components/table/modalView";
import { ConfirmDeleteDialog } from "@/components/table/confirmDeleteDialog";
import { EditModal } from "@/components/table/editModal";
import { ConfirmBulkDeleteDialog } from "@/components/table/confirmBulkDeleteDialog";
import { useAllAmc } from "@/hooks/core_systems/amc/useAmc";
import { useDeleteAmc } from "@/hooks/core_systems/amc/useAmc";
import { useUpdateAmc } from "@/hooks/core_systems/amc/useAmc";
import { AmcData, AmcUpdatePayload } from "@/types/amc";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import FileAttachment from "@/components/utility/fileAttachment";
import { useDocumentUploader } from "@/hooks/utility/useDocument";

export default function AmcAction() {
  const { amcRecords, mutate } = useAllAmc();
  const [viewAmc, setViewAmc] = useState<AmcData | null>(null);
  const [editAmc, setEditAmc] = useState<AmcData | null>(null);
  const [deleteAmcTarget, setDeleteAmcTarget] = useState<AmcData | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<(number | string)[]>([]);
  const [resetSelectionKey, setResetSelectionKey] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { deleteAmc } = useDeleteAmc();
  const { updateAmc } = useUpdateAmc();
  const { uploadDocument } = useDocumentUploader();
  const userName = useUserDetails();

  const handleDeleteAmc = async (amc: AmcData) => {
    await deleteAmc(amc.id);
    setDeleteAmcTarget(null);
    setViewAmc(null);
    mutate();
  };

  const handleUpdateAmc = async (updated: AmcData, newFiles: File[]) => {
    const editableKeys = columns.map((col) => col.key);
    const payload: AmcUpdatePayload = Object.fromEntries(
      Object.entries(updated).filter(([key]) =>
        editableKeys.includes(key as keyof AmcUpdatePayload)
      )
    );

    const finalPayload: AmcUpdatePayload = {
      ...payload,
      editBy: userName,
      documents: updated.documents?.map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        storedFilePath: doc.downloadUrl,
        relatedType: doc.relatedType,
        relatedId: doc.relatedId,
        mimeType: doc.mimeType,
        size: doc.size,
        uploadedBy: doc.uploadedBy,
        description: doc.description,
      })),
      documentIdsToRemove: updated.documentIdsToRemove ?? [],
    };

    const success = await updateAmc(updated.id, finalPayload);

    if (success && newFiles.length > 0) {
      for (const file of newFiles) {
        await uploadDocument("amc", updated.id, file, {
          uploadedBy: userName,
          description: `${userName} uploaded the file.`,
        });
      }
    }

    setEditAmc(null);
    setSelectedFiles([]);
    mutate();
  };

  const columns: Column<AmcData>[] = [
    { key: "productName", label: "Product Name", type: "text" },
    { key: "quantity", label: "Quantity", type: "number" },
    { key: "serialNumber", label: "Serial Number", type: "text" },
    { key: "assetTag", label: "Asset Tag", type: "text" },
    { key: "isEolOrEosl", label: "Is EOL/EOSL?", type: "boolean" },
    { key: "declaredEolOrEosl", label: "Declared EOL/EOSL Date", type: "date" },
    { key: "underAmc", label: "Under AMC?", type: "boolean" },
    { key: "supportType", label: "Support Type", type: "text" },
    { key: "amcStart", label: "AMC Start Date", type: "date" },
    { key: "amcEnd", label: "AMC End Date", type: "date" },
    { key: "warrantyStart", label: "Warranty Start Date", type: "date" },
    { key: "warrantyEnd", label: "Warranty End Date", type: "date" },
    { key: "vendorName", label: "Vendor", type: "text" },
    { key: "oem", label: "OEM", type: "text" },
    { key: "purchaseDate", label: "Purchase Date", type: "date" },
    { key: "purchaseOrderNumber", label: "Purchase Order Number", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "status", label: "Status", type: "text" },
    { key: "remarks", label: "Remarks", type: "text" },
    { key: "isActive", label: "Is Active", type: "boolean" },
    { key: "documents", label: "Attachments", type: "href" },
  ];

  return (
    <div className="w-full p-4 text-[10px]">
      {/* Header */}
      <div className="flex justify-end mb-4">
        <Link href="/core-systems/amc-creation">
          <Button variant="default" size="sm" className="text-xs">
            <FilePlus2 className="h-4 w-4 mr-2" /> Create AMC
          </Button>
        </Link>
      </div>

      {/* Table */}
      <DataTable
        key={resetSelectionKey}
        columns={columns}
        data={amcRecords}
        tableName="amc_list"
        onView={(amc) => setViewAmc(amc)}
        onEdit={(amc) => setEditAmc(amc)}
        onDelete={(amc) => setDeleteAmcTarget(amc)}
        onBulkDelete={(ids) => setBulkDeleteIds(ids)}
      />

      {/* View Modal */}
      {viewAmc && (
        <ViewModal
          row={viewAmc}
          columns={columns}
          onClose={() => setViewAmc(null)}
        />
      )}

      {/* Edit Modal with FileAttachment */}
      {editAmc && (
        <EditModal
          row={editAmc}
          columns={columns}
          open={!!editAmc}
          onClose={() => setEditAmc(null)}
          onSubmit={(updatedRow) => handleUpdateAmc(updatedRow, selectedFiles)}
        >
          <FileAttachment
            onFilesSelected={(files) => setSelectedFiles(files)}
          />
        </EditModal>
      )}

      {/* Delete Dialog */}
      {deleteAmcTarget && (
        <ConfirmDeleteDialog
          row={deleteAmcTarget}
          open={!!deleteAmcTarget}
          onClose={() => setDeleteAmcTarget(null)}
          onConfirm={handleDeleteAmc}
        />
      )}

      {/* Bulk Delete Dialog */}
      {bulkDeleteIds.length > 0 && (
        <ConfirmBulkDeleteDialog
          ids={bulkDeleteIds}
          open={bulkDeleteIds.length > 0}
          onClose={() => setBulkDeleteIds([])}
          onConfirm={async (ids) => {
            await Promise.all(ids.map((id) => deleteAmc(Number(id))));
            setBulkDeleteIds([]);
            setResetSelectionKey((prev) => prev + 1);
            mutate();
          }}
        />
      )}
    </div>
  );
}
