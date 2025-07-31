import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import AmcAction from "@/components/core_systems/amc/amcAction";
import ClusterAction from "@/components/core_systems/cluster/clusterAction";

export const metadata = {
  title: "Cluster-Update",
  description: "Developed by Core Systems",
};

const ClusterUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <ClusterAction />
      </MainLayout>
    </>
  );
};

export default ClusterUpdate;
