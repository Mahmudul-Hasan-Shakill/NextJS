import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { UserRegister } from "@/components/users/userRegister";
import { VmRegister } from "@/components/core_systems/vm/vmRegister";

export const metadata = {
  title: "VM-Creation",
  description: "Developed by Core Systems",
};

const VmCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <VmRegister />
      </MainLayout>
    </>
  );
};

export default VmCreation;
