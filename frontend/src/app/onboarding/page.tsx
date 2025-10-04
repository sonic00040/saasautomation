'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bot, MessageSquare, Building2, FileText, CheckCircle2, ArrowRight } from 'lucide-react'

type Platform = 'telegram' | 'whatsapp'

interface OnboardingData {
  platform: Platform | null
  companyName: string
  businessEmail: string
  botToken: string
  whatsappPhone: string
  whatsappApiToken: string
  knowledgeBase: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<OnboardingData>({
    platform: null,
    companyName: '',
    businessEmail: '',
    botToken: '',
    whatsappPhone: '',
    whatsappApiToken: '',
    knowledgeBase: ''
  })

  const handlePlatformSelect = (platform: Platform) => {
    setData({ ...data, platform })
    setStep(2)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Create company record
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          name: data.companyName,
          email: data.businessEmail,
          platform: data.platform,
          telegram_bot_token: data.platform === 'telegram' ? data.botToken : null
        })
        .select()
        .single()

      if (companyError) throw companyError

      // Create first bot
      const { data: bot, error: botError } = await supabase
        .from('bots')
        .insert({
          company_id: company.id,
          user_id: user.id,
          name: `${data.companyName} Bot`,
          platform: data.platform,
          token: data.platform === 'telegram' ? data.botToken : data.whatsappApiToken,
          is_active: false
        })
        .select()
        .single()

      if (botError) throw botError

      // Set up webhook and activate bot
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
        console.log('[Onboarding] Setting up webhook...')

        const webhookResponse = await fetch(`${backendUrl}/api/webhooks/setup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: data.platform,
            bot_token: data.platform === 'telegram' ? data.botToken : null,
            business_phone: data.platform === 'whatsapp' ? data.whatsappPhone : null
          })
        })

        const webhookData = await webhookResponse.json()
        console.log('[Onboarding] Webhook response:', webhookData)

        if (webhookData.status === 'success') {
          // Update bot to active and store webhook URL
          await supabase
            .from('bots')
            .update({
              is_active: true,
              webhook_url: webhookData.webhook_url
            })
            .eq('id', bot.id)

          console.log('[Onboarding] ✅ Bot activated successfully!')
        } else {
          console.log('[Onboarding] ⚠️ Webhook setup:', webhookData.status, '- Bot will remain inactive')
        }
      } catch (webhookError) {
        console.error('[Onboarding] Webhook setup failed:', webhookError)
        // Don't fail onboarding, just log the error
      }

      // Create knowledge base
      if (data.knowledgeBase.trim()) {
        const { error: kbError } = await supabase
          .from('knowledge_bases')
          .insert({
            company_id: company.id,
            content: data.knowledgeBase,
            title: 'Initial Knowledge Base'
          })

        if (kbError) throw kbError
      }

      // Create default subscription (Free Plan - 30 days, one-time only)
      console.log('[Onboarding] Creating Free Plan subscription...')

      const { data: freePlan, error: planError } = await supabase
        .from('plans')
        .select('id')
        .eq('name', 'Free Plan')
        .single()

      if (planError) {
        console.error('[Onboarding] Free Plan not found:', planError)
        throw new Error('Free Plan not found in database. Please contact support.')
      }

      console.log('[Onboarding] Free Plan found:', freePlan.id)

      // Calculate 30-day expiry for Free Plan
      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          company_id: company.id,
          plan_id: freePlan.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(), // Free Plan expires in 30 days
          is_active: true
        })

      if (subError) {
        console.error('[Onboarding] Subscription creation failed:', subError)
        throw new Error(`Failed to create subscription: ${subError.message}`)
      }

      console.log('[Onboarding] Free Plan subscription created! Expires:', endDate.toISOString())

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to complete onboarding'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`h-1 w-16 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Platform Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Platform</h1>
              <p className="text-gray-600">Select the messaging platform for your chatbot</p>
              <p className="text-sm text-yellow-600 mt-2">⚠️ This choice is locked for your billing cycle</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Telegram Card */}
              <button
                onClick={() => handlePlatformSelect('telegram')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Telegram</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Perfect for instant messaging with 700M+ users worldwide
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    • Easy setup with BotFather<br />
                    • Rich media support<br />
                    • Inline keyboards
                  </div>
                </div>
              </button>

              {/* WhatsApp Card */}
              <button
                onClick={() => handlePlatformSelect('whatsapp')}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200">
                    <Bot className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">WhatsApp</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Reach 2B+ users on the world&apos;s most popular messaging app
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    • Business API integration<br />
                    • End-to-end encryption<br />
                    • Global reach
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Company Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Information</h1>
              <p className="text-gray-600">Tell us about your business</p>
            </div>

            <div className="space-y-4 mt-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  value={data.businessEmail}
                  onChange={(e) => setData({ ...data, businessEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contact@acme.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This can be different from your login email
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!data.companyName || !data.businessEmail}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bot Credentials */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bot Credentials</h1>
              <p className="text-gray-600">
                Connect your {data.platform === 'telegram' ? 'Telegram' : 'WhatsApp'} bot
              </p>
            </div>

            <div className="space-y-4 mt-8">
              {data.platform === 'telegram' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bot Token *
                    </label>
                    <input
                      type="text"
                      value={data.botToken}
                      onChange={(e) => setData({ ...data, botToken: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your bot token from{' '}
                      <a
                        href="https://t.me/BotFather"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        @BotFather
                      </a>
                    </p>
                  </div>
                </>
              )}

              {data.platform === 'whatsapp' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={data.whatsappPhone}
                      onChange={(e) => setData({ ...data, whatsappPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+1234567890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Business API Token *
                    </label>
                    <input
                      type="text"
                      value={data.whatsappApiToken}
                      onChange={(e) => setData({ ...data, whatsappApiToken: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      placeholder="EAAxxxxxxxxxxxxxxxxxx"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your API token from{' '}
                      <a
                        href="https://developers.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Meta for Developers
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={
                  data.platform === 'telegram' ? !data.botToken : (!data.whatsappPhone || !data.whatsappApiToken)
                }
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Knowledge Base */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600">Add information for your bot to reference</p>
            </div>

            <div className="space-y-4 mt-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Knowledge Base Content
                </label>
                <textarea
                  value={data.knowledgeBase}
                  onChange={(e) => setData({ ...data, knowledgeBase: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 resize-none"
                  placeholder="Enter information about your products, services, FAQs, company policies, etc."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {data.knowledgeBase.length} characters • Optional but recommended
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Setup
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
