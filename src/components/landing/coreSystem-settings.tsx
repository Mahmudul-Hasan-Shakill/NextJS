"use client";
import { HoverEffect } from "../ui/card-hover-effect";

export function CoreSystem_Settings() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Virtual Machine Creation",
    link: "/core-systems/vm-creation",
  },
  {
    title: "Virtual Machine Update",
    link: "/core-systems/vm-update",
  },
  {
    title: "Physical Server Creation",
    link: "/core-systems/physical-server-creation",
  },
  {
    title: "Physical Server Update",
    link: "/core-systems/physical-server-update",
  },
];
