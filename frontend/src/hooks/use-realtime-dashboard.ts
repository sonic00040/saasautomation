'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRealtime } from './use-realtime'
import { useToast } from '@/contexts/toast-context'
import { useAuth } from '@/contexts/auth-context'

interface DashboardMetrics {
  activeUsers: number
  totalMessages: number
  botResponses: number
  avgResponseTime: number
  errorRate: number
  lastUpdated: string
}

interface ActivityItem {
  id: string
  type: 'message' | 'error' | 'user_join' | 'user_leave' | 'bot_response'
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

export function useRealtimeDashboard() {
  const { user } = useAuth()
  const { success, info, error, warning } = useToast()
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeUsers: 0,
    totalMessages: 0,
    botResponses: 0,
    avgResponseTime: 0,
    errorRate: 0,
    lastUpdated: new Date().toISOString()
  })
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Simulate real-time metrics updates
  const updateMetrics = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      activeUsers: Math.floor(Math.random() * 50) + 10,
      totalMessages: prev.totalMessages + Math.floor(Math.random() * 5),
      botResponses: prev.botResponses + Math.floor(Math.random() * 3),
      avgResponseTime: Math.random() * 2000 + 500,
      errorRate: Math.random() * 5,
      lastUpdated: new Date().toISOString()
    }))
  }, [])

  // Add new activity
  const addActivity = useCallback((activity: Omit<ActivityItem, 'id'>) => {
    const newActivity: ActivityItem = {
      id: Math.random().toString(36).substring(2, 9),
      ...activity
    }

    setActivities(prev => [newActivity, ...prev.slice(0, 19)]) // Keep only 20 items

    // Show toast notification for important activities
    switch (activity.type) {
      case 'error':
        error('System Error', activity.message)
        break
      case 'user_join':
        info('New User', activity.message)
        break
      case 'bot_response':
        // Only show success for significant milestones
        if (metrics.botResponses % 10 === 0) {
          success('Bot Active', `${metrics.botResponses} responses today`)
        }
        break
    }
  }, [error, info, success, metrics.botResponses])

  // Simulate activity generation
  const generateActivity = useCallback(() => {
    const activities = [
      {
        type: 'message' as const,
        message: 'New message received from customer',
        timestamp: new Date().toISOString()
      },
      {
        type: 'bot_response' as const,
        message: 'Bot generated helpful response',
        timestamp: new Date().toISOString()
      },
      {
        type: 'user_join' as const,
        message: 'New user started conversation',
        timestamp: new Date().toISOString()
      }
    ]

    if (Math.random() < 0.1) {
      activities.push({
        type: 'error' as const,
        message: 'Rate limit exceeded for API calls',
        timestamp: new Date().toISOString()
      })
    }

    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    addActivity(randomActivity)
  }, [addActivity])

  // Set up real-time subscription (simulated for now)
  useEffect(() => {
    if (!user) return

    setIsConnected(true)

    // Simulate periodic updates
    const metricsInterval = setInterval(updateMetrics, 10000) // Every 10 seconds
    const activityInterval = setInterval(generateActivity, 5000) // Every 5 seconds

    return () => {
      clearInterval(metricsInterval)
      clearInterval(activityInterval)
      setIsConnected(false)
    }
  }, [user, updateMetrics, generateActivity])

  // Real-time subscription for messages table (when available)
  useRealtime(
    { table: 'messages', event: 'INSERT' },
    {
      onInsert: (payload) => {
        console.log('New message:', payload)
        addActivity({
          type: 'message',
          message: 'New message received',
          timestamp: new Date().toISOString(),
          metadata: payload.new
        })
        updateMetrics()
      },
      onError: (err) => {
        console.error('Realtime subscription error:', err)
        setIsConnected(false)
        error('Connection Lost', 'Real-time updates disconnected')
      },
      enabled: true
    }
  )

  // Real-time subscription for bot responses (when available)
  useRealtime(
    { table: 'bot_responses', event: 'INSERT' },
    {
      onInsert: (payload) => {
        console.log('New bot response:', payload)
        addActivity({
          type: 'bot_response',
          message: 'Bot generated response',
          timestamp: new Date().toISOString(),
          metadata: payload.new
        })
        updateMetrics()
      },
      enabled: true
    }
  )

  const refresh = useCallback(() => {
    updateMetrics()
    info('Dashboard Refreshed', 'Data has been updated')
  }, [updateMetrics, info])

  return {
    metrics,
    activities,
    isConnected,
    refresh,
    setMetrics,
    addActivity
  }
}