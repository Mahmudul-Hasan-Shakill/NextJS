import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { ClusterRegister } from "@/components/core_systems/cluster/clusterRegister";

export const metadata = {
  title: "Cluster-Creation",
  description: "Developed by Core Systems",
};

const ClusterCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <ClusterRegister />
      </MainLayout>
    </>
  );
};

export default ClusterCreation;
