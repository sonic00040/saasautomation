import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        success: "bg-green-100",
        warning: "bg-yellow-100",
        danger: "bg-red-100",
        gradient: "bg-gradient-to-r from-blue-50 to-purple-50",
      },
      size: {
        default: "h-2",
        sm: "h-1",
        lg: "h-3",
        xl: "h-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressBarVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-600",
        warning: "bg-yellow-600",
        danger: "bg-red-600",
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number
  max?: number
  animated?: boolean
}

function Progress({
  className,
  value = 0,
  max = 100,
  variant,
  size,
  animated = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <div
        className={cn(
          progressBarVariants({ variant }),
          animated && "animate-pulse",
          "rounded-full"
        )}
        style={{ width: `${percentage}%` }}
      />
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
    </div>
  )
}

export { Progress, progressVariants }