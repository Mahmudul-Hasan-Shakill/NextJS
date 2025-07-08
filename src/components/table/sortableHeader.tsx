"use client";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortableHeaderProps<T> = {
  column: { key: keyof T; label: string };
  sortKey: keyof T | null;
  sortOrder: "asc" | "desc";
  onSort: (key: keyof T) => void;
  className?: string;
};

export function SortableHeader<T>({
  column,
  sortKey,
  sortOrder,
  onSort,
  className,
}: SortableHeaderProps<T>) {
  const isActive = sortKey === column.key;

  const icon = isActive ? (
    sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    )
  ) : (
    <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
  );

  return (
    <button
      type="button"
      onClick={() => onSort(column.key)}
      className={`inline-flex items-center gap-1 ${className}`}
    >
      <span>{column.label}</span>
      {icon}
    </button>
  );
}
