import type { OptimizationTip } from "@/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, DollarSign, FileText, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface AiTipsModernProps {
  tips: OptimizationTip[]
}

export function AiTipsModern({ tips }: AiTipsModernProps) {
  const getTipConfig = (type: OptimizationTip["type"]) => {
    switch (type) {
      case "keyword":
        return {
          icon: <Target className="h-5 w-5" />,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        }
      case "bid":
        return {
          icon: <DollarSign className="h-5 w-5" />,
          bgColor: "bg-emerald-50",
          iconColor: "text-emerald-600",
        }
      case "budget":
        return {
          icon: <DollarSign className="h-5 w-5" />,
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
        }
      case "ad":
        return {
          icon: <FileText className="h-5 w-5" />,
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
        }
    }
  }

  const getImpactColor = (impact: OptimizationTip["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
    }
  }

  return (
    <Card className="border-0 shadow-lg mt-2">
      <CardHeader className="">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          AI Optimization Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 grid grid-cols-2 gap-2">
          {tips.map((tip) => {
            const config = getTipConfig(tip.type)
            return (
              <div
                key={tip.id}
                className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl", config.bgColor)}>
                    <div className={config.iconColor}>{config.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tip.title}
                      </h4>
                      <Badge className={cn("text-xs font-medium border", getImpactColor(tip.impact))}>
                        {tip.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                    {tip.estimatedSavings && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 text-emerald-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm font-semibold">${tip.estimatedSavings} potential savings</span>
                        </div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
