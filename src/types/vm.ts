export interface VmReg {
  deviceCategory: string;
  hostname: string;
  osIpAddress: string;
  sshPort: number;
  osSubnetMask?: string;
  osDefaultGateway?: string;
  serverType?: string;
  volumeLabel?: string;
  volumeSize?: number;
  loginProtocol?: string;
  patchVersion?: string;
  kernelVersion?: string;
  platform: string;
  osVersion: string;
  osClusterName?: string;
  lastPatchingDate?: Date;
  serverStatus: string;
  isDecommissioned?: boolean;
  totalSocket?: number;
  vcpu?: number;
  ramGb?: number;
  hddSize?: number;
  custodianInfo?: string;
  rdpEnabled?: boolean;
  managementIpActive?: boolean;
  backupAvailable?: boolean;
  backupType?: string;
  backupSchedule?: string;
  fileSystemBackupPath?: string;
  backupDbName?: string;
  backupRetention?: string;
  databaseInfo?: string;
  applicationInfo?: string;
  physicalServer?: string;
  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
  applicationIds?: number[];
  databaseIds?: number[];
  physicalId?: number;
}

export interface VmEdit extends VmReg {
  id: number;
}
