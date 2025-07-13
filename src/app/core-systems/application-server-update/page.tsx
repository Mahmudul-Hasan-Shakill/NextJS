import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import ApplicationAction from "@/components/core_systems/application/applicationAction";

export const metadata = {
  title: "Application-Server-Update",
  description: "Developed by Core Systems",
};

const ApplicationUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <ApplicationAction />
      </MainLayout>
    </>
  );
};

export default ApplicationUpdate;
