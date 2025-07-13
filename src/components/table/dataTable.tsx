"use client";

import React from "react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ColumnToggleMenu } from "./columnToggleMenu";
import { ExportCsvButton } from "./exportCsvButton";
import { SortableHeader } from "./sortableHeader";
import { PaginationControls } from "./paginationControls";
import { BooleanBadge } from "./booleanBadge";
import { RowActionsMenu } from "./rowActionsMenu";
import { Button } from "../ui/button";
import { ExportPdfButton } from "./exportPdfButton";
import { DataFilter } from "./dataFilters";

export type Column<T> = {
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

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  tableName: string;
  onView?: (row: T) => void;
  onApprove?: (row: T) => void;
  onReset?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  showView?: boolean;
  showApprove?: boolean;
  showReset?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  tableName,
  onView,
  onApprove,
  onReset,
  onEdit,
  onDelete,
  showView = true,
  showApprove = false,
  showReset = false,
  showEdit = true,
  showDelete = true,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<(keyof T)[]>(
    columns.map((col) => col.key)
  );
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, any[]>>({});

  // Filtering + Search + Sorting
  const filteredData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );

      const matchesFilters = Object.entries(columnFilters).every(
        ([key, selected]) => {
          if (!selected || selected.length === 0) return true;
          return selected.includes(item[key as keyof T]);
        }
      );

      return matchesSearch && matchesFilters;
    });

    // Per-column filtering
    Object.entries(columnFilters).forEach(([key, selected]) => {
      if (selected.length > 0) {
        filtered = filtered.filter((row) =>
          selected.includes(String(row[key as keyof T]))
        );
      }
    });

    // Global search
    filtered = filtered.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );

    // Sorting
    if (sortKey) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, sortKey, sortOrder, columnFilters]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") setSortKey(null);
      else setSortOrder("asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const displayedColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  const isBoolean = (value: any): value is boolean =>
    typeof value === "boolean";

  return (
    <div className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white space-y-4 text-xs">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="text-xs"
        />

        {Object.values(columnFilters).some((arr) => arr.length > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColumnFilters({})}
            className="text-xs gap-1 py-5"
          >
            Reset Filters
          </Button>
        )}

        <ColumnToggleMenu
          allColumns={columns}
          visibleColumns={visibleColumns}
          onToggle={(key, visible) => {
            setVisibleColumns((prev) =>
              visible ? [...prev, key] : prev.filter((k) => k !== key)
            );
          }}
        />

        <ExportPdfButton
          data={filteredData}
          columns={displayedColumns}
          filename={tableName}
        />

        <ExportCsvButton
          data={filteredData}
          columns={displayedColumns}
          filename={tableName}
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-[10px]">
            <tr>
              {displayedColumns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className="px-3 py-2 border-b text-center"
                >
                  <div className="inline-flex items-center justify-center gap-1">
                    <SortableHeader
                      column={col}
                      sortKey={sortKey}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      className="text-center"
                    />
                    <DataFilter
                      columnKey={col.key}
                      data={data}
                      selectedFilters={columnFilters[col.key as string] || []}
                      onFilterChange={(selected) =>
                        setColumnFilters((prev) => ({
                          ...prev,
                          [col.key as string]: selected,
                        }))
                      }
                    />
                  </div>
                </th>
              ))}
              <th scope="col" className="text-center px-3 py-2 border-b">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-[8px]">
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700"
              >
                {displayedColumns.map((col) => (
                  <td key={String(col.key)} className="px-3 py-2 text-center">
                    {isBoolean(row[col.key]) ? (
                      <BooleanBadge
                        value={row[col.key] as boolean}
                        type={col.key as "isActive" | "isLocked" | "isReset"}
                      />
                    ) : (
                      String(row[col.key])
                    )}
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <RowActionsMenu
                    row={row}
                    onView={onView}
                    onApprove={onApprove}
                    onReset={onReset}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showView={showView}
                    showApprove={showApprove}
                    showReset={showReset}
                    showEdit={showEdit}
                    showDelete={showDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        onPageChange={goToPage}
        currentCount={paginatedData.length}
        totalCount={filteredData.length}
      />
    </div>
  );
}
