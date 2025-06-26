import React, { ReactNode } from "react";

interface PageTitleProps {
  children: ReactNode;
}

const Underline: React.FC<PageTitleProps> = ({ children }) => {
  return (
    <div className="w-full mx-auto text-center pt-2">
      <div className="max-w-full mx-auto px-4">
        <div className="relative inline-block">
          <span className="text-slate-700 text-2xl md:text-2xl font-bold">{children} </span>
          <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-blue-700 via-purple-500 to-blue-700 rounded-full"></span>
        </div>
      </div>
    </div>
  );
};

export default Underline;
