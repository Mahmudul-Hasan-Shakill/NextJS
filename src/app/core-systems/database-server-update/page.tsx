import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import DatabaseAction from "@/components/core_systems/database/databaseAction";

export const metadata = {
  title: "Database-Server-Update",
  description: "Developed by Core Systems",
};

const DatabaseUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <DatabaseAction />
      </MainLayout>
    </>
  );
};

export default DatabaseUpdate;
