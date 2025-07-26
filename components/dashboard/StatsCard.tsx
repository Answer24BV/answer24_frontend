import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SimpleStatsCardProps {
  title: string
  value: string | number
  change?: number
  format?: "currency" | "percentage" | "number"
  icon?: React.ReactNode
}

export function SimpleStatsCard({ title, value, change, format = "number", icon }: SimpleStatsCardProps) {
  const formatValue = (val: string | number) => {
    if (format === "currency") {
      return `$${typeof val === "number" ? val.toLocaleString() : val}`
    }
    if (format === "percentage") {
      return `${val}%`
    }
    return typeof val === "number" ? val.toLocaleString() : val
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-blue-600">{icon}</div>
          </div>
          {change !== undefined && (
            <div className="flex items-center text-sm">
              {change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={cn("font-medium", change > 0 ? "text-green-600" : "text-red-500")}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          {change !== undefined && <p className="text-xs text-gray-500">vs last month</p>}
        </div>
      </CardContent>
    </Card>
  )
}
