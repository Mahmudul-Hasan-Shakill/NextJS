import { SelfRegister } from "@/components/auth/selfRegister";
import React from "react";

export const metadata = {
  title: "Self Registration",
  description: "Developed by Core Systems",
};

const SelfRegisterPage: React.FC = () => {
  return (
    <>
      <SelfRegister />
    </>
  );
};

export default SelfRegisterPage;
