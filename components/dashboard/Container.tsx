"use client"

import { useState, useEffect } from "react"
import type { Campaign, OptimizationTip, DashboardStats, ChartData, PerformanceData } from "@/types/dashboard"
import {
  getDashboardStats,
  getCampaigns,
  getOptimizationTips,
  getChartData,
  getPerformanceData,
} from "@/app/[locale]/actions/dashboard"
import { SimpleStatsCard } from "./StatsCard"
import { CompactCampaigns } from "./CompactCampaign"
import { CompactAiTips } from "./AITips"
import { QuickActionsGrid } from "./QuickActionGrid"
import { DollarSign, MousePointer, Eye, Target } from "lucide-react"
import { LineChart } from "./chart/LinkChart"
import { DonutChart } from "./chart/DonutChart"
import { QuickActionsModern } from "./QuickActionModern"
import { AiTipsModern } from "./AITipsModern"
import { useTranslations } from "next-intl"
import { CampaignTabs } from "./CampaignTabs"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { tokenUtils } from "@/utils/auth"
// import NotificationTest from "@/components/common/NotificationTest"

export function CleanDashboardContainer() {
  const [activeCampaignTab, setActiveCampaignTab] = useState<'all' | 'active' | 'paused' | 'draft'>('active');
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [tips, setTips] = useState<OptimizationTip[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize push notifications
  const user = tokenUtils.getUser()
  const { sendTestNotification } = usePushNotifications(user?.id)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [statsData, campaignsData, tipsData, chartDataRes, performanceDataRes] = await Promise.all([
          getDashboardStats(),
          getCampaigns(),
          getOptimizationTips(),
          getChartData(),
          getPerformanceData(),
        ])

        // Ensure all data is valid before setting state
        if (!statsData || !campaignsData || !tipsData || !chartDataRes || !performanceDataRes) {
          throw new Error('Failed to load dashboard data: Invalid response from server')
        }

        setStats(statsData)
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : [])
        setTips(Array.isArray(tipsData) ? tipsData : [])
        setChartData(Array.isArray(chartDataRes) ? chartDataRes : [])
        setPerformanceData(Array.isArray(performanceDataRes) ? performanceDataRes : [])
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const t = useTranslations("Dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-lg font-medium text-red-800">Error Loading Dashboard</h2>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Transform data for charts
  const weeklyLineData = chartData.map((item) => ({
    name: item.name,
    value: item.clicks,
  }))

  const campaignDonutData = campaigns.map((campaign, index) => ({
    name: campaign.name,
    value: campaign.spent,
    color: index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : "#f59e0b",
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 mt-1">{t('subtitle')}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SimpleStatsCard
              title={t('stats.totalSpend')}
              value={stats.totalSpend}
              change={stats.spendChange}
              format="currency"
              icon={<DollarSign className="h-5 w-5" />}
              colorIndex={0}
            />
            <SimpleStatsCard
              title={t('stats.totalClicks')}
              value={stats.totalClicks}
              change={stats.clicksChange}
              format="number"
              icon={<MousePointer className="h-5 w-5" />}
              colorIndex={1}
            />
            <SimpleStatsCard
              title={t('stats.totalImpressions')}
              value={stats.totalImpressions}
              change={stats.averageCTR}
              format="number"
              icon={<Eye className="h-5 w-5" />}
              colorIndex={2}
            />
            <SimpleStatsCard
              title="CTR"
              value={stats.averageCTR}
              change={stats.averageCTR}
              format="percentage"
              icon={<Target className="h-5 w-5" />}
              colorIndex={3}
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100  shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4 px-6 py-4">Weekly Clicks Trend</h3>
              <LineChart title="" data={weeklyLineData} color="#3b82f6" />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Spend Distribution</h3>
              <DonutChart title="" data={campaignDonutData} />
          </div>
        </div>

        {/* Main Content Grid - Compact Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Campaigns and Tips */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 pb-0">
                <h3 className="text-lg font-medium text-gray-900">Campaigns</h3>
                <CampaignTabs 
                  activeTab={activeCampaignTab} 
                  onTabChange={setActiveCampaignTab} 
                  className="mt-4"
                />
              </div>
                <CompactCampaigns campaigns={campaigns} />
            </div>
            <div className="bg-white rounded-xl border border-gray-100  shadow-sm">
              <AiTipsModern tips={tips} />
            </div>
          </div>
          
          {/* Right Column - Quick Actions */}
          <div className="space-y-4">
            <QuickActionsModern />
            {/* <NotificationTest /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
