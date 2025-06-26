import React from "react";
import MainLayout from "@/components/layout/main-layout";
import { BackgroundLinesDemo } from "@/components/ui/backgroundLines";

export const metadata = {
  title: "Home",
  description: "Developed by Core Systems",
};

const Bookmarks: React.FC = () => {
  return (
    <>
      <MainLayout>
        <BackgroundLinesDemo />
      </MainLayout>
    </>
  );
};

export default Bookmarks;
