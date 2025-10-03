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

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (fetchError) throw fetchError

      setCompany(data)
    } catch (err) {
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
