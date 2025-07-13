// "use client";

// import React, { ReactNode, Suspense, useState } from "react";
// import { Sidebar } from "../sidebar/sidebar";
// import DataLoader from "../loader/dataLoader";
// import { Button } from "../ui/button";
// import { PanelLeftClose, PanelRightClose } from "lucide-react";
// import { withRoleProtection } from "../roles/withRoleProtection";
// import { ScrollToTop } from "./scrollToTop";
// import { Footer } from "./footer";

// interface MainLayoutProps {
//   children: ReactNode;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <div className="flex min-h-screen relative">
//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 z-40 h-full w-[250px] bg-gray-300 dark:bg-gray-900 border-r transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <Sidebar />
//       </div>
//       {/* Toggle button */}
//       <Button
//         variant="ghost"
//         size="icon"
//         onClick={toggleSidebar}
//         className={`fixed top-4 z-50 transition-all duration-300 ease-in-out ${
//           sidebarOpen ? "left-[260px]" : "left-2"
//         } bg-muted/60 backdrop-blur-sm shadow-md rounded-full`}
//       >
//         {sidebarOpen ? (
//           <PanelLeftClose
//             className="text-gray-600 dark:text-gray-300"
//             size={20}
//           />
//         ) : (
//           <PanelRightClose
//             className="text-gray-600 dark:text-gray-300"
//             size={20}
//           />
//         )}
//       </Button>
//       {/* Main content */}
//       <main
//         className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
//           sidebarOpen ? "ml-[250px]" : "ml-0"
//         } bg-white dark:bg-black`}
//       >
//         <Suspense fallback={<DataLoader />}></Suspense>
//         {children}

//         <ScrollToTop />
//         {/* <Footer /> */}
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

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col min-h-screen">
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
          sidebarOpen ? "left-[260px]" : "left-2"
        } bg-muted/60 backdrop-blur-sm shadow-md rounded-full`}
      >
        {sidebarOpen ? (
          <PanelLeftClose
            className="text-gray-600 dark:text-gray-300"
            size={20}
          />
        ) : (
          <PanelRightClose
            className="text-gray-600 dark:text-gray-300"
            size={20}
          />
        )}
      </Button>
      {/* Main content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-[250px]" : "ml-0"
        } bg-white dark:bg-black`}
      >
        <Suspense fallback={<DataLoader />}>
          <div className="flex-1 overflow-y-auto">{children}</div>
          <ScrollToTop />
        </Suspense>
        <Footer />
      </main>
    </div>
  );
};

export default withRoleProtection(MainLayout);
