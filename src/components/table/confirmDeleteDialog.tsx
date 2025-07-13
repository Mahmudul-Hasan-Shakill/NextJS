"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmDeleteDialogProps<T> = {
  row: T;
  open: boolean;
  onClose: () => void;
  onConfirm: (row: T) => void;
};

export function ConfirmDeleteDialog<T>({
  row,
  open,
  onClose,
  onConfirm,
}: ConfirmDeleteDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm text-black dark:text-white font-extrabold">
            Confirm Delete
          </DialogTitle>
          <DialogDescription className="text-xs">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onConfirm(row)}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
