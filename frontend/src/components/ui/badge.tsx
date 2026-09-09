import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#bbf451]/30 bg-[#bbf451]/10 text-[#bbf451] hover:bg-[#bbf451]/20",
        lime:
          "border-[#bbf451]/30 bg-[#bbf451]/10 text-[#bbf451] hover:bg-[#bbf451]/20",
        limeSolid:
          "bg-[#bbf451] text-[#050505] font-bold border border-[#bbf451]",
        orange:
          "border-[#fb923c]/30 bg-[#fb923c]/10 text-[#fb923c] hover:bg-[#fb923c]/20",
        orangeSolid:
          "bg-[#fb923c] text-[#050505] font-bold border border-[#fb923c]",
        white:
          "bg-white text-[#050505] font-bold border border-white",
        secondary:
          "border-[#2a2a2a] bg-[#1a1a1a] text-[#d0d0d0] hover:bg-[#222222]",
        destructive:
          "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline:
          "border-[#2e2e2e] bg-[#141414] text-[#a0a0a0] hover:bg-[#1a1a1a]",
        success:
          "border-[#bbf451]/30 bg-[#bbf451]/10 text-[#bbf451] hover:bg-[#bbf451]/20",
        warning:
          "border-[#fb923c]/30 bg-[#fb923c]/10 text-[#fb923c] hover:bg-[#fb923c]/20",
        purple:
          "border-[#fb923c]/30 bg-[#fb923c]/10 text-[#fb923c]",
        cyan:
          "border-[#bbf451]/30 bg-[#bbf451]/10 text-[#bbf451]",
        gradient:
          "border-[#bbf451]/30 bg-[#bbf451]/10 text-[#bbf451]",
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
