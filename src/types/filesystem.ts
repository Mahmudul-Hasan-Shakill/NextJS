// types/filesystem.ts
export interface FilesystemReg {
  // static fields
  application: string;
  node?: string;
  ipAddress?: string;
  os?: string;
  backupEnvironment?: string;
  backupType?: string;
  subClientName?: string;
  contentDetails?: string;
  scheduleType?: string;
  backupSchedule?: string;
  storagePolicy?: string;
  backupStartTime?: string;
  backupEndTime?: string;
  fullBackupSize?: string;
  retention?: string;

  // common
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;

  // dynamic
  extras?: Record<string, any>;
}

export interface FilesystemEdit extends FilesystemReg {
  id: number;
}
