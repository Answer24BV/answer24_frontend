import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, BarChart3, FileText, Users, Zap, ArrowRight } from "lucide-react"

export function QuickActionsModern() {
  const actions = [
    {
      icon: <Plus className="h-6 w-6" />,
      title: "Create Campaign",
      description: "Launch new Google Ads campaign",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Keyword Research",
      description: "AI-powered keyword discovery",
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Campaign Audit",
      description: "Comprehensive performance analysis",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Generate Report",
      description: "White-label client reports",
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "hover:from-orange-600 hover:to-orange-700",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Competitor Analysis",
      description: "Track competitor strategies",
      gradient: "from-red-500 to-red-600",
      hoverGradient: "hover:from-red-600 hover:to-red-700",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Auto-Optimize",
      description: "Apply AI recommendations",
      gradient: "from-yellow-500 to-yellow-600",
      hoverGradient: "hover:from-yellow-600 hover:to-yellow-700",
    },
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action, index) => (
            <Button key={index} variant="ghost" className="h-auto p-0 hover:bg-transparent group">
              <div className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} ${action.hoverGradient} transition-all duration-200`}
                >
                  <div className="text-white">{action.icon}</div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
