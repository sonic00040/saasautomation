'use client'

import { Plus, Search, MessageSquare, Bot as BotIcon } from 'lucide-react'
import { BotCard } from './bot-card'
import { useState } from 'react'

interface Bot {
  id: string
  name: string
  platform: 'telegram' | 'whatsapp'
  token: string
  is_active: boolean
  last_activity?: string
  webhook_url?: string
}

interface MyBotsViewProps {
  platform: 'telegram' | 'whatsapp'
  bots: Bot[]
  onAddBot: () => void
  onEditBot: (bot: Bot) => void
  onDeleteBot: (botId: string) => void
  onUpdateKnowledge: (botId: string) => void
}

export function MyBotsView({
  platform,
  bots,
  onAddBot,
  onEditBot,
  onDeleteBot,
  onUpdateKnowledge
}: MyBotsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const platformConfig = {
    telegram: {
      icon: MessageSquare,
      name: 'Telegram',
      color: 'blue',
      emptyMessage: 'No Telegram bots yet'
    },
    whatsapp: {
      icon: BotIcon,
      name: 'WhatsApp',
      color: 'green',
      emptyMessage: 'No WhatsApp bots yet'
    }
  }

  const config = platformConfig[platform]
  const PlatformIcon = config.icon

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bots</h1>
          <p className="text-gray-600">
            Manage your {config.name} chatbots
          </p>
        </div>
        <button
          onClick={onAddBot}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add New Bot
        </button>
      </div>

      {/* Search */}
      {bots.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bots by name..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Stats */}
      {bots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BotIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{bots.length}</div>
                <div className="text-sm text-gray-600">Total Bots</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {bots.filter(b => b.is_active).length}
                </div>
                <div className="text-sm text-gray-600">Active Bots</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${config.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                <PlatformIcon className={`w-6 h-6 ${config.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{config.name}</div>
                <div className="text-sm text-gray-600">Platform</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bots Grid */}
      {filteredBots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onEdit={onEditBot}
              onDelete={onDeleteBot}
              onUpdateKnowledge={onUpdateKnowledge}
            />
          ))}
        </div>
      ) : bots.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className={`w-16 h-16 ${config.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <PlatformIcon className={`w-8 h-8 ${config.color === 'blue' ? 'text-blue-600' : 'text-green-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {config.emptyMessage}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first {config.name} bot. Connect your bot token and start chatting with your customers!
          </p>
          <button
            onClick={onAddBot}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Bot
          </button>
        </div>
      ) : (
        /* No Results */
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No bots found
          </h3>
          <p className="text-gray-600">
            No bots match your search query "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  )
}
