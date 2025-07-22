import React from "react";
import MainLayout from "@/components/layout/main-layout";
// import VmChartsWrapper from "@/components/charts/userVmChartsWrapper";
import HomeTabs from "@/components/landing/home-tabs";

export const metadata = {
  title: "Home",
  description: "Developed by Core Systems",
};

const Bookmarks: React.FC = () => {
  return (
    <>
      <MainLayout>
        {/* <VmChartsWrapper /> */}
        <HomeTabs />
      </MainLayout>
    </>
  );
};

export default Bookmarks;
