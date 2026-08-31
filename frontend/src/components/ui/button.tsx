import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 border border-indigo-500/30",
        gradient:
          "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white shadow-md shadow-fuchsia-500/25 hover:shadow-lg hover:shadow-fuchsia-500/35 border border-fuchsia-500/30",
        cyan:
          "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/35",
        destructive:
          "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30",
        outline:
          "border border-slate-200/90 bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm",
        secondary:
          "bg-slate-100/90 text-slate-800 hover:bg-slate-200/80 border border-slate-200/80 shadow-xs",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        link:
          "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto font-medium active:scale-100",
        glass:
          "bg-white/70 backdrop-blur-md border border-white/60 text-slate-800 hover:bg-white/90 shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8.5 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-base font-bold",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
