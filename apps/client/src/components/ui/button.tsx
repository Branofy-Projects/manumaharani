import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
        lg: "h-10 px-6 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
      },
      variant: {
        default: "bg-gray-900 text-white shadow-xs hover:bg-gray-800",
        destructive: "bg-red-600 text-white shadow-xs hover:bg-red-700",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        gradient:
          "bg-gradient-to-r from-[#455540] to-[#6b8e23] hover:from-[#5a6b4a] hover:to-[#7fa650] text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300",
        link: "text-gray-900 underline-offset-4 hover:underline",
        outline: "border border-gray-300 bg-white shadow-xs hover:bg-gray-100",
        reserve:
          "bg-[#2b2b2b] text-[#f4efe8] px-5 py-2 text-sm tracking-wide hover:bg-[#4a4a4a]",
        secondary: "bg-gray-100 text-gray-900 shadow-xs hover:bg-gray-200",
      },
    },
  }
);

function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: {
  asChild?: boolean;
} & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
