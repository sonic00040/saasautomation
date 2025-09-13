'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Progress } from "@/components/ui/progress"
import { useRealtimeDashboard } from "@/hooks/use-realtime-dashboard"
import { useToast } from "@/contexts/toast-context"
import { useTour, TourProgress } from "@/components/ui/tour"
import { dashboardTour } from "@/lib/tours"
import { formatDateTime, useClientSide } from "@/lib/utils"
import {
  Bot,
  MessageSquare,
  TrendingUp,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Upload,
  Settings,
  Users,
  Target,
  RefreshCw,
  Wifi,
  WifiOff,
  Play
} from "lucide-react"

export default function DashboardPage() {
  const { metrics, activities, isConnected, refresh, loading, error, dashboardMetrics } = useRealtimeDashboard()
  const { success } = useToast()
  const { startTour, isActive } = useTour()
  const isClient = useClientSide()

  const handleStartTour = () => {
    startTour(dashboardTour)
  }

  // Use real dashboard metrics
  const stats = {
    totalMessages: dashboardMetrics.totalMessages,
    totalBots: dashboardMetrics.activeBots,
    activeConversations: 0, // deprecated
    avgResponseTime: dashboardMetrics.avgResponseTime > 0
      ? `${(dashboardMetrics.avgResponseTime / 1000).toFixed(1)}s`
      : '0.0s',
    successRate: Math.round(dashboardMetrics.successRate),
    messagesThisMonth: dashboardMetrics.messagesThisMonth,
    monthlyLimit: dashboardMetrics.monthlyLimit,
    tokensUsed: dashboardMetrics.tokensUsed,
    planName: dashboardMetrics.planName,
  }

  // Use real activities from the API
  const recentActivity = activities.slice(0, 4).map(activity => ({
    id: activity.id,
    type: activity.type,
    description: activity.description,
    bot: activity.botName || "AI Bot",
    time: formatDateTime(activity.timestamp),
    status: activity.type === 'message' ? 'resolved' :
            activity.type === 'bot_response' ? 'resolved' :
            activity.type === 'user_join' ? 'active' :
            activity.type === 'bot_created' ? 'success' :
            activity.type === 'knowledge_updated' ? 'success' : 'pending'
  }))

  // Check if this is a new user with no data
  const isNewUser = stats.totalBots === 0 && stats.totalMessages === 0

  const quickActions = [
    {
      title: "Create New Bot",
      description: "Set up a new chatbot",
      icon: Plus,
      href: "/dashboard/bots/new",
      color: "bg-blue-500"
    },
    {
      title: "Upload Knowledge",
      description: "Add documents to knowledge base",
      icon: Upload,
      href: "/dashboard/knowledge",
      color: "bg-green-500"
    },
    {
      title: "View Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      color: "bg-purple-500"
    },
    {
      title: "Bot Settings",
      description: "Configure bot behavior",
      icon: Settings,
      href: "/dashboard/settings",
      color: "bg-orange-500"
    },
  ]

  const usagePercentage = stats.monthlyLimit > 0 ? (stats.tokensUsed / stats.monthlyLimit) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TourProgress />

      {/* Enhanced Page Header with Real-time Status */}
      <div className="pb-4 border-b border-gray-200" data-tour="dashboard-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back! Here&apos;s what&apos;s happening with your chatbots.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Real-time Connection Status */}
            <div className="flex items-center space-x-2" data-tour="realtime-status">
              {isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Live</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <WifiOff className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Offline</span>
                </>
              )}
            </div>

            {/* Tour Button */}
            {!isActive && (
              <Button
                onClick={handleStartTour}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Tour</span>
              </Button>
            )}

            {/* Refresh Button */}
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Last Updated Timestamp */}
        {metrics.lastUpdated && isClient && (
          <p className="mt-2 text-xs text-gray-500">
            Last updated: {formatDateTime(metrics.lastUpdated)}
          </p>
        )}
      </div>

      {/* Enhanced Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" data-tour="stats-cards">
        <StatCard
          title="Total Messages"
          value={stats.totalMessages}
          subtitle={isNewUser ? "Get started by creating a bot" : "This month"}
          icon={MessageSquare}
          trend={stats.totalMessages > 0 ? { value: "Messages processed", type: "positive" } : undefined}
          variant="gradient"
          color="blue"
          animated
        />

        <StatCard
          title="Active Bots"
          value={stats.totalBots}
          subtitle={isNewUser ? "No bots configured yet" : stats.totalBots === 1 ? "1 bot configured" : `${stats.totalBots} bots configured`}
          icon={Bot}
          variant="colored"
          color={stats.totalBots > 0 ? "green" : "blue"}
        />

        <StatCard
          title="Success Rate"
          value={stats.totalMessages > 0 ? `${stats.successRate}%` : "N/A"}
          subtitle={isNewUser ? "No data available yet" : "Resolution accuracy"}
          icon={Target}
          trend={stats.successRate > 0 ? { value: "Performance tracking", type: "positive" } : undefined}
          variant="gradient"
          color="purple"
        />

        <StatCard
          title="Response Time"
          value={stats.avgResponseTime}
          subtitle={isNewUser ? "No responses yet" : "Average response"}
          icon={Clock}
          trend={stats.totalMessages > 0 ? { value: "Response speed", type: "positive" } : undefined}
          variant="colored"
          color="orange"
        />
      </div>

      {/* Usage & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Usage Card */}
        <Card variant="gradient" data-tour="usage-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Monthly Usage ({stats.planName})
                </CardTitle>
                <CardDescription>
                  Token consumption and limits
                </CardDescription>
              </div>
              <Badge 
                variant={usagePercentage > 80 ? "warning" : usagePercentage > 60 ? "info" : "success"}
                size="lg"
              >
                {Math.round(usagePercentage)}% used
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">
                {stats.tokensUsed.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                of {stats.monthlyLimit.toLocaleString()} tokens
              </p>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={usagePercentage} 
                variant={usagePercentage > 80 ? "danger" : usagePercentage > 60 ? "warning" : "success"}
                size="lg"
                animated
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{stats.monthlyLimit.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {(stats.monthlyLimit - stats.tokensUsed).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Remaining tokens</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardMetrics.subscriptionEndDate
                    ? Math.max(0, Math.ceil((new Date(dashboardMetrics.subscriptionEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                    : 30
                  }
                </p>
                <p className="text-xs text-gray-500">Days to reset</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card variant="elevated" data-tour="quick-actions">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks to get things done faster
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={action.title}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <a href={action.href} className="block p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300" />
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activity Timeline */}
      <Card variant="glass" data-tour="activity-feed">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest events and updates from your chatbots
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Once you create and configure bots, their activity will appear here.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button size="sm" asChild>
                    <a href="/dashboard/bots/new">Create Bot</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/knowledge">Add Knowledge</a>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-green-200 to-gray-200"></div>

                <div className="space-y-6">
                  {recentActivity.map((activity, index) => {
                const StatusIcon = activity.status === 'resolved' ? CheckCircle :
                                 activity.status === 'success' ? CheckCircle :
                                 activity.status === 'active' ? Activity :
                                 AlertCircle

                const iconBgColor = activity.status === 'resolved' ? 'bg-green-100' :
                                  activity.status === 'success' ? 'bg-green-100' :
                                  activity.status === 'active' ? 'bg-blue-100' :
                                  'bg-yellow-100'

                const iconColor = activity.status === 'resolved' ? 'text-green-600' :
                                activity.status === 'success' ? 'text-green-600' :
                                activity.status === 'active' ? 'text-blue-600' :
                                'text-yellow-600'

                return (
                  <div key={activity.id} className="relative flex items-start group">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shadow-sm ${iconBgColor}`}>
                      <StatusIcon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="ml-4 flex-1 min-w-0 bg-white rounded-xl border border-gray-100 p-4 group-hover:shadow-md group-hover:border-gray-200 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="font-medium text-gray-700">{activity.bot}</span>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            activity.status === 'resolved' ? 'success' :
                            activity.status === 'success' ? 'success' :
                            activity.status === 'active' ? 'info' :
                            'warning'
                          }
                          size="sm"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
                  })}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}