// "use client";

// import React, { ReactNode, Suspense } from "react";
// import { Sidebar } from "../sidebar/sidebar";
// import DataLoader from "../loader/dataLoader";

// interface MainLayoutProps {
//   children: ReactNode;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   return (
//     <>
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main content */}
//         <main className="flex-1 ml-[250px] bg-white dark:bg-black min-h-screen h-auto overflow-y-auto">
//           <Suspense fallback={<DataLoader />}></Suspense>
//           {children}
//         </main>
//       </div>
//     </>
//   );
// };

// export default MainLayout;

"use client";

import React, { ReactNode, Suspense, useState } from "react";
import { Sidebar } from "../sidebar/sidebar";
import DataLoader from "../loader/dataLoader";
import { Button } from "../ui/button";
import { MenuIcon, X } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-[250px] bg-gray-300 dark:bg-gray-900 border-r transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "left-[260px]" : "left-4"
        } bg-muted/60 backdrop-blur-sm shadow-md rounded-full`}
      >
        {sidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </Button>

      {/* Main content */}
      <main
        className={`flex-1 min-h-screen h-auto overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-[250px]" : "ml-0"
        } bg-white dark:bg-black`}
      >
        <Suspense fallback={<DataLoader />}></Suspense>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
