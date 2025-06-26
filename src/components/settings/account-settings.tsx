"use client";
import { HoverEffect } from "../ui/card-hover-effect";

export function AccountSettings() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "User Creation",
    link: "/account-settings/user-creation",
  },
  {
    title: "User Update",
    link: "/account-settings/user-update",
  },
  {
    title: "Role Creation",
    link: "/account-settings/role-creation",
  },
  {
    title: "Role Update",
    link: "/account-settings/role-update",
  },
];
