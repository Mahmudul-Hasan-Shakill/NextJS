import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import FilesystemAction from "@/components/core_systems/filesystem/filesystemAction";

export const metadata = {
  title: "Filesystem-Update",
  description: "Developed by Core Systems",
};

const FilesystemUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <FilesystemAction />
      </MainLayout>
    </>
  );
};

export default FilesystemUpdate;
