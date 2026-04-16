import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
