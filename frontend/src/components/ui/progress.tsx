import * as React from "react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; indicatorColor?: string }
>(({ className, value, indicatorColor = "bg-gradient-to-r from-indigo-500 to-violet-600", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 p-0.5",
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
