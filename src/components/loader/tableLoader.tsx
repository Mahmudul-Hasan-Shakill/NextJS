import React from "react";

export const TableSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-6 bg-white">
      <div className="p-4 space-y-4 w-full animate-pulse">
        {/* Title */}
        <div className="flex justify-center">
          <div className="h-10 bg-slate-600 rounded w-1/3"></div>
        </div>
        {/* Searchbar and Excel */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 bg-slate-300 rounded w-1/3"></div>
          <div className="h-10 bg-slate-300 rounded w-1/3"></div>
        </div>

        {/* Table Header */}
        <div className="flex w-full space-x-6">
          <div className="h-10 bg-slate-600 rounded w-1/3"></div>
          <div className="h-10 bg-slate-600 rounded w-1/6"></div>
          <div className="h-10 bg-slate-600 rounded w-1/6"></div>
          <div className="h-10 bg-slate-600 rounded w-1/6"></div>
          <div className="h-10 bg-slate-600 rounded w-1/6"></div>
        </div>

        {/* Table Rows */}
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="flex w-full space-x-6">
            <div className="h-10 bg-slate-400 rounded w-1/3"></div>
            <div className="h-10 bg-slate-400 rounded w-1/6"></div>
            <div className="h-10 bg-slate-400 rounded w-1/6"></div>
            <div className="h-10 bg-slate-400 rounded w-1/6"></div>
            <div className="h-10 bg-slate-400 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
