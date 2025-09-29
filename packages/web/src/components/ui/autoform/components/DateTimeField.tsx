import { Input } from "@/components/ui/input";
import { type AutoFormFieldProps } from "@autoform/react";
import React from "react";

export const DateTimeField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;

  return (
    <Input
      id={id}
      type="datetime-local"
      className={error ? "border-destructive" : ""}
      {...props}
    />
  );
};
