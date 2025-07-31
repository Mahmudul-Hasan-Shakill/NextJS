// import { useState } from "react";
// import { toast } from "sonner";

// interface FileAttachmentProps {
//   onFilesSelected: (files: File[]) => void;
// }

// const allowedTypes = [
//   "text/plain",
//   "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/vnd.ms-excel",
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   "image/png",
//   "image/jpeg",
//   "image/jpg",
//   "text/csv",
// ];

// const maxFileSizeMB = 5;

// export default function FileAttachment({
//   onFilesSelected,
// }: FileAttachmentProps) {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

//   const validateFiles = (files: FileList | File[]): File[] => {
//     const validFiles: File[] = [];
//     const oversized: string[] = [];
//     const invalidTypes: string[] = [];

//     Array.from(files).forEach((file) => {
//       if (!allowedTypes.includes(file.type)) {
//         invalidTypes.push(file.name);
//       } else if (file.size > maxFileSizeMB * 1024 * 1024) {
//         oversized.push(file.name);
//       } else {
//         validFiles.push(file);
//       }
//     });

//     if (invalidTypes.length > 0) {
//       toast.error(`Unsupported types: ${invalidTypes.join(", ")}`);
//     }
//     if (oversized.length > 0) {
//       toast.error(`Files too large: ${oversized.join(", ")}`);
//     }

//     return validFiles;
//   };

//   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       const validated = validateFiles(e.target.files);
//       const updated = [...selectedFiles, ...validated];
//       setSelectedFiles(updated);
//       onFilesSelected(updated);
//     }
//   };

//   const handleRemoveFile = (index: number) => {
//     const updated = selectedFiles.filter((_, i) => i !== index);
//     setSelectedFiles(updated);
//     onFilesSelected(updated);
//   };

//   return (
//     <div className="space-y-4">
//       <label className="block text-sm font-medium text-gray-700 dark:text-white">
//         Attach Documents (optional)
//       </label>
//       <input
//         type="file"
//         multiple
//         accept={allowedTypes.join(",")}
//         onChange={handleFileInputChange}
//         className="block w-full text-sm text-gray-700 dark:text-gray-200"
//       />
//       {selectedFiles.length > 0 && (
//         <ul className="text-sm space-y-1">
//           {selectedFiles.map((file, index) => (
//             <li
//               key={file.name + index}
//               className="flex justify-between items-center"
//             >
//               <span>
//                 📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//               </span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveFile(index)}
//                 className="text-red-500 hover:text-red-700 text-xs"
//               >
//                 Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { toast } from "sonner";

interface FileAttachmentProps {
  onFilesSelected: (files: File[]) => void;
}

const allowedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "text/csv",
];

const maxFileSizeMB = 5;

export default function FileAttachment({
  onFilesSelected,
}: FileAttachmentProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const validateFiles = (files: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const oversized: string[] = [];
    const invalidTypes: string[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidTypes.push(file.name);
      } else if (file.size > maxFileSizeMB * 1024 * 1024) {
        oversized.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidTypes.length > 0) {
      toast.error(`Unsupported types: ${invalidTypes.join(", ")}`);
    }
    if (oversized.length > 0) {
      toast.error(`Files too large: ${oversized.join(", ")}`);
    }

    return validFiles;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const validated = validateFiles(e.target.files);
      const updated = [...selectedFiles, ...validated];
      setSelectedFiles(updated);
      onFilesSelected(updated);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files?.length) {
      const validated = validateFiles(files);
      const updated = [...selectedFiles, ...validated];
      setSelectedFiles(updated);
      onFilesSelected(updated);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-white">
        Attach Documents (optional)
      </label>

      <div
        className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <p className="text-sm text-gray-600">
          Drag and drop files here or click to select (max {maxFileSizeMB}MB
          each)
        </p>
        <input
          type="file"
          multiple
          accept={allowedTypes.join(",")}
          onChange={handleFileInputChange}
          className="mt-2"
        />
        {selectedFiles.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            {selectedFiles.map((file, index) => (
              <li
                key={file.name + index}
                className="flex justify-between items-center"
              >
                <span>
                  📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
