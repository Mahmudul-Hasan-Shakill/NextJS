import { PermissionActions } from "@/common/permission";

// The permission object for a GUI
export type GuiPermissions = {
  [key in PermissionActions]: boolean;
};

export interface CreateRoleDtoFrontend {
  roleName: string;
  hrefGui: string;
  permissions?: GuiPermissions; // <- Only the CRUD object for this GUI
  makeBy?: string;
  makeDate?: string;
  isActive?: boolean;
}

export interface RoleBackendResponse {
  id: number;
  roleName: string;
  hrefGui: string;
  permissions: GuiPermissions; // CRUD object
  makeBy: string;
  makeDate: string;
  editBy: string | null;
  editDate: string | null;
  isActive: boolean;
}

export interface UpdateRoleDtoFrontend {
  roleName: string;
  guiPermissions: {
    hrefGui: string;
    isActive: boolean;
    permissions: { [k: string]: boolean };
    editBy: string;
    editDate?: string;
  }[];
}

// For getGuiByRoleName:
export interface GuiByRoleNameResponse {
  hrefGui: string;
  isActive: boolean;
  permissions: GuiPermissions;
}
