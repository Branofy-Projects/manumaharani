import { cn } from "@/lib/utils";

import type * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "placeholder:text-gray-500 selection:bg-gray-900 bg-white selection:text-white flex min-h-16 w-full rounded-md border border-gray-300 px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#2b2b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2b2b]/50",
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        className
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
