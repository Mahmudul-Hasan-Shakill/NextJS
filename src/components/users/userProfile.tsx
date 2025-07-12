"use client";

import { useUserByPin } from "@/hooks/useUserByPin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import UserEdit from "./userEdit";

export default function UserProfile() {
  const user = useUserByPin();
  const [editOpen, setEditOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col gap-4 p-10 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-1/3" />
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <CardContent className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-primary">
                My Profile
              </h1>
              <p className="text-muted-foreground text-sm">
                Personal information associated with your account
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfileField label="PIN" value={user.pin} />
              <ProfileField label="Name" value={user.name} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Unit" value={user.unit ?? "—"} />
              <ProfileField label="Department" value={user.department ?? "—"} />
              <ProfileField label="Division" value={user.division ?? "—"} />
              <ProfileField
                label="Date of Birth"
                value={formatDate(user.dob)}
              />
              <ProfileField
                label="Marital Status"
                value={user.marital ?? "—"}
              />
              <ProfileField label="NID" value={user.nid ?? "—"} />
              <ProfileField label="Phone" value={user.phone ?? "—"} />
              <ProfileField label="Address" value={user.address ?? "—"} />
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={() => setEditOpen(true)}>Edit</Button>

              {editOpen && (
                <UserEdit
                  user={user}
                  open={editOpen}
                  onClose={() => setEditOpen(false)}
                  onSuccess={() => window.location.reload()}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="break-words">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xs font-medium text-foreground break-words whitespace-pre-wrap">
        {value}
      </p>
    </div>
  );
}

function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // fallback if invalid
  return date.toISOString().split("T")[0]; // format as YYYY-MM-DD
}
