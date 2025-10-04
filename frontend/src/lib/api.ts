'use client'

import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface DashboardMetrics {
  totalMessages: number
  activeBots: number
  successRate: number
  avgResponseTime: number
  messagesThisMonth: number
  monthlyLimit: number
  tokensUsed: number
  planName: string
  planPrice: number
  subscriptionEndDate: string | null
}

export interface BotConfig {
  id: string
  name: string
  platform: 'telegram' | 'whatsapp' | 'discord'
  isActive: boolean
  lastActivity: string | null
  messageCount: number
  webhookUrl: string | null
  createdAt: string
}

export interface Activity {
  id: string
  type: 'message' | 'bot_response' | 'user_join' | 'user_leave' | 'bot_created' | 'knowledge_updated'
  description: string
  timestamp: string
  metadata?: Record<string, unknown>
  botName?: string
}

export interface UsageData {
  currentUsage: number
  monthlyLimit: number
  remainingTokens: number
  daysToReset: number
  usagePercentage: number
  planName: string
}

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'APIError'
  }
}

export async function createUserCompany(user: User): Promise<{ id: string; name: string }> {
  try {
    // Validate input parameters
    if (!user || !user.email) {
      console.error('createUserCompany called with invalid user:', {
        user,
        userId: user?.id,
        email: user?.email,
        timestamp: new Date().toISOString()
      })
      throw new APIError('Invalid user data provided')
    }

    // Generate company name from email (e.g., "john@example.com" -> "John's Company")
    const emailPrefix = user.email?.split('@')[0] || 'User'
    const companyName = `${emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)}'s Company`

    console.log('Creating new company:', {
      userId: user.id,
      email: user.email,
      companyName,
      timestamp: new Date().toISOString()
    })

    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        email: user.email!
      })
      .select('id, name')
      .single()

    if (error) {
      console.error('Error creating company:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
        userId: user.id,
        email: user.email,
        companyName,
        timestamp: new Date().toISOString()
      })
      throw new APIError(`Failed to create company: ${error.message || 'Unknown error'}`)
    }

    console.log('Successfully created new company:', {
      companyId: data.id,
      companyName: data.name,
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    })
    return data
  } catch (error) {
    console.error('Unexpected error creating company:', {
      error,
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error instanceof APIError ? error : new APIError('Failed to create company')
  }
}

export async function getUserCompany(user: User): Promise<{ id: string; name: string } | null> {
  try {
    // Validate input parameters
    if (!user) {
      console.error('getUserCompany called with missing user:', { user })
      return null
    }

    if (!user.email) {
      console.error('getUserCompany called with user missing email:', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      })
      return null
    }

    console.log('Fetching company for user:', {
      userId: user.id,
      email: user.email,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })

    // First try to get existing company
    const { data, error } = await supabase
      .from('companies')
      .select('id, name')
      .eq('email', user.email)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user company:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      })
      return null
    }

    // If company exists, return it
    if (data) {
      console.log('Found existing company:', {
        companyId: data.id,
        companyName: data.name,
        userId: user.id,
        email: user.email
      })
      return data
    }

    // If no company exists, create one
    console.log('No company found for user, creating new company:', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    })
    try {
      const newCompany = await createUserCompany(user)
      console.log('Successfully created company:', {
        companyId: newCompany.id,
        companyName: newCompany.name,
        userId: user.id,
        email: user.email
      })
      return newCompany
    } catch (createError) {
      console.error('Failed to create company for user:', {
        error: createError,
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        stack: createError instanceof Error ? createError.stack : undefined
      })
      return null
    }
  } catch (error) {
    console.error('Unexpected error fetching company:', {
      error,
      userId: user?.id,
      email: user?.email,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    })
    return null
  }
}

export async function getUserMetrics(user: User): Promise<DashboardMetrics> {
  try {
    const company = await getUserCompany(user)

    if (!company) {
      return {
        totalMessages: 0,
        activeBots: 0,
        successRate: 0,
        avgResponseTime: 0,
        messagesThisMonth: 0,
        monthlyLimit: 1000,
        tokensUsed: 0,
        planName: 'Free Plan',
        planPrice: 0,
        subscriptionEndDate: null
      }
    }

    const [botsData, subscriptionData, usageData] = await Promise.all([
      getUserBots(company.id),
      getUserSubscription(company.id),
      getUserUsage(company.id)
    ])

    const activeBots = botsData.filter(bot => bot.isActive).length
    const totalMessages = botsData.reduce((sum, bot) => sum + bot.messageCount, 0)

    const subscription = subscriptionData
    const monthlyLimit = (subscription?.plan as any)?.token_limit || 1000
    const tokensUsed = usageData.currentUsage
    const planName = (subscription?.plan as any)?.name || 'Free Plan'
    const planPrice = (subscription?.plan as any)?.price || 0

    const successRate = totalMessages > 0 ? Math.round((totalMessages * 0.97)) : 0

    return {
      totalMessages,
      activeBots,
      successRate,
      avgResponseTime: activeBots > 0 ? Math.random() * 1000 + 500 : 0,
      messagesThisMonth: totalMessages,
      monthlyLimit,
      tokensUsed,
      planName,
      planPrice,
      subscriptionEndDate: subscription?.end_date || null
    }
  } catch (error) {
    console.error('Error fetching user metrics:', error)
    throw new APIError('Failed to fetch dashboard metrics')
  }
}

export async function getUserBots(companyId: string): Promise<BotConfig[]> {
  try {
    // Validate input parameters
    if (!companyId) {
      console.error('getUserBots called with missing companyId:', { companyId })
      return []
    }

    console.log('Fetching bots for company:', companyId)

    const { data: bots, error } = await supabase
      .from('bots')
      .select(`
        id,
        name,
        platform,
        is_active,
        last_activity,
        webhook_url,
        created_at,
        conversations(message_count)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user bots:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
        companyId,
        timestamp: new Date().toISOString()
      })
      return []
    }

    console.log('Successfully fetched bots:', { count: bots?.length || 0, companyId })

    return (bots || []).map(bot => ({
      id: bot.id,
      name: bot.name,
      platform: bot.platform as 'telegram' | 'whatsapp' | 'discord',
      isActive: bot.is_active,
      lastActivity: bot.last_activity,
      messageCount: bot.conversations?.reduce((sum: number, conv: { message_count?: number }) => sum + (conv.message_count || 0), 0) || 0,
      webhookUrl: bot.webhook_url,
      createdAt: bot.created_at
    }))
  } catch (error) {
    console.error('Unexpected error fetching bots:', {
      error,
      companyId,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

export async function getUserSubscription(companyId: string) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        start_date,
        end_date,
        is_active,
        plan:plans (
          id,
          name,
          price,
          token_limit
        )
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

export async function getUserUsage(companyId: string): Promise<UsageData> {
  try {
    const subscription = await getUserSubscription(companyId)

    if (!subscription) {
      return {
        currentUsage: 0,
        monthlyLimit: 1000,
        remainingTokens: 1000,
        daysToReset: 30,
        usagePercentage: 0,
        planName: 'Free Plan'
      }
    }

    const { data: usageResult, error } = await supabase.rpc('get_total_usage', {
      p_subscription_id: subscription.id,
      p_start_date: subscription.start_date,
      p_end_date: subscription.end_date
    })

    if (error) {
      console.error('Error fetching usage:', error)
      return {
        currentUsage: 0,
        monthlyLimit: subscription.plan.token_limit,
        remainingTokens: subscription.plan.token_limit,
        daysToReset: 30,
        usagePercentage: 0,
        planName: subscription.plan.name
      }
    }

    const currentUsage = usageResult || 0
    const monthlyLimit = subscription.plan.token_limit
    const remainingTokens = Math.max(0, monthlyLimit - currentUsage)
    const usagePercentage = monthlyLimit > 0 ? (currentUsage / monthlyLimit) * 100 : 0

    const endDate = new Date(subscription.end_date)
    const now = new Date()
    const daysToReset = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

    return {
      currentUsage,
      monthlyLimit,
      remainingTokens,
      daysToReset,
      usagePercentage,
      planName: subscription.plan.name
    }
  } catch (error) {
    console.error('Error calculating usage:', error)
    return {
      currentUsage: 0,
      monthlyLimit: 1000,
      remainingTokens: 1000,
      daysToReset: 30,
      usagePercentage: 0,
      planName: 'Free Plan'
    }
  }
}

export async function getUserActivities(user: User, limit: number = 10): Promise<Activity[]> {
  try {
    // Validate input parameters
    if (!user) {
      console.error('getUserActivities called with missing user:', { user })
      return []
    }

    console.log('Fetching activities for user:', { userId: user.id, email: user.email, limit })

    const company = await getUserCompany(user)

    if (!company) {
      console.error('No company found for user in getUserActivities:', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString()
      })
      return []
    }

    console.log('Found company for activities:', { companyId: company.id, companyName: company.name })

    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        id,
        type,
        description,
        metadata,
        created_at
      `)
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching activities:', {
        error,
        errorMessage: error.message,
        errorDetails: error.details,
        errorHint: error.hint,
        errorCode: error.code,
        companyId: company.id,
        userId: user.id,
        limit,
        timestamp: new Date().toISOString()
      })
      return []
    }

    console.log('Successfully fetched activities:', {
      count: activities?.length || 0,
      companyId: company.id,
      userId: user.id
    })

    return (activities || []).map(activity => ({
      id: activity.id,
      type: activity.type as Activity['type'],
      description: activity.description,
      timestamp: activity.created_at,
      metadata: activity.metadata,
      botName: activity.metadata?.botName || 'AI Bot'
    }))
  } catch (error) {
    console.error('Unexpected error fetching activities:', {
      error,
      userId: user?.id,
      userEmail: user?.email,
      limit,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : undefined
    })
    return []
  }
}

export async function createBot(user: User, botData: {
  name: string
  platform: 'telegram' | 'whatsapp' | 'discord'
  token?: string
}) {
  try {
    const company = await getUserCompany(user)

    if (!company) {
      throw new APIError('Company not found')
    }

    // Create bot in bots table
    const { data, error } = await supabase
      .from('bots')
      .insert({
        company_id: company.id,
        user_id: user.id,
        name: botData.name,
        platform: botData.platform,
        token: botData.token,
        is_active: true // Set as active when token is provided
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating bot:', error)
      throw new APIError('Failed to create bot')
    }

    // IMPORTANT: Also update the companies table for backend compatibility
    // The Python backend looks for telegram_bot_token in the companies table
    if (botData.platform === 'telegram' && botData.token) {
      const { error: companyError } = await supabase
        .from('companies')
        .update({ telegram_bot_token: botData.token })
        .eq('id', company.id)

      if (companyError) {
        console.error('Error updating company telegram token:', companyError)
        // Don't throw error here, bot is created, just log the warning
        console.warn('Bot created but company telegram_bot_token not updated')
      }
    }

    await logActivity(user, {
      type: 'bot_created',
      description: `Created new ${botData.platform} bot: ${botData.name}`,
      metadata: { botId: data.id, botName: botData.name, platform: botData.platform }
    })

    return data
  } catch (error) {
    console.error('Error creating bot:', error)
    throw error instanceof APIError ? error : new APIError('Failed to create bot')
  }
}

export async function logActivity(user: User, activity: {
  type: Activity['type']
  description: string
  metadata?: Record<string, unknown>
}) {
  try {
    const company = await getUserCompany(user)

    if (!company) {
      return
    }

    const { error } = await supabase
      .from('activities')
      .insert({
        user_id: user.id,
        company_id: company.id,
        type: activity.type,
        description: activity.description,
        metadata: activity.metadata
      })

    if (error) {
      console.error('Error logging activity:', error)
    }
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

// Knowledge Base API functions
export interface KnowledgeBaseEntry {
  id: string
  content: string
  title?: string
  file_name?: string
  file_size?: number
  file_type?: string
  created_at: string
  updated_at: string
}

export async function getKnowledgeBase(user: User): Promise<KnowledgeBaseEntry[]> {
  try {
    const company = await getUserCompany(user)
    if (!company) {
      return []
    }

    const { data, error } = await supabase
      .from('knowledge_bases')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching knowledge base:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching knowledge base:', error)
    return []
  }
}

export async function addKnowledgeContent(user: User, content: {
  content: string
  title?: string
  file_name?: string
  file_size?: number
  file_type?: string
}) {
  try {
    const company = await getUserCompany(user)
    if (!company) {
      throw new APIError('Company not found')
    }

    const { data, error } = await supabase
      .from('knowledge_bases')
      .insert({
        company_id: company.id,
        content: content.content,
        title: content.title,
        file_name: content.file_name,
        file_size: content.file_size,
        file_type: content.file_type
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding knowledge content:', error)
      throw new APIError('Failed to add knowledge content')
    }

    // Log activity
    await logActivity(user, {
      type: 'knowledge_updated',
      description: `Added new knowledge: ${content.title || content.file_name || 'Content'}`,
      metadata: {
        contentId: data.id,
        title: content.title,
        fileName: content.file_name,
        fileType: content.file_type
      }
    })

    return data
  } catch (error) {
    console.error('Error adding knowledge content:', error)
    throw error instanceof APIError ? error : new APIError('Failed to add knowledge content')
  }
}

export async function updateKnowledgeContent(user: User, id: string, updates: {
  content?: string
  title?: string
}) {
  try {
    const company = await getUserCompany(user)
    if (!company) {
      throw new APIError('Company not found')
    }

    const { data, error } = await supabase
      .from('knowledge_bases')
      .update(updates)
      .eq('id', id)
      .eq('company_id', company.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating knowledge content:', error)
      throw new APIError('Failed to update knowledge content')
    }

    await logActivity(user, {
      type: 'knowledge_updated',
      description: `Updated knowledge: ${updates.title || 'Content'}`,
      metadata: { contentId: id }
    })

    return data
  } catch (error) {
    console.error('Error updating knowledge content:', error)
    throw error instanceof APIError ? error : new APIError('Failed to update knowledge content')
  }
}

export async function deleteKnowledgeContent(user: User, id: string) {
  try {
    const company = await getUserCompany(user)
    if (!company) {
      throw new APIError('Company not found')
    }

    const { error } = await supabase
      .from('knowledge_bases')
      .delete()
      .eq('id', id)
      .eq('company_id', company.id)

    if (error) {
      console.error('Error deleting knowledge content:', error)
      throw new APIError('Failed to delete knowledge content')
    }

    await logActivity(user, {
      type: 'knowledge_updated',
      description: 'Deleted knowledge content',
      metadata: { contentId: id }
    })

    return true
  } catch (error) {
    console.error('Error deleting knowledge content:', error)
    throw error instanceof APIError ? error : new APIError('Failed to delete knowledge content')
  }
}