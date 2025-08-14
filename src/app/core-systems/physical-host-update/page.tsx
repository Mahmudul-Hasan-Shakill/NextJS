import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import PhysicalHostAction from "@/components/core_systems/physical_host/physicalHostAction";

export const metadata = {
  title: "Physical-Host-Update",
  description: "Developed by Core Systems",
};

const PhysicalHostUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <PhysicalHostAction />
      </MainLayout>
    </>
  );
};

export default PhysicalHostUpdate;
