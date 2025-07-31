// import React from "react";

// const DataLoader: React.FC = () => {
//   return (
//     <div className="flex justify-center items-center p-6">
//       <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
//         <div className="flex items-center w-full">
//           <div className="h-2.5 bg-gray-300 rounded-full w-32"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
//         </div>
//         <div className="flex items-center w-full max-w-[480px]">
//           <div className="h-2.5 bg-gray-300 rounded-full w-full"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
//         </div>
//         <div className="flex items-center w-full max-w-[400px]">
//           <div className="h-2.5 bg-gray-400 rounded-full w-full"></div>
//           <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-80"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
//         </div>
//         <div className="flex items-center w-full max-w-[480px]">
//           <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-full"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
//         </div>
//         <div className="flex items-center w-full max-w-[440px]">
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-32"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-24"></div>
//           <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-full"></div>
//         </div>
//         <div className="flex items-center w-full max-w-[360px]">
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
//           <div className="h-2.5 ml-2 bg-gray-300 rounded-full w-80"></div>
//           <div className="h-2.5 ml-2 bg-gray-400 rounded-full w-full"></div>
//         </div>
//         <span className="sr-only">Loading...</span>
//       </div>
//     </div>
//   );
// };

// export default DataLoader;

import React from "react";

const DataLoader: React.FC = () => {
  return (
    <div className="p-4 animate-pulse space-y-4">
      {/* Top bar: Search + Export */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
      </div>

      {/* Table header */}
      <div className="grid grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={`header-${i}`}
            className="h-4 bg-gray-400 dark:bg-gray-600 rounded"
          />
        ))}
      </div>

      {/* Table rows */}
      <div className="space-y-3">
        {[...Array(10)].map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid grid-cols-6 gap-4 items-center"
          >
            {[...Array(6)].map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 bg-gray-300 dark:bg-gray-700 rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataLoader;
