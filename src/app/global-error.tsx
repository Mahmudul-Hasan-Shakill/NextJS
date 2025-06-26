"use client";
import React from "react";
import dynamic from "next/dynamic";
// import Player from "lottie-react";
const Player = dynamic(() => import("lottie-react"), { ssr: false });

import animationData from "@/../public/lottie/error-animation.json";

const GlobalError: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-yellow-600 p-4">
      <div className="w-80 h-80 md:w-96 md:h-96">
        <Player
          autoplay
          loop
          animationData={animationData}
          style={{ height: 300, width: 300 }}
        />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-white mt-4 text-center">
        Something Went Wrong
      </h1>
      <p className="text-lg text-white mt-2 text-center">
        An unexpected error has occurred. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 text-lg font-semibold text-red-600 bg-white rounded-md hover:bg-gray-300"
      >
        Reload
      </button>
    </div>
  );
};

export default GlobalError;
