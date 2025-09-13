'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/contexts/toast-context"
import { getUserBots, getUserCompany, type BotConfig } from "@/lib/api"
import {
  Bot,
  Settings,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  ExternalLink,
  Webhook,
  Key,
  Activity,
  Loader2
} from "lucide-react"

interface BotData {
  id: string
  name: string
  token: string | null
  webhookUrl: string
  status: 'connected' | 'disconnected' | 'error'
  lastActivity: string
  platform: string
  messagesCount: number
}

export default function BotsPage() {
  const { user } = useAuth()
  const { error: showError } = useToast()
  const [showToken, setShowToken] = useState<{ [key: string]: boolean }>({})
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({})
  const [bots, setBots] = useState<BotData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBots = async () => {
      if (!user) return

      try {
        setLoading(true)
        const company = await getUserCompany(user)
        if (!company) {
          setBots([])
          return
        }

        const botsData = await getUserBots(company.id)

        // Transform the data to match the UI expectations
        const transformedBots: BotData[] = botsData.map(bot => {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.ngrok.io'
          const webhookUrl = bot.token ? `${backendUrl}/webhook/${bot.token}` : ''

          // Determine status based on bot configuration
          const status: 'connected' | 'disconnected' | 'error' =
            bot.isActive && bot.token ? 'connected' :
            bot.token ? 'disconnected' : 'error'

          return {
            id: bot.id,
            name: bot.name,
            token: bot.token || '',
            webhookUrl,
            status,
            lastActivity: bot.lastActivity
              ? new Date(bot.lastActivity).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Never',
            platform: bot.platform.charAt(0).toUpperCase() + bot.platform.slice(1),
            messagesCount: bot.messageCount
          }
        })

        setBots(transformedBots)
      } catch (err) {
        console.error('Error fetching bots:', err)
        showError('Error', 'Failed to load bots')
        setBots([])
      } finally {
        setLoading(false)
      }
    }

    fetchBots()
  }, [user, showError])

  const copyToClipboard = async (text: string, id: string, type: 'token' | 'webhook') => {
    await navigator.clipboard.writeText(text)
    setCopied({ ...copied, [`${id}-${type}`]: true })
    setTimeout(() => {
      setCopied({ ...copied, [`${id}-${type}`]: false })
    }, 2000)
  }

  const toggleTokenVisibility = (id: string) => {
    setShowToken({ ...showToken, [id]: !showToken[id] })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'disconnected':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'success'
      case 'disconnected':
        return 'warning'
      case 'error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bot className="h-7 w-7 text-yellow-400" />
                Bot Configuration
              </h1>
              <p className="mt-2 text-slate-300">
                Manage your chatbots, configure tokens, and monitor connection status
              </p>
            </div>
            <Button disabled className="bg-yellow-500 text-slate-900 font-semibold">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with dark theme matching screenshot */}
      <div className="bg-slate-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h-7 w-7 text-yellow-400" />
              Bot Configuration
            </h1>
            <p className="mt-2 text-slate-300">
              Manage your chatbots, configure tokens, and monitor connection status
            </p>
          </div>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
            onClick={() => window.location.href = '/dashboard/bots/new'}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Bot
          </Button>
        </div>
      </div>

      {/* Stats Cards matching screenshot design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bot className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {bots.length}
            </div>
            <div className="text-sm text-slate-600">Total Bots</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {bots.filter(bot => bot.status === 'connected').length}
            </div>
            <div className="text-sm text-slate-600">Active Connections</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {bots.reduce((sum, bot) => sum + bot.messagesCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">Total Messages</div>
          </CardContent>
        </Card>
      </div>

      {/* Bot Configuration Cards */}
      <div className="space-y-6">
        {bots.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Bots Created Yet</h3>
              <p className="text-slate-600 mb-6">
                Create your first bot to start providing AI-powered customer support.
              </p>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
                onClick={() => window.location.href = '/dashboard/bots/new'}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          bots.map((bot) => (
          <Card key={bot.id} className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      {bot.name}
                      {getStatusIcon(bot.status)}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Platform: {bot.platform}</span>
                      <span>•</span>
                      <span>Last activity: {bot.lastActivity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(bot.status) as any}>
                    {bot.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bot Token Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Bot Token</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`token-${bot.id}`} className="text-sm font-medium text-slate-700">
                      API Token
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`token-${bot.id}`}
                          type={showToken[bot.id] ? "text" : "password"}
                          value={bot.token}
                          readOnly
                          className="pr-20 font-mono text-sm"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleTokenVisibility(bot.id)}
                          >
                            {showToken[bot.id] ? 
                              <EyeOff className="h-3 w-3" /> : 
                              <Eye className="h-3 w-3" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(bot.token, bot.id, 'token')}
                          >
                            {copied[`${bot.id}-token`] ? 
                              <CheckCircle className="h-3 w-3 text-green-600" /> : 
                              <Copy className="h-3 w-3" />
                            }
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Keep this token secure and never share it publicly
                    </p>
                  </div>
                </div>

                {/* Webhook Configuration Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Webhook className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Webhook Configuration</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`webhook-${bot.id}`} className="text-sm font-medium text-slate-700">
                      Webhook URL
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`webhook-${bot.id}`}
                          value={bot.webhookUrl}
                          readOnly
                          className="pr-20 font-mono text-sm"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(bot.webhookUrl, bot.id, 'webhook')}
                          >
                            {copied[`${bot.id}-webhook`] ? 
                              <CheckCircle className="h-3 w-3 text-green-600" /> : 
                              <Copy className="h-3 w-3" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            asChild
                          >
                            <a href={bot.webhookUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Use this URL in your platform's webhook configuration
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Connection Status</p>
                        <p className="text-xs text-slate-500">Last checked: {bot.lastActivity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bot.status)}
                        <span className="text-sm font-medium capitalize text-slate-700">
                          {bot.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                <Button variant="outline" className="flex-1">
                  Test Connection
                </Button>
                <Button 
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                  asChild
                >
                  <a href={`/dashboard/bots/${bot.id}/test`}>
                    Test Bot
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/dashboard/bots/${bot.id}/settings`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  )
}