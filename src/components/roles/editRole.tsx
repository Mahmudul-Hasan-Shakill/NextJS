"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useRoleNames } from "@/hooks/useRoleNames";
import { useGuiByRoleName } from "@/hooks/useGuiByRoleName";
import { useUpdateRole } from "@/hooks/useUpdateRole";
import SubmitButton from "../ui/submitButton";
import { toast } from "sonner";

interface HrefGui {
  hrefGui: string;
  isActive: boolean;
}

const EditRole: React.FC = () => {
  const { roleNames } = useRoleNames();
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [hrefGuis, setHrefGuis] = useState<HrefGui[]>([]);
  const { updateRole, loading } = useUpdateRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = useUserDetails();

  const guiData = useGuiByRoleName(selectedRoleName);

  useEffect(() => {
    if (selectedRoleName && Array.isArray(guiData)) {
      setHrefGuis(guiData);
    }
  }, [selectedRoleName, guiData]);

  const handleRoleNameChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoleName(e.target.value);
  };

  const handleCheckboxChange = (href: string) => {
    setHrefGuis((prev) =>
      prev.map((item) =>
        item.hrefGui === href ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedRoleName) {
      toast.warning("Please select a role name.");
      return;
    }

    const editBy = userName;
    const editDate = new Date().toISOString();

    const roleData = {
      roleName: selectedRoleName,
      hrefGui: hrefGuis.map((item) => ({
        ...item,
        editBy,
        editDate,
      })),
    };

    setIsSubmitting(true);

    try {
      const result = await updateRole(roleData);
      if (result?.isSuccessful)
        setTimeout(() => {
          setIsSubmitting(false);
          toast.success(result.message);
          window.location.reload();
        }, 2000);
      else {
        toast.error(result?.message);
        setIsSubmitting(false);
      }
    } catch {
      toast.error("Unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full m-4">
      <div className="w-full mx-auto shadow-sm shadow-gray-800 dark:shadow-gray-300 bg-gray-300 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="p-8 border-2">
          {/* Role Name Dropdown */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="roleName"
              className="block text-black dark:text-white text-xs font-bold py-2"
            >
              Select Role Name
            </label>
            <select
              id="roleName"
              value={selectedRoleName}
              onChange={handleRoleNameChange}
              className="block w-full text-sm px-4 py-2 text-black dark:text-white bg-white dark:bg-black border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option
                className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                value=""
                disabled
              >
                Select role...
              </option>
              {roleNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* GUI Path Checkboxes */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {hrefGuis.map((href) => (
              <div key={href.hrefGui} className="flex items-center">
                <input
                  type="checkbox"
                  id={href.hrefGui}
                  checked={href.isActive}
                  onChange={() => handleCheckboxChange(href.hrefGui)}
                  className="mr-2"
                />
                <label htmlFor={href.hrefGui} className="text-sm">
                  {href.hrefGui}
                </label>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <SubmitButton isSubmitting={isSubmitting} label="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRole;
