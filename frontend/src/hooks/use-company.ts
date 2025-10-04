import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Company {
  id: string
  user_id: string
  name: string
  email: string
  platform: 'telegram' | 'whatsapp'
  created_at: string
  updated_at: string
}

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('[useCompany] Fetching company data...')

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        console.log('[useCompany] No authenticated user found')
        throw new Error('Not authenticated')
      }

      console.log('[useCompany] User authenticated:', user.id)

      const { data, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // PGRST116 means no rows found - this is expected for new users
      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('[useCompany] No company found for user (needs onboarding)')
        setCompany(null)
        setLoading(false)
        return
      }

      if (fetchError) {
        console.error('[useCompany] Database error:', fetchError)
        throw fetchError
      }

      console.log('[useCompany] Company found:', data?.name)
      setCompany(data)
    } catch (err) {
      console.error('[useCompany] Error in fetchCompany:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchCompany()
  }

  return {
    company,
    loading,
    error,
    refetch
  }
}
