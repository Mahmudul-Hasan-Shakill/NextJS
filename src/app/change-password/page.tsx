import React from "react";
import ChangePassword from "@/components/auth/changePassword";

export const metadata = {
  title: "Change Password",
  description: "Developed by Core Systems",
};

const ChangePasswordPage: React.FC = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};

export default ChangePasswordPage;
