import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Plan {
  id: string
  name: string
  price: number
  token_limit: number
  features: any
  is_active: boolean
}

interface Subscription {
  id: string
  company_id: string
  plan_id: string
  start_date: string
  end_date?: string
  is_active: boolean
  plan?: Plan
}

interface UsageData {
  tokens_used: number
  token_limit: number
  plan_name: string
  price: number
  start_date: string
  end_date?: string
  is_active: boolean
}

export function useSubscription(companyId?: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (companyId) {
      fetchSubscription()
    }
  }, [companyId])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch active subscription with plan details
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .single()

      if (subError && subError.code !== 'PGRST116') throw subError

      setSubscription(subData)

      // Fetch usage data
      if (subData) {
        const { data: usageLogs, error: usageError } = await supabase
          .from('usage_logs')
          .select('tokens_used')
          .eq('subscription_id', subData.id)

        if (usageError) throw usageError

        const totalTokens = usageLogs?.reduce((sum, log) => sum + log.tokens_used, 0) || 0

        setUsageData({
          tokens_used: totalTokens,
          token_limit: subData.plan.token_limit,
          plan_name: subData.plan.name,
          price: subData.plan.price,
          start_date: subData.start_date,
          end_date: subData.end_date,
          is_active: subData.is_active
        })
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchSubscription()
  }

  return {
    subscription,
    usageData,
    loading,
    error,
    refetch
  }
}
