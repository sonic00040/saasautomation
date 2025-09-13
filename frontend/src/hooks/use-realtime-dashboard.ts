'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRealtime } from './use-realtime'
import { useToast } from '@/contexts/toast-context'
import { useAuth } from '@/contexts/auth-context'
import { getUserMetrics, getUserActivities, logActivity, type DashboardMetrics, type Activity, APIError } from '@/lib/api'

interface DashboardState {
  metrics: DashboardMetrics
  activities: Activity[]
  loading: boolean
  error: string | null
}

export function useRealtimeDashboard() {
  const { user } = useAuth()
  const { success, info, error: showError, warning } = useToast()

  const [state, setState] = useState<DashboardState>({
    metrics: {
      totalMessages: 0,
      activeBots: 0,
      successRate: 0,
      avgResponseTime: 0,
      messagesThisMonth: 0,
      monthlyLimit: 1000,
      tokensUsed: 0,
      planName: 'Free Plan',
      planPrice: 0,
      subscriptionEndDate: null
    },
    activities: [],
    loading: true,
    error: null
  })

  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'User not authenticated'
      }))
      return
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const [metricsData, activitiesData] = await Promise.all([
        getUserMetrics(user),
        getUserActivities(user, 10)
      ])

      setState(prev => ({
        ...prev,
        metrics: metricsData,
        activities: activitiesData,
        loading: false,
        error: null
      }))

      setLastUpdated(new Date().toISOString())
      setIsConnected(true)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      const errorMessage = err instanceof APIError ? err.message : 'Failed to load dashboard data'

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))

      setIsConnected(false)
      showError('Data Error', errorMessage)
    }
  }, [user, showError])

  const addActivity = useCallback(async (activity: {
    type: Activity['type']
    description: string
    metadata?: Record<string, unknown>
  }) => {
    if (!user) return

    try {
      await logActivity(user, activity)

      const newActivity: Activity = {
        id: Math.random().toString(36).substring(2, 9),
        type: activity.type,
        description: activity.description,
        timestamp: new Date().toISOString(),
        metadata: activity.metadata,
        botName: (activity.metadata?.botName as string) || 'AI Bot'
      }

      setState(prev => ({
        ...prev,
        activities: [newActivity, ...prev.activities.slice(0, 9)]
      }))

      // Show toast notification for important activities
      switch (activity.type) {
        case 'user_join':
          info('New User', activity.description)
          break
        case 'bot_created':
          success('Bot Created', activity.description)
          break
        case 'knowledge_updated':
          info('Knowledge Updated', activity.description)
          break
      }
    } catch (err) {
      console.error('Error logging activity:', err)
    }
  }, [user, info, success])

  const refresh = useCallback(async () => {
    await fetchDashboardData()
    info('Dashboard Refreshed', 'Data has been updated')
  }, [fetchDashboardData, info])

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user, fetchDashboardData])

  // Real-time subscription for activities
  useRealtime(
    { table: 'activities', event: 'INSERT' },
    {
      onInsert: (payload) => {
        console.log('New activity:', payload)

        if (payload.new && payload.new.user_id === user?.id) {
          const newActivity: Activity = {
            id: payload.new.id,
            type: payload.new.type,
            description: payload.new.description,
            timestamp: payload.new.created_at,
            metadata: payload.new.metadata,
            botName: (payload.new.metadata?.botName as string) || 'AI Bot'
          }

          setState(prev => ({
            ...prev,
            activities: [newActivity, ...prev.activities.slice(0, 9)]
          }))
        }
      },
      onError: (err) => {
        console.error('Realtime subscription error:', err)
        setIsConnected(false)
        showError('Connection Lost', 'Real-time updates disconnected')
      },
      enabled: !!user
    }
  )

  // Real-time subscription for conversations/usage updates
  useRealtime(
    { table: 'usage_logs', event: 'INSERT' },
    {
      onInsert: (payload) => {
        console.log('New usage logged:', payload)
        // Refresh metrics when new usage is recorded
        fetchDashboardData()
      },
      enabled: !!user
    }
  )

  // Real-time subscription for bot status changes
  useRealtime(
    { table: 'bots', event: 'UPDATE' },
    {
      onUpdate: (payload) => {
        console.log('Bot updated:', payload)
        // Refresh metrics when bot status changes
        fetchDashboardData()
      },
      enabled: !!user
    }
  )

  // For backward compatibility, expose metrics separately
  const metrics = {
    activeUsers: 0, // deprecated
    totalMessages: state.metrics.totalMessages,
    botResponses: state.metrics.totalMessages, // deprecated
    avgResponseTime: state.metrics.avgResponseTime,
    errorRate: 100 - state.metrics.successRate,
    lastUpdated
  }

  return {
    metrics,
    activities: state.activities,
    isConnected,
    loading: state.loading,
    error: state.error,
    refresh,
    addActivity,
    dashboardMetrics: state.metrics,
    setMetrics: () => {}, // deprecated
  }
}