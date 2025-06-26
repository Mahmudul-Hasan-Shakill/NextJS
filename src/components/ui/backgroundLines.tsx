import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export function BackgroundLinesDemo() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-2xl lg:text-2xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Inventory Management System
      </h2>
    </BackgroundLines>
  );
}
