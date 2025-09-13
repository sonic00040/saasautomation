'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UsageForecastCard } from "@/components/analytics/usage-forecast-card"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Clock,
  MessageSquare,
  Users,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface AnalyticsData {
  totalMessages: number
  successfulResponses: number
  averageResponseTime: number
  activeUsers: number
  topQuestions: Array<{
    question: string
    count: number
    successRate: number
  }>
  hourlyData: Array<{
    hour: string
    messages: number
    responses: number
  }>
  dailyData: Array<{
    date: string
    messages: number
    users: number
    successRate: number
  }>
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'messages' | 'users' | 'success'>('messages')

  // Mock analytics data - in real app this would come from API
  const analyticsData: AnalyticsData = {
    totalMessages: 12467,
    successfulResponses: 11742,
    averageResponseTime: 1250,
    activeUsers: 892,
    topQuestions: [
      { question: "What are your business hours?", count: 245, successRate: 98 },
      { question: "How do I reset my password?", count: 189, successRate: 94 },
      { question: "Can you help with billing?", count: 156, successRate: 92 },
      { question: "Where is my order?", count: 134, successRate: 89 },
      { question: "How do I cancel my subscription?", count: 98, successRate: 95 }
    ],
    hourlyData: [
      { hour: "00:00", messages: 23, responses: 22 },
      { hour: "01:00", messages: 18, responses: 17 },
      { hour: "02:00", messages: 12, responses: 11 },
      { hour: "03:00", messages: 8, responses: 8 },
      { hour: "04:00", messages: 15, responses: 14 },
      { hour: "05:00", messages: 28, responses: 26 },
      { hour: "06:00", messages: 45, responses: 43 },
      { hour: "07:00", messages: 78, responses: 75 },
      { hour: "08:00", messages: 124, responses: 118 },
      { hour: "09:00", messages: 167, responses: 159 },
      { hour: "10:00", messages: 198, responses: 189 },
      { hour: "11:00", messages: 234, responses: 223 },
      { hour: "12:00", messages: 267, responses: 252 },
      { hour: "13:00", messages: 245, responses: 234 },
      { hour: "14:00", messages: 289, responses: 275 },
      { hour: "15:00", messages: 312, responses: 298 },
      { hour: "16:00", messages: 298, responses: 284 },
      { hour: "17:00", messages: 267, responses: 251 },
      { hour: "18:00", messages: 189, responses: 179 },
      { hour: "19:00", messages: 134, responses: 127 },
      { hour: "20:00", messages: 98, responses: 93 },
      { hour: "21:00", messages: 67, responses: 64 },
      { hour: "22:00", messages: 45, responses: 43 },
      { hour: "23:00", messages: 32, responses: 30 }
    ],
    dailyData: [
      { date: "2025-01-06", messages: 456, users: 123, successRate: 94.2 },
      { date: "2025-01-07", messages: 523, users: 145, successRate: 95.1 },
      { date: "2025-01-08", messages: 489, users: 134, successRate: 93.8 },
      { date: "2025-01-09", messages: 612, users: 167, successRate: 96.3 },
      { date: "2025-01-10", messages: 578, users: 156, successRate: 94.7 },
      { date: "2025-01-11", messages: 634, users: 189, successRate: 95.8 },
      { date: "2025-01-12", messages: 567, users: 178, successRate: 93.9 }
    ]
  }

  const successRate = (analyticsData.successfulResponses / analyticsData.totalMessages) * 100
  const maxHourlyMessages = Math.max(...analyticsData.hourlyData.map(d => d.messages))

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days'
      case '30d': return 'Last 30 days'
      case '90d': return 'Last 90 days'
      default: return 'Last 30 days'
    }
  }

  const exportData = () => {
    const exportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalMessages: analyticsData.totalMessages,
        successfulResponses: analyticsData.successfulResponses,
        successRate: successRate.toFixed(2),
        averageResponseTime: analyticsData.averageResponseTime,
        activeUsers: analyticsData.activeUsers
      },
      topQuestions: analyticsData.topQuestions,
      hourlyData: analyticsData.hourlyData,
      dailyData: analyticsData.dailyData
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with dark theme matching screenshot */}
      <div className="bg-slate-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-yellow-400" />
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-slate-300">
              Monitor your chatbot performance and user interactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={exportData}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Messages</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {analyticsData.totalMessages.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.3%</span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {successRate.toFixed(1)}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.1%</span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {(analyticsData.averageResponseTime / 1000).toFixed(1)}s
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">-0.3s</span>
                  <span className="text-xs text-slate-500">improvement</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Users</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {analyticsData.activeUsers.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.7%</span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Hourly Activity
            </CardTitle>
            <CardDescription>
              Message volume throughout the day ({getTimeRangeLabel(timeRange)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.hourlyData.map((data, index) => {
                const percentage = (data.messages / maxHourlyMessages) * 100
                return (
                  <div key={data.hour} className="flex items-center gap-3">
                    <div className="w-12 text-xs text-slate-600 font-mono">
                      {data.hour}
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-700">
                          {data.messages}
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-xs text-slate-500 text-right">
                      {((data.responses / data.messages) * 100).toFixed(0)}%
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Top Questions
            </CardTitle>
            <CardDescription>
              Most frequently asked questions ({getTimeRangeLabel(timeRange)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topQuestions.map((question, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 flex-shrink-0">
                    <span className="text-sm font-semibold text-slate-700">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                      {question.question}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {question.count} times
                      </span>
                      <span className="flex items-center gap-1">
                        {question.successRate >= 95 ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : question.successRate >= 90 ? (
                          <Target className="h-3 w-3 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-3 w-3 text-red-600" />
                        )}
                        {question.successRate}% success
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Daily Trends
              </CardTitle>
              <CardDescription>
                Performance metrics over time ({getTimeRangeLabel(timeRange)})
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedMetric === 'messages' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('messages')}
              >
                Messages
              </Button>
              <Button
                variant={selectedMetric === 'users' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('users')}
              >
                Users
              </Button>
              <Button
                variant={selectedMetric === 'success' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('success')}
              >
                Success Rate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-2 pt-4">
            {analyticsData.dailyData.map((data, index) => {
              let value: number
              let maxValue: number
              let color: string

              switch (selectedMetric) {
                case 'users':
                  value = data.users
                  maxValue = Math.max(...analyticsData.dailyData.map(d => d.users))
                  color = 'from-purple-500 to-purple-600'
                  break
                case 'success':
                  value = data.successRate
                  maxValue = 100
                  color = 'from-green-500 to-green-600'
                  break
                default:
                  value = data.messages
                  maxValue = Math.max(...analyticsData.dailyData.map(d => d.messages))
                  color = 'from-blue-500 to-blue-600'
                  break
              }

              const height = (value / maxValue) * 100

              return (
                <div key={data.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative group">
                    <div 
                      className={`w-full bg-gradient-to-t ${color} rounded-t-md transition-all duration-300 hover:opacity-80`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {selectedMetric === 'success' ? `${value}%` : value.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 rotate-45 origin-bottom-left">
                    {new Date(data.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">Key Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Peak Activity</p>
                <p className="font-medium text-slate-900">2:00 PM - 4:00 PM</p>
              </div>
              <div>
                <p className="text-slate-600">Best Day</p>
                <p className="font-medium text-slate-900">
                  {analyticsData.dailyData.reduce((best, current) => 
                    current.successRate > best.successRate ? current : best
                  ).date.split('-').slice(1).join('/')}
                </p>
              </div>
              <div>
                <p className="text-slate-600">Growth Trend</p>
                <p className="font-medium text-green-600">+12.3% this period</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Forecasting Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Usage Forecasting</h2>
            <p className="text-sm text-gray-600">
              Predictive analysis and recommendations based on usage patterns
            </p>
          </div>
        </div>

        <UsageForecastCard />
      </div>
    </div>
  )
}