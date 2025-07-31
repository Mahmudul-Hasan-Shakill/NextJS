// "use client";

// import React, { ReactNode, Suspense, useState } from "react";
// import { Sidebar } from "../sidebar/sidebar";
// import DataLoader from "../loader/dataLoader";
// import { Button } from "../ui/button";
// import { PanelLeftClose, PanelRightClose } from "lucide-react";
// import { withRoleProtection } from "../roles/withRoleProtection";
// import { ScrollToTop } from "./scrollToTop";
// import { Footer } from "./footer";
// import { ScrollProgressBar } from "./progressBar";

// interface MainLayoutProps {
//   children: ReactNode;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <ScrollProgressBar />
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 z-40 h-full w-[250px] bg-gray-300 dark:bg-gray-900 border-r transition-transform transform-gpu will-change-transform duration-300 ease-in-out ${
//           sidebarOpen
//             ? "translate-x-0 animate-in slide-in-from-left"
//             : "-translate-x-full"
//         }`}
//       >
//         <Sidebar />
//       </div>

//       {/* Toggle button */}
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={toggleSidebar}
//         className={`fixed top-4 z-50 transition-transform transform-gpu will-change-transform duration-300 ease-in-out translate-x-0 ${
//           sidebarOpen ? "translate-x-[260px]" : "translate-x-5"
//         } bg-muted/60 backdrop-blur-sm shadow-md rounded-full`}
//       >
//         {sidebarOpen ? (
//           <PanelLeftClose
//             className="text-gray-600 dark:text-gray-300 transition-opacity duration-200 ease-in-out opacity-100"
//             size={20}
//           />
//         ) : (
//           <PanelRightClose
//             className="text-gray-600 dark:text-gray-300 transition-opacity duration-200 ease-in-out opacity-100"
//             size={20}
//           />
//         )}
//       </Button>

//       {/* Main content */}
//       <main
//         className={`flex-1 flex flex-col transition-all transform-gpu duration-300 ease-in-out ${
//           sidebarOpen ? "ml-[250px]" : "ml-0"
//         } bg-white dark:bg-black`}
//       >
//         <Suspense fallback={<DataLoader />}>
//           <div className="flex-1 overflow-y-auto">{children}</div>
//           <ScrollToTop />
//         </Suspense>
//         <Footer />
//       </main>
//     </div>
//   );
// };

// export default withRoleProtection(MainLayout);

"use client";

import React, { ReactNode, Suspense, useState } from "react";
import { Sidebar } from "../sidebar/sidebar";
import DataLoader from "../loader/dataLoader";
import { Button } from "../ui/button";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { withRoleProtection } from "../roles/withRoleProtection";
import { ScrollToTop } from "./scrollToTop";
import { Footer } from "./footer";
import { ScrollProgressBar } from "./progressBar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <ScrollProgressBar />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-[250px] bg-gray-300 dark:bg-gray-900 border-r transition-transform transform-gpu will-change-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0 animate-in slide-in-from-left"
            : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 transition-transform transform-gpu will-change-transform duration-300 ease-in-out translate-x-0 ${
          sidebarOpen ? "translate-x-[260px]" : "translate-x-5"
        } bg-muted/60 backdrop-blur-sm shadow-md rounded-full`}
      >
        {sidebarOpen ? (
          <PanelLeftClose
            className="text-gray-600 dark:text-gray-300 transition-opacity duration-200 ease-in-out opacity-100"
            size={20}
          />
        ) : (
          <PanelRightClose
            className="text-gray-600 dark:text-gray-300 transition-opacity duration-200 ease-in-out opacity-100"
            size={20}
          />
        )}
      </Button>

      {/* Main content */}
      <main
        className={`flex-1 flex flex-col bg-white dark:bg-black transition-all transform-gpu duration-300 ease-in-out ${
          sidebarOpen ? "ml-[250px]" : "ml-0"
        }`}
      >
        <Suspense fallback={<DataLoader />}>
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            {children}
            <ScrollToTop />
          </div>
        </Suspense>

        {/* Footer stays at bottom */}
        <Footer />
      </main>
    </div>
  );
};

export default withRoleProtection(MainLayout);
