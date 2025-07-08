"use client";
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import dynamic from "next/dynamic";

const UserRoleChartsWrapper = dynamic(
  () => import("@/components/charts/userRoleChartsWrapper"),
  {
    ssr: false,
  }
);

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <UserRoleChartsWrapper />
    </BackgroundLines>
  );
}
