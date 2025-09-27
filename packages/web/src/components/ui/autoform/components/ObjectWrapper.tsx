import React from "react";
import { type ObjectWrapperProps } from "@autoform/react";

export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({
  label,
  children,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{label}</h3>
      <div className="border-l-2 border-gray-400 px-3">{children}</div>
    </div>
  );
};
