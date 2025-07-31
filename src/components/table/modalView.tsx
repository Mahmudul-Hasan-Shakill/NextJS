"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Column } from "./dataTable";
import { FileDown } from "lucide-react";
import { TDocumentDefinitions } from "pdfmake/interfaces";

const logoUrl = "/images/common/brac_logo.png";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

type ViewModalProps<T> = {
  row: T;
  columns: Column<T>[];
  onClose: () => void;
};

export function ViewModal<T extends Record<string, any>>({
  row,
  columns,
  onClose,
}: ViewModalProps<T>) {
  const truncate = (text: string, max = 100) =>
    text.length > max ? text.slice(0, max) + "..." : text;
  const handleExportPdf = async () => {
    const logoBase64 = await fetch(logoUrl)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          columns: [
            {
              image: logoBase64,
              width: 60,
            },
            {
              stack: [
                { text: "BRAC Bank PLC", style: "header", alignment: "right" },
                {
                  text: "Detail Report",
                  style: "subheader",
                  alignment: "right",
                },
                {
                  text: `Generated on ${formattedDate} at ${formattedTime}`,
                  style: "timestamp",
                  alignment: "right",
                },
              ],
            },
          ],
        },
        {
          table: {
            widths: ["30%", "70%"],

            body: columns.map(({ key, label }) => [
              { text: label, bold: true },
              { text: truncate(String(row[key]), 120) },
            ]),
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => "#aaa",
            vLineColor: () => "#aaa",
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
          margin: [0, 20, 0, 0],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 12,
          color: "#555",
        },
        timestamp: {
          fontSize: 9,
          color: "#888",
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("details.pdf");
  };

  return (
    <Dialog open={!!row} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">Details</DialogTitle>
          <DialogDescription className="text-xs">
            Here are the details of the selected row.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-md p-3 space-y-2 text-xs">
          {columns.map(({ key, label }) => (
            <div
              key={String(key)}
              className="flex justify-between border-b pb-1 last:border-b-0"
            >
              <span className="font-medium">{label}</span>

              <span className="text-right break-words max-w-[60%]">
                {truncate(String(row[key]), 120)}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="absolute top-4 right-16 flex gap-1 items-center"
            onClick={handleExportPdf}
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
