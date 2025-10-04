'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LeftNav } from '@/components/dashboard/left-nav'
import { MyBotsView } from '@/components/dashboard/my-bots-view'
import { UsagePlanView } from '@/components/dashboard/usage-plan-view'
import { AccountSettingsView } from '@/components/dashboard/account-settings-view'
import { BotSetupModal } from '@/components/dashboard/bot-setup-modal'
import { KnowledgeBaseEditor } from '@/components/dashboard/knowledge-base-editor'
import { useCompany } from '@/hooks/use-company'
import { useBots } from '@/hooks/use-bots'
import { useSubscription } from '@/hooks/use-subscription'
import { Loader2 } from 'lucide-react'

type View = 'my-bots' | 'usage' | 'settings'

interface Bot {
  id?: string
  name: string
  platform: 'telegram' | 'whatsapp'
  token: string
  is_active: boolean
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Initialize activeView from URL query parameter, defaulting to 'my-bots'
  const initialView = (searchParams.get('view') as View) || 'my-bots'
  const [activeView, setActiveView] = useState<View>(initialView)
  const [user, setUser] = useState<{ id: string; email?: string; [key: string]: unknown } | null>(null)
  const [showBotModal, setShowBotModal] = useState(false)
  const [showKnowledgeEditor, setShowKnowledgeEditor] = useState(false)
  const [editingBot, setEditingBot] = useState<Bot | null>(null)
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null)
  const [knowledgeContent, setKnowledgeContent] = useState('')
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  const { company, loading: companyLoading, error: companyError, refetch: refetchCompany } = useCompany()
  const { bots, createBot, updateBot, deleteBot, refetch: refetchBots } = useBots(company?.id)
  const { usageData, refetch: refetchSubscription } = useSubscription(company?.id)

  // Handle view changes and update URL
  const handleViewChange = (view: View) => {
    setActiveView(view)
    // Update URL without full page reload
    router.push(`/dashboard?view=${view}`, { scroll: false })
  }

  // Check auth and redirect if needed
  useEffect(() => {
    checkUser()

    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      if (companyLoading) {
        console.warn('[Dashboard] Loading timeout reached after 10 seconds')
        setLoadingTimeout(true)
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [])

  // Separate effect to handle onboarding redirect when company data loads
  useEffect(() => {
    console.log('[Dashboard] Company state changed:', {
      companyLoading,
      hasCompany: !!company,
      hasUser: !!user,
      companyError: companyError?.message
    })

    // Only redirect to onboarding if:
    // 1. Company loading is complete
    // 2. User is authenticated
    // 3. No company exists
    // 4. No company error (errors are handled separately)
    if (!companyLoading && user && !company && !companyError) {
      console.log('[Dashboard] Redirecting to onboarding - no company found')
      router.push('/onboarding')
    }
  }, [companyLoading, company, user, companyError, router])

  const checkUser = async () => {
    console.log('[Dashboard] Checking user authentication...')
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log('[Dashboard] No user found, redirecting to signin')
      router.push('/auth/signin')
      return
    }

    console.log('[Dashboard] User authenticated:', user.id)
    setUser(user as unknown as { id: string; email?: string; [key: string]: unknown })
  }

  // Handle bot creation/update
  const handleSaveBot = async (botData: Partial<Bot>) => {
    try {
      if (editingBot && editingBot.id) {
        await updateBot(editingBot.id, botData)
      } else {
        await createBot(botData)
      }
      setShowBotModal(false)
      setEditingBot(null)
      refetchBots()
    } catch (error: unknown) {
      throw error
    }
  }

  // Handle bot deletion
  const handleDeleteBot = async (botId: string) => {
    const confirmed = confirm('Are you sure you want to delete this bot? This action cannot be undone.')
    if (!confirmed) return

    try {
      await deleteBot(botId)
      refetchBots()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert('Failed to delete bot: ' + message)
    }
  }

  // Handle knowledge base update
  const handleUpdateKnowledge = async (botId: string) => {
    setSelectedBotId(botId)

    // Fetch existing knowledge base
    try {
      const { data, error } = await supabase
        .from('knowledge_bases')
        .select('content')
        .eq('company_id', company?.id)
        .single()

      if (data) {
        setKnowledgeContent(data.content || '')
      }
    } catch (error) {
      setKnowledgeContent('')
    }

    setShowKnowledgeEditor(true)
  }

  // Save knowledge base
  const handleSaveKnowledge = async (content: string) => {
    try {
      // Check if knowledge base exists
      const { data: existing } = await supabase
        .from('knowledge_bases')
        .select('id')
        .eq('company_id', company?.id)
        .single()

      if (existing) {
        // Update
        const { error } = await supabase
          .from('knowledge_bases')
          .update({ content })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('knowledge_bases')
          .insert({
            company_id: company?.id,
            content,
            title: 'Knowledge Base'
          })

        if (error) throw error
      }
    } catch (error: unknown) {
      throw error
    }
  }

  // Handle edit bot
  const handleEditBot = (bot: Bot) => {
    setEditingBot(bot)
    setShowBotModal(true)
  }

  // Handle add new bot
  const handleAddBot = () => {
    // Check bot limit before opening modal
    if (!usageData) {
      alert('Please wait, loading subscription data...')
      return
    }

    const currentBotCount = bots.length
    const maxBots = (typeof usageData.plan?.features?.bots === 'number' ? usageData.plan.features.bots : 1)

    if (currentBotCount >= maxBots) {
      const upgradeMsg = `You&apos;ve reached your plan limit of ${maxBots} bot${maxBots > 1 ? 's' : ''}.\n\nPlease upgrade your plan to add more bots.`
      alert(upgradeMsg)
      handleViewChange('usage') // Redirect to upgrade page
      return
    }

    setEditingBot(null)
    setShowBotModal(true)
  }

  // Show loading state
  if (companyLoading || !user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
          {loadingTimeout && (
            <div className="mt-4">
              <p className="text-yellow-600 text-sm">This is taking longer than expected...</p>
              <button
                onClick={() => router.push('/onboarding')}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Go to Onboarding
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show error state
  if (companyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {companyError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation */}
      <LeftNav activeView={activeView} onViewChange={handleViewChange} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeView === 'my-bots' && (
          <MyBotsView
            platform={company.platform}
            bots={bots}
            maxBots={typeof usageData?.plan?.features?.bots === 'number' ? usageData.plan.features.bots : 1}
            onAddBot={handleAddBot}
            onEditBot={handleEditBot}
            onDeleteBot={handleDeleteBot}
            onUpdateKnowledge={handleUpdateKnowledge}
          />
        )}

        {activeView === 'usage' && (
          <UsagePlanView
            platform={company.platform}
            subscription={usageData || undefined}
            onSubscriptionUpdate={refetchSubscription}
          />
        )}

        {activeView === 'settings' && (
          <AccountSettingsView
            user={user}
            company={company}
            nextBillingDate={usageData?.end_date}
            onCompanyUpdate={refetchCompany}
          />
        )}
      </main>

      {/* Modals */}
      {showBotModal && (
        <BotSetupModal
          bot={editingBot || undefined}
          platform={company.platform}
          onClose={() => {
            setShowBotModal(false)
            setEditingBot(null)
          }}
          onSave={handleSaveBot}
        />
      )}

      {showKnowledgeEditor && (
        <KnowledgeBaseEditor
          botId={selectedBotId || ''}
          initialContent={knowledgeContent}
          onSave={handleSaveKnowledge}
          onClose={() => {
            setShowKnowledgeEditor(false)
            setSelectedBotId(null)
          }}
        />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
