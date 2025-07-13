import React from "react";

interface UniversalButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Accepts an event argument
  type?: "button" | "submit" | "reset"; // Button type
  children: React.ReactNode; // Button content
  className?: string; // Additional classes for customization
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const UniversalButton: React.FC<UniversalButtonProps> = ({
  onClick,
  type = "button",
  children,
  className = "",
}) => {
  return (
    <button
      className={`group/btn text-xs relative block col-span-1 md:col-span-2 mt-8 h-10 w-full rounded-md bg-gradient-to-br from-gray-900 to-gray-600 font-medium text-white shadow dark:bg-zinc-800 ${className}`}
      type={type}
      onClick={onClick}
    >
      {children} <BottomGradient />
    </button>
  );
};

export default UniversalButton;
