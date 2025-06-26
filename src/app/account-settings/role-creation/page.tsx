import MainLayout from "@/components/layout/main-layout";
import RoleSettings from "@/components/roles/roleSettings";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

export const metadata = {
  title: "Role-Creation",
  description: "Developed by Core Systems",
};

const UserSettings: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <RoleSettings />
      </MainLayout>
    </>
  );
};

export default UserSettings;
