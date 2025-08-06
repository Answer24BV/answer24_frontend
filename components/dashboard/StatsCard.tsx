import type React from "react"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Define color variants for different cards
const cardVariants = [
  {
    // Blue
    bg: 'from-blue-50 to-blue-300',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'border-blue-100',
    highlight: 'bg-blue-100/80',
  },
  {
    // Green
    bg: 'from-emerald-50 to-emerald-300',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-100',
    highlight: 'bg-emerald-100/80',
  },
  {
    // Purple
    bg: 'from-violet-50 to-violet-300',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    border: 'border-violet-100',
    highlight: 'bg-violet-100/80',
  },
  {
    // Amber
    bg: 'from-amber-50 to-amber-300',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    border: 'border-amber-100',
    highlight: 'bg-amber-100/80',
  },
  {
    // Rose
    bg: 'from-rose-50 to-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    border: 'border-rose-100',
    highlight: 'bg-rose-100/80',
  },
  {
    // Indigo
    bg: 'from-indigo-50 to-indigo-400',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    border: 'border-indigo-100',
    highlight: 'bg-indigo-100/80',
  },
  {
    // Teal
    bg: 'from-teal-50 to-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    border: 'border-teal-100',
    highlight: 'bg-teal-100/80',
  },
  {
    // Fuchsia
    bg: 'from-fuchsia-50 to-fuchsia-50',
    iconBg: 'bg-fuchsia-100',
    iconColor: 'text-fuchsia-600',
    border: 'border-fuchsia-100',
    highlight: 'bg-fuchsia-100/80',
  },
]

interface SimpleStatsCardProps {
  title: string
  value: string | number
  change?: number
  format?: "currency" | "percentage" | "number"
  icon?: React.ReactNode
}

export function SimpleStatsCard({ title, value, change, format = "number", icon, colorIndex = 0 }: SimpleStatsCardProps & { colorIndex?: number }) {
  const colors = cardVariants[colorIndex % cardVariants.length] || cardVariants[0]
  
  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return `$${typeof val === "number" ? val.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }) : val}`
    }
    if (format === "percentage") {
      const numVal = typeof val === 'string' ? parseFloat(val) : val
      return `${numVal.toFixed(1)}%`
    }
    return typeof val === "number" ? val.toLocaleString() : val
  }

  const isPositive = change !== undefined ? change >= 0 : true
  const changeValue = change !== undefined ? Math.abs(change) : 0
  
  return (
    <Card className={cn(
      `bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1`,
      'group hover:shadow-blue-100/50'
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-2.5 rounded-lg transition-colors duration-300 group-hover:scale-110",
            colors.iconBg,
            colors.iconColor
          )}>
            <div className="h-5 w-5 flex items-center justify-center">
              {icon}
            </div>
          </div>
          
          {change !== undefined && (
            <div className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
              isPositive 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700',
              'group-hover:shadow-sm'
            )}>
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-1 flex-shrink-0" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1 flex-shrink-0" />
              )}
              {changeValue}%
            </div>
          )}
        </div>
        
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-gray-500 whitespace-normal break-words">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">
            {formatValue(value)}
          </p>
          
          {change !== undefined && (
            <p className="text-xs text-gray-400 mt-1">
              <span className={cn(
                isPositive ? 'text-green-600' : 'text-red-500',
                'font-medium'
              )}>
                {isPositive ? '↑' : '↓'} {changeValue}% 
              </span>
              <span className="text-gray-400">vs last month</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
