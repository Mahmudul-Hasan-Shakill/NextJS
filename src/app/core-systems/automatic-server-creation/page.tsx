import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { AutomationRegister } from "@/components/core_systems/automation/automationRegister";

export const metadata = {
  title: "Automatic Server Creation",
  description: "Developed by Core Systems",
};

const AutoCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <AutomationRegister />
      </MainLayout>
    </>
  );
};

export default AutoCreation;
