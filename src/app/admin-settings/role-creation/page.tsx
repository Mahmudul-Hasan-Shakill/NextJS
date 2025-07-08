import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import InsertRole from "@/components/roles/insertRole";

export const metadata = {
  title: "Role-Creation",
  description: "Developed by Core Systems",
};

const UserSettings: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <InsertRole />
      </MainLayout>
    </>
  );
};

export default UserSettings;
