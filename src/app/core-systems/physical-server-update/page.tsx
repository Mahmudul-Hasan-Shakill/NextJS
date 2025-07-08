import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import PhysicalAction from "@/components/core_systems/physical/physicalAction";

export const metadata = {
  title: "Physical-Server-Update",
  description: "Developed by Core Systems",
};

const PhysicalUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <PhysicalAction />
      </MainLayout>
    </>
  );
};

export default PhysicalUpdate;
