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
  return (
    <th
      key={String(column.key)}
      onClick={() => onSort(column.key)}
      className={`cursor-pointer ${className} px-3 py-2 border-b border-gray-300 dark:border-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
    >
      <div className="flex items-center justify-center gap-1">
        {/* Center align content */}
        {column.label}
        {sortKey === column.key ? (
          sortOrder === "asc" ? (
            <ArrowUp className="w-3 h-3" />
          ) : sortOrder === "desc" ? (
            <ArrowDown className="w-3 h-3" />
          ) : (
            <ArrowUpDown className="w-3 h-3" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
        )}
      </div>
    </th>
  );
}
