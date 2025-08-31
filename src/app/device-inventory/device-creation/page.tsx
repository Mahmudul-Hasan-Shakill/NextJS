import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { DeviceRegister } from "@/components/device/deviceRegsiter";

export const metadata = {
  title: "Device-Creation",
  description: "Developed by Core Systems",
};

const DeviceCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <DeviceRegister />
      </MainLayout>
    </>
  );
};

export default DeviceCreation;
