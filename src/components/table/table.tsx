// "use client";

// import { useState, useMemo } from "react";
// import { Input } from "@/components/ui/input";
// import { ColumnToggleMenu } from "./columnToggleMenu";
// import { ExportCsvButton } from "./exportCsvButton";
// import { SortableHeader } from "./sortableHeader";
// import { PaginationControls } from "./paginationControls";
// import { BooleanBadge } from "./booleanBadge";
// import { RowActionsMenu } from "./rowActionsMenu";

// export type Column<T> = {
//   key: keyof T;
//   label: string;
//   type?:
//     | "text"
//     | "select"
//     | "boolean"
//     | "number"
//     | "date"
//     | "email"
//     | "textarea"
//     | "radio"
//     | "checkbox";
//   options?: { label: string; value: any }[];
//   fetchOptions?: () => Promise<{ label: string; value: any }[]>;
// };

// type DataTableProps<T> = {
//   columns: Column<T>[];
//   data: T[];
//   tableName: string;
//   onView?: (row: T) => void;
//   onEdit?: (row: T) => void;
//   onDelete?: (row: T) => void;
// };

// export function DataTable<T extends { id: number | string }>({
//   columns,
//   data,
//   tableName,
//   onView,
//   onEdit,
//   onDelete,
// }: DataTableProps<T>) {
//   const [search, setSearch] = useState("");
//   const [visibleColumns, setVisibleColumns] = useState<(keyof T)[]>(
//     columns.map((col) => col.key)
//   );
//   const [sortKey, setSortKey] = useState<keyof T | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredData = useMemo(() => {
//     let filtered = data.filter((item) =>
//       Object.values(item).some((val) =>
//         String(val).toLowerCase().includes(search.toLowerCase())
//       )
//     );

//     if (sortKey) {
//       filtered = [...filtered].sort((a, b) => {
//         const aVal = a[sortKey];
//         const bVal = b[sortKey];
//         if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
//         if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
//         return 0;
//       });
//     }

//     return filtered;
//   }, [data, search, sortKey, sortOrder]);

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleSort = (key: keyof T) => {
//     if (sortKey === key) {
//       if (sortOrder === "asc") {
//         setSortOrder("desc");
//       } else if (sortOrder === "desc") {
//         setSortKey(null);
//       } else {
//         setSortOrder("asc");
//       }
//     } else {
//       setSortKey(key);
//       setSortOrder("asc");
//     }
//   };

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const displayedColumns = columns.filter((col) =>
//     visibleColumns.includes(col.key)
//   );

//   const isBoolean = (value: any): value is boolean =>
//     typeof value === "boolean";

//   return (
//     <div className="p-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white space-y-4 text-xs">
//       <div className="flex flex-wrap items-center gap-2">
//         <Input
//           placeholder="Search..."
//           value={search}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//             setSearch(e.target.value)
//           }
//           className="text-xs"
//         />

//         <ColumnToggleMenu
//           allColumns={columns}
//           visibleColumns={visibleColumns}
//           onToggle={(key, visible) => {
//             setVisibleColumns((prev) =>
//               visible ? [...prev, key] : prev.filter((k) => k !== key)
//             );
//           }}
//         />

//         <ExportCsvButton
//           data={filteredData}
//           columns={displayedColumns}
//           filename={tableName}
//         />
//       </div>

//       {/* Table */}
//       <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
//         <table className="min-w-full table-auto border-collapse">
//           <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-[10px]">
//             <tr>
//               {displayedColumns.map((col) => (
//                 <SortableHeader
//                   key={String(col.key)}
//                   column={col}
//                   sortKey={sortKey}
//                   sortOrder={sortOrder}
//                   onSort={handleSort}
//                   className="text-center"
//                 />
//               ))}
//               <th className="text-center px-3 py-2 border-b">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="text-[8px]">
//             {paginatedData.map((row) => (
//               <tr
//                 key={row.id}
//                 className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-200 dark:border-gray-700"
//               >
//                 {displayedColumns.map((col) => (
//                   <td key={String(col.key)} className="px-3 py-2 text-center">
//                     {/* Center align body cells */}
//                     {isBoolean(row[col.key]) ? (
//                       <BooleanBadge
//                         value={row[col.key] as boolean}
//                         type={col.key as "isActive" | "isLocked" | "isReset"}
//                       />
//                     ) : (
//                       String(row[col.key])
//                     )}
//                   </td>
//                 ))}
//                 <td className="px-3 py-2 text-center">
//                   {/* Center align Actions cell */}
//                   <RowActionsMenu
//                     row={row}
//                     onView={onView}
//                     onEdit={onEdit}
//                     onDelete={onDelete}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <PaginationControls
//         currentPage={currentPage}
//         totalPages={totalPages}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={setRowsPerPage}
//         onPageChange={goToPage}
//         currentCount={paginatedData.length}
//         totalCount={filteredData.length}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ColumnToggleMenu } from "./columnToggleMenu";
import { ExportCsvButton } from "./exportCsvButton";
import { SortableHeader } from "./sortableHeader";
import { PaginationControls } from "./paginationControls";
import { BooleanBadge } from "./booleanBadge";
import { RowActionsMenu } from "./rowActionsMenu";
import { DataFilter } from "./DataFilter";
import { Button } from "../ui/button";

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
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  tableName,
  onView,
  onEdit,
  onDelete,
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

        <ColumnToggleMenu
          allColumns={columns}
          visibleColumns={visibleColumns}
          onToggle={(key, visible) => {
            setVisibleColumns((prev) =>
              visible ? [...prev, key] : prev.filter((k) => k !== key)
            );
          }}
        />

        <ExportCsvButton
          data={filteredData}
          columns={displayedColumns}
          filename={tableName}
        />

        {Object.values(columnFilters).some((arr) => arr.length > 0) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColumnFilters({})}
            className="text-xs"
          >
            Reset All Filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-[10px]">
            <tr>
              {displayedColumns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-3 py-2 border-b text-center"
                >
                  <div className="flex items-center justify-center gap-1">
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
              <th className="text-center px-3 py-2 border-b">Actions</th>
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
                    onEdit={onEdit}
                    onDelete={onDelete}
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
