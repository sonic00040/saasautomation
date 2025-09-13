'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useUsageForecasting } from '@/hooks/use-usage-forecasting'
import { formatChartDate, formatNumber } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react'

export function UsageForecastCard() {
  const { forecast, loading, refreshData } = useUsageForecasting()

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex items-center space-x-2 text-gray-500">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Analyzing usage patterns...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!forecast) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Not enough data for forecasting</p>
            <Button onClick={refreshData} variant="outline" size="sm" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = () => {
    switch (forecast.nextPeriod.trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4" />
      case 'decreasing': return <TrendingDown className="h-4 w-4" />
      default: return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (forecast.nextPeriod.trend) {
      case 'increasing': return 'text-blue-600'
      case 'decreasing': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskIcon = () => {
    switch (forecast.riskLevel) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-amber-600" />
      default: return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getRiskColor = () => {
    switch (forecast.riskLevel) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-amber-200 bg-amber-50'
      default: return 'border-green-200 bg-green-50'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Usage Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Usage Forecast</span>
              </CardTitle>
              <CardDescription>
                Predictive analysis of your message consumption patterns
              </CardDescription>
            </div>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Usage Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast.forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => formatChartDate(date)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(date) => formatChartDate(date)}
                  formatter={(value, name) => [
                    `${value} messages`,
                    name === 'predicted' ? 'Usage' : name
                  ]}
                />

                {/* Historical data */}
                <Line
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={(props: any) => {
                    if (props.payload && props.payload.type === 'historical') {
                      return <circle key={`historical-${props.index || props.payload.date}`} cx={props.cx} cy={props.cy} r={3} fill="#3b82f6" />
                    }
                    return null
                  }}
                  connectNulls={false}
                />

                {/* Forecast data */}
                <Line
                  dataKey={(entry) => entry.type === 'forecast' ? entry.predicted : null}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={(props: any) => {
                    if (props.payload && props.payload.type === 'forecast') {
                      return <circle key={`forecast-${props.index || props.payload.date}`} cx={props.cx} cy={props.cy} r={3} fill="#10b981" />
                    }
                    return null
                  }}
                />

                {/* Today line */}
                <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="#6b7280" strokeDasharray="2 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-600"></div>
              <span className="text-gray-600">Historical Usage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-green-600 border-dashed"></div>
              <span className="text-gray-600">Predicted Usage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-gray-600"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Summary */}
      <div className="space-y-6">
        {/* Current Period Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Current Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(forecast.currentPeriod.used)}
              </div>
              <div className="text-sm text-gray-500">
                of {formatNumber(forecast.currentPeriod.limit)} messages
              </div>
            </div>

            <Progress
              value={forecast.currentPeriod.percentageUsed}
              variant={forecast.riskLevel === 'high' ? 'danger' :
                      forecast.riskLevel === 'medium' ? 'warning' : 'success'}
              className="h-2"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>{forecast.currentPeriod.percentageUsed}% used</span>
              <span>{formatNumber(forecast.currentPeriod.remaining)} remaining</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Period Prediction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Next Period Prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {formatNumber(forecast.nextPeriod.predicted)}
                </div>
                <div className="text-sm text-gray-500">predicted messages</div>
              </div>
              <Badge
                variant="secondary"
                className={`${getTrendColor()} bg-gray-50 border`}
              >
                {getTrendIcon()}
                <span className="ml-1 capitalize">{forecast.nextPeriod.trend}</span>
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">Confidence:</div>
              <div className="flex-1">
                <Progress value={forecast.nextPeriod.confidence} className="h-1" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {forecast.nextPeriod.confidence}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className={`border ${getRiskColor()}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              {getRiskIcon()}
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant="secondary"
              className={`mb-3 ${
                forecast.riskLevel === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                forecast.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-green-100 text-green-800 border-green-200'
              }`}
            >
              {forecast.riskLevel.toUpperCase()} RISK
            </Badge>

            <div className="space-y-2">
              {forecast.recommendations.map((recommendation, index) => (
                <div key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                  <span>{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}