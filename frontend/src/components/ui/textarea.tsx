import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-4 text-sm text-slate-100 shadow-inner shadow-black/20 transition-all duration-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-cyan-500/80 focus-visible:ring-4 focus-visible:ring-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
