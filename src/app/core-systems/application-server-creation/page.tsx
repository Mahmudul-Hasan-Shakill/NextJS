import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { ApplicationRegister } from "@/components/core_systems/application/applicationRegister";

export const metadata = {
  title: "Application-Server-Creation",
  description: "Developed by Core Systems",
};

const ApplicationCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <ApplicationRegister />
      </MainLayout>
    </>
  );
};

export default ApplicationCreation;
