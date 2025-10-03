'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [activeView, setActiveView] = useState<View>('my-bots')
  const [user, setUser] = useState<any>(null)
  const [showBotModal, setShowBotModal] = useState(false)
  const [showKnowledgeEditor, setShowKnowledgeEditor] = useState(false)
  const [editingBot, setEditingBot] = useState<any>(null)
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null)
  const [knowledgeContent, setKnowledgeContent] = useState('')

  const { company, loading: companyLoading, error: companyError } = useCompany()
  const { bots, createBot, updateBot, deleteBot, refetch: refetchBots } = useBots(company?.id)
  const { usageData, refetch: refetchSubscription } = useSubscription(company?.id)

  // Check auth and redirect if needed
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/signin')
      return
    }

    setUser(user)

    // Check if user has completed onboarding (has a company)
    if (!companyLoading && !company) {
      router.push('/onboarding')
    }
  }

  // Handle bot creation/update
  const handleSaveBot = async (botData: Partial<Bot>) => {
    try {
      if (editingBot) {
        await updateBot(editingBot.id, botData)
      } else {
        await createBot(botData)
      }
      setShowBotModal(false)
      setEditingBot(null)
      refetchBots()
    } catch (error: any) {
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
    } catch (error: any) {
      alert('Failed to delete bot: ' + error.message)
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
    } catch (error: any) {
      throw error
    }
  }

  // Handle edit bot
  const handleEditBot = (bot: any) => {
    setEditingBot(bot)
    setShowBotModal(true)
  }

  // Handle add new bot
  const handleAddBot = () => {
    setEditingBot(null)
    setShowBotModal(true)
  }

  if (companyLoading || !user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (companyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard: {companyError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation */}
      <LeftNav activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeView === 'my-bots' && (
          <MyBotsView
            platform={company.platform}
            bots={bots}
            onAddBot={handleAddBot}
            onEditBot={handleEditBot}
            onDeleteBot={handleDeleteBot}
            onUpdateKnowledge={handleUpdateKnowledge}
          />
        )}

        {activeView === 'usage' && (
          <UsagePlanView
            platform={company.platform}
            subscription={usageData}
          />
        )}

        {activeView === 'settings' && (
          <AccountSettingsView
            user={user}
            company={company}
            nextBillingDate={usageData?.end_date}
          />
        )}
      </main>

      {/* Modals */}
      {showBotModal && (
        <BotSetupModal
          bot={editingBot}
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
