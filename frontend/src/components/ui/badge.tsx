import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-indigo-200/80 bg-indigo-50/90 text-indigo-700 hover:bg-indigo-100",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200/80",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        outline:
          "border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50",
        success:
          "border-emerald-200/90 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        warning:
          "border-amber-200/90 bg-amber-50 text-amber-700 hover:bg-amber-100",
        purple:
          "border-purple-200/90 bg-purple-50 text-purple-700 hover:bg-purple-100",
        cyan:
          "border-cyan-200/90 bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
        gradient:
          "border-indigo-300/40 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-indigo-700",
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
