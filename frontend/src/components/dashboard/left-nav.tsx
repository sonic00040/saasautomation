'use client'

import { Bot, BarChart3, Settings } from 'lucide-react'

type View = 'my-bots' | 'usage' | 'settings'

interface LeftNavProps {
  activeView: View
  onViewChange: (view: View) => void
}

export function LeftNav({ activeView, onViewChange }: LeftNavProps) {
  const navItems = [
    {
      id: 'my-bots' as View,
      icon: Bot,
      label: 'My Bots',
      description: 'Manage your chatbots'
    },
    {
      id: 'usage' as View,
      icon: BarChart3,
      label: 'Usage & Plan',
      description: 'View usage and subscription'
    },
    {
      id: 'settings' as View,
      icon: Settings,
      label: 'Account Settings',
      description: 'Update your account'
    }
  ]

  return (
    <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
      </div>

      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <div className="text-left">
                <div className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* User Info at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          BotAI Dashboard v1.0
        </div>
      </div>
    </nav>
  )
}
