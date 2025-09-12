"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          ["bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-800 active:bg-neutral-800/90",
            "dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:active:bg-neutral-300/80"
          ],
          ghost: [
            "transparent hover:bg-neutral-100 hover:text-neutral-900",
            "dark:hover:bg-neutral-800 dark:active:bg-neutral-800/80 dark:hover:text-neutral-100"
          ],
        outline:
          ["border shadow-sm",
            "transparent border-neutral-200 hover:bg-neutral-100 text-neutral-800 hover:text-neutral-900 active:bg-neutral-200 hover:border-transparent",
            "dark:hover:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-800 dark:active:bg-neutral-800/80 dark:hover:text-neutral-100"
          ],
        link: [
          "text-neutral-900 underline underline-offset-4 hover:text-indigo-600 dark:text-neutral-50",
          "dark:text-neutral-100 dark:hover:text-indigo-400"
        ],
        destructive:
          ["bg-red-600 text-neutral-50 shadow-sm hover:bg-red-500 active:bg-red-500/85",
            'dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-500/85'
          ],
      },
      size: {
        xs: "h-6 min-w-6 gap-1 px-1 text-xs [&>svg]:size-3",
        sm: "h-8 min-w-8 gap-2 px-2 text-sm [&>svg]:size-3",
        md: "h-9 min-w-9 gap-2 px-3 text-base [&>svg]:size-3",
        lg: "h-10 min-w-10 gap-2 px-3 text-base [&>svg]:size-3",
        xl: "h-12 min-w-12 gap-2 px-5 text-base [&>svg]:size-3",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "sm",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, rounded = "md", ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
