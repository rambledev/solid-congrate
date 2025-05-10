import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // เพิ่ม className ที่เป็น optional
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`border rounded-lg shadow-md p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>;
}