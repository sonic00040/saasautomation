'use client'

import { useState, useEffect } from 'react'
import { X, Bot, MessageSquare, Loader2 } from 'lucide-react'
import { WebhookDisplay } from './webhook-display'

interface Bot {
  id?: string
  name: string
  platform: 'telegram' | 'whatsapp'
  token: string
  is_active: boolean
}

interface BotSetupModalProps {
  bot?: Bot
  platform: 'telegram' | 'whatsapp'
  onClose: () => void
  onSave: (bot: Partial<Bot>) => Promise<void>
}

export function BotSetupModal({ bot, platform, onClose, onSave }: BotSetupModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWebhook, setShowWebhook] = useState(false)

  const [formData, setFormData] = useState({
    name: bot?.name || '',
    token: bot?.token || '',
    whatsappPhone: '',
    whatsappApiToken: ''
  })

  const isEditing = !!bot?.id
  const isFormValid = platform === 'telegram'
    ? formData.name && formData.token
    : formData.name && formData.whatsappPhone && formData.whatsappApiToken

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    try {
      setLoading(true)
      setError(null)

      const botData: Partial<Bot> = {
        name: formData.name,
        platform,
        token: platform === 'telegram' ? formData.token : formData.whatsappApiToken,
        is_active: false
      }

      if (isEditing) {
        botData.id = bot.id
      }

      await onSave(botData)
      setShowWebhook(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save bot')
      setLoading(false)
    }
  }

  const platformConfig = {
    telegram: {
      icon: MessageSquare,
      color: 'blue',
      name: 'Telegram',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    whatsapp: {
      icon: Bot,
      color: 'green',
      name: 'WhatsApp',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    }
  }

  const config = platformConfig[platform]
  const PlatformIcon = config.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
              <PlatformIcon className={`w-5 h-5 ${config.textColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Bot' : 'Add New Bot'}
              </h2>
              <p className="text-sm text-gray-600">{config.name} Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showWebhook ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Bot Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bot Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Awesome Bot"
                  required
                />
              </div>

              {/* Platform-specific fields */}
              {platform === 'telegram' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Token *
                  </label>
                  <input
                    type="text"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
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
              )}

              {platform === 'whatsapp' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsappPhone}
                      onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
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
                      value={formData.whatsappApiToken}
                      onChange={(e) => setFormData({ ...formData, whatsappApiToken: e.target.value })}
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

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    isEditing ? 'Update Bot' : 'Create Bot'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-green-900 font-medium mb-1">
                  Bot {isEditing ? 'Updated' : 'Created'} Successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Now set up your webhook to start receiving messages.
                </p>
              </div>

              {/* Webhook Setup */}
              <WebhookDisplay
                platform={platform}
                botToken={platform === 'telegram' ? formData.token : undefined}
                businessPhone={platform === 'whatsapp' ? formData.whatsappPhone : undefined}
                environment={process.env.NEXT_PUBLIC_ENV as 'development' | 'production'}
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
