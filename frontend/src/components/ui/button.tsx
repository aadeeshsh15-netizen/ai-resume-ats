import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#bbf451] hover:bg-[#a8eb38] text-[#050505] font-bold border border-[#bbf451]/40 shadow-sm hover:shadow-[#bbf451]/20",
        lime:
          "bg-[#bbf451] hover:bg-[#a8eb38] text-[#050505] font-bold border border-[#bbf451]/40 shadow-sm",
        orange:
          "bg-[#fb923c] hover:bg-[#f97316] text-[#050505] font-bold border border-[#fb923c]/40 shadow-sm",
        white:
          "bg-white hover:bg-[#f0f0f0] text-[#050505] font-bold border border-white/80 shadow-sm",
        gradient:
          "bg-[#bbf451] hover:bg-[#a8eb38] text-[#050505] font-bold border border-[#bbf451]/40 shadow-sm",
        cyan:
          "bg-[#bbf451] hover:bg-[#a8eb38] text-[#050505] font-bold border border-[#bbf451]/40 shadow-sm",
        destructive:
          "bg-red-600 hover:bg-red-500 text-white font-bold border border-red-500/30 shadow-sm",
        outline:
          "border border-[#2a2a2a] bg-[#141414] text-[#f5f5f5] hover:bg-[#1c1c1c] hover:border-[#3d3d3d] shadow-xs",
        secondary:
          "bg-[#1e1e1e] text-[#f5f5f5] hover:bg-[#282828] border border-[#2e2e2e] shadow-xs",
        ghost:
          "text-[#888888] hover:bg-[#1a1a1a] hover:text-[#f5f5f5]",
        link:
          "text-[#bbf451] underline-offset-4 hover:underline p-0 h-auto font-medium active:scale-100",
        glass:
          "bg-[#161616] border border-[#2a2a2a] text-[#f5f5f5] hover:bg-[#202020] hover:border-[#383838] shadow-xs",
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
