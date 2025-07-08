import MainLayout from "@/components/layout/main-layout";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import UserAction from "@/components/users/userAction";

export const metadata = {
  title: "User-Update",
  description: "Developed by Core Systems",
};

const UserUpdate: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <UserAction />
      </MainLayout>
    </>
  );
};

export default UserUpdate;
