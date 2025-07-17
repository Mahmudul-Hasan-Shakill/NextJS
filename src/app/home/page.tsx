import React from "react";
import MainLayout from "@/components/layout/main-layout";
import VmChartsWrapper from "@/components/charts/userVmChartsWrapper";

export const metadata = {
  title: "Home",
  description: "Developed by Core Systems",
};

const Bookmarks: React.FC = () => {
  return (
    <>
      <MainLayout>
        <VmChartsWrapper />
      </MainLayout>
    </>
  );
};

export default Bookmarks;
