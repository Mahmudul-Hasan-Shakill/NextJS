import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { PhysicalRegister } from "@/components/core_systems/physical/physicalRegister";

export const metadata = {
  title: "Physical-Server-Creation",
  description: "Developed by Core Systems",
};

const PhysicalCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <PhysicalRegister />
      </MainLayout>
    </>
  );
};

export default PhysicalCreation;
