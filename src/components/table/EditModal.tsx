"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EditField } from "./EditField";

type Column<T> = {
  key: keyof T;
  label: string;
  type?:
    | "text"
    | "select"
    | "boolean"
    | "number"
    | "date"
    | "email"
    | "textarea"
    | "radio"
    | "checkbox";
  options?: { label: string; value: any }[];
  fetchOptions?: () => Promise<{ label: string; value: any }[]>;
};

type EditModalProps<T> = {
  row: T;
  columns: Column<T>[];
  open: boolean;
  onClose: () => void;
  onSubmit: (updatedRow: T) => Promise<void>;
};

export function EditModal<T extends Record<string, any>>({
  row,
  columns,
  open,
  onClose,
  onSubmit,
}: EditModalProps<T>) {
  const [formData, setFormData] = useState<T>(row);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    setFormData(row);
    const fetchAllOptions = async () => {
      const optionsMap: Record<string, any[]> = {};
      await Promise.all(
        columns.map(async (col) => {
          if (col.fetchOptions) {
            try {
              const opts = await col.fetchOptions();
              optionsMap[String(col.key)] = opts;
            } catch (err) {
              console.error(
                `Failed to fetch options for ${String(col.key)}`,
                err
              );
            }
          }
        })
      );
      setDynamicOptions(optionsMap);
    };
    fetchAllOptions();
  }, [row, columns]);

  const handleChange = (key: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {}
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[80vw] !max-w-[80vw] !h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {columns.map((col) => {
            const keyStr = String(col.key);
            return (
              <EditField
                key={keyStr}
                label={col.label}
                type={col.type}
                value={formData[col.key]}
                options={col.options || dynamicOptions[keyStr]}
                name={keyStr}
                onChange={(val) => handleChange(col.key, val)}
              />
            );
          })}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
