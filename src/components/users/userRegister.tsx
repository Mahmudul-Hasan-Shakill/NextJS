"use client";

import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import DataLoader from "../loader/dataLoader";
import { RegisterData } from "@/types/user";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useRoleNames } from "@/hooks/useRoleNames";
import { Select } from "../ui/selects";

export function UserRegister() {
  const { register, loading } = useRegister();
  const [pin, setPin] = useState("");
  const userName = useUserDetails();
  const { roleNames } = useRoleNames();

  const [formData, setFormData] = useState<RegisterData>({
    pin: "",
    name: "",
    email: "",
    unit: "",
    division: "",
    department: "",
    makeBy: "",
    userRole: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPin = e.target.value;
    if (/^\d{0,5}$/.test(newPin)) {
      setPin(newPin);
      setFormData((prev) => ({ ...prev, pin: newPin })); // Update formData with the new PIN
    } else {
      toast.error("PIN must be numeric and up to 5 digits only.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...formData,
      makeBy: userName,
    };

    await register(payload);

    setFormData({
      pin: "",
      name: "",
      email: "",
      unit: "",
      division: "",
      department: "",
      makeBy: "",
      userRole: "",
    });
    setPin("");
  };

  if (loading) return <DataLoader />;

  return (
    <div className="shadow-none mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl text-center font-bold text-black dark:text-white">
        Register User
      </h2>
      <form className="text-xs my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="pin">
              PIN <span className="text-red-500">*</span>
            </Label>
            <Input
              className="text-xs"
              id="pin"
              placeholder="Enter PIN"
              type="text"
              value={pin}
              onChange={handlePinChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              className="text-xs"
              id="name"
              placeholder="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              className="text-xs"
              id="email"
              placeholder="example@domain.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="unit">
              Unit <span className="text-red-500">*</span>
            </Label>
            <Input
              className="text-xs"
              id="unit"
              placeholder="Unit"
              type="text"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="division">
              Division <span className="text-red-500">*</span>
            </Label>
            <Input
              className="text-xs"
              id="division"
              placeholder="Division"
              type="text"
              value={formData.division}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="department">
              Department <span className="text-red-500">*</span>
            </Label>
            <Input
              className="text-xs"
              id="department"
              placeholder="Department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </LabelInputContainer>
        </div>

        <div className="mb-4">
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="userRole">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              id="userRole"
              value={formData.userRole}
              onChange={handleChange}
              required
              className="text-xs"
            >
              <option value="">Select Role</option>
              {roleNames?.map((role: string) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </LabelInputContainer>
        </div>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Submit &rarr;
          <BottomGradient />
        </button>
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2 text-xs", className)}>
      {children}
    </div>
  );
};
