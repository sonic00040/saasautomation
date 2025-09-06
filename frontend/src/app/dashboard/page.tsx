'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/ui/stat-card"
import { Progress } from "@/components/ui/progress"
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
  Target
} from "lucide-react"

export default function DashboardPage() {
  // Mock data - in real app this would come from API
  const stats = {
    totalMessages: 1247,
    totalBots: 2,
    activeConversations: 23,
    avgResponseTime: "1.2s",
    successRate: 94,
    messagesThisMonth: 892,
    monthlyLimit: 1000,
  }

  const recentActivity = [
    {
      id: 1,
      type: "message",
      description: "Customer inquiry about pricing",
      bot: "Support Bot",
      time: "2 minutes ago",
      status: "resolved"
    },
    {
      id: 2,
      type: "bot",
      description: "Knowledge base updated",
      bot: "Sales Bot",
      time: "1 hour ago",
      status: "success"
    },
    {
      id: 3,
      type: "conversation",
      description: "New conversation started",
      bot: "Support Bot",
      time: "2 hours ago",
      status: "active"
    },
    {
      id: 4,
      type: "message",
      description: "Customer feedback received",
      bot: "Feedback Bot",
      time: "3 hours ago",
      status: "pending"
    },
  ]

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

  const usagePercentage = (stats.messagesThisMonth / stats.monthlyLimit) * 100

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening with your chatbots.
        </p>
      </div>

      {/* Enhanced Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={stats.totalMessages}
          subtitle="This month"
          icon={MessageSquare}
          trend={{ value: "+12% from last month", type: "positive" }}
          variant="gradient"
          color="blue"
          animated
        />

        <StatCard
          title="Active Bots"
          value={stats.totalBots}
          subtitle="All systems operational"
          icon={Bot}
          variant="colored"
          color="green"
        />

        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Resolution accuracy"
          icon={Target}
          trend={{ value: "+2% from last week", type: "positive" }}
          variant="gradient"
          color="purple"
        />

        <StatCard
          title="Response Time"
          value={stats.avgResponseTime}
          subtitle="Average response"
          icon={Clock}
          trend={{ value: "-0.3s improvement", type: "positive" }}
          variant="colored"
          color="orange"
        />
      </div>

      {/* Usage & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Usage Card */}
        <Card variant="gradient">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Monthly Usage
                </CardTitle>
                <CardDescription>
                  Current plan usage and limits
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
                {stats.messagesThisMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                of {stats.monthlyLimit.toLocaleString()} messages
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
                  {(stats.monthlyLimit - stats.messagesThisMonth).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-500">Days to reset</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card variant="elevated">
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
      <Card variant="glass">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}