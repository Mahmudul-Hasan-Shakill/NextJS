export interface AmcReg {
  item: string;
  productName: string;
  quantity: number;
  eolOrEosl: boolean;
  declaredEolOrEosl: Date;
  underAmc: boolean;
  supportType: string;
  amcStart: Date;
  amcEnd: Date;
  warrantyStart: Date;
  warrantyEnd: Date;
  vendorName: string;
  oem: string;
  remarks?: string;
  isActive?: boolean;
  makeBy: string;
  makeDate?: Date;
  editBy?: string;
  editDate?: Date;
}

export interface AmcEdit extends AmcReg {
  id: number;
}
