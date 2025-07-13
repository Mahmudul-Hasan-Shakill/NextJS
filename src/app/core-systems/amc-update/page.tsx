import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import AmcAction from "@/components/core_systems/amc/amcAction";

export const metadata = {
  title: "AMC-Update",
  description: "Developed by Core Systems",
};

const AmcUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <AmcAction />
      </MainLayout>
    </>
  );
};

export default AmcUpdate;
