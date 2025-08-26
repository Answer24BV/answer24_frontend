"use client";

import { useState, useEffect } from "react";
import type {
  Campaign,
  OptimizationTip,
  DashboardStats,
  ChartData,
  PerformanceData,
} from "@/types/dashboard";
import {
  getDashboardStats,
  getCampaigns,
  getOptimizationTips,
  getChartData,
  getPerformanceData,
} from "@/app/[locale]/actions/dashboard";
import { SimpleStatsCard } from "./StatsCard";
import { CompactCampaigns } from "./CompactCampaign";
import { CompactAiTips } from "./AITips";
import { QuickActionsGrid } from "./QuickActionGrid";
import { DollarSign, MousePointer, Eye, Target } from "lucide-react";
import { LineChart } from "./chart/LinkChart";
import { DonutChart } from "./chart/DonutChart";
import { QuickActionsModern } from "./QuickActionModern";
import { AiTipsModern } from "./AITipsModern";
import { useTranslations } from "next-intl";
import { CampaignTabs } from "./CampaignTabs";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { tokenUtils } from "@/utils/auth";

export function CleanDashboardContainer() {
  const [activeCampaignTab, setActiveCampaignTab] = useState<
    "all" | "active" | "paused" | "draft"
  >("active");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tips, setTips] = useState<OptimizationTip[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpisData, setKpisData] = useState<{
    revenue?: { value: number; growth: number };
    visitors?: { value: number; growth: number };
    impressions?: { value: number; growth: number };
    ctr?: { value: number; growth: number };
  } | null>(null);

  // Initialize push notifications
  const user = tokenUtils.getUser();
  const { sendTestNotification } = usePushNotifications(user?.id);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = tokenUtils.getToken();
        setIsLoading(true);
        setError(null);

        try {
          const response = await fetch(
            "https://answer24.laravel.cloud/api/v1/dashboard",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(
            "Dashboard details API response status:",
            response.status
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Dashboard details API response:", data);
            const kpis = data.kpis;
            setKpisData(kpis);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error(
              "Failed to fetch Dashboard details",
              response.status,
              errorData
            );
          }
        } catch (err) {
          console.log("Error fetching Dashboard details:", err);
        } finally {
          setIsPageLoading(false);
        }

        // Load dashboard data
        const [
          statsData,
          campaignsData,
          tipsData,
          chartDataRes,
          performanceDataRes,
        ] = await Promise.all([
          getDashboardStats(),
          getCampaigns(),
          getOptimizationTips(),
          getChartData(),
          getPerformanceData(),
        ]);

        // Ensure all data is valid before setting state
        if (
          !statsData ||
          !campaignsData ||
          !tipsData ||
          !chartDataRes ||
          !performanceDataRes
        ) {
          throw new Error(
            "Failed to load dashboard data: Invalid response from server"
          );
        }

        setStats(statsData);
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        setTips(Array.isArray(tipsData) ? tipsData : []);
        setChartData(Array.isArray(chartDataRes) ? chartDataRes : []);
        setPerformanceData(
          Array.isArray(performanceDataRes) ? performanceDataRes : []
        );
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const t = useTranslations("Dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 border-2 border-slate-200 rounded-2xl bg-white/70 backdrop-blur-sm">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-slate-200 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="border-2 border-red-200 rounded-2xl p-8 max-w-md w-full bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-50">
              <span className="text-2xl text-red-500">⚠</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Error Loading Dashboard
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 font-medium hover:scale-105"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const weeklyLineData = chartData.map((item) => ({
    name: item.name,
    value: item.clicks,
  }));

  const campaignDonutData = campaigns.map((campaign, index) => ({
    name: campaign.name,
    value: campaign.spent,
    color: index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : "#f59e0b",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Outer Container Border */}
        <div className="border-2 border-slate-200 rounded-3xl bg-white/60 backdrop-blur-sm shadow-sm">
          <div className="p-8">
            {/* Header Section */}
            <div className="mb-8 pb-6 border-b-2 border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    {t("title")}
                  </h1>
                  <p className="text-slate-500 text-lg">{t("subtitle")}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards Section */}
            {stats && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-700">
                    Key Metrics
                  </h2>
                  <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <SimpleStatsCard
                    title={"Revenue"}
                    value={kpisData?.revenue?.value ?? 0}
                    change={kpisData?.revenue?.growth ?? 0}
                    format="currency"
                    icon={<DollarSign className="h-5 w-5" />}
                    colorIndex={0}
                  />
                  <SimpleStatsCard
                    title={" Total Visitors"}
                    value={kpisData?.visitors?.value ?? 0}
                    change={kpisData?.visitors?.growth ?? 0}
                    format="number"
                    icon={<MousePointer className="h-5 w-5" />}
                    colorIndex={1}
                  />
                  <SimpleStatsCard
                    title={t("stats.totalImpressions")}
                    value={kpisData?.impressions?.value ?? 0}
                    change={kpisData?.impressions?.growth ?? 0}
                    format="number"
                    icon={<Eye className="h-5 w-5" />}
                    colorIndex={2}
                  />
                  <SimpleStatsCard
                    title="CTR"
                    value={kpisData?.ctr?.value ?? 0}
                    change={kpisData?.ctr?.growth ?? 0}
                    format="percentage"
                    icon={<Target className="h-5 w-5" />}
                    colorIndex={3}
                  />
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-700">
                  Analytics Overview
                </h2>
                <div className="h-0.5 flex-1 mx-4 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-medium text-slate-800">
                      Weekly Clicks Trend
                    </h3>
                  </div>
                  <div className="p-6 pt-4">
                    <LineChart title="" data={weeklyLineData} color="#3b82f6" />
                  </div>
                </div>
                <div className="border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-medium text-slate-800">
                      Campaign Spend Distribution
                    </h3>
                  </div>
                  <div className="p-6 pt-4">
                    <DonutChart title="" data={campaignDonutData} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Campaigns and Tips */}
              <div className="lg:col-span-2 space-y-6">
                {/* Campaigns Section */}
                <div className="border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">
                      Campaigns
                    </h3>
                    <CampaignTabs
                      activeTab={activeCampaignTab}
                      onTabChange={setActiveCampaignTab}
                    />
                  </div>
                  <div className="p-0">
                    <CompactCampaigns campaigns={campaigns} />
                  </div>
                </div>

                {/* AI Tips Section */}
                <div className="border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-medium text-slate-800">
                      AI Optimization Tips
                    </h3>
                  </div>
                  <div className="p-6 pt-4">
                    <AiTipsModern tips={tips} />
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Actions */}
              <div className="space-y-6">
                <div className="border-2 border-slate-200 rounded-2xl bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-medium text-slate-800">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="p-6 pt-4">
                    <QuickActionsModern />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
