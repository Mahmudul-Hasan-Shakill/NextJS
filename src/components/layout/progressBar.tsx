"use-client";

import { useState, useEffect } from "react";

export const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const totalScrollableHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (totalScrollableHeight > 0) {
      const progress = (currentScrollY / totalScrollableHeight) * 100;
      setScrollProgress(progress);
    } else {
      setScrollProgress(0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 w-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
