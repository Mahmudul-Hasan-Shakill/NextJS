import { DocumentData, CreateDocumentPayload } from "./document";

export interface AmcCreatePayload {
  productName: string;
  quantity: number;
  serialNumber?: string;
  assetTag?: string;
  isEolOrEosl?: boolean;
  declaredEolOrEosl?: string;
  underAmc?: boolean;
  supportType?: string;
  amcStart?: string;
  amcEnd?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  vendorName?: string;
  oem?: string;
  purchaseDate?: string;
  purchaseOrderNumber?: string;
  remarks?: string;
  location?: string;
  status: string;
  makeBy: string;
  isActive?: boolean;
  documents?: CreateDocumentPayload[]; // ✅ Centralized document model
}

export interface AmcUpdatePayload extends Partial<AmcCreatePayload> {
  editBy?: string;
  documentIdsToRemove?: number[];
  documents?: CreateDocumentPayload[]; // ✅ For adding new documents
}

export interface AmcData {
  id: number;
  productName: string;
  quantity: number;
  serialNumber?: string;
  assetTag?: string;
  isEolOrEosl: boolean;
  declaredEolOrEosl?: string;
  underAmc: boolean;
  supportType?: string;
  amcStart?: string;
  amcEnd?: string;
  warrantyStart?: string;
  warrantyEnd?: string;
  vendorName?: string;
  oem?: string;
  purchaseDate?: string;
  purchaseOrderNumber?: string;
  remarks?: string;
  location?: string;
  status: string;
  makeBy: string;
  makeDate: string;
  editBy?: string;
  editDate: string;
  isActive: boolean;
  documents: DocumentData[];
  documentIdsToRemove?: number[];
}

export interface AmcQueryParams {
  productName?: string;
  status?: string;
  vendorName?: string;
  underAmc?: boolean;
  location?: string;
  page?: number;
  limit?: number;
}
