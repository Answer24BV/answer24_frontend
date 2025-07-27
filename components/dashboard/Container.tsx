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

export function CleanDashboardContainer() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [tips, setTips] = useState<OptimizationTip[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, campaignsData, tipsData, chartDataRes, performanceDataRes] = await Promise.all([
          getDashboardStats(),
          getCampaigns(),
          getOptimizationTips(),
          getChartData(),
          getPerformanceData(),
        ])

        setStats(statsData)
        setCampaigns(campaignsData)
        setTips(tipsData)
        setChartData(chartDataRes)
        setPerformanceData(performanceDataRes)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
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
      <div className="max-w-7xl mx-auto py-26 px-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SimpleStatsCard
              title={t('stats.totalSpend')}
              value={stats.totalSpend}
              change={stats.spendChange}
              format="currency"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <SimpleStatsCard
              title={t('stats.totalClicks')}
              value={stats.totalClicks}
              change={stats.clicksChange}
              format="number"
              icon={<MousePointer className="h-5 w-5" />}
            />
            <SimpleStatsCard
              title={t('stats.totalImpressions')}
              value={stats.totalImpressions}
              change={stats.averageCTR}
              format="number"
              icon={<Eye className="h-5 w-5" />}
            />
            <SimpleStatsCard
              title="CTR"
              value={stats.averageCTR}
              change={stats.averageCTR}
              format="percentage"
              icon={<Target className="h-5 w-5" />}
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart title="Weekly Clicks Trend" data={weeklyLineData} color="#3b82f6" />
          <DonutChart title="Campaign Spend Distribution" data={campaignDonutData} />
        </div>

        {/* Main Content Grid - Compact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaigns - Compact Table */}
          <div className="lg:col-span-2">
            <CompactCampaigns campaigns={campaigns} />
            <AiTipsModern tips={tips} />
          </div>
          {/* AI Tips */}
            
          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {/* <QuickActionsGrid /> */}
            <QuickActionsModern />

            {/* AI Tips - Compact */}
            {/* <CompactAiTips tips={tips} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}
