"use client";
import { HoverEffect } from "../ui/card-hover-effect";

export function Admin_Settings() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "User Creation",
    link: "/admin-settings/user-creation",
  },
  {
    title: "User Update",
    link: "/admin-settings/user-update",
  },
  {
    title: "Role Creation",
    link: "/admin-settings/role-creation",
  },
  {
    title: "Role Update",
    link: "/admin-settings/role-update",
  },
  {
    title: "Dynamic Columns",
    link: "/admin-settings/dynamic-column",
  },
  {
    title: "Dynamic View",
    link: "/admin-settings/dynamic-view",
  },
];
