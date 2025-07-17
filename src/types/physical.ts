// export interface PhysicalReg {
//   deviceCategory: string;
//   hostname: string;
//   primaryIdentificationName: string;
//   makeOrBrand: string;
//   serverModel: string;
//   serviceTag: string;
//   enclosureIp: string;
//   managementIp: string;
//   serviceIp: string;
//   zone: string;
//   os: string;
//   osVersion: string;
//   hypervisorEOSL?: string;
//   serverEOSL?: string;
//   purchasedDate?: Date;
//   installationDate?: Date;
//   purchasedFrom?: string;
//   workOrderNumber?: string;
//   warranty?: string;
//   underAMC?: boolean;
//   floorName?: string;
//   rack?: string;
//   row?: string;
//   uInformation?: string;
//   numberOfNICCards?: number;
//   numberOfNICPorts?: number;
//   numberOfHBACards?: number;
//   numberOfHBAPorts?: number;
//   numberOfSockets?: number;
//   coresPerSocket?: number;
//   isDecommissioned?: boolean;
//   physicalCores?: number;
//   physicalRamGb?: number;
//   physicalDiskSize?: number;
//   numberOfDisks?: number;
//   diskType?: string;
//   nicFirmwareVersion?: string;
//   sanFirmwareVersion?: string;
//   chasis?: string;
//   dualConnectivity?: boolean;
//   nicCapacity?: string;
//   switchUplink?: string;
//   serverUplink?: string;
//   uplinkPort?: string;
//   remarks?: string;
//   isActive?: boolean;
//   makeBy: string;
//   makeDate?: Date;
//   editBy?: string;
//   editDate?: Date;
//   vmIds?: number[];
// }

// export interface PhysicalEdit extends PhysicalReg {
//   id: number;
// }

export interface PhysicalReg {
  // Required Fields
  deviceCategory: string; // Required
  hostname: string; // Required
  os: string; // Required
  makeBy: string; // Required

  // Optional Fields
  makeOrBrand?: string; // Optional
  serverModel?: string; // Optional
  enclosureIp?: string; // Optional
  dcZone?: string; // Optional
  drZone?: string; // Optional
  rack?: string; // Optional
  floorName?: string; // Optional
  dimensionMm?: string; // Optional
  dimensionRackU?: number; // Optional
  uInformation?: string; // Optional
  numberOfNICPorts?: string; // Optional
  numberOfHBAPorts?: string; // Optional
  serviceIp?: string; // Optional
  servicePort?: string; // Optional
  loginProtocol?: string; // Optional
  serverStatus?: string; // Optional
  kernelVersion?: string; // Optional
  serverType?: string; // Optional
  serverMacAddress?: string; // Optional
  numberOfSockets?: number; // Optional
  coresPerSocket?: number; // Optional
  totalVcpu?: number; // Optional
  physicalRamGb?: number; // Optional
  custodianInformation?: string; // Optional
  osClusterName?: string; // Optional
  latestPatchVersion?: string; // Optional
  osIpAddress?: string; // Optional
  subnetMask?: string; // Optional
  defaultGateway?: string; // Optional
  serviceVlan?: string; // Optional
  onmIpGateway?: string; // Optional
  onmIpMask?: string; // Optional
  onmVlan?: string; // Optional
  primaryDns?: string; // Optional
  secondaryDns?: string; // Optional
  dualConnectivity?: string; // Optional
  nicCapacity?: string; // Optional
  rdpEnabled?: boolean; // Optional
  switchUplink?: string; // Optional
  serverUplink?: string; // Optional
  uplinkPort?: string; // Optional
  managementIp?: string; // Optional
  dbName?: string; // Optional
  dbVirtualIp?: string; // Optional
  dbAdditionalIp?: string; // Optional
  dbInstance?: string; // Optional
  dbVersion?: string; // Optional
  rdmsType?: string; // Optional
  dbPort?: string; // Optional
  dbStatus?: string; // Optional
  dbType?: string; // Optional
  dbOwnerEmail?: string; // Optional
  environmentCategory?: string; // Optional
  serviceName?: string; // Optional
  middlewareDetails?: string; // Optional
  loadBalancerDetails?: string; // Optional
  oem?: string; // Optional
  maintenanceVendor?: string; // Optional
  eolDate?: Date; // Optional
  eosDate?: Date; // Optional
  backupAvailable?: string; // Optional
  backupType?: string; // Optional
  backupSchedule?: string; // Optional
  powerConnectivity?: string; // Optional
  powerRedundancy?: string; // Optional
  powerRedundancyMethodology?: string; // Optional
  inputPowerType?: string; // Optional
  powerPhase?: string; // Optional
  powerConsumptionVa?: string; // Optional
  infraMonitoring?: boolean; // Optional
  appMonitoring?: boolean; // Optional
  remarks?: string; // Optional
  isActive?: boolean; // Optional
  makeDate?: Date; // Optional
  editBy?: string; // Optional
  editDate?: Date; // Optional
  vmIds?: number[]; // Optional
}

export interface PhysicalEdit extends PhysicalReg {
  id: number;
}
