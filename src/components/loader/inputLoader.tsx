import React from "react";

const InputPageLoader: React.FC = () => {
  return (
    <div className="mt-12 mx-16 p-4 animate-pulse space-y-6">
      {/* Top: View Button */}
      <div className="flex justify-end">
        <div className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* Input Rows */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <div className="h-10 w-full bg-gray-400 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
};

export default InputPageLoader;
