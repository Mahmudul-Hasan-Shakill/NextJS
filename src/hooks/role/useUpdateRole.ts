// import { useState } from "react";
// import { roleService } from "@/services/roleServices";

// export function useUpdateRole() {
//   const [loading, setLoading] = useState(false);

//   const updateRole = async (roleData: any) => {
//     setLoading(true);
//     try {
//       const response = await roleService.updateRole(roleData);
//       return response;
//     } catch (err) {
//       console.error("Error updating role:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { updateRole, loading };
// }

import { useState } from "react";
import { roleService } from "@/services/roleServices";
import { UpdateRoleDtoFrontend } from "@/types/role";

export function useUpdateRole() {
  const [loading, setLoading] = useState(false);

  const updateRole = async (roleData: UpdateRoleDtoFrontend) => {
    setLoading(true);
    try {
      const response = await roleService.updateRole(roleData);
      return response;
    } catch (err) {
      console.error("Error updating role:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateRole, loading };
}