// /components/table/bulkEditModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState, useCallback } from "react";
import { EditField } from "./editFields";
import type { Column } from "./dataTable";

type Option = { label: string; value: any };

type BulkEditModalProps<T extends Record<string, any>> = {
  open: boolean;
  onClose: () => void;
  columns: Column<T>[];
  /** When submitted, you’ll receive ONLY the fields the user touched */
  onSubmit: (patch: Partial<T>) => Promise<void> | void;
  title?: string;
  description?: string;
};

export function BulkEditModal<T extends Record<string, any>>({
  open,
  onClose,
  columns,
  onSubmit,
  title = "Bulk Update",
  description = "Set only the fields you want to change. Leave others blank to keep their current values.",
}: BulkEditModalProps<T>) {
  const [draft, setDraft] = useState<Partial<T>>({});
  const [dirty, setDirty] = useState<Set<keyof T>>(new Set());
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, Option[]>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter editable columns (skip id and href/doc columns)
  const editableColumns = useMemo(
    () =>
      columns.filter(
        (c) => c.key !== ("id" as any) && (c.type ?? "text") !== "href"
      ),
    [columns]
  );

  // Load dynamic options just like EditModal
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const map: Record<string, Option[]> = {};
      await Promise.all(
        editableColumns.map(async (col) => {
          if (!col.fetchOptions) return;
          try {
            const opts = await col.fetchOptions();
            map[String(col.key)] = opts;
          } catch {
            // ignore per-field errors
          }
        })
      );
      if (!cancelled) setDynamicOptions(map);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [editableColumns]);

  // Reset state whenever dialog opens/closes
  useEffect(() => {
    if (!open) {
      setDraft({});
      setDirty(new Set());
    }
  }, [open]);

  // Unified onChange that mirrors EditModal’s, but for partial updates.
  // If value becomes empty string/null/undefined => remove from draft/dirty.
  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >
        | { target: { id: string; value: any } }
    ) => {
      const { id, value } = e.target;
      const key = id as keyof T;

      const empty =
        value === "" ||
        value === null ||
        (Array.isArray(value) && value.length === 0);

      setDraft((prev) => {
        const next = { ...prev };
        if (empty) delete (next as any)[key];
        else (next as any)[key] = value;
        return next;
      });

      setDirty((prev) => {
        const next = new Set(prev);
        if (empty) next.delete(key);
        else next.add(key);
        return next;
      });
    },
    []
  );

  const handleSubmit = async () => {
    // Build patch from dirty keys only
    const patch: Partial<T> = {};
    Array.from(dirty).forEach((k) => {
      (patch as any)[k] = (draft as any)[k];
    });

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(patch);
      onClose();
    } finally {
      setIsSubmitting(false);
      setDraft({});
      setDirty(new Set());
    }
  };

  // Render each field using the SAME EditField for consistent look
  const renderField = (col: Column<T>) => {
    const keyStr = String(col.key);
    const value = (draft as any)[col.key] ?? "";

    // Skip href/doc arrays in bulk modal
    if (col.type === "href") return null;

    return (
      <EditField
        className="text-xs"
        key={keyStr}
        label={col.label}
        type={col.type}
        value={value}
        options={col.options || dynamicOptions[keyStr]}
        name={keyStr}
        onChange={handleChange}
        // Hint to user this field is optional for bulk
        placeholder="— leave blank to keep —"
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[80vw] !max-w-[80vw] !h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {editableColumns.map(renderField)}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Applying..." : "Apply to Selected"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
