"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateUserByPin } from "@/hooks/useUpdateUserByPin";
import { toast } from "sonner";
import { Select } from "@/components/ui/selects";

export default function UserEdit({
  user,
  open,
  onClose,
  onSuccess,
}: {
  user: any;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { updateUser, loading } = useUpdateUserByPin();

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    unit: user.unit || "",
    department: user.department || "",
    division: user.division || "",
    dob: user.dob ? user.dob.split("T")[0] : "", // Format to YYYY-MM-DD
    marital: user.marital || "",
    nid: user.nid || "",
    phone: user.phone || "",
    address: user.address || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    return newErrors;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors.");
      return;
    }

    const success = await updateUser(user.pin, formData);
    if (success) {
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-screen overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-6">
          <Field
            label="Name"
            value={formData.name}
            onChange={(val) => handleChange("name", val)}
            error={errors.name}
          />
          <Field
            label="Email"
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            error={errors.email}
          />
          <Field
            label="Unit"
            value={formData.unit}
            onChange={(val) => handleChange("unit", val)}
          />
          <Field
            label="Department"
            value={formData.department}
            onChange={(val) => handleChange("department", val)}
          />
          <Field
            label="Division"
            value={formData.division}
            onChange={(val) => handleChange("division", val)}
          />
          <Field
            label="Date of Birth"
            value={formData.dob}
            onChange={(val) => handleChange("dob", val)}
            type="date"
          />
          <DropdownField
            label="Marital Status"
            value={formData.marital}
            onChange={(val) => handleChange("marital", val)}
            options={["Single", "Married"]}
          />
          <Field
            label="NID"
            value={formData.nid}
            onChange={(val) => handleChange("nid", val)}
          />
          <Field
            label="Phone"
            value={formData.phone}
            onChange={(val) => handleChange("phone", val)}
          />
          <Field
            label="Address"
            value={formData.address}
            onChange={(val) => handleChange("address", val)}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <Input
        className="text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function DropdownField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label className="mb-1 block text-xs">{label}</Label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)} // extract value from simulated event
        options={options.map((opt) => ({
          value: opt,
          label: opt,
        }))}
        placeholder="Select"
        className="w-full text-xs"
      />
    </div>
  );
}
