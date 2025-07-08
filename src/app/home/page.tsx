import React from "react";
import MainLayout from "@/components/layout/main-layout";
import { BackgroundLinesDemo } from "@/components/ui/backgroundLines";
import UserRoleChartsWrapper from "@/components/charts/userRoleChartsWrapper";
import { Vortex } from "@/components/ui/vortex";

export const metadata = {
  title: "Home",
  description: "Developed by Core Systems",
};

const Bookmarks: React.FC = () => {
  return (
    <>
      <MainLayout>
        <UserRoleChartsWrapper />
      </MainLayout>
    </>
  );
};

export default Bookmarks;
