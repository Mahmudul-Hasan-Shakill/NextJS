export interface PhysicalReg {
  deviceCategory: string;
  hostname: string;
  primaryIdentificationName: string;
  makeOrBrand: string;
  serverModel: string;
  serviceTag: string;
  enclosureIp: string;
  managementIp: string;
  serviceIp: string;
  zone: string;
  os: string;
  osVersion: string;
  hypervisorEOSL?: string;
  serverEOSL?: string;
  purchasedDate?: Date;
  installationDate?: Date;
  purchasedFrom?: string;
  workOrderNumber?: string;
  warranty?: string;
  underAMC?: boolean;
  floorName?: string;
  rack?: string;
  row?: string;
  uInformation?: string;
  numberOfNICCards?: number;
  numberOfNICPorts?: number;
  numberOfHBACards?: number;
  numberOfHBAPorts?: number;
  numberOfSockets?: number;
  coresPerSocket?: number;
  isDecommissioned?: boolean;
  physicalCores?: number;
  physicalRamGb?: number;
  physicalDiskSize?: number;
  numberOfDisks?: number;
  diskType?: string;
  nicFirmwareVersion?: string;
  sanFirmwareVersion?: string;
  chasis?: string;
  dualConnectivity?: boolean;
  nicCapacity?: string;
  switchUplink?: string;
  serverUplink?: string;
  uplinkPort?: string;
  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
  vmIds?: number[];
}

export interface PhysicalEdit extends PhysicalReg {
  id: number;
}
