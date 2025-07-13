"use client";

export const Footer = () => {
  return (
    <footer className="w-full mt-6 px-4 py-2 bg-gray-300 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
        <p className="font-medium">
          © {new Date().getFullYear()} Core Systems. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
