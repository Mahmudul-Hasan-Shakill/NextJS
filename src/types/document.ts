export interface DocumentData {
  id: number;
  fileName: string;
  mimeType: string;
  size: number;
  uploadDate: string;
  uploadedBy: string;
  description?: string;
  relatedId: number;
  relatedType: string;
  downloadUrl: string;
}

export interface CreateDocumentPayload {
  fileName: string;
  storedFilePath: string;
  mimeType?: string;
  size?: number;
  uploadedBy?: string;
  description?: string;
  relatedType: string;
  relatedId: number;
}

export interface DocumentUpdatePayload {
  fileName?: string;
  description?: string;
}
