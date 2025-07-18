// hooks/useFileUploader.ts
import { useState } from "react";

export function useFileUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const uploadFiles = async (
    files: FileList,
    folder: string,
    filename: string
  ): Promise<boolean> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("folder", folder);
    formData.append("filename", filename);

    try {
      const success = await new Promise<boolean>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${baseUrl}upload`);
        console.log(`${baseUrl}upload`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadedPaths(response.paths);
              resolve(true);
            } else {
              setError(response.message || "Upload failed");
              resolve(false);
            }
          } catch (e) {
            setError("Failed to parse server response");
            resolve(false);
          }
        };

        xhr.onerror = () => {
          setError("Network error occurred during upload");
          resolve(false);
        };

        xhr.onabort = () => {
          setError("Upload was cancelled");
          resolve(false);
        };

        xhr.send(formData);
      });

      return success;
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFiles, uploading, progress, uploadedPaths, error };
}
