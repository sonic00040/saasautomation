'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'

interface SessionInfo {
  id: string
  user_agent?: string
  ip?: string
  created_at: string
  updated_at: string
  is_current: boolean
  browser?: string
  os?: string
  device?: string
  location?: string
}

export function useSessionManagement() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Parse user agent to extract browser, OS, and device info
  const parseUserAgent = (userAgent: string) => {
    const ua = userAgent.toLowerCase()

    // Browser detection
    let browser = 'Unknown Browser'
    if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome'
    else if (ua.includes('firefox')) browser = 'Firefox'
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari'
    else if (ua.includes('edg')) browser = 'Edge'
    else if (ua.includes('opera')) browser = 'Opera'

    // OS detection
    let os = 'Unknown OS'
    if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS'
    else if (ua.includes('linux')) os = 'Linux'
    else if (ua.includes('android')) os = 'Android'
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'

    // Device detection
    let device = 'Desktop'
    if (ua.includes('mobile') || ua.includes('android')) device = 'Mobile'
    else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet'

    return { browser, os, device }
  }

  // Get current session info
  const getCurrentSessionInfo = (): SessionInfo => {
    const userAgent = navigator.userAgent
    const { browser, os, device } = parseUserAgent(userAgent)

    return {
      id: 'current',
      user_agent: userAgent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_current: true,
      browser,
      os,
      device,
      location: 'Current Location' // Could be enhanced with geolocation API
    }
  }

  // Load sessions (for now, just show current session)
  const loadSessions = async () => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // For now, we'll just show the current session
      // In a real implementation, you'd fetch session data from your backend
      const currentSession = getCurrentSessionInfo()
      setSessions([currentSession])
    } catch (err) {
      console.error('Failed to load sessions:', err)
      setError('Failed to load session information')
    } finally {
      setLoading(false)
    }
  }

  // Revoke session (sign out from other devices)
  const revokeSession = async (sessionId: string) => {
    if (sessionId === 'current') {
      // If trying to revoke current session, just sign out
      await supabase.auth.signOut()
      return true
    }

    // In a real implementation, you'd call your backend to revoke the specific session
    // For now, we'll just remove it from the list
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    return true
  }

  // Revoke all other sessions
  const revokeAllOtherSessions = async () => {
    try {
      // In a real implementation, you'd call your backend to revoke all other sessions
      // For now, we'll just keep the current session
      setSessions(prev => prev.filter(s => s.is_current))
      return true
    } catch (err) {
      setError('Failed to revoke sessions')
      return false
    }
  }

  useEffect(() => {
    loadSessions()
  }, [user])

  return {
    sessions,
    loading,
    error,
    loadSessions,
    revokeSession,
    revokeAllOtherSessions,
    clearError: () => setError(null)
  }
}