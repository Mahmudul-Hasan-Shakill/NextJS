import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import EditRole from "@/components/roles/editRole";

export const metadata = {
  title: "Role-Update",
  description: "Developed by Core Systems",
};

const UserSettings: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <EditRole />
      </MainLayout>
    </>
  );
};

export default UserSettings;
