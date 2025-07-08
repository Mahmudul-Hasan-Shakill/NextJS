import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { Admin_Settings } from "@/components/landing/admin-settings";

export const metadata = {
  title: "Admin-Settings",
  description: "Developed by Core Systems",
};

const AdminSettingsPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <Admin_Settings />
      </MainLayout>
    </>
  );
};

export default AdminSettingsPage;
