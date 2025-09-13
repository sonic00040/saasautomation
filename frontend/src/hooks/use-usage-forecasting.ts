'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface UsageData {
  date: string
  messages: number
  tokens: number
  cost: number
}

interface ForecastPoint {
  date: string
  predicted: number
  confidence: number
  type: 'historical' | 'forecast'
}

interface UsageForecast {
  currentPeriod: {
    used: number
    remaining: number
    limit: number
    percentageUsed: number
  }
  nextPeriod: {
    predicted: number
    confidence: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  forecastData: ForecastPoint[]
}

export function useUsageForecasting() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [historicalData, setHistoricalData] = useState<UsageData[]>([])

  // Generate mock historical data (in a real app, this would come from your API)
  const generateMockData = useMemo(() => {
    const data: UsageData[] = []
    const now = new Date()
    const tokensPerMessage = 150 // Average tokens per message
    const costPerToken = 0.002 // Cost per 1k tokens

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Simulate realistic usage patterns
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isBusinessDay = !isWeekend

      // Base usage with trends and seasonality
      let baseMessages = 25

      // Add weekly pattern (higher on business days)
      if (isBusinessDay) {
        baseMessages += 15
      }

      // Add growth trend
      baseMessages += Math.floor((30 - i) * 0.5)

      // Add some randomness
      const messages = Math.max(0, Math.floor(baseMessages + (Math.random() - 0.5) * 20))
      const tokens = messages * tokensPerMessage
      const cost = (tokens / 1000) * costPerToken

      data.push({
        date: date.toISOString().split('T')[0],
        messages,
        tokens,
        cost
      })
    }

    return data
  }, [])

  // Load historical data
  useEffect(() => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      setHistoricalData(generateMockData)
      setLoading(false)
    }, 1000)
  }, [generateMockData, user])

  // Calculate linear regression for trend prediction
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return { slope: 0, intercept: 0 }

    const n = data.length
    const x = Array.from({length: n}, (_, i) => i)
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = data.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((acc, xi, i) => acc + xi * data[i], 0)
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    return { slope, intercept }
  }

  // Calculate moving average for smoothing
  const calculateMovingAverage = (data: number[], window: number = 7) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - window + 1)
      const slice = data.slice(start, index + 1)
      return slice.reduce((sum, val) => sum + val, 0) / slice.length
    })
  }

  // Generate forecast
  const forecast = useMemo((): UsageForecast | null => {
    if (loading || historicalData.length === 0) return null

    const messages = historicalData.map(d => d.messages)
    const recentData = messages.slice(-14) // Last 2 weeks
    const trend = calculateTrend(recentData)
    const movingAvg = calculateMovingAverage(messages, 7)

    // Current period calculations
    const monthlyLimit = 1000
    const currentUsed = messages.reduce((sum, val) => sum + val, 0)
    const remaining = Math.max(0, monthlyLimit - currentUsed)
    const percentageUsed = (currentUsed / monthlyLimit) * 100

    // Next period prediction
    const lastValue = recentData[recentData.length - 1]
    const predictedDaily = Math.max(0, lastValue + trend.slope)
    const nextPeriodPrediction = predictedDaily * 30 // Next 30 days

    // Calculate confidence based on trend consistency
    const variance = recentData.reduce((sum, val) => {
      const expectedVal = trend.intercept + trend.slope * recentData.indexOf(val)
      return sum + Math.pow(val - expectedVal, 2)
    }, 0) / recentData.length

    const confidence = Math.max(0.1, Math.min(1, 1 - (variance / (lastValue * lastValue))))

    // Determine trend direction
    const trendDirection = Math.abs(trend.slope) < 0.1 ? 'stable' :
                          trend.slope > 0 ? 'increasing' : 'decreasing'

    // Risk assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (percentageUsed > 80) riskLevel = 'high'
    else if (percentageUsed > 60) riskLevel = 'medium'

    // Generate recommendations
    const recommendations: string[] = []

    if (percentageUsed > 80) {
      recommendations.push('Consider upgrading your plan - you\'re approaching your limit')
    }

    if (trendDirection === 'increasing' && trend.slope > 2) {
      recommendations.push('Usage is increasing rapidly - monitor daily consumption')
    }

    if (nextPeriodPrediction > monthlyLimit) {
      recommendations.push('Predicted usage exceeds current plan limit for next period')
    }

    if (trendDirection === 'stable') {
      recommendations.push('Usage is stable - current plan should be sufficient')
    }

    if (recommendations.length === 0) {
      recommendations.push('Usage patterns look healthy and within expected ranges')
    }

    // Generate forecast data points for charting
    const forecastData: ForecastPoint[] = []

    // Historical data points
    historicalData.forEach((data, index) => {
      forecastData.push({
        date: data.date,
        predicted: data.messages,
        confidence: 1,
        type: 'historical'
      })
    })

    // Future predictions (next 7 days)
    const lastDate = new Date(historicalData[historicalData.length - 1].date)
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(lastDate)
      futureDate.setDate(lastDate.getDate() + i)

      const prediction = Math.max(0, lastValue + (trend.slope * i))
      const futureDateStr = futureDate.toISOString().split('T')[0]

      forecastData.push({
        date: futureDateStr,
        predicted: Math.round(prediction),
        confidence: Math.max(0.1, confidence - (i * 0.05)), // Confidence decreases over time
        type: 'forecast'
      })
    }

    return {
      currentPeriod: {
        used: currentUsed,
        remaining,
        limit: monthlyLimit,
        percentageUsed: Math.round(percentageUsed * 10) / 10
      },
      nextPeriod: {
        predicted: Math.round(nextPeriodPrediction),
        confidence: Math.round(confidence * 100),
        trend: trendDirection
      },
      recommendations,
      riskLevel,
      forecastData
    }
  }, [loading, historicalData])

  const refreshData = () => {
    setLoading(true)
    // In a real app, this would refetch from your API
    setTimeout(() => {
      setHistoricalData(generateMockData)
      setLoading(false)
    }, 500)
  }

  return {
    forecast,
    loading,
    historicalData,
    refreshData
  }
}