import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Bot {
  id: string
  company_id: string
  user_id: string
  name: string
  platform: 'telegram' | 'whatsapp'
  token: string
  is_active: boolean
  last_activity?: string
  webhook_url?: string
  created_at: string
  updated_at: string
}

export function useBots(companyId?: string) {
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (companyId) {
      fetchBots()
    }
  }, [companyId])

  const fetchBots = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('bots')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setBots(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const createBot = async (bot: Partial<Bot>) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('bots')
      .insert({
        ...bot,
        company_id: companyId,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    await fetchBots()
    return data
  }

  const updateBot = async (botId: string, updates: Partial<Bot>) => {
    const { data, error } = await supabase
      .from('bots')
      .update(updates)
      .eq('id', botId)
      .select()
      .single()

    if (error) throw error

    await fetchBots()
    return data
  }

  const deleteBot = async (botId: string) => {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', botId)

    if (error) throw error

    await fetchBots()
  }

  const refetch = () => {
    fetchBots()
  }

  return {
    bots,
    loading,
    error,
    createBot,
    updateBot,
    deleteBot,
    refetch
  }
}
