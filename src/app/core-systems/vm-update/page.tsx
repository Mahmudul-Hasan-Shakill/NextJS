import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import UserAction from "@/components/users/userAction";
import VmAction from "@/components/core_systems/vm/vmAction";

export const metadata = {
  title: "Vm-Update",
  description: "Developed by Core Systems",
};

const VmUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <VmAction />
      </MainLayout>
    </>
  );
};

export default VmUpdate;
