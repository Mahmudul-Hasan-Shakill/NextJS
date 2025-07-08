"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useGuiNames } from "@/hooks/useGuiNames";
import { useCreateRoles } from "@/hooks/useCreateRoles";
import { useRolesData } from "@/hooks/useRolesData";
import { useUserDetails } from "@/hooks/useUserDetails";

// Types
interface Role {
  roleName: string;
  hrefGui: string;
  isActive: boolean;
  makeBy: string;
  makeDate: string;
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

const InsertRole: React.FC = () => {
  const [roleName, setRoleName] = useState("");
  const [selectedHrefGuis, setSelectedHrefGuis] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const userName = useUserDetails();
  const hrefOptions = useGuiNames();
  const { rolesData } = useRolesData();
  const { createRoles, loading } = useCreateRoles();

  useEffect(() => {
    setRoles(rolesData);
  }, [rolesData]);

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

    const makeDate = new Date().toISOString().split("T")[0];
    const newRoles: Role[] = selectedHrefGuis.map((hrefGui) => ({
      roleName,
      hrefGui,
      isActive,
      makeBy: userName,
      makeDate,
    }));

    setIsSubmitting(true);

    const response = await createRoles(newRoles);

    if (response?.isSuccessful) {
      toast.success(response.message);
      setRoleName("");
      setSelectedHrefGuis([]);
      setIsActive(true);
      setRoles((prev) => [...prev, ...newRoles]);
    } else {
      toast.error(response?.message || "Failed to create roles.");
    }

    setIsSubmitting(false);
  };

  if (loading || !hrefOptions.length) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Create New Role</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Name */}
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name..."
                required
              />
            </div>

            {/* GUI Paths */}
            <div className="space-y-2">
              <Label>GUI Paths</Label>
              <Separator />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {hrefOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      value={option}
                      checked={selectedHrefGuis.includes(option)}
                      onCheckedChange={(checked) =>
                        handleHrefGuiChange({
                          target: {
                            value: option,
                            checked: checked as boolean,
                          },
                        } as ChangeEvent<HTMLInputElement>)
                      }
                    />
                    {/* <Label htmlFor={option}>{option}</Label> */}
                    <Label className="text-xs" htmlFor={option}>
                      {formatGuiLabel(option)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Role List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Existing Roles</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.length === 0 ? (
            <p className="text-muted-foreground">No roles available.</p>
          ) : (
            roles.map((role, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{role.roleName}</span>
                  <Badge variant={role.isActive ? "default" : "secondary"}>
                    {role.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  GUI: {role.hrefGui}
                </div>
                <Separator />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsertRole;
