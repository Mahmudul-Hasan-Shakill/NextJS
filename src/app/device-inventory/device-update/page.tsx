import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import DeviceAction from "@/components/device/deviceAction";

export const metadata = {
  title: "Device-Update",
  description: "Developed by Core Systems",
};

const DeviceUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <DeviceAction />
      </MainLayout>
    </>
  );
};

export default DeviceUpdate;
