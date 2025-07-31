// src/types/role.ts

import { AppModules, PermissionActions } from "@/common/permission";

export type ModulePermissions = {
  [key in PermissionActions]?: boolean;
};

export type Permissions = {
  [key in AppModules]?: ModulePermissions;
};

export interface CreateRoleDtoFrontend {
  roleName: string;
  hrefGui: string;
  permissions?: Permissions;
  makeBy?: string;
  makeDate?: string;
  isActive?: boolean;
}

export interface RoleBackendResponse {
  id: number;
  roleName: string;
  hrefGui: string;
  permissions: Permissions;
  makeBy: string;
  makeDate: string;
  editBy: string | null;
  editDate: string | null;
  isActive: boolean;
}

export interface UpdateRoleDtoFrontend {
  roleName: string;
  hrefGui: {
    hrefGui: string;
    isActive: boolean;
    editBy: string;
    editDate?: string;
  }[];
  permissions?: Permissions;
}

// Updated: GuiByRoleNameResponse now includes permissions
export interface GuiByRoleNameResponse {
  hrefGui: string;
  isActive: boolean;
  permissions: Permissions; // Added permissions to this structure
}
