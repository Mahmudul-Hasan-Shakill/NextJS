export interface PhysicalHostReg {
  hostname: string;
  physicalIp: string;
  clusterName?: string;
  location?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  assetTag?: string;
  cpuModel?: string;
  cpuCoresTotal?: number;
  ramTotalGb?: number;
  storageTotalTb?: number;
  storageType?: string;
  powerSupply?: string;
  networkPorts?: string;
  osInstalled?: string;
  osVersion?: string;
  hypervisorType?: string;
  hypervisorVersion?: string;
  status?: string;
  warrantyExpiry?: string;
  assignedToTeam?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
}

export interface PhysicalHostEdit extends PhysicalHostReg {
  id: number;
}

export interface PhysicalHostSummary {
  brand: string;
  count: number;
  totalRam: number;
  totalStorage: number;
}
