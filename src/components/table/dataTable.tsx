"use client";

import React, { useCallback } from "react";
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
import { useDebounce } from "use-debounce";
import { BulkActions } from "./bulkActionBar";
import { ColumnReordering } from "./columnReordering";
import { GripVertical } from "lucide-react";

export type Column<T> = {
  key: keyof T;
  label: string;
  type?:
    | "text"
    | "select"
    | "multiselect"
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
  onBulkDelete?: (ids: (string | number)[]) => void;
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
  onBulkDelete,
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
  const [debouncedSearch] = useDebounce(search, 300);
  const [debouncedColumnFilters] = useDebounce(columnFilters, 300);
  const [selectedRowIds, setSelectedRowIds] = useState<(number | string)[]>([]);

  const filteredData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(debouncedSearch.toLowerCase())
      );

      const matchesFilters = Object.entries(debouncedColumnFilters).every(
        ([key, selected]) => {
          if (!selected || selected.length === 0) return true;
          return selected.includes(item[key as keyof T]);
        }
      );

      return matchesSearch && matchesFilters;
    });

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
  }, [data, debouncedSearch, sortKey, sortOrder, debouncedColumnFilters]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = useCallback(
    (key: keyof T) => {
      if (sortKey === key) {
        if (sortOrder === "asc") setSortOrder("desc");
        else if (sortOrder === "desc") setSortKey(null);
        else setSortOrder("asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    },
    [sortKey, sortOrder]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    },
    [totalPages]
  );

  // const displayedColumns = visibleColumns
  //   .map((key) => columns.find((col) => col.key === key))
  //   .filter((col): col is Column<T> => col !== undefined);

  const displayedColumns = useMemo(() => {
    return visibleColumns
      .map((key) => columns.find((col) => col.key === key))
      .filter((col): col is Column<T> => col !== undefined);
  }, [visibleColumns, columns]);

  const isBoolean = (value: any): value is boolean =>
    typeof value === "boolean";

  const handleResize = (e: React.MouseEvent, th: HTMLElement) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = startWidth + (e.clientX - startX);
      th.style.width = `${Math.max(40, newWidth)}px`; // enforce a min width
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white space-y-4 text-xs">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="text-xs pr-8"
          />
          {search !== debouncedSearch && (
            <div className="absolute right-2 top-3">
              <svg
                className="animate-spin h-5 w-5 text-muted-foreground"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          )}
        </div>

        {Object.values(debouncedColumnFilters).some(
          (arr) => arr.length > 0
        ) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColumnFilters({})}
            className="text-xs gap-1 py-5"
          >
            Reset Filters
          </Button>
        )}

        <BulkActions
          selectedRowIds={selectedRowIds}
          onBulkDelete={onBulkDelete}
        />

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
        <table className="table-fixed w-full border-collapse">
          <ColumnReordering
            columns={columns}
            visibleColumns={visibleColumns}
            onReorder={setVisibleColumns}
          >
            {({
              draggedColumn,
              hoveredColumn,
              handleDragStart,
              handleDragOver,
              handleDragEnd,
              handleDrop,
            }) => (
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-[10px]">
                <tr>
                  <th
                    style={{ width: "40px" }}
                    className="p-1 border-l border-t border-b border-gray-300 dark:border-gray-700 text-center"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedRowIds.length > 0 &&
                        selectedRowIds.length === paginatedData.length
                      }
                      onChange={(e) => {
                        const ids = paginatedData.map((row) => row.id);
                        setSelectedRowIds(e.target.checked ? ids : []);
                      }}
                    />
                  </th>
                  {displayedColumns.map((col, index) => (
                    <th
                      key={String(col.key)}
                      className={`relative px-3 py-2 border-t border-b border-r border-gray-300 dark:border-gray-700 text-center align-middle ${
                        draggedColumn === col.key ? "opacity-50" : ""
                      } ${
                        hoveredColumn === col.key
                          ? "bg-gray-200 dark:bg-gray-800"
                          : ""
                      }`}
                      style={{ width: "180px" }}
                      draggable
                      onDragStart={() => handleDragStart(col.key)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        handleDragOver(col.key);
                      }}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(col.key);
                      }}
                    >
                      {/* Centered header and filter */}
                      <div className="flex flex-col items-center gap-1 w-full">
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
                          selectedFilters={
                            debouncedColumnFilters[col.key as string] || []
                          }
                          onFilterChange={(selected) =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [col.key as string]: selected,
                            }))
                          }
                        />
                      </div>

                      {/* Right-aligned reorder icon */}
                      <span
                        className="absolute top-3 right-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleDragStart(col.key);
                        }}
                      >
                        <GripVertical className="h-5 w-5" />
                      </span>

                      {/* Resizer */}
                      <div
                        onMouseDown={(e) => {
                          const table = e.currentTarget.closest("table");
                          const ths = table?.querySelectorAll("th");
                          const thElement = ths?.[index + 1];
                          if (thElement)
                            handleResize(e, thElement as HTMLElement);
                        }}
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize z-10"
                      />
                    </th>
                  ))}

                  <th
                    style={{ width: "120px" }}
                    className="px-3 py-2 border-t border-b border-r border-gray-300 dark:border-gray-700 text-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
            )}
          </ColumnReordering>

          <tbody className="text-[8px]">
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
                  selectedRowIds.includes(row.id)
                    ? "bg-blue-50 dark:bg-blue-900"
                    : ""
                }`}
              >
                <td className="p-1 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.includes(row.id)}
                    onChange={(e) => {
                      setSelectedRowIds((prev) =>
                        e.target.checked
                          ? [...prev, row.id]
                          : prev.filter((id) => id !== row.id)
                      );
                    }}
                  />
                </td>
                {/* {displayedColumns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-3 py-2 text-center align-top break-words whitespace-normal"
                    style={{ wordBreak: "break-word", maxWidth: "200px" }}
                  >
                    {isBoolean(row[col.key]) ? (
                      <div className="inline-block">
                        <BooleanBadge
                          value={row[col.key] as boolean}
                          type={col.key as "isActive" | "isLocked" | "isReset"}
                        />
                      </div>
                    ) : (
                      <div className="inline-block break-words">
                        {String(row[col.key])}
                      </div>
                    )}
                  </td>
                ))} */}

                {displayedColumns.map((col) => {
                  const cellValue = row[col.key];
                  return (
                    <td
                      key={String(col.key)}
                      className="px-3 py-2 text-center align-top break-words whitespace-normal"
                      style={{ wordBreak: "break-word", maxWidth: "200px" }}
                    >
                      {isBoolean(cellValue) ? (
                        <div className="inline-block">
                          <BooleanBadge
                            value={cellValue}
                            type={
                              col.key as "isActive" | "isLocked" | "isReset"
                            }
                          />
                        </div>
                      ) : col.type === "multiselect" &&
                        Array.isArray(cellValue) &&
                        col.options ? (
                        <div className="flex flex-wrap gap-0.5 justify-center">
                          {cellValue.map((id) => {
                            const label = col.options?.find(
                              (opt) => opt.value === id
                            )?.label;
                            return label ? (
                              <span
                                key={id}
                                className="inline-block bg-blue-100  text-blue-800 text-[8px] font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-100"
                              >
                                {label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <div className="inline-block break-words">
                          {String(cellValue ?? "—")}
                        </div>
                      )}
                    </td>
                  );
                })}

                <td
                  style={{ width: "120px" }}
                  className="px-3 py-2 text-center align-top"
                >
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
