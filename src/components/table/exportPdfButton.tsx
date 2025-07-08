// "use client";

// import { Button } from "@/components/ui/button";
// import { FileText } from "lucide-react";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import { TDocumentDefinitions } from "pdfmake/interfaces";
// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

// pdfMake.vfs = pdfFonts.vfs;

// const logoUrl = "/images/common/brac_logo.png";

// export function ExportPdfButton<T extends Record<string, any>>({
//   data,
//   columns,
//   filename,
// }: {
//   data: T[];
//   columns: { key: keyof T; label: string }[];
//   filename: string;
// }) {
//   const [open, setOpen] = useState(false);

//   const handleGeneratePdf = async (orientation: "portrait" | "landscape") => {
//     setOpen(false);

//     const logoBase64 = await fetch(logoUrl)
//       .then((res) => res.blob())
//       .then(
//         (blob) =>
//           new Promise<string>((resolve) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result as string);
//             reader.readAsDataURL(blob);
//           })
//       );

//     const now = new Date();
//     const formattedDate = now.toLocaleDateString();
//     const formattedTime = now.toLocaleTimeString();
//     const fullFilename = `${filename}_${now.getDate()}_${
//       now.getMonth() + 1
//     }_${now.getFullYear()}.pdf`;

//     const tableBody = [
//       columns.map((col) => ({ text: col.label, bold: true })),
//       ...data.map((row) => columns.map((col) => String(row[col.key] ?? ""))),
//     ];

//     const docDefinition: TDocumentDefinitions = {
//       pageOrientation: orientation,
//       pageSize: "A4",
//       footer: (currentPage, pageCount) => ({
//         text: `Page ${currentPage} of ${pageCount}`,
//         alignment: "center",
//         fontSize: 9,
//         margin: [0, 10, 0, 0],
//       }),
//       content: [
//         {
//           columns: [
//             { image: logoBase64, width: 60 },
//             {
//               stack: [
//                 { text: "BRAC Bank PLC", style: "header", alignment: "right" },
//                 {
//                   text: `${filename} Report`,
//                   style: "subheader",
//                   alignment: "right",
//                 },
//                 {
//                   text: `Generated on ${formattedDate} at ${formattedTime}`,
//                   style: "timestamp",
//                   alignment: "right",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           margin: [0, 30, 0, 0],
//           columns: [
//             {
//               width: "*",
//               alignment: "center",
//               table: {
//                 headerRows: 1,
//                 widths: Array(columns.length).fill("auto"),
//                 body: tableBody,
//               },
//               layout: {
//                 hLineWidth: () => 0.5,
//                 vLineWidth: () => 0.5,
//                 hLineColor: () => "#aaa",
//                 vLineColor: () => "#aaa",
//                 paddingLeft: () => 4,
//                 paddingRight: () => 4,
//                 paddingTop: () => 2,
//                 paddingBottom: () => 2,
//               },
//             },
//           ],
//         },
//       ],
//       styles: {
//         header: { fontSize: 18, bold: true },
//         subheader: { fontSize: 12, color: "#555" },
//         timestamp: { fontSize: 9, color: "#888" },
//       },
//       defaultStyle: {
//         fontSize: 8,
//       },
//     };

//     pdfMake.createPdf(docDefinition).download(fullFilename);
//   };

//   return (
//     <>
//       <Button
//         variant="outline"
//         size="sm"
//         className="text-xs flex items-center gap-1 py-5"
//         onClick={() => setOpen(true)}
//       >
//         <FileText className="w-4 h-4" />
//         Export PDF
//       </Button>

//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="!max-w-xs text-sm">
//           <DialogHeader>
//             <DialogTitle>Select Page Orientation</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col gap-3">
//             <Button
//               className="text-xs"
//               onClick={() => handleGeneratePdf("portrait")}
//             >
//               Portrait
//             </Button>
//             <Button
//               className="text-xs"
//               onClick={() => handleGeneratePdf("landscape")}
//             >
//               Landscape
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

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
      ...data.map((row) => columns.map((col) => String(row[col.key] ?? ""))),
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
        <DropdownMenuItem className="text-xs" onClick={() => handleGeneratePdf("portrait", false)}>
          <LayoutPanelTop className="w-4 h-4 mr-2" />
          Download Portrait
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" onClick={() => handleGeneratePdf("landscape", false)}>
          <Layout className="w-4 h-4 mr-2" />
          Download Landscape
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs" onClick={() => handleGeneratePdf("portrait", true)}>
          <Printer className="w-4 h-4 mr-2" />
          Print Portrait
        </DropdownMenuItem>

        <DropdownMenuItem className="text-xs" onClick={() => handleGeneratePdf("landscape", true)}>
          <Printer className="w-4 h-4 mr-2" />
          Print Landscape
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
