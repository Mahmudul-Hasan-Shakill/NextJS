import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import AutomationAction from "@/components/core_systems/automation/automationAction";

export const metadata = {
  title: "Automatic Server Update",
  description: "Developed by Core Systems",
};

const AutoUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <AutomationAction />
      </MainLayout>
    </>
  );
};

export default AutoUpdate;
