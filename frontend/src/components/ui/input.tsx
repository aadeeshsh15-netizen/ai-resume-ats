import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md px-4 py-2 text-sm text-slate-100 shadow-inner shadow-black/20 transition-all duration-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-cyan-500/80 focus-visible:ring-4 focus-visible:ring-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
