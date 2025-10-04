/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'

export interface RealtimeSubscriptionConfig {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  schema?: string
  filter?: string
}

export interface RealtimeHookOptions {
  onInsert?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
  onUpdate?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
  onDelete?: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
  onError?: (error: unknown) => void
  enabled?: boolean
}

export function useRealtime(config: RealtimeSubscriptionConfig, options: RealtimeHookOptions = {}) {
  const { user } = useAuth()
  const channelRef = useRef<RealtimeChannel | null>(null)
  const {
    onInsert,
    onUpdate,
    onDelete,
    onError,
    enabled = true
  } = options

  const subscribe = useCallback(() => {
    if (!user || !enabled) return

    try {
      // Create unique channel name based on table and user
      const channelName = `${config.table}_${user.id}_${Date.now()}`

      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes' as any, // Type assertion for Supabase realtime compatibility
          {
            event: config.event || '*',
            schema: config.schema || 'public',
            table: config.table,
            filter: config.filter
          } as any,
          (payload: any) => {
            console.log('Realtime change:', payload)

            switch (payload.eventType) {
              case 'INSERT':
                onInsert?.(payload as any)
                break
              case 'UPDATE':
                onUpdate?.(payload as any)
                break
              case 'DELETE':
                onDelete?.(payload as any)
                break
              default:
                break
            }
          }
        )
        .subscribe((status: any) => {
          console.log(`Realtime subscription status for ${config.table}:`, status)

          if (status === 'SUBSCRIPTION_ERROR') {
            onError?.(new Error('Subscription error'))
          }
        })

      channelRef.current = channel
    } catch (error) {
      console.error('Error setting up realtime subscription:', error)
      onError?.(error)
    }
  }, [user, enabled, config, onInsert, onUpdate, onDelete, onError])

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  useEffect(() => {
    if (enabled && user) {
      subscribe()
    } else {
      unsubscribe()
    }

    return unsubscribe
  }, [subscribe, unsubscribe, enabled, user])

  return {
    subscribe,
    unsubscribe,
    isSubscribed: channelRef.current !== null
  }
}

// Hook for multiple realtime subscriptions
export function useMultipleRealtime(subscriptions: Array<{
  config: RealtimeSubscriptionConfig
  options: RealtimeHookOptions
}>) {
  const { user } = useAuth()
  const channelsRef = useRef<RealtimeChannel[]>([])

  const subscribeAll = useCallback(() => {
    if (!user) return

    // Unsubscribe from existing channels first
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel)
    })
    channelsRef.current = []

    subscriptions.forEach(({ config, options }, index) => {
      if (options.enabled === false) return

      try {
        const channelName = `${config.table}_${user.id}_${index}_${Date.now()}`

        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes' as any, // Type assertion for Supabase realtime compatibility
            {
              event: config.event || '*',
              schema: config.schema || 'public',
              table: config.table,
              filter: config.filter
            } as any,
            (payload: any) => {
              console.log(`Realtime change for ${config.table}:`, payload)

              switch (payload.eventType) {
                case 'INSERT':
                  options.onInsert?.(payload as any)
                  break
                case 'UPDATE':
                  options.onUpdate?.(payload as any)
                  break
                case 'DELETE':
                  options.onDelete?.(payload as any)
                  break
                default:
                  break
              }
            }
          )
          .subscribe((status: any) => {
            console.log(`Realtime subscription status for ${config.table}:`, status)

            if (status === 'SUBSCRIPTION_ERROR') {
              options.onError?.(new Error(`Subscription error for ${config.table}`))
            }
          })

        channelsRef.current.push(channel)
      } catch (error) {
        console.error(`Error setting up realtime subscription for ${config.table}:`, error)
        options.onError?.(error)
      }
    })
  }, [user, subscriptions])

  const unsubscribeAll = useCallback(() => {
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel)
    })
    channelsRef.current = []
  }, [])

  useEffect(() => {
    if (user) {
      subscribeAll()
    } else {
      unsubscribeAll()
    }

    return unsubscribeAll
  }, [subscribeAll, unsubscribeAll, user])

  return {
    subscribeAll,
    unsubscribeAll,
    activeChannels: channelsRef.current.length
  }
}