import * as React from "react"
import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; indicatorColor?: string }
>(({ className, value, indicatorColor = "bg-gradient-to-r from-cyan-500 to-indigo-500", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-slate-950/80 border border-white/10 p-0.5",
      className
    )}
    {...props}
  >
    <div
      className={cn("h-full rounded-full transition-all duration-500 ease-out shadow-sm shadow-cyan-500/20", indicatorColor)}
      style={{ width: `${Math.min(Math.max(value || 0, 0), 100)}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
