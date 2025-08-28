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
  {
    title: "Application Server Creation",
    link: "/core-systems/application-server-creation",
  },
  {
    title: "Application Server Update",
    link: "/core-systems/application-server-update",
  },
  {
    title: "AMC Creation",
    link: "/core-systems/amc-creation",
  },
  {
    title: "AMC Update",
    link: "/core-systems/amc-update",
  },
  {
    title: "Database Server Creation",
    link: "/core-systems/database-server-creation",
  },
  {
    title: "Database Server Update",
    link: "/core-systems/database-server-update",
  },
  {
    title: "Automatic Server Creation",
    link: "/core-systems/automatic-server-creation",
  },
  {
    title: "Automatic Server Update",
    link: "/core-systems/automatic-server-update",
  },
  {
    title: "Cluster Creation",
    link: "/core-systems/cluster-creation",
  },
  {
    title: "Cluster Update",
    link: "/core-systems/cluster-update",
  },
  {
    title: "Physical Host Creation",
    link: "/core-systems/physical-host-creation",
  },
  {
    title: "Physical Host Update",
    link: "/core-systems/physical-host-update",
  },
  {
    title: "Filesystem Creation",
    link: "/core-systems/filesystem-creation",
  },
  {
    title: "Filesystem Update",
    link: "/core-systems/filesystem-update",
  },
];
