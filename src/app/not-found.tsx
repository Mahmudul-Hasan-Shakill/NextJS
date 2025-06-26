"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Player = dynamic(() => import("lottie-react"), { ssr: false });

import animationData from "@/../public/lottie/404-animation.json";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="mb-4 w-80 h-80 md:w-96 md:h-96">
        <Player
          autoplay
          loop
          animationData={animationData}
          style={{ height: 500, width: 400 }}
        />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-white mt-4 text-center">
        Page Not Found
      </h1>
      <p className="text-lg text-white mt-2 text-center">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-2 text-lg font-semibold text-blue-600 bg-white rounded-md hover:bg-gray-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
