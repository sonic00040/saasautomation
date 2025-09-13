'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'

interface MFAEnrollmentResponse {
  id: string
  type: 'totp'
  totp: {
    qr_code: string
    secret: string
    uri: string
  }
}

interface MFAFactor {
  id: string
  friendly_name?: string
  factor_type: 'totp'
  status: 'verified' | 'unverified'
  created_at: string
  updated_at: string
}

export function use2FA() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enrollmentData, setEnrollmentData] = useState<MFAEnrollmentResponse | null>(null)
  const { user } = useAuth()

  // Enroll in 2FA (start the process)
  const enroll2FA = async () => {
    if (!user) {
      setError('User must be logged in to enroll in 2FA')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App'
      })

      if (error) {
        setError(error.message)
        return null
      }

      setEnrollmentData(data as MFAEnrollmentResponse)
      return data
    } catch (err) {
      setError('Failed to enroll in 2FA')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Verify 2FA enrollment with code from authenticator app
  const verify2FAEnrollment = async (factorId: string, verificationCode: string) => {
    if (!user) {
      setError('User must be logged in')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verificationCode
      })

      if (error) {
        setError(error.message)
        return false
      }

      return true
    } catch (err) {
      setError('Failed to verify 2FA code')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Get existing MFA factors
  const getMFAFactors = async (): Promise<MFAFactor[]> => {
    if (!user) {
      return []
    }

    try {
      const { data, error } = await supabase.auth.mfa.listFactors()

      if (error) {
        console.error('Error fetching MFA factors:', error)
        return []
      }

      return data.totp as MFAFactor[]
    } catch (err) {
      console.error('Failed to fetch MFA factors:', err)
      return []
    }
  }

  // Unenroll from 2FA (remove factor)
  const unenroll2FA = async (factorId: string) => {
    if (!user) {
      setError('User must be logged in')
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId })

      if (error) {
        setError(error.message)
        return false
      }

      return true
    } catch (err) {
      setError('Failed to remove 2FA')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Create challenge for existing 2FA factor
  const create2FAChallenge = async (factorId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId })

      if (error) {
        setError(error.message)
        return null
      }

      return data
    } catch (err) {
      setError('Failed to create 2FA challenge')
      return null
    }
  }

  // Verify 2FA challenge
  const verify2FAChallenge = async (factorId: string, challengeId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      })

      if (error) {
        setError(error.message)
        return null
      }

      return data
    } catch (err) {
      setError('Failed to verify 2FA challenge')
      return null
    }
  }

  const clearError = () => setError(null)
  const clearEnrollmentData = () => setEnrollmentData(null)

  return {
    loading,
    error,
    enrollmentData,
    enroll2FA,
    verify2FAEnrollment,
    getMFAFactors,
    unenroll2FA,
    create2FAChallenge,
    verify2FAChallenge,
    clearError,
    clearEnrollmentData
  }
}