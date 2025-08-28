// export interface DatabaseReg {
//   dbName: string;
//   virtualIp: string;
//   additionalIp?: string;
//   dbInstance: string;
//   dbVersion: string;
//   rdbmsType: string;
//   dbPort: number;
//   dbStatus: string;
//   dbType: string;
//   dbOwnerEmail: string;
//   remarks?: string;
//   isActive?: boolean;
//   makeBy: string;
//   makeDate?: Date;
//   editBy?: string;
//   editDate?: Date;
//   vmIds?: number[];
// }

// export interface DatabaseEdit extends DatabaseReg {
//   id: number;
// }

export interface DatabaseReg {
  dbName: string;
  virtualIp: string;
  additionalIp?: string;
  dbInstance: string;
  dbVersion: string;
  rdbmsType: string;
  dbPort: number;
  dbStatus: string;
  dbType: string;
  dbOwnerEmail: string;
  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
  vmIds?: number[];

  /** ✅ dynamic fields payload */
  extras?: Record<string, any>;
  /** optional keys to remove during update (ignored for create) */
  extrasRemove?: string[];
}

export interface DatabaseEdit extends DatabaseReg {
  id: number;
}
