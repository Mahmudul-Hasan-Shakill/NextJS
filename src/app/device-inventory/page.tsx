import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { DeviceInventory_Settings } from "@/components/landing/deviceInventory-settings";

export const metadata = {
  title: "Device Inventory",
  description: "Developed by Core Systems",
};

const DeviceInventoryPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <DeviceInventory_Settings />
      </MainLayout>
    </>
  );
};

export default DeviceInventoryPage;
