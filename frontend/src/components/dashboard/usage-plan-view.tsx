'use client'

import { useState, useEffect } from 'react'
import { Lock, MessageSquare, Bot as BotIcon, TrendingUp, CreditCard, Calendar, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UsagePlanViewProps {
  platform: 'telegram' | 'whatsapp'
  subscription?: {
    plan_name: string
    price: number
    token_limit: number
    tokens_used: number
    start_date: string
    end_date?: string
    is_active: boolean
  }
  botUsage?: Array<{
    bot_name: string
    tokens_used: number
  }>
  onSubscriptionUpdate?: () => void
}

export function UsagePlanView({ platform, subscription, botUsage = [], onSubscriptionUpdate }: UsagePlanViewProps) {
  const [availablePlans, setAvailablePlans] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClient()

  const tokensUsed = subscription?.tokens_used || 0
  const tokenLimit = subscription?.token_limit || 100000
  const usagePercentage = (tokensUsed / tokenLimit) * 100

  // Calculate days remaining
  const daysRemaining = subscription?.end_date
    ? Math.max(0, Math.ceil((new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  const nextBillingDate = subscription?.end_date
    ? new Date(subscription.end_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A'

  useEffect(() => {
    async function fetchPlans() {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (data) {
        // Filter out Free Plan from upgrade options
        setAvailablePlans(data.filter(plan => plan.name !== 'Free Plan'))
      }
      setLoading(false)
    }
    fetchPlans()
  }, [])

  const platformConfig = {
    telegram: {
      icon: MessageSquare,
      name: 'Telegram',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    whatsapp: {
      icon: BotIcon,
      name: 'WhatsApp',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    }
  }

  const config = platformConfig[platform]
  const PlatformIcon = config.icon

  const handleRefresh = async () => {
    if (!onSubscriptionUpdate) return

    setRefreshing(true)
    try {
      await onSubscriptionUpdate()
    } finally {
      // Add a small delay for better UX
      setTimeout(() => setRefreshing(false), 500)
    }
  }

  const handleUpgrade = async (newPlan: Record<string, unknown>) => {
    if (!confirm(`Upgrade to ${newPlan.name} for $${newPlan.price}/month?`)) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please log in to upgrade')
        return
      }

      // Get company_id from current subscription or user
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!company) {
        alert('Company not found')
        return
      }

      // Deactivate current subscription
      const { error: deactivateError } = await supabase
        .from('subscriptions')
        .update({ is_active: false })
        .eq('company_id', company.id)
        .eq('is_active', true)

      if (deactivateError) throw deactivateError

      // Create new subscription
      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

      const { error: createError } = await supabase
        .from('subscriptions')
        .insert({
          company_id: company.id,
          plan_id: newPlan.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          is_active: true
        })

      if (createError) throw createError

      alert(`✅ Successfully upgraded to ${newPlan.name}!`)

      // Small delay to ensure database write completes before refetching
      await new Promise(resolve => setTimeout(resolve, 500))

      // Use refetch instead of reload for better UX
      if (onSubscriptionUpdate) {
        onSubscriptionUpdate()  // Refetch subscription data
      } else {
        window.location.reload()  // Fallback
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to upgrade: ${message}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Usage & Plan</h1>
        <p className="text-gray-600">Monitor your token usage and subscription details</p>
      </div>

      {/* Platform Lock Alert */}
      <div className={`p-4 ${config.bgColor} border border-${config.color}-200 rounded-lg flex items-start gap-3`}>
        <Lock className={`w-5 h-5 ${config.textColor} mt-0.5`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <PlatformIcon className={`w-5 h-5 ${config.textColor}`} />
            <h3 className={`font-bold ${config.textColor}`}>
              Platform Locked: {config.name}
            </h3>
          </div>
          <p className={`text-sm ${config.textColor}`}>
            Your subscription is locked to {config.name} until your next billing cycle on <strong>{nextBillingDate}</strong>.
            To switch platforms, wait until the billing cycle ends or upgrade your plan.
          </p>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{subscription?.plan_name || 'Free Plan'}</h2>
            <p className="text-gray-600 mt-1">
              ${subscription?.price?.toFixed(2) || '0.00'}/month
            </p>
          </div>
          <button
            onClick={() => {
              document.getElementById('available-plans')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>

        {/* Token Usage Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Token Usage</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()} tokens
              </span>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh usage data"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all ${
                usagePercentage >= 90
                  ? 'bg-red-500'
                  : usagePercentage >= 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {usagePercentage >= 90 && '⚠️ You\'re approaching your token limit'}
            {usagePercentage >= 70 && usagePercentage < 90 && '💡 Consider upgrading for more tokens'}
            {usagePercentage < 70 && '✅ You have plenty of tokens remaining'}
          </p>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Billing Cycle</div>
              <div className="text-sm font-medium text-gray-900">Monthly</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Status</div>
              <div className="text-sm font-medium text-green-600">
                {subscription?.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500">Next Billing</div>
              <div className="text-sm font-medium text-gray-900">
                {nextBillingDate}
                {daysRemaining > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({daysRemaining} day{daysRemaining !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div id="available-plans" className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Available Plans</h3>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availablePlans.map((plan, index) => {
              const isCurrentPlan = subscription?.plan_name === plan.name
              const isPopular = plan.name === 'Professional Plan'

              return (
                <div
                  key={String(plan.id)}
                  className={`border-2 rounded-lg p-6 relative ${
                    isPopular ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Popular
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{String(plan.name)}</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-4">
                    ${String(plan.price)}<span className="text-lg text-gray-600">/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li>✓ {(plan.token_limit as number).toLocaleString()} tokens/month</li>
                    <li>✓ {(plan.features as Record<string, unknown>).bots === 999999 ? 'Unlimited' : String((plan.features as Record<string, unknown>).bots)} bot{(plan.features as Record<string, unknown>).bots as number > 1 ? 's' : ''}</li>
                    <li>✓ {String((plan.features as Record<string, unknown>).support)} support</li>
                    <li>✓ {String((plan.features as Record<string, unknown>).knowledge_items)} knowledge items</li>
                  </ul>
                  <button
                    onClick={() => !isCurrentPlan && handleUpgrade(plan)}
                    disabled={isCurrentPlan}
                    className={`w-full px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
