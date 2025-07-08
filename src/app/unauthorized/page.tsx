import UnAuth from "@/components/auth/unauth";
import React from "react";

export const metadata = {
  title: "Unauthorized",
  description: "Developed by Core Systems",
};

// Define the functional component with React.FC
const Unauthorized: React.FC = () => {
  return (
    <>
      <UnAuth />
    </>
  );
};

export default Unauthorized;
