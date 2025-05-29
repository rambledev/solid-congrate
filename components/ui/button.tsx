import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
