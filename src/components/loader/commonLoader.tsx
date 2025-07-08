"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Player = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/../public/lottie/spinner-loading-animation.json";

interface PageLoaderProps {
  children: React.ReactNode;
}

const CommonLoader: React.FC<PageLoaderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black bg-opacity-50 flex-col">
        <Player
          autoplay
          loop
          animationData={animationData}
          style={{ height: 300, width: 300 }}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default CommonLoader;
