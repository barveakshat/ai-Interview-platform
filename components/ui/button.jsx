import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-accent-blue text-white shadow-xs hover:bg-accent-purple hover:shadow-lg hover:scale-105 border border-border-subtle transform transition-all duration-200",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-red-600 hover:shadow-lg hover:scale-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 border border-border-subtle transform transition-all duration-200",
        outline:
          "border bg-background shadow-xs hover:bg-accent-blue hover:text-white hover:shadow-lg hover:scale-105 dark:bg-input/30 dark:border-input transform transition-all duration-200",
        secondary:
          "bg-card text-text-primary font-semibold py-2 px-4 rounded-lg border border-border-subtle hover:bg-accent-blue hover:text-white hover:scale-105 hover:shadow-lg transform transition-all duration-200",
        ghost:
          "hover:bg-accent-blue/20 hover:text-accent-blue hover:shadow-md hover:scale-105 transform transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-accent-purple transition-colors duration-200",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
