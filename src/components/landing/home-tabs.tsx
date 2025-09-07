// "use client";

// import React from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import VmChartsWrapper from "@/components/charts/userVmChartsWrapper";

// const tabItems = [
//   { name: "Server", component: <VmChartsWrapper /> },
//   { name: "Network", component: <VmChartsWrapper /> },
//   { name: "Storage", component: <VmChartsWrapper /> },
//   { name: "Switch", component: <VmChartsWrapper /> },
// ];

// const HomeTabs: React.FC = () => {
//   return (
//     <Tabs defaultValue={tabItems[0].name} className="w-full">
//       {/* Center the TabsList */}
//       <div className="flex justify-center mt-8">
//         <div className="flex justify-center mt-8 px-2">
//           <TabsList className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 overflow-x-auto">
//             {tabItems.map((tab) => (
//               <TabsTrigger key={tab.name} value={tab.name}>
//                 {tab.name}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>
//       </div>

//       {/* Tab content */}
//       {tabItems.map((tab) => (
//         <TabsContent key={tab.name} value={tab.name} className="mt-4 mx-10 rounded-lg bg-gray-100/40 dark:bg-gray-800/60">
//           {tab.component}
//         </TabsContent>
//       ))}
//     </Tabs>
//   );
// };

// export default HomeTabs;

// // components/landing/home-tabs.tsx
// "use client";

// import React from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import ServerDashboard from "@/components/dashboard/vm/serverDashboard";
// import VmChartsWrapper from "@/components/charts/userVmChartsWrapper"; // placeholder for other tabs

// const tabItems = [
//   { name: "Server", component: <ServerDashboard /> },
//   { name: "Network", component: <VmChartsWrapper /> },
//   { name: "Storage", component: <VmChartsWrapper /> },
//   { name: "Switch", component: <VmChartsWrapper /> },
// ];

// const HomeTabs: React.FC = () => {
//   return (
//     <Tabs defaultValue={tabItems[0].name} className="w-full">
//       <div className="flex justify-center mt-8">
//         <div className="flex justify-center mt-8 px-2">
//           <TabsList className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 overflow-x-auto">
//             {tabItems.map((tab) => (
//               <TabsTrigger key={tab.name} value={tab.name}>
//                 {tab.name}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>
//       </div>

//       {tabItems.map((tab) => (
//         <TabsContent
//           key={tab.name}
//           value={tab.name}
//           className="mt-4 mx-10 rounded-lg bg-gray-100/40 dark:bg-gray-800/60"
//         >
//           {tab.component}
//         </TabsContent>
//       ))}
//     </Tabs>
//   );
// };

// export default HomeTabs;

// src/components/landing/HomeTabs.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useVisibleTabs } from "@/hooks/useVisibleTabs";
import { TAB_COMPONENTS } from "@/components/dashboard/tabRegistry";
import Cookies from "js-cookie";

const keyForLast = () => {
  const role = (Cookies.get("USRROLE") || "default").toLowerCase();
  return `ui:last_tab:${role}`;
};

export default function HomeTabs() {
  const { tabs, loading, error } = useVisibleTabs();

  // default active = first visible tab OR last remembered (if still visible)
  const firstKey = useMemo(() => tabs[0]?.key ?? "dashboard", [tabs]);
  const [active, setActive] = useState<string>(firstKey);

  useEffect(() => {
    // when tabs load/role changes, restore last if valid
    const last =
      typeof window !== "undefined" ? localStorage.getItem(keyForLast()) : null;
    const candidate =
      last && tabs.some((t) => t.key === last) ? last : firstKey;
    setActive(candidate);
  }, [firstKey, tabs]);

  const onValueChange = (val: string) => {
    setActive(val);
    try {
      localStorage.setItem(keyForLast(), val);
    } catch {}
  };

  if (loading) {
    return (
      <div className="w-full p-8">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-muted" />
          <div className="h-44 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="mx-auto max-w-2xl rounded border bg-red-50 dark:bg-red-900/20 p-6">
          <div className="text-sm font-semibold text-red-600 dark:text-red-400">
            Failed to load tabs
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {String(error)}
          </div>
        </div>
      </div>
    );
  }

  // Safety: if backend returns unknown keys, we still show a placeholder
  const resolved = tabs.map((t) => ({
    ...t,
    node: TAB_COMPONENTS[t.key] ?? (
      <div className="rounded-2xl border bg-white dark:bg-zinc-950 p-8">
        <div className="text-sm font-semibold">{t.label}</div>
        <div className="text-xs text-muted-foreground mt-1">
          No component mapped for <code>{t.key}</code> yet.
        </div>
      </div>
    ),
  }));

  return (
    <Tabs value={active} onValueChange={onValueChange} className="w-full">
      {/* Centered tabs list */}
      <div className="flex justify-center mt-8">
        <div className="flex justify-center mt-8 px-2">
          <TabsList className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 overflow-x-auto">
            {resolved.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      {/* Content panes */}
      {resolved.map((tab) => (
        <TabsContent
          key={tab.key}
          value={tab.key}
          className="mt-4 mx-4 md:mx-10 rounded-lg bg-gray-100 dark:bg-gray-800/60 p-3 md:p-6"
        >
          {tab.node}
        </TabsContent>
      ))}
    </Tabs>
  );
}
