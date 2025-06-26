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
  password?: string;
  makeBy: string;
  userRole: string;
}
