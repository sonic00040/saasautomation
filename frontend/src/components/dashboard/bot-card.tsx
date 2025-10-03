'use client'

import { useState } from 'react'
import { MessageSquare, Bot as BotIcon, Circle, Edit2, Trash2, FileText, Copy, Check } from 'lucide-react'

interface Bot {
  id: string
  name: string
  platform: 'telegram' | 'whatsapp'
  token: string
  is_active: boolean
  last_activity?: string
  webhook_url?: string
}

interface BotCardProps {
  bot: Bot
  onEdit: (bot: Bot) => void
  onDelete: (botId: string) => void
  onUpdateKnowledge: (botId: string) => void
}

export function BotCard({ bot, onEdit, onDelete, onUpdateKnowledge }: BotCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyWebhook = () => {
    if (bot.webhook_url) {
      navigator.clipboard.writeText(bot.webhook_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const platformConfig = {
    telegram: {
      icon: MessageSquare,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    whatsapp: {
      icon: BotIcon,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    }
  }

  const config = platformConfig[bot.platform]
  const PlatformIcon = config.icon

  return (
    <div className={`bg-white rounded-xl border-2 ${bot.is_active ? config.borderColor : 'border-gray-200'} p-6 hover:shadow-lg transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center`}>
            <PlatformIcon className={`w-6 h-6 ${config.textColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{bot.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor} font-medium`}>
                {bot.platform.toUpperCase()}
              </span>
              <div className="flex items-center gap-1">
                <Circle
                  className={`w-2 h-2 ${bot.is_active ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
                />
                <span className={`text-xs ${bot.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                  {bot.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token/Credentials */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">
          {bot.platform === 'telegram' ? 'Bot Token' : 'API Token'}
        </div>
        <div className="font-mono text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
          {bot.token.slice(0, 8)}...{bot.token.slice(-4)}
        </div>
      </div>

      {/* Webhook URL */}
      {bot.webhook_url && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Webhook URL</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 truncate">
              {bot.webhook_url}
            </div>
            <button
              onClick={handleCopyWebhook}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy webhook URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Last Activity */}
      {bot.last_activity && (
        <div className="text-xs text-gray-500 mb-4">
          Last active: {new Date(bot.last_activity).toLocaleDateString()}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onUpdateKnowledge(bot.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Knowledge</span>
        </button>
        <button
          onClick={() => onEdit(bot)}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Edit</span>
        </button>
        <button
          onClick={() => onDelete(bot.id)}
          className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete bot"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
