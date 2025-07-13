"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmBulkDeleteDialogProps = {
  ids: (number | string)[];
  open: boolean;
  onClose: () => void;
  onConfirm: (ids: (number | string)[]) => void;
};

export function ConfirmBulkDeleteDialog({
  ids,
  open,
  onClose,
  onConfirm,
}: ConfirmBulkDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm text-black dark:text-white font-extrabold">
            Confirm Bulk Delete
          </DialogTitle>
          <DialogDescription className="text-xs">
            Are you sure you want to delete {ids.length} item(s)? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onConfirm(ids)}
            className="bg-red-400 hover:bg-red-500"
          >
            Delete All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
