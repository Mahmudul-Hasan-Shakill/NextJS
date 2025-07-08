export interface SelfRegisterData {
  pin: string;
  name: string;
  email: string;
  unit: string;
  division: string;
  department: string;
  password: string;
  makeBy: string;
  userRole: string;
}

export interface RegisterData {
  pin: string;
  name: string;
  email: string;
  unit: string;
  division: string;
  department: string;
  makeBy: string;
  userRole: string;
  isActive?: boolean;
  isLocked?: boolean;
  isReset?: boolean;
}

export type Register = {
  id: number;
  pin: string;
  name: string;
  email: string;
  userRole: string;
  isActive: boolean;
  isLocked: boolean;
  isReset: boolean;
};
