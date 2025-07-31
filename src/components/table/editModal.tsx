// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogClose,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect, ReactNode, JSXElementConstructor, Key, ReactElement, ReactPortal } from "react";
// import { EditField } from "./editFields";

// type Column<T> = {
//   key: keyof T;
//   label: string;
//   type?:
//     | "text"
//     | "select"
//     | "multiselect"
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

// type EditModalProps<T> = {
//   row: T;
//   columns: Column<T>[];
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (updatedRow: T) => Promise<void>;
//   children?: ReactNode;
// };

// export function EditModal<T extends Record<string, any>>({
//   row,
//   columns,
//   open,
//   onClose,
//   onSubmit,
//   children,
// }: EditModalProps<T>) {
//   const [formData, setFormData] = useState<T>(row);
//   const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
//     {}
//   );

//   useEffect(() => {
//     setFormData(row);
//     const fetchAllOptions = async () => {
//       const optionsMap: Record<string, any[]> = {};
//       await Promise.all(
//         columns.map(async (col) => {
//           if (col.fetchOptions) {
//             try {
//               const opts = await col.fetchOptions();
//               optionsMap[String(col.key)] = opts;
//             } catch (err) {
//               console.error(
//                 `Failed to fetch options for ${String(col.key)}`,
//                 err
//               );
//             }
//           }
//         })
//       );
//       setDynamicOptions(optionsMap);
//     };
//     fetchAllOptions();
//   }, [row, columns]);

//   const handleChange = (
//     e: React.ChangeEvent<any> | { target: { id: string; value: any } }
//   ) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       await onSubmit(formData);
//       onClose();
//     } catch (err) {
//       console.error("Submit failed:", err);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="!w-[80vw] !max-w-[80vw] !h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit</DialogTitle>
//           <DialogDescription>
//             Update the necessary fields and click "Save" to apply changes.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
//           {columns.map((col) => {
//             const keyStr = String(col.key);
//             return (
//               <EditField
//                 className="text-xs"
//                 key={keyStr}
//                 label={col.label}
//                 type={col.type}
//                 value={formData[col.key] ?? ""}
//                 options={col.options || dynamicOptions[keyStr]}
//                 name={keyStr}
//                 onChange={handleChange}
//               />
//             );
//           })}
//         </div>

//         {formData.documents?.length > 0 && (
//           <div className="col-span-full mt-4">
//             <h4 className="text-sm font-semibold mb-2">Uploaded Documents</h4>
//             <ul className="space-y-1 text-xs">
//               {formData.documents.map((doc: { downloadUrl: string | undefined; fileName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; id: any; }, idx: Key | null | undefined) => (
//                 <li key={idx} className="flex items-center justify-between">
//                   <a
//                     href={doc.downloadUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     {doc.fileName}
//                   </a>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => {
//                       const updatedDocs = formData.documents.filter(
//                         (_: any, i: Key | null | undefined) => i !== idx
//                       );
//                       const removedIds = formData.documentIdsToRemove ?? [];
//                       setFormData((prev) => ({
//                         ...prev,
//                         documents: updatedDocs,
//                         documentIdsToRemove: [...removedIds, doc.id],
//                       }));
//                     }}
//                   >
//                     Remove
//                   </Button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {children && <div className="col-span-full">{children}</div>}

//         <DialogFooter className="mt-4">
//           <DialogClose asChild>
//             <Button variant="ghost">Cancel</Button>
//           </DialogClose>
//           <Button onClick={handleSubmit}>Save</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, ReactNode } from "react";
import { EditField } from "./editFields";

type Column<T> = {
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
    | "checkbox"
    | "href";
  options?: { label: string; value: any }[];
  fetchOptions?: () => Promise<{ label: string; value: any }[]>;
};

type EditModalProps<T> = {
  row: T;
  columns: Column<T>[];
  open: boolean;
  onClose: () => void;
  onSubmit: (updatedRow: T) => Promise<void>;
  children?: ReactNode;
};

export function EditModal<T extends Record<string, any>>({
  row,
  columns,
  open,
  onClose,
  onSubmit,
  children,
}: EditModalProps<T>) {
  const [formData, setFormData] = useState<T>(row);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    setFormData({
      ...row,
      documentIdsToRemove: row.documentIdsToRemove ?? [],
    });

    const fetchAllOptions = async () => {
      const optionsMap: Record<string, any[]> = {};
      await Promise.all(
        columns.map(async (col) => {
          if (col.fetchOptions) {
            try {
              const opts = await col.fetchOptions();
              optionsMap[String(col.key)] = opts;
            } catch (err) {
              console.error(
                `Failed to fetch options for ${String(col.key)}`,
                err
              );
            }
          }
        })
      );
      setDynamicOptions(optionsMap);
    };

    fetchAllOptions();
  }, [row, columns]);

  const handleChange = (
    e: React.ChangeEvent<any> | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[80vw] !max-w-[80vw] !h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Update the necessary fields and click "Save" to apply changes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {/* {columns.map((col) => {
            const keyStr = String(col.key);
            return (
              <EditField
                className="text-xs"
                key={keyStr}
                label={col.label}
                type={col.type}
                value={formData[col.key] ?? ""}
                options={col.options || dynamicOptions[keyStr]}
                name={keyStr}
                onChange={handleChange}
              />
            );
          })} */}
          {columns.map((col) => {
            const keyStr = String(col.key);
            const value = formData[col.key];

            // Skip rendering href fields if value is an object or array of objects
            if (
              col.type === "href" &&
              (typeof value === "object" || Array.isArray(value))
            ) {
              return null;
            }

            return (
              <EditField
                className="text-xs"
                key={keyStr}
                label={col.label}
                type={col.type}
                value={value ?? ""}
                options={col.options || dynamicOptions[keyStr]}
                name={keyStr}
                onChange={handleChange}
              />
            );
          })}
        </div>

        {formData.documents?.length > 0 && (
          <div className="col-span-full mt-4">
            <h4 className="text-sm font-semibold mb-2">Uploaded Documents</h4>
            <ul className="space-y-1 text-xs">
              {formData.documents.map((doc: any) => (
                <li key={doc.id} className="flex items-center justify-between">
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {doc.fileName}
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const updatedDocs = formData.documents.filter(
                        (d: any) => d.id !== doc.id
                      );
                      setFormData((prev) => ({
                        ...prev,
                        documents: updatedDocs,
                        documentIdsToRemove: [
                          ...(prev.documentIdsToRemove ?? []),
                          doc.id,
                        ],
                      }));
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {children && <div className="col-span-full">{children}</div>}

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
