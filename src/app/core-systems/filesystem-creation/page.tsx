import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { FilesystemRegister } from "@/components/core_systems/filesystem/filesystemRegister";

export const metadata = {
  title: "Filesystem-Creation",
  description: "Developed by Core Systems",
};

const FilesystemCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <FilesystemRegister />
      </MainLayout>
    </>
  );
};

export default FilesystemCreation;
