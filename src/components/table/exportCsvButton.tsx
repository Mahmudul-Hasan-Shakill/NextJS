// "use client";

// import { Button } from "@/components/ui/button";
// import { FileSpreadsheet } from "lucide-react";

// type ExportCsvButtonProps<T> = {
//   data: T[];
//   columns: { key: keyof T; label: string }[];
//   filename: string;
// };

// export function ExportCsvButton<T>({
//   data,
//   columns,
//   filename,
// }: ExportCsvButtonProps<T>) {
//   const handleExport = () => {
//     const headers = columns.map((col) => col.label);
//     const rows = data.map((row) =>
//       columns.map((col) => {
//         const value = row[col.key];

//         // Handle attachments (documents)
//         if (Array.isArray(value) && value.length > 0 && value[0]?.downloadUrl) {
//           return value
//             .map((doc: any) => `${doc.fileName} (${doc.downloadUrl})`)
//             .join(" | ");
//         }

//         return String(value ?? "");
//       })
//     );

//     const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

//     // Create a Blob from the CSV content
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     // Get the current date
//     const now = new Date();
//     const dateString = `${now.getDate()}_${
//       now.getMonth() + 1
//     }_${now.getFullYear()}`; // Format: DD_MM_YYYY
//     const fullFilename = `${filename}_${dateString}.csv`; // Construct the full filename

//     // Create a temporary link element
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", fullFilename); // Use the constructed filename

//     // Append to the body, click and remove
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     // Release the object URL
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <Button
//       variant="outline"
//       size="sm"
//       className="text-xs flex items-center gap-1 py-5"
//       onClick={handleExport}
//     >
//       <FileSpreadsheet className="w-4 h-4" />
//       Export CSV
//     </Button>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

type ExportCsvButtonProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  filename: string;
};

// CSV helpers
const CSV_DELIM = ",";

function normalizeCell(val: any): string {
  // Attachments [{fileName, downloadUrl}, ...]
  if (Array.isArray(val)) {
    if (val.length > 0 && typeof val[0] === "object" && val[0]?.downloadUrl) {
      return val
        .map((doc: any) => `${doc.fileName} (${doc.downloadUrl})`)
        .join(" | ");
    }
    // Array of primitives → comma-join (e.g., multiselect)
    return val.map((v) => (v ?? "").toString()).join(",");
  }

  if (val instanceof Date) return val.toISOString();
  if (val === true) return "TRUE";
  if (val === false) return "FALSE";
  if (val == null) return "";

  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }

  return String(val);
}

function csvEscape(raw: string): string {
  // Quote if it contains delimiter, quotes, newlines, or leading/trailing spaces
  const needsQuotes =
    /[",\n\r]/.test(raw) || /^\s/.test(raw) || /\s$/.test(raw);
  if (!needsQuotes) return raw;
  return `"${raw.replace(/"/g, '""')}"`;
}

export function ExportCsvButton<T>({
  data,
  columns,
  filename,
}: ExportCsvButtonProps<T>) {
  const handleExport = () => {
    // Header
    const header = columns
      .map((c) => csvEscape(String(c.label)))
      .join(CSV_DELIM);

    // Rows
    const body = data
      .map((row) =>
        columns
          .map((c) => csvEscape(normalizeCell((row as any)[c.key])))
          .join(CSV_DELIM)
      )
      .join("\n");

    const csvContent = `${header}\n${body}`;
    // Add BOM for Excel UTF-8 friendliness
    const csvWithBom = "\uFEFF" + csvContent;

    // Blob + download
    const blob = new Blob([csvWithBom], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const now = new Date();
    const dateString = `${now.getDate()}_${
      now.getMonth() + 1
    }_${now.getFullYear()}`;
    const fullFilename = `${filename}_${dateString}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fullFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs flex items-center gap-1 py-5"
      onClick={handleExport}
    >
      <FileSpreadsheet className="w-4 h-4" />
      Export CSV
    </Button>
  );
}
