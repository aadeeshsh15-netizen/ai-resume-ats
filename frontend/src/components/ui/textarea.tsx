import * as React from "react"
import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-[#2a2a2a] bg-[#141414] p-4 text-sm text-[#f5f5f5] transition-all duration-200 placeholder:text-[#666666] focus-visible:outline-none focus-visible:border-[#bbf451]/70 focus-visible:ring-2 focus-visible:ring-[#bbf451]/20 disabled:cursor-not-allowed disabled:opacity-50 leading-relaxed",
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
