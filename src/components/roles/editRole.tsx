// "use client";

// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { useUserDetails } from "@/hooks/useUserDetails";
// import { useRoleNames } from "@/hooks/useRoleNames";
// import { useGuiByRoleName } from "@/hooks/useGuiByRoleName";
// import { useUpdateRole } from "@/hooks/useUpdateRole";
// import SubmitButton from "../ui/submitButton";
// import { toast } from "sonner";

// interface HrefGui {
//   hrefGui: string;
//   isActive: boolean;
// }

// const EditRole: React.FC = () => {
//   const { roleNames } = useRoleNames();
//   const [selectedRoleName, setSelectedRoleName] = useState("");
//   const [hrefGuis, setHrefGuis] = useState<HrefGui[]>([]);
//   const { updateRole } = useUpdateRole();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const userName = useUserDetails();

//   const guiData = useGuiByRoleName(selectedRoleName);

//   useEffect(() => {
//     if (selectedRoleName && Array.isArray(guiData)) {
//       setHrefGuis(guiData);
//     }
//   }, [selectedRoleName, guiData]);

//   const handleRoleNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     setSelectedRoleName(e.target.value);
//   };

//   const handleCheckboxChange = (href: string) => {
//     setHrefGuis((prev) =>
//       prev.map((item) =>
//         item.hrefGui === href ? { ...item, isActive: !item.isActive } : item
//       )
//     );
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!selectedRoleName) {
//       toast.warning("Please select a role name.");
//       return;
//     }

//     const editBy = userName;
//     const editDate = new Date().toISOString();

//     const roleData = {
//       roleName: selectedRoleName,
//       hrefGui: hrefGuis.map((item) => ({
//         ...item,
//         editBy,
//         editDate,
//       })),
//     };

//     setIsSubmitting(true);

//     try {
//       const result = await updateRole(roleData);
//       if (result?.isSuccessful)
//         setTimeout(() => {
//           setIsSubmitting(false);
//           toast.success(result.message);
//           window.location.reload();
//         }, 2000);
//       else {
//         toast.error(result?.message);
//         setIsSubmitting(false);
//       }
//     } catch {
//       toast.error("Unexpected error occurred.");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full m-4">
//       <div className="w-full mx-auto shadow-sm shadow-gray-800 dark:shadow-gray-300 bg-gray-300 dark:bg-gray-800">
//         <form onSubmit={handleSubmit} className="p-8 border-2">
//           {/* Role Name Dropdown */}
//           <div className="flex flex-col mb-4">
//             <label
//               htmlFor="roleName"
//               className="block text-black dark:text-white text-xs font-bold py-2"
//             >
//               Select Role Name
//             </label>
//             <select
//               id="roleName"
//               value={selectedRoleName}
//               onChange={handleRoleNameChange}
//               className="block w-full text-sm px-4 py-2 text-black dark:text-white bg-white dark:bg-black border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
//             >
//               <option
//                 className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
//                 value=""
//                 disabled
//               >
//                 Select role...
//               </option>
//               {roleNames.map((name) => (
//                 <option key={name} value={name}>
//                   {name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* GUI Path Checkboxes */}
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {hrefGuis.map((href) => (
//               <div key={href.hrefGui} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id={href.hrefGui}
//                   checked={href.isActive}
//                   onChange={() => handleCheckboxChange(href.hrefGui)}
//                   className="mr-2"
//                 />
//                 <label htmlFor={href.hrefGui} className="text-sm">
//                   {href.hrefGui}
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <SubmitButton isSubmitting={isSubmitting} label="Submit" />
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditRole;

"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useRoleNames } from "@/hooks/role/useRoleNames";
import { useGuiByRoleName } from "@/hooks/role/useGuiByRoleName";
import { useUpdateRole } from "@/hooks/role/useUpdateRole";

interface HrefGui {
  hrefGui: string;
  isActive: boolean;
}

// Utility to format GUI paths into readable labels
function formatGuiLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return "Home";

  return segments
    .map((segment) =>
      segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" → ");
}

const EditRole: React.FC = () => {
  const { roleNames } = useRoleNames();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [hrefGuis, setHrefGuis] = useState<HrefGui[]>([]);
  const { updateRole } = useUpdateRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const userName = useUserDetails();

  const guiData = useGuiByRoleName(selectedRoleName);

  useEffect(() => {
    if (selectedRoleName && Array.isArray(guiData)) {
      setHrefGuis(guiData);
    }
  }, [selectedRoleName, guiData]);

  const handleCheckboxChange = (href: string) => {
    setHrefGuis((prev) =>
      prev.map((item) =>
        item.hrefGui === href ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedRoleName) {
      toast.warning("Please select a role name.");
      return;
    }

    const editBy = userName;
    const editDate = new Date().toISOString();

    const roleData = {
      roleName: selectedRoleName,
      hrefGui: hrefGuis.map((item) => ({
        hrefGui: item.hrefGui,
        isActive: item.isActive,
        editBy,
        editDate,
      })),
    };

    setIsSubmitting(true);

    try {
      const result = await updateRole(roleData);
      if (result?.isSuccessful) {
        toast.success(result.message);
        setTimeout(() => {
          setIsSubmitting(false);
          window.location.reload();
        }, 2000);
      } else {
        toast.error(result?.message);
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Edit Role</h2>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setShowConfirm(true);
            }}
            className="space-y-6"
          >
            {/* Role Name Dropdown */}
            <div className="space-y-2">
              <Label className="py-4">Select Role Name</Label>
              <Select
                value={selectedRoleName}
                onValueChange={setSelectedRoleName}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role..." />
                </SelectTrigger>
                <SelectContent>
                  {roleNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GUI Path Checkboxes */}
            <div className="space-y-2">
              <Label>GUI Paths</Label>
              <div className="py-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {hrefGuis.map((href) => (
                  <div
                    key={href.hrefGui}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={href.hrefGui}
                      checked={href.isActive}
                      onCheckedChange={() => handleCheckboxChange(href.hrefGui)}
                    />
                    <Label className="text-xs" htmlFor={href.hrefGui}>
                      {formatGuiLabel(href.hrefGui)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the role{" "}
              <strong>{selectedRoleName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowConfirm(false);
                handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Yes, Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditRole;
