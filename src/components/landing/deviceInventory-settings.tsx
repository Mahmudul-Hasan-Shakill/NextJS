"use client";
import { HoverEffect } from "../ui/card-hover-effect";

export function DeviceInventory_Settings() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Device Creation",
    link: "/device-inventory/device-creation",
  },
  {
    title: "Device Update",
    link: "/device-inventory/device-update",
  },
];
