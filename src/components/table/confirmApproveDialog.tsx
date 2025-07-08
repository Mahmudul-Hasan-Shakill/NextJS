"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ConfirmApproveDialogProps<T> = {
  row: T;
  open: boolean;
  onClose: () => void;
  onConfirm: (row: T) => void;
};

export function ConfirmApproveDialog<T>({
  row,
  open,
  onClose,
  onConfirm,
}: ConfirmApproveDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm text-black dark:text-white font-extrabold">
            Confirm Approval
          </DialogTitle>
          <DialogDescription className="text-xs">
            Are you sure you want to approve this user? This will activate their
            account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onConfirm(row)}
            className="bg-green-500 hover:bg-green-600"
          >
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
