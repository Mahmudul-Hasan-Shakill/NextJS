import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { PhysicalHostRegister } from "@/components/core_systems/physical_host/physicalHostRegister";

export const metadata = {
  title: "Physical-Host-Creation",
  description: "Developed by Core Systems",
};

const PhysicalHostCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <PhysicalHostRegister />
      </MainLayout>
    </>
  );
};

export default PhysicalHostCreation;
