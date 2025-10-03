'use client'

import { Lock, MessageSquare, Bot as BotIcon, TrendingUp, CreditCard, Calendar } from 'lucide-react'

interface UsagePlanViewProps {
  platform: 'telegram' | 'whatsapp'
  subscription?: {
    plan_name: string
    price: number
    token_limit: number
    tokens_used: number
    start_date: string
    end_date: string
    is_active: boolean
  }
  botUsage?: Array<{
    bot_name: string
    tokens_used: number
  }>
}

export function UsagePlanView({ platform, subscription, botUsage = [] }: UsagePlanViewProps) {
  const tokensUsed = subscription?.tokens_used || 0
  const tokenLimit = subscription?.token_limit || 1000
  const usagePercentage = (tokensUsed / tokenLimit) * 100

  const nextBillingDate = subscription?.end_date
    ? new Date(subscription.end_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A'

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
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
        </div>

        {/* Token Usage Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Token Usage</span>
            <span className="text-sm text-gray-600">
              {tokensUsed.toLocaleString()} / {tokenLimit.toLocaleString()} tokens
            </span>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage by Bot */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Usage by Bot</h3>

        {botUsage.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BotIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No usage data available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {botUsage.map((bot, index) => {
              const botPercentage = (bot.tokens_used / tokensUsed) * 100

              return (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{bot.bot_name}</span>
                    <span className="text-sm text-gray-600">
                      {bot.tokens_used.toLocaleString()} tokens ({botPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${botPercentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Available Plans</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Free Plan</h4>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $0<span className="text-lg text-gray-600">/mo</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 1,000 tokens/month</li>
              <li>✓ 1 bot</li>
              <li>✓ Basic support</li>
            </ul>
            <button
              disabled={subscription?.plan_name === 'Free Plan'}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
            >
              {subscription?.plan_name === 'Free Plan' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-blue-500 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Popular
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Pro Plan</h4>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $29.99<span className="text-lg text-gray-600">/mo</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 10,000 tokens/month</li>
              <li>✓ 5 bots</li>
              <li>✓ Priority support</li>
            </ul>
            <button
              disabled={subscription?.plan_name === 'Pro Plan'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {subscription?.plan_name === 'Pro Plan' ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h4>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $99.99<span className="text-lg text-gray-600">/mo</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li>✓ 50,000 tokens/month</li>
              <li>✓ 20 bots</li>
              <li>✓ Dedicated support</li>
            </ul>
            <button
              disabled={subscription?.plan_name === 'Enterprise Plan'}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {subscription?.plan_name === 'Enterprise Plan' ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
