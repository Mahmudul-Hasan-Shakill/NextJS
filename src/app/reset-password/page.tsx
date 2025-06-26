import ResetPassword from "@/components/auth/resetPassword";
import React from "react";

export const metadata = {
  title: "Reset Password",
  description: "Developed by Core Systems",
};

const ResetPasswordPage: React.FC = () => {
  return (
    <>
      <ResetPassword />
    </>
  );
};

export default ResetPasswordPage;
