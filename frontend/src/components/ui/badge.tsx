import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20",
        secondary:
          "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
        destructive:
          "border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20",
        outline:
          "border-white/15 bg-slate-900/50 text-slate-300 hover:bg-white/5",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20",
        cyan:
          "border-cyan-500/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25",
        gradient:
          "border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 text-cyan-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
