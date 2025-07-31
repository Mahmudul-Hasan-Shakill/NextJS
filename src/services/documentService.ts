import Cookies from "js-cookie";
import { DocumentData, DocumentUpdatePayload } from "@/types/document";
import { BackendResponse } from "@/types/backendResponse";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getAuthHeaders = (contentType?: string) => {
  const token = Cookies.get("ACSTKN");
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  return headers;
};

const handleResponse = async <T>(
  res: Response
): Promise<BackendResponse<T>> => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as BackendResponse<T>;
};

export const documentService = {
  // async uploadDocument(
  //   relatedType: string,
  //   relatedId: number,
  //   file: File,
  //   onUploadProgress?: (progressEvent: ProgressEvent) => void
  // ): Promise<BackendResponse<DocumentData>> {
  //   return new Promise((resolve, reject) => {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const xhr = new XMLHttpRequest();
  //     xhr.open(
  //       "POST",
  //       `${baseUrl}documents/upload/${relatedType}/${relatedId}`
  //     );
  //     xhr.setRequestHeader("Authorization", `Bearer ${Cookies.get("ACSTKN")}`);

  //     if (onUploadProgress) {
  //       xhr.upload.onprogress = onUploadProgress;
  //     }

  //     xhr.onload = () => {
  //       try {
  //         const response = JSON.parse(xhr.responseText);
  //         if (xhr.status >= 200 && xhr.status < 300) {
  //           resolve(response as BackendResponse<DocumentData>);
  //         } else {
  //           reject(new Error(response.message || "Document upload failed"));
  //         }
  //       } catch (e) {
  //         reject(new Error("Failed to parse server response during upload"));
  //       }
  //     };

  //     xhr.onerror = () =>
  //       reject(new Error("Network error occurred during document upload"));
  //     xhr.onabort = () => reject(new Error("Document upload was cancelled"));

  //     xhr.send(formData);
  //   });
  // },

  async uploadDocument(
    relatedType: string,
    relatedId: number,
    file: File,
    metadata?: { uploadedBy?: string; description?: string },
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<BackendResponse<DocumentData>> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      if (metadata?.uploadedBy)
        formData.append("uploadedBy", metadata.uploadedBy);
      if (metadata?.description)
        formData.append("description", metadata.description);

      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `${baseUrl}documents/upload/${relatedType}/${relatedId}`
      );
      xhr.setRequestHeader("Authorization", `Bearer ${Cookies.get("ACSTKN")}`);

      if (onUploadProgress) {
        xhr.upload.onprogress = onUploadProgress;
      }

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response as BackendResponse<DocumentData>);
          } else {
            reject(new Error(response.message || "Document upload failed"));
          }
        } catch (e) {
          reject(new Error("Failed to parse server response during upload"));
        }
      };

      xhr.onerror = () =>
        reject(new Error("Network error occurred during document upload"));
      xhr.onabort = () => reject(new Error("Document upload was cancelled"));

      xhr.send(formData);
    });
  },

  async getDocumentsByEntity(
    relatedType: string,
    relatedId: number
  ): Promise<BackendResponse<DocumentData[]>> {
    const res = await fetch(`${baseUrl}documents/${relatedType}/${relatedId}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse<DocumentData[]>(res);
  },

  async getDocument(id: number): Promise<BackendResponse<DocumentData>> {
    const res = await fetch(`${baseUrl}documents/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse<DocumentData>(res);
  },

  async downloadDocument(id: number): Promise<Blob> {
    const res = await fetch(`${baseUrl}documents/${id}/download`, {
      method: "GET",
      headers: getAuthHeaders(undefined),
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to download document");
    }
    return res.blob();
  },

  async updateDocument(
    id: number,
    updateDocumentDto: DocumentUpdatePayload
  ): Promise<BackendResponse<DocumentData>> {
    const res = await fetch(`${baseUrl}documents/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(updateDocumentDto),
    });
    return handleResponse<DocumentData>(res);
  },

  async deleteDocument(id: number): Promise<BackendResponse<null>> {
    const res = await fetch(`${baseUrl}documents/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse<null>(res);
  },
};
