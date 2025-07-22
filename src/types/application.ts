export interface ApplicationReg {
  environment: string;
  serviceName: string;
  serviceOwner: string;
  applicationCategory: string;
  appModule: string;
  appOwner: string;
  appOwnerEmail: string;
  applicationUrl?: string;
  applicationCertificateDetail?: string;
  certificationExpiryDate?: Date;
  connectedApps?: string;
  middlewareDetails?: string;
  databaseDetails?: string;
  loadBalancerDetails?: string;
  buildLanguage?: string;
  licenceType?: string;
  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
  vmIds?: number[];
  automationIds?: number[];
}

export interface ApplicationEdit extends ApplicationReg {
  id: number;
}
