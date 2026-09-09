import * as React from "react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; indicatorColor?: string }
>(({ className, value, indicatorColor = "bg-[#bbf451]", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2.5 w-full overflow-hidden rounded-full bg-[#1c1c1c] border border-[#2a2a2a] p-0.5",
      className
    )}
    {...props}
  >
    <div
      className={cn("h-full rounded-full transition-all duration-500 ease-out", indicatorColor)}
      style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
