"use client";
import React from "react";
import dynamic from "next/dynamic";
const Player = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/../public/lottie/loading-animation2.json";

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black bg-opacity-50">
      <Player
        autoplay
        loop
        animationData={animationData}
        style={{ height: 300, width: 300 }}
      />
    </div>
  );
};

export default PageLoader;
