import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Plan {
  id: string
  name: string
  price: number
  token_limit: number
  features: Record<string, unknown>
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
  plan?: Plan
}

export function useSubscription(companyId?: string) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    if (companyId) {
      fetchSubscription()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, refreshTrigger])

  const fetchSubscription = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch active subscription with plan details (get latest first)
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (subError && subError.code !== 'PGRST116') throw subError

      setSubscription(subData)

      // Fetch usage data
      if (subData) {
        // Try to fetch usage logs, but don't fail if table schema is incorrect
        let totalTokens = 0
        try {
          const { data: usageLogs, error: usageError } = await supabase
            .from('usage_logs')
            .select('total_tokens')  // Fixed: Use 'total_tokens' column name from database
            .eq('subscription_id', subData.id)

          if (!usageError && usageLogs) {
            totalTokens = usageLogs.reduce((sum, log) => sum + (log.total_tokens || 0), 0)
          }
        } catch (usageError) {
          // Silently handle usage tracking errors - subscription data is more important
          console.warn('Failed to fetch usage logs:', usageError)
        }

        // Always set usageData even if usage tracking fails
        setUsageData({
          tokens_used: totalTokens,
          token_limit: subData.plan.token_limit,
          plan_name: subData.plan.name,
          price: subData.plan.price,
          start_date: subData.start_date,
          end_date: subData.end_date,
          is_active: subData.is_active,
          plan: subData.plan
        })
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    setRefreshTrigger(prev => prev + 1)  // Trigger useEffect to run again with fresh data
  }

  return {
    subscription,
    usageData,
    loading,
    error,
    refetch
  }
}
