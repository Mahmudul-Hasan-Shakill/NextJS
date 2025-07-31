"use client";

import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";

type ExportCsvButtonProps<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  filename: string;
};

export function ExportCsvButton<T>({
  data,
  columns,
  filename,
}: ExportCsvButtonProps<T>) {
  const handleExport = () => {
    const headers = columns.map((col) => col.label);
    const rows = data.map((row) =>
      columns.map((col) => String(row[col.key] ?? ""))
    );

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Get the current date
    const now = new Date();
    const dateString = `${now.getDate()}_${
      now.getMonth() + 1
    }_${now.getFullYear()}`; // Format: DD_MM_YYYY
    const fullFilename = `${filename}_${dateString}.csv`; // Construct the full filename

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fullFilename); // Use the constructed filename

    // Append to the body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL
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
