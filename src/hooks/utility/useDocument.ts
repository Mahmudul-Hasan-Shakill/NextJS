import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { documentService } from "@/services/documentService";
import { DocumentData, DocumentUpdatePayload } from "@/types/document";

export function useDocumentUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocument, setUploadedDocument] = useState<DocumentData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (
    relatedType: string,
    relatedId: number,
    file: File,
    metadata?: { uploadedBy?: string; description?: string }
  ): Promise<DocumentData | null> => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadedDocument(null);

    try {
      const res = await documentService.uploadDocument(
        relatedType,
        relatedId,
        file,
        metadata,
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(percent);
          }
        }
      );

      if (res?.isSuccessful) {
        toast.success(res.message || "Document uploaded successfully!");
        setUploadedDocument(res.data);
        return res.data;
      } else {
        setError(res.message || "Document upload failed.");
        toast.error(res.message || "Document upload failed.");
        return null;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during upload.");
      toast.error(err.message || "An unexpected error occurred during upload.");
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return { uploadDocument, uploading, uploadProgress, uploadedDocument, error };
}

export function useEntityDocuments(relatedType: string, relatedId: number) {
  const fetcher = async () => {
    const response = await documentService.getDocumentsByEntity(
      relatedType,
      relatedId
    );
    if (response?.isSuccessful && Array.isArray(response.data)) {
      return response.data;
    }
    console.error(
      `Invalid documents response for ${relatedType} ID ${relatedId}:`,
      response
    );
    throw new Error(
      `Failed to fetch documents for ${relatedType} ID ${relatedId}`
    );
  };

  const { data, error, mutate } = useSWR(
    relatedId ? `${relatedType}-documents-${relatedId}` : null,
    fetcher
  );

  return {
    documents: data ?? [],
    isLoading: !error && !data,
    error,
    mutate,
  };
}

export function useUpdateDocument() {
  const [loading, setLoading] = useState(false);

  const updateDocument = async (
    id: number,
    data: DocumentUpdatePayload
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await documentService.updateDocument(id, data);
      if (res?.isSuccessful) {
        toast.success(res.message || "Document metadata updated successfully.");
        return true;
      } else {
        toast.error(res.message || "Failed to update document metadata.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update document metadata.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateDocument, loading };
}

export function useDeleteDocument() {
  const [loading, setLoading] = useState(false);

  const deleteDocument = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await documentService.deleteDocument(id);
      if (res?.isSuccessful) {
        toast.success(res.message || "Document deleted successfully!");
        return true;
      } else {
        toast.error(res.message || "Failed to delete document.");
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDocument, loading };
}
