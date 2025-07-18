import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParserHookResult {
  parseFiles: (files: FileList) => Promise<boolean>;
  parsing: boolean;
  result: any;
  error: string | null;
}

type AutomationFileParserUploaderProps = {
  useParserHook: () => ParserHookResult;
};

export default function AutomationFileParserUploader({
  useParserHook,
}: AutomationFileParserUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const { parseFiles, parsing, result, error } = useParserHook();

  const allowedTypes = ["text/plain"];
  const maxFileSizeMB = 2;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    const validFiles = Array.from(droppedFiles).filter((f) =>
      allowedTypes.includes(f.type)
    );

    if (!validFiles.length) {
      toast.error("Only .txt files are allowed");
      return;
    }

    const oversized = validFiles.filter(
      (f) => f.size > maxFileSizeMB * 1024 * 1024
    );
    if (oversized.length) {
      toast.error(
        `Some files exceed the ${maxFileSizeMB}MB limit: ${oversized
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    const dt = new DataTransfer();
    validFiles.forEach((file) => dt.items.add(file));
    setFiles(dt.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const validFiles = Array.from(e.target.files).filter((f) =>
      allowedTypes.includes(f.type)
    );

    const oversized = validFiles.filter(
      (f) => f.size > maxFileSizeMB * 1024 * 1024
    );
    if (oversized.length) {
      toast.error(
        `Some files exceed the ${maxFileSizeMB}MB limit: ${oversized
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    const dt = new DataTransfer();
    validFiles.forEach((file) => dt.items.add(file));
    setFiles(dt.files);

    // Allow re-uploading the same file
    e.target.value = "";
  };

  const handleParse = async () => {
    if (!files) {
      toast.error("No files selected");
      return;
    }

    const success = await parseFiles(files);
    const parsedCount = result?.data?.length ?? 0;

    if (success) {
      if (parsedCount > 0) {
        toast.success(
          `Parsed and saved ${parsedCount} record${parsedCount > 1 ? "s" : ""}.`
        );
      } else {
        toast.warning("No new records parsed (duplicates or invalid).");
      }

      setFiles(null);
      const input = document.getElementById(
        "automation-file-input"
      ) as HTMLInputElement;
      if (input) input.value = "";
    } else {
      toast.error(error || "Failed to parse files");
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
          Drag and drop text files here or click to select (max {maxFileSizeMB}
          MB each)
        </p>
        <input
          id="automation-file-input"
          type="file"
          multiple
          accept={allowedTypes.join(",")}
          onChange={handleChange}
          className="mt-2"
        />
        {files && files.length > 0 && (
          <ul className="mt-2 text-sm text-gray-700">
            {files.length === 1 ? (
              <li className="truncate">
                📄 {files[0].name} - {(files[0].size / 1024).toFixed(1)} KB
              </li>
            ) : (
              <li className="truncate">📄 {files.length} files selected</li>
            )}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={handleParse}
          disabled={parsing || !files}
          className={cn(
            "mb-4 group/btn text-xs relative block h-10 w-full rounded-md font-medium text-white shadow transition-all",
            parsing
              ? "bg-gray-500 cursor-not-allowed"
              : files
              ? "bg-gradient-to-br from-gray-900 to-gray-600 font-medium text-white shadow dark:bg-zinc-800"
              : "bg-gray-400 cursor-not-allowed"
          )}
        >
          {parsing ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Parsing...
            </span>
          ) : (
            "Parse & Upload"
          )}
          <BottomGradient />
        </button>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const Spinner = () => (
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
