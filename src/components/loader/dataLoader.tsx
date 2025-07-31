import React from "react";

const DataLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-6">
      <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
        <div className="flex items-center w-full">
          <div className="h-2.5 bg-gray-300 rounded-full w-32"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
        </div>
        <div className="flex items-center w-full max-w-[480px]">
          <div className="h-2.5 bg-gray-300 rounded-full w-full"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
        </div>
        <div className="flex items-center w-full max-w-[400px]">
          <div className="h-2.5 bg-gray-400 rounded-full w-full"></div>
          <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-80"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
        </div>
        <div className="flex items-center w-full max-w-[480px]">
          <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-full"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
        </div>
        <div className="flex items-center w-full max-w-[440px]">
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-32"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
          <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-full"></div>
        </div>
        <div className="flex items-center w-full max-w-[360px]">
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
          <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-80"></div>
          <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default DataLoader;
