// automation.ts
export interface AutomationReg {
  hostname?: string;
  ipAddress?: string;
  serverEnvironment?: string;
  cpuPhysicalCores?: number;
  cpuVirtualCores?: number;
  cpuModel?: string;
  totalRam?: string;
  totalDiskSize?: string;
  osVersion?: string;
  kernelVersion?: string;
  serverPlatform?: string;
  serialNumber?: string;
  sshPort?: string;
  sockets?: number;
  lastPatchInstalled?: Date;
  systemUptime?: string;

  // Falcon Sensor
  falconInstalled?: string;
  falconVersion?: string;
  falconInstallDate?: Date;
  falconStatus?: string;

  // Qualys
  qualysInstalled?: string;
  qualysVersion?: string;
  qualysInstallDate?: Date;
  qualysStatus?: string;

  // Disk Info
  diskTotalSize?: string;
  diskUsed?: string;
  diskFree?: string;

  // Network Info
  subnetMask?: string;
  gateway?: string;
  networkIp?: string;

  // NTP Info
  ntpService?: string;
  ntpServers?: string;
  ntpSyncSource?: string;

  // User Info
  systemUsersCount?: number;
  sudoUsers?: string;

  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
  applicationIds?: number[];
  databaseIds?: number[];
}

export interface AutomationEdit extends AutomationReg {
  id: number;
}
