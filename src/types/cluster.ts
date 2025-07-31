export interface ClusterReg {
  clusterName: string;
  vmIpList: string[];
  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  editBy?: string;
  editDate?: Date;
}

export interface ClusterEdit extends ClusterReg {
  id: number;
  vmIp: string;
}
