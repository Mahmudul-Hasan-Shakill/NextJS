import MainLayout from "@/components/layout/main-layout";
import Underline from "@/components/ui/underline";
import EditAdminList from "@/components/users/adminList";
import React from "react";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { UserRegister } from "@/components/users/userRegister";

export const metadata = {
  title: "User-Creation",
  description: "Developed by Core Systems",
};

const UserCreation: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <UserRegister />
      </MainLayout>
    </>
  );
};

export default UserCreation;
