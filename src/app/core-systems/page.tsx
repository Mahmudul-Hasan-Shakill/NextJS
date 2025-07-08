import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { CoreSystem_Settings } from "@/components/landing/coreSystem-settings";

export const metadata = {
  title: "Core Systems",
  description: "Developed by Core Systems",
};

const AdminSettingsPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <CoreSystem_Settings />
      </MainLayout>
    </>
  );
};

export default AdminSettingsPage;
