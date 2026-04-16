import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 resize-none",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
