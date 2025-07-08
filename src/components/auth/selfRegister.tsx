"use client";

import React, { ChangeEvent, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSelfRegister } from "@/hooks/useSelfRegister";
import DataLoader from "../loader/dataLoader";
import { SelfRegisterData } from "@/types/register";
import { toast } from "sonner";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { divisionsData } from "@/types/data";
import { Select } from "../ui/selects";

export function SelfRegister() {
  const { register, loading } = useSelfRegister();
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SelfRegisterData>({
    pin: "",
    name: "",
    email: "",
    unit: "",
    division: "",
    department: "",
    password: "",
    makeBy: "",
    userRole: "",
  });
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
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

  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(
    null
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);

  const filteredDepartments = selectedDivisionId
    ? divisionsData.find((div) => div.id === selectedDivisionId)?.departments ||
      []
    : [];

  const filteredUnits = selectedDepartmentId
    ? filteredDepartments.find((dep) => dep.id === selectedDepartmentId)
        ?.units || []
    : [];

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      makeBy: prev.name,
      userRole: "user",
    }));
  }, [formData.name]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password
    if (!validatePassword(formData.password)) {
      toast.warning(
        <>
          Password must contain at least 6 characters,
          <br />
          Including upper and lower case letters,
          <br />
          At least one number and
          <br />
          At least one special character.
        </>
      );
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      toast.warning("Email must be a valid email address.");
      return;
    }

    try {
      await register(formData);
      setFormData({
        pin: "",
        name: "",
        email: "",
        unit: "",
        division: "",
        department: "",
        password: "",
        makeBy: "",
        userRole: "",
      });
      setPin("");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error("Internal server error. Please try again later.");
    }
  };

  if (loading) return <DataLoader />;

  return (
    <div className="shadow-none mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-black dark:text-white">Register</h2>
      <p className="mt-2 max-w-sm text-xs text-neutral-600 dark:text-neutral-300">
        Register to Inventory Management System
      </p>
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
            <Label className="text-xs" htmlFor="division">
              Division <span className="text-red-500">*</span>
            </Label>
            <Select
              name="division"
              value={formData.division}
              onChange={(e) => {
                const divisionId = parseInt(e.target.value);
                const selectedDivision = divisionsData.find(
                  (div) => div.id === divisionId
                );
                if (selectedDivision) {
                  setSelectedDivisionId(divisionId);
                  setSelectedDepartmentId(null);
                  setFormData((prev) => ({
                    ...prev,
                    division: divisionId.toString(), // store ID
                    department: "",
                    unit: "",
                  }));
                }
              }}
              options={divisionsData.map((div) => ({
                value: div.id.toString(),
                label: div.name,
              }))}
              placeholder="-- Select Division --"
              className="text-[10px]"
            />
          </LabelInputContainer>
        </div>

        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label className="text-xs" htmlFor="department">
              Department <span className="text-red-500">*</span>
            </Label>
            <Select
              name="department"
              value={formData.department}
              onChange={(e) => {
                const departmentId = parseInt(e.target.value);
                const selectedDepartment = filteredDepartments.find(
                  (dep) => dep.id === departmentId
                );
                if (selectedDepartment) {
                  setSelectedDepartmentId(departmentId);
                  setFormData((prev) => ({
                    ...prev,
                    department: departmentId.toString(), // store ID
                    unit: "",
                  }));
                }
              }}
              options={filteredDepartments.map((dep) => ({
                value: dep.id.toString(),
                label: dep.name,
              }))}
              placeholder="-- Select Department --"
              className="text-[10px]"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label className="text-xs" htmlFor="unit">
              Unit <span className="text-red-500">*</span>
            </Label>
            <Select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              options={filteredUnits.map((unit) => ({
                value: unit.name,
                label: unit.name,
              }))}
              placeholder="-- Select Unit --"
              className="text-[10px]"
            />
          </LabelInputContainer>
        </div>

        <div className="mb-4">
          <LabelInputContainer>
            <Label htmlFor="password" className="text-xs">
              Password
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="text-xs"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-2 text-black dark:text-white"
              >
                {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
              </button>
            </div>
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
