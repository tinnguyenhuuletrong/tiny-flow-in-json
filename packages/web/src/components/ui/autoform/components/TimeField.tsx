import { Input } from "@/components/ui/input";
import { type AutoFormFieldProps } from "@autoform/react";
import React from "react";

export const TimeField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;

  return (
    <Input
      id={id}
      type="time"
      className={error ? "border-destructive" : ""}
      {...props}
    />
  );
};
