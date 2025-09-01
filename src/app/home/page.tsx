import React from "react";
import MainLayout from "@/components/layout/main-layout";
import HomeTabs from "@/components/landing/home-tabs";

export const metadata = {
  title: "Home",
  description: "Developed by Core Systems",
};

const Bookmarks: React.FC = () => {
  return (
    <>
      <MainLayout>
        <HomeTabs />
      </MainLayout>
    </>
  );
};

export default Bookmarks;
