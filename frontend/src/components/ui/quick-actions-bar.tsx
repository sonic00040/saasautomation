'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Search,
  Upload,
  MessageSquare,
  BarChart3,
  Settings,
  Bot,
  Users,
  CreditCard,
  Zap,
  Command,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { useRouter } from "next/navigation"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  category: string
  shortcut: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: 'new-bot',
    title: 'Create New Bot',
    description: 'Set up a new chatbot',
    icon: Plus,
    href: '/dashboard/bots/new',
    category: 'Bots',
    shortcut: 'Ctrl+N',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'test-bot',
    title: 'Test Bot',
    description: 'Test your chatbot responses',
    icon: MessageSquare,
    href: '/dashboard/bots/test',
    category: 'Bots',
    shortcut: 'Ctrl+T',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'upload-knowledge',
    title: 'Upload Knowledge',
    description: 'Add documents to knowledge base',
    icon: Upload,
    href: '/dashboard/knowledge',
    category: 'Knowledge',
    shortcut: 'Ctrl+U',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'search-knowledge',
    title: 'Search Knowledge',
    description: 'Search through your knowledge base',
    icon: Search,
    href: '/dashboard/knowledge?search=true',
    category: 'Knowledge',
    shortcut: 'Ctrl+K',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'view-analytics',
    title: 'Analytics',
    description: 'View performance metrics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    category: 'Analytics',
    shortcut: 'Ctrl+A',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'manage-team',
    title: 'Team Management',
    description: 'Manage team members',
    icon: Users,
    href: '/dashboard/team',
    category: 'Team',
    shortcut: 'Ctrl+M',
    color: 'bg-cyan-500 hover:bg-cyan-600'
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'View billing and subscription',
    icon: CreditCard,
    href: '/dashboard/billing',
    category: 'Account',
    shortcut: 'Ctrl+B',
    color: 'bg-pink-500 hover:bg-pink-600'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure bot settings',
    icon: Settings,
    href: '/dashboard/settings',
    category: 'Settings',
    shortcut: 'Ctrl+,',
    color: 'bg-gray-500 hover:bg-gray-600'
  }
]

export function QuickActionsBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  const filteredActions = quickActions.filter(action =>
    action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle quick actions with Ctrl+Space or Cmd+Space
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault()
        setIsOpen(!isOpen)
        setSearchQuery('')
        setSelectedIndex(0)
        return
      }

      // If quick actions is open
      if (isOpen) {
        switch (e.key) {
          case 'Escape':
            setIsOpen(false)
            setSearchQuery('')
            break
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex(prev => (prev + 1) % filteredActions.length)
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex(prev => prev === 0 ? filteredActions.length - 1 : prev - 1)
            break
          case 'Enter':
            e.preventDefault()
            if (filteredActions[selectedIndex]) {
              router.push(filteredActions[selectedIndex].href)
              setIsOpen(false)
              setSearchQuery('')
            }
            break
        }
        return
      }

      // Global shortcuts when quick actions is closed
      const shortcutAction = quickActions.find(action => {
        const keys = action.shortcut.toLowerCase().split('+')
        const hasCtrl = keys.includes('ctrl') && (e.ctrlKey || e.metaKey)
        const hasKey = keys.includes(e.key.toLowerCase())
        return hasCtrl && hasKey
      })

      if (shortcutAction) {
        e.preventDefault()
        router.push(shortcutAction.href)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredActions, selectedIndex, router])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  const categories = Array.from(new Set(filteredActions.map(action => action.category)))

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isMinimized ? 'transform translate-x-full' : ''}`}>
          <div className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              size="lg"
            >
              <Zap className="h-6 w-6 text-white" />
            </Button>
            <Badge
              variant="secondary"
              className="absolute -top-2 -left-2 text-xs bg-white shadow-md"
            >
              ⌘+Space
            </Badge>
          </div>

          {/* Minimize toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-6 p-0 bg-white shadow-md"
          >
            {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      )}

      {/* Quick Actions Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <CardContent className="p-0">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Command className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-500">Navigate and perform actions quickly</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search actions... (type to filter)"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Actions List */}
              <div className="max-h-96 overflow-y-auto">
                {categories.map((category) => {
                  const categoryActions = filteredActions.filter(action => action.category === category)
                  if (categoryActions.length === 0) return null

                  return (
                    <div key={category} className="p-4 border-b last:border-b-0">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{category}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryActions.map((action, categoryIndex) => {
                          const globalIndex = filteredActions.indexOf(action)
                          const isSelected = selectedIndex === globalIndex
                          const Icon = action.icon

                          return (
                            <button
                              key={action.id}
                              onClick={() => {
                                router.push(action.href)
                                setIsOpen(false)
                                setSearchQuery('')
                              }}
                              className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-gray-50 ${
                                isSelected ? 'bg-blue-50 border-blue-200' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{action.title}</p>
                                <p className="text-sm text-gray-500 truncate">{action.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {action.shortcut.replace('Ctrl', '⌘')}
                              </Badge>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {filteredActions.length === 0 && (
                  <div className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No actions found matching &quot;{searchQuery}&quot;</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t p-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-white border rounded">↑↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-white border rounded">Enter</kbd>
                      <span>Select</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-white border rounded">Esc</kbd>
                      <span>Close</span>
                    </span>
                  </div>
                  <span>⌘+Space to toggle</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}