"use client";

import { Button } from "@/components/ui/button";
import { FileText, Printer, Layout, LayoutPanelTop } from "lucide-react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

pdfMake.vfs = pdfFonts.vfs;

const logoUrl = "/images/common/brac_logo.png";

export function ExportPdfButton<T extends Record<string, any>>({
  data,
  columns,
  filename,
}: {
  data: T[];
  columns: { key: keyof T; label: string }[];
  filename: string;
}) {
  const handleGeneratePdf = async (
    orientation: "portrait" | "landscape",
    print = false
  ) => {
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
    const fullFilename = `${filename}_${now.getDate()}_${
      now.getMonth() + 1
    }_${now.getFullYear()}.pdf`;

    const tableBody = [
      columns.map((col) => ({ text: col.label, bold: true })),
      ...data.map((row) =>
        columns.map((col) => {
          const value = row[col.key];

          // Handle attachments (documents)
          if (
            Array.isArray(value) &&
            value.length > 0 &&
            value[0]?.downloadUrl
          ) {
            return {
              stack: value.map((doc: any) => ({
                text: doc.fileName,
                link: doc.downloadUrl,
                color: "blue",
                decoration: "underline",
              })),
            };
          }

          return String(value ?? "");
        })
      ),
    ];

    const docDefinition: TDocumentDefinitions = {
      pageOrientation: orientation,
      pageSize: "A4",
      footer: (currentPage, pageCount) => ({
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: "center",
        fontSize: 9,
        margin: [0, 10, 0, 0],
      }),
      content: [
        {
          columns: [
            { image: logoBase64, width: 60 },
            {
              stack: [
                { text: "BRAC Bank PLC", style: "header", alignment: "right" },
                {
                  text: `${filename} Report`,
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
          margin: [0, 30, 0, 0],
          columns: [
            {
              width: "*",
              alignment: "center",
              table: {
                headerRows: 1,
                widths: Array(columns.length).fill("auto"),
                body: tableBody,
              },
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => "#aaa",
                vLineColor: () => "#aaa",
                paddingLeft: () => 4,
                paddingRight: () => 4,
                paddingTop: () => 2,
                paddingBottom: () => 2,
              },
            },
          ],
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 12, color: "#555" },
        timestamp: { fontSize: 9, color: "#888" },
      },
      defaultStyle: {
        fontSize: 8,
      },
    };

    const pdf = pdfMake.createPdf(docDefinition);
    print ? pdf.print() : pdf.download(fullFilename);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex items-center gap-1 py-5"
        >
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-sm">
        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleGeneratePdf("portrait", false)}
        >
          <LayoutPanelTop className="w-4 h-4 mr-2" />
          Download Portrait
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleGeneratePdf("landscape", false)}
        >
          <Layout className="w-4 h-4 mr-2" />
          Download Landscape
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleGeneratePdf("portrait", true)}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Portrait
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleGeneratePdf("landscape", true)}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Landscape
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
