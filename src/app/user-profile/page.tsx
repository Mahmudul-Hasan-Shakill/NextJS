import ResetPassword from "@/components/auth/resetPassword";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import MainLayout from "@/components/layout/main-layout";
import UserProfile from "@/components/users/userProfile";
import React from "react";

export const metadata = {
  title: "User Profile",
  description: "Developed by Core Systems",
};

const UserProfilePage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Breadcrumb pageName={metadata.title} />
        <UserProfile />
      </MainLayout>
    </>
  );
};

export default UserProfilePage;
