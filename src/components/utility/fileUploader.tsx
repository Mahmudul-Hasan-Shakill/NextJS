import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFileUploader } from "@/hooks/utility/useFileUploader";
import { toast } from "sonner";

interface FileUploaderProps {
  folder: string;
  baseFilename: string;
  maxFileSizeMB?: number;
  onUploadComplete?: (paths: string[]) => void;
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
  maxFileSizeMB = 5,
  onUploadComplete,
}: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

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

    // Check file sizes
    const oversizedFiles = Array.from(droppedFiles).filter(
      (file) => file.size > maxFileSizeMB * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      toast.error(
        `Some files exceed the ${maxFileSizeMB}MB limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    const dt = new DataTransfer();
    validFiles.forEach((file) => dt.items.add(file));
    setFiles(dt.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validFiles.length === 0) {
        toast.error(
          "Only text, csv, excel, image, doc, and pdf files are allowed."
        );
        return;
      }

      // Check file sizes
      const oversizedFiles = Array.from(e.target.files).filter(
        (file) => file.size > maxFileSizeMB * 1024 * 1024
      );

      if (oversizedFiles.length > 0) {
        toast.error(
          `Some files exceed the ${maxFileSizeMB}MB limit: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`
        );
        return;
      }

      const dt = new DataTransfer();
      validFiles.forEach((file) => dt.items.add(file));
      setFiles(dt.files);
    }
  };

  const { uploadFiles, uploading, progress, error, uploadedPaths } =
    useFileUploader();

  const handleUpload = async () => {
    if (files) {
      const success = await uploadFiles(files, folder, baseFilename);
      if (success) {
        onUploadComplete?.(uploadedPaths);
        setFiles(null);
        const input = document.getElementById(
          `file-input-${folder}`
        ) as HTMLInputElement;
        if (input) input.value = "";
        toast.success("Files uploaded successfully!");
      } else {
        toast.error(error || "Failed to upload files");
      }
    } else {
      toast.error("No files selected for upload");
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
          Drag and drop files here or click to select (max {maxFileSizeMB}MB
          each)
        </p>
        <input
          id={`file-input-${folder}`}
          type="file"
          multiple
          accept={allowedTypes.join(",")}
          onChange={handleFileInputChange}
          className="mt-2"
        />
        {files && files.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700">
            {files.length === 1 ? (
              // Show full details for single file
              <li className="truncate">
                📄 {files[0].name} - {(files[0].size / 1024 / 1024).toFixed(2)}
                MB
                {files[0].size > maxFileSizeMB * 1024 * 1024 && (
                  <span className="text-red-500 ml-2">(Over size limit)</span>
                )}
              </li>
            ) : (
              // Show count for multiple files
              <li className="truncate">
                📄 {files.length} files selected
                {Array.from(files).some(
                  (file) => file.size > maxFileSizeMB * 1024 * 1024
                ) && (
                  <span className="text-red-500 ml-2">
                    (Some files exceed size limit)
                  </span>
                )}
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Upload Button with Progress Indicator */}
      <div className="space-y-2">
        <button
          onClick={handleUpload}
          disabled={uploading || !files}
          className={cn(
            "group/btn text-xs relative block col-span-1 md:col-span-2 my-2 h-10 w-full rounded-md font-medium text-white shadow transition-all",
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : files
              ? "bg-gradient-to-br from-gray-900 to-gray-600 hover:from-gray-800 hover:to-gray-700"
              : "bg-gray-400 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Uploading ({progress}%)
            </span>
          ) : (
            "Upload Files"
          )}
          <BottomGradient />
        </button>

        {/* Enhanced Progress Bar */}
        {uploading && (
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Upload progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const Spinner = () => {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};
