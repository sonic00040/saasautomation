import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const statCardVariants = cva(
  "relative overflow-hidden rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg",
        gradient: "bg-gradient-to-br from-white to-gray-50/50 border-gray-200/50 hover:shadow-xl",
        colored: "border-0 text-white hover:shadow-xl hover:scale-[1.02]",
        glass: "bg-white/80 backdrop-blur-md border-white/20 hover:shadow-xl",
        elevated: "bg-white border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: string
    type: "positive" | "negative" | "neutral"
  }
  color?: "blue" | "green" | "purple" | "orange" | "red" | "yellow"
  animated?: boolean
}

function StatCard({
  className,
  variant,
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  animated = false,
  ...props
}: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600", 
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
  }

  const iconColorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50", 
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50",
  }

  const trendColorClasses = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  }

  return (
    <div
      className={cn(
        statCardVariants({ variant }),
        variant === "colored" && `bg-gradient-to-br ${colorClasses[color]}`,
        className
      )}
      {...props}
    >
      {variant === "colored" && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
      )}
      
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium",
              variant === "colored" ? "text-white/80" : "text-gray-600"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-3xl font-bold mt-2",
              variant === "colored" ? "text-white" : "text-gray-900",
              animated && "transition-all duration-300"
            )}>
              {animated ? (
                <CountUpAnimation value={typeof value === 'number' ? value : 0} />
              ) : (
                value
              )}
            </p>
            {subtitle && (
              <p className={cn(
                "text-sm mt-1",
                variant === "colored" ? "text-white/70" : "text-gray-500"
              )}>
                {subtitle}
              </p>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              variant === "colored" ? "bg-white/20" : iconColorClasses[color]
            )}>
              <Icon className={cn(
                "w-6 h-6",
                variant === "colored" ? "text-white" : iconColorClasses[color].split(" ")[0]
              )} />
            </div>
          )}
        </div>
        
        {trend && (
          <div className="flex items-center mt-4">
            <div className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              variant === "colored" ? "bg-white/20 text-white" : trendColorClasses[trend.type]
            )}>
              {trend.type === "positive" ? "↗" : trend.type === "negative" ? "↘" : "→"} {trend.value}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Animated counter component
function CountUpAnimation({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = React.useState(0)
  
  React.useEffect(() => {
    let start = 0
    const increment = value / 50
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 30)
    
    return () => clearInterval(timer)
  }, [value])
  
  return <>{displayValue.toLocaleString()}</>
}

export { StatCard, statCardVariants }