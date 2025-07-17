"use client";

import React, { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRegister } from "@/hooks/auth/useRegister";
import DataLoader from "../loader/dataLoader";
import { RegisterData } from "@/types/register";
import { toast } from "sonner";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import { useRoleNames } from "@/hooks/role/useRoleNames";
import { Select } from "../ui/selects";
import MailLoader from "../loader/mailLoader";
import { divisionsData } from "@/types/data";
import UniversalButton from "../ui/universalButton";
import { Button } from "../ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

export function UserRegister() {
  const { register, loading } = useRegister();
  const [pin, setPin] = useState("");
  const userName = useUserDetails();
  const { roleNames } = useRoleNames();
  const [showAnimation, setShowAnimation] = useState(false);
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
      setFormData((prev) => ({ ...prev, pin: newPin }));
    } else {
      toast.error("PIN must be numeric and up to 5 digits only.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShowAnimation(true);

    const payload = {
      ...formData,
      makeBy: userName,
    };

    setTimeout(async () => {
      try {
        const success = await register(payload);
        if (success) {
        } else {
        }

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
      } catch (error) {
        toast.error("Registration failed.");
        console.error(error);
      } finally {
        setShowAnimation(false);
      }
    }, 5000);
  };

  if (loading) return <DataLoader />;

  return (
    <div className="mx-auto w-full max-w-5xl bg-white p-6 rounded-lg shadow-md dark:bg-black">
      <h2 className="text-xl font-bold text-center mb-6 text-black dark:text-white">
        Register User
      </h2>
      <div className="flex justify-end mb-4">
        <Link href="/admin-settings/user-update">
          <Button variant="default" size="sm" className="text-xs">
            <ScanSearch className="h-4 w-4 mr-2" /> View Users
          </Button>
        </Link>
      </div>
      {showAnimation && <MailLoader />}
      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

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

        {/* Email and Division */}
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

        {/* Department and Unit */}
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
            <Label className="text-xs" htmlFor="userRole">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              className="text-[10px]"
              options={roleNames.map((role) => ({ value: role, label: role }))}
              placeholder="-- Select an option --"
            />
          </LabelInputContainer>
        </div>

        <UniversalButton type="submit">Submit &rarr;</UniversalButton>
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </div>
  );
}

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
