"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import LoaderSkeleton from "../loader/skeleton";
import { useGuiNames } from "@/hooks/useGuiNames";
import { useCreateRoles } from "@/hooks/useCreateRoles";
import { useRolesData } from "@/hooks/useRolesData";
import { useUserDetails } from "@/hooks/useUserDetails";
import { toast } from "sonner";
import SubmitButton from "../ui/submitButton";

interface InsertRoleProps {
  setRoles: React.Dispatch<React.SetStateAction<any[]>>;
}

const InsertRole: React.FC<InsertRoleProps> = ({ setRoles }) => {
  const [roleName, setRoleName] = useState("");
  const [selectedHrefGuis, setSelectedHrefGuis] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userName = useUserDetails();
  const hrefOptions = useGuiNames();
  const rolesData = useRolesData();
  const { createRoles, loading } = useCreateRoles();

  if (loading || !hrefOptions.length) return <LoaderSkeleton />;

  const handleHrefGuiChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSelectedHrefGuis((prev) =>
      checked ? [...prev, value] : prev.filter((gui) => gui !== value)
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!roleName) {
      toast.warning("Please enter a role name.");
      return;
    }

    if (selectedHrefGuis.length === 0) {
      toast.warning("Please select at least one GUI path.");
      return;
    }

    const makeBy = userName;

    const roleData = selectedHrefGuis.map((hrefGui) => ({
      roleName,
      hrefGui,
      isActive,
      makeBy,
      makeDate: new Date().toISOString().split("T")[0],
    }));

    setIsSubmitting(true);

    try {
      const response = await createRoles(roleData);

      if (response?.isSuccessful) {
        setTimeout(() => {
          setIsSubmitting(false);
          toast.success(response.message);
          setRoleName("");
          setSelectedHrefGuis([]);
          setIsActive(true);
          setRoles(rolesData);
        }, 2000);
      } else {
        toast.error(response?.message);
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
          {/* Role Name */}
          <div className="flex flex-col mb-4">
            <label
              htmlFor="roleName"
              className="block text-black dark:text-white text-xs font-bold py-2"
            >
              Role Name
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name..."
              className="block w-full text-sm px-4 py-2 text-black dark:text-white bg-white dark:bg-black border rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
          </div>

          {/* GUI Paths */}
          <div className="mb-4">
            <label
              htmlFor="hrefGui"
              className="block text-black dark:text-white text-xs font-bold py-2"
            >
              GUI Path
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hrefOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option}
                    value={option}
                    checked={selectedHrefGuis.includes(option)}
                    onChange={handleHrefGuiChange}
                    className="mr-2"
                  />
                  <label htmlFor={option} className="text-sm">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <SubmitButton isSubmitting={isSubmitting} label="Submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertRole;
