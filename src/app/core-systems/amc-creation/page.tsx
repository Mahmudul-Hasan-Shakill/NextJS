import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { AmcRegister } from "@/components/core_systems/amc/amcRegister";

export const metadata = {
  title: "AMC-Creation",
  description: "Developed by Core Systems",
};

const AmcCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <AmcRegister />
      </MainLayout>
    </>
  );
};

export default AmcCreation;
