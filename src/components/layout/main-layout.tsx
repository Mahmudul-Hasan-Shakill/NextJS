"use client";

import React, { ReactNode, Suspense } from "react";
import { Sidebar } from "../sidebar/sidebar";
import DataLoader from "../loader/dataLoader";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 ml-[250px] bg-white dark:bg-black min-h-screen h-auto overflow-y-auto">
          <Suspense fallback={<DataLoader />}></Suspense>
          {children}
        </main>
      </div>
    </>
  );
};

export default MainLayout;
