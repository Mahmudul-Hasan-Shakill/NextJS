// hooks/useFileUploader.ts
import { useState } from "react";

export function useFileUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const uploadFiles = async (
    files: FileList,
    folder: string,
    filename: string
  ) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("folder", folder);
    formData.append("filename", filename);

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
      const response = JSON.parse(xhr.responseText);
      setUploadedPaths(response.paths);
      setUploading(false);
    };

    xhr.onerror = () => {
      console.error("Upload failed");
      setUploading(false);
    };

    xhr.send(formData);
  };

  return { uploadFiles, uploading, progress, uploadedPaths };
}
