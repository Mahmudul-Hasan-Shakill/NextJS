"use client";

import React from "react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="p-[2px] relative w-full text-sm font-semibold"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-300 dark:to-gray-400 rounded" />
      <div className="px-8 py-2 bg-gray-400 dark:bg-gray-500 rounded relative group transition duration-200 text-black dark:text-white hover:bg-transparent dark:hover:bg-transparent hover:text-white dark:hover:text-black flex items-center justify-center gap-2">
        {isSubmitting && (
          <svg
            className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {isSubmitting ? "Loading..." : label}
      </div>
    </button>
  );
};

export default SubmitButton;
