import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFileUploader } from "@/hooks/utility/useFileUploader";
import { toast } from "sonner";

interface FileUploaderProps {
  folder: string;
  baseFilename: string;
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

export default function FileUploader({
  folder,
  baseFilename,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const { uploadFiles, uploading, progress, uploadedPaths } = useFileUploader();

  const fileAccessBaseUrl =
    process.env.NEXT_PUBLIC_FILE_BASE_URL ?? "http://localhost:4000/uploads/";

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    const validFiles = Array.from(droppedFiles).filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length === 0) {
      toast.error(
        "Only text, csv, excel, image, doc, and pdf files are allowed."
      );
      return;
    }

    const dt = new DataTransfer();
    validFiles.forEach((file) => dt.items.add(file));
    setFiles(dt.files);
  };

  const handleUpload = () => {
    if (files) {
      uploadFiles(files, folder, baseFilename);
      setFiles(null);
      const input = document.getElementById(
        `file-input-${folder}`
      ) as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center transition-colors",
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <p className="text-sm text-gray-600">
          Drag and drop files here or click to select
        </p>
        <input
          id={`file-input-${folder}`}
          type="file"
          multiple
          accept={allowedTypes.join(",")}
          onChange={(e) => setFiles(e.target.files)}
          className="mt-2"
        />
        {files && files.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700">
            {Array.from(files).map((file, idx) => (
              <li key={idx} className="truncate">
                📄 {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !files}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? `Uploading... (${progress}%)` : "Upload"}
      </button>

      {progress > 0 && uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* {Array.isArray(uploadedPaths) && uploadedPaths.length > 0 && (
        <ul className="mt-4 space-y-2">
          {uploadedPaths.map((path) => (
            <li key={path}>
              <a
                href={`${fileAccessBaseUrl}${path.split("/uploads/")[1]}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {path.split("/").pop()}
              </a>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}
