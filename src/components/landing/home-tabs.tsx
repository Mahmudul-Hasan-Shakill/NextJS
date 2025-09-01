"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VmChartsWrapper from "@/components/charts/userVmChartsWrapper";

const tabItems = [
  { name: "Server", component: <VmChartsWrapper /> },
  { name: "Network", component: <VmChartsWrapper /> },
  { name: "Storage", component: <VmChartsWrapper /> },
  { name: "Switch", component: <VmChartsWrapper /> },
];

const HomeTabs: React.FC = () => {
  return (
    <Tabs defaultValue={tabItems[0].name} className="w-full">
      {/* Center the TabsList */}
      <div className="flex justify-center mt-8">
        <div className="flex justify-center mt-8 px-2">
          <TabsList className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 overflow-x-auto">
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.name} value={tab.name}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      {/* Tab content */}
      {tabItems.map((tab) => (
        <TabsContent key={tab.name} value={tab.name} className="mt-4 mx-10 rounded-lg bg-gray-100/40 dark:bg-gray-800/60">
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default HomeTabs;

