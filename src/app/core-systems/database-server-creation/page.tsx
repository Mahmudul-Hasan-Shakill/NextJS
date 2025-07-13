import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { DatabaseRegister } from "@/components/core_systems/database/databaseRegister";

export const metadata = {
  title: "Database-Server-Creation",
  description: "Developed by Core Systems",
};

const DatabaseCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <DatabaseRegister />
      </MainLayout>
    </>
  );
};

export default DatabaseCreation;
