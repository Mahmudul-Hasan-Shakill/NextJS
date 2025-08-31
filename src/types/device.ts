// /types/device.ts
export interface DeviceReg {
  // Identity
  deviceType?: string | null;
  assetTag: string;
  serialNumber?: string | null;

  brand?: string | null;
  model?: string | null;

  // Ownership & location
  currentOwnerPin?: string | null;
  currentOwnerName?: string | null;
  currentOwnerEmail?: string | null;
  unit?: string | null;
  site?: string | null;
  locationNote?: string | null;

  // Status & lifecycle
  status?: "in_use" | "in_stock" | "under_repair" | "retired" | "disposed";
  assignedDate?: string | Date | null; // ISO string or Date; server accepts Date
  returnedDate?: string | Date | null;
  remarks?: string | null;

  // Technical
  hostname?: string | null;
  platform?: string | null;
  osVersion?: string | null;
  ipAddress?: string | null;
  macAddress?: string | null;

  // Commercial
  purchaseOrderNo?: string | null;
  vendor?: string | null;
  purchaseDate?: string | Date | null;
  warrantyEnd?: string | Date | null;

  // Common
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;

  // Dynamic fields (sanitized by service)
  extras?: Record<string, any>;
}

export interface DeviceEdit extends DeviceReg {
  id: number;
}
