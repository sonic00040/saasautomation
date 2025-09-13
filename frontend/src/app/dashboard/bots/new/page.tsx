'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/contexts/toast-context"
import { createBot } from "@/lib/api"
import {
  Bot,
  ArrowLeft,
  Loader2,
  Copy,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Info
} from "lucide-react"

export default function NewBotPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { success, error: showError } = useToast()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    platform: 'telegram' as 'telegram' | 'whatsapp' | 'discord',
    token: ''
  })
  const [createdBot, setCreatedBot] = useState<{
    id: string
    name: string
    platform: string
    webhookUrl: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.name.trim() || !formData.token.trim()) {
      showError('Validation Error', 'Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const bot = await createBot(user, {
        name: formData.name.trim(),
        platform: formData.platform,
        token: formData.token.trim()
      })

      // Generate webhook URL (this should match your backend URL)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.ngrok.io'
      const webhookUrl = `${backendUrl}/webhook/${formData.token}`

      setCreatedBot({
        id: bot.id,
        name: formData.name,
        platform: formData.platform,
        webhookUrl
      })

      success('Bot Created', `${formData.name} has been created successfully!`)
    } catch (err) {
      console.error('Error creating bot:', err)
      showError('Creation Failed', 'Failed to create bot. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyWebhookUrl = async () => {
    if (!createdBot) return

    try {
      await navigator.clipboard.writeText(createdBot.webhookUrl)
      setCopied(true)
      success('Copied', 'Webhook URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      showError('Copy Failed', 'Failed to copy webhook URL')
    }
  }

  const getPlatformInstructions = () => {
    switch (formData.platform) {
      case 'telegram':
        return {
          tokenHelp: 'Get your bot token from @BotFather on Telegram',
          webhookStep: 'Set this webhook URL in your Telegram bot settings or use the Telegram Bot API'
        }
      case 'whatsapp':
        return {
          tokenHelp: 'Get your access token from WhatsApp Business API',
          webhookStep: 'Configure this webhook URL in your WhatsApp Business API settings'
        }
      case 'discord':
        return {
          tokenHelp: 'Get your bot token from Discord Developer Portal',
          webhookStep: 'Use this URL for Discord webhook configurations'
        }
      default:
        return {
          tokenHelp: 'Enter your platform-specific bot token',
          webhookStep: 'Configure this webhook URL with your platform'
        }
    }
  }

  if (createdBot) {
    const instructions = getPlatformInstructions()

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bot Created Successfully!</h1>
            <p className="text-sm text-gray-600">Configure your webhook to activate the bot</p>
          </div>
        </div>

        {/* Success Card */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-800">
                {createdBot.name} Created
              </CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your {createdBot.platform} bot has been created and is ready for configuration.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Complete the setup by configuring your webhook URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Webhook URL */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  value={createdBot.webhookUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={copyWebhookUrl}
                  className="px-3"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {instructions.webhookStep}
              </p>
            </div>

            {/* Instructions */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Next Steps:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Copy the webhook URL above</li>
                  <li>Configure it in your {createdBot.platform} platform settings</li>
                  <li>Your bot will start responding to messages automatically</li>
                  <li>Monitor usage and responses in the dashboard</li>
                </ol>
              </AlertDescription>
            </Alert>

            {/* Platform-specific help */}
            {formData.platform === 'telegram' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Telegram Setup:</strong>
                  <br />
                  Use the Telegram Bot API to set your webhook:
                  <br />
                  <code className="text-xs bg-gray-100 px-1 py-0.5 rounded mt-1 inline-block">
                    https://api.telegram.org/bot{'{YOUR_BOT_TOKEN}'}/setWebhook?url={createdBot.webhookUrl}
                  </code>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={() => router.push('/dashboard/bots')} className="flex-1">
                View All Bots
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/knowledge')}
                className="flex-1"
              >
                Add Knowledge Base
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Bot</h1>
          <p className="text-sm text-gray-600">Set up a new chatbot for customer support</p>
        </div>
      </div>

      {/* Creation Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Bot Configuration
          </CardTitle>
          <CardDescription>
            Enter your bot details to create a new AI-powered customer support bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bot Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Support Bot, Sales Assistant"
                required
              />
              <p className="text-xs text-gray-500">
                Choose a descriptive name for your bot
              </p>
            </div>

            {/* Platform Selection */}
            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value: 'telegram' | 'whatsapp' | 'discord') =>
                  setFormData(prev => ({...prev, platform: value}))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Choose the messaging platform for your bot
              </p>
            </div>

            {/* Bot Token */}
            <div className="space-y-2">
              <Label htmlFor="token">Bot Token *</Label>
              <Input
                id="token"
                type="password"
                value={formData.token}
                onChange={(e) => setFormData(prev => ({...prev, token: e.target.value}))}
                placeholder="Enter your bot token"
                required
              />
              <p className="text-xs text-gray-500">
                {getPlatformInstructions().tokenHelp}
              </p>
            </div>

            {/* Platform Help */}
            {formData.platform === 'telegram' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Telegram Bot Setup:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1 text-sm">
                    <li>Message @BotFather on Telegram</li>
                    <li>Use /newbot command to create a bot</li>
                    <li>Copy the bot token provided</li>
                    <li>Paste it in the field above</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.name.trim() || !formData.token.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Bot...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Create Bot
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}