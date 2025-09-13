'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { formatTimeOnly } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Bot, 
  Send, 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  MessageSquare,
  Zap,
  Info,
  Download,
  RefreshCw
} from "lucide-react"
import Link from 'next/link'

interface TestMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'error'
  responseTime?: number
}

export default function BotTestPage() {
  const params = useParams()
  const botId = params.id as string
  
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<TestMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI support assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 60000),
      status: 'delivered',
      responseTime: 850
    }
  ])

  // Mock bot data - in real app this would come from API
  const bot = {
    id: botId,
    name: 'Support Bot',
    status: 'connected' as const,
    platform: 'Telegram',
    lastActivity: '2 minutes ago'
  }

  const sendTestMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    
    // Add user message
    const userMessage: TestMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      status: 'sent'
    }
    
    setMessages(prev => [...prev, userMessage])
    setMessage('')

    // Simulate API call delay
    setTimeout(() => {
      const responseTime = Math.floor(Math.random() * 2000) + 500
      
      // Add bot response
      const botResponse: TestMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: getBotResponse(userMessage.content),
        timestamp: new Date(),
        status: 'delivered',
        responseTime
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsLoading(false)
    }, 1500)
  }

  const getBotResponse = (userInput: string): string => {
    const responses = [
      "I understand your concern. Let me help you with that right away.",
      "That's a great question! Based on our knowledge base, here's what I can tell you...",
      "I'd be happy to assist you with this issue. Let me check our documentation.",
      "Thank you for reaching out. I can definitely help you resolve this matter.",
      "I see what you're asking about. Here's the information you need..."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI support assistant. How can I help you today?',
      timestamp: new Date(),
      status: 'delivered',
      responseTime: 850
    }])
  }

  const exportChat = () => {
    const chatData = {
      botId: bot.id,
      botName: bot.name,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        responseTime: msg.responseTime
      }))
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bot-test-${bot.name}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const averageResponseTime = messages
    .filter(msg => msg.type === 'bot' && msg.responseTime)
    .reduce((sum, msg) => sum + (msg.responseTime || 0), 0) / 
    messages.filter(msg => msg.type === 'bot' && msg.responseTime).length

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="bg-slate-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/bots">
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bots
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-7 w-7 text-yellow-400" />
                Test: {bot.name}
              </h1>
              <p className="mt-1 text-slate-300">
                Test your chatbot responses and debug conversations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {bot.status}
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">
              {bot.platform}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-slate-600" />
                    Chat Interface
                  </CardTitle>
                  <CardDescription>
                    Send test messages and see how your bot responds
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportChat}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-yellow-500 text-slate-900'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === 'bot' && (
                          <Bot className="h-4 w-4 text-slate-600 mt-0.5 flex-shrink-0" />
                        )}
                        {msg.type === 'user' && (
                          <User className="h-4 w-4 text-slate-700 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeOnly(msg.timestamp)}</span>
                            {msg.responseTime && (
                              <>
                                <span>•</span>
                                <Zap className="h-3 w-3" />
                                <span>{msg.responseTime}ms</span>
                              </>
                            )}
                            {msg.status === 'delivered' && (
                              <CheckCircle className="h-3 w-3 text-green-600" />
                            )}
                            {msg.status === 'error' && (
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-slate-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* Message Input */}
            <div className="border-t border-slate-200 p-4 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your test message..."
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendTestMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendTestMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Debug Panel */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {isNaN(averageResponseTime) ? '-' : Math.round(averageResponseTime)}ms
                </div>
                <div className="text-sm text-slate-600">Avg Response Time</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Messages:</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Bot Responses:</span>
                  <span className="font-medium">
                    {messages.filter(m => m.type === 'bot').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Success Rate:</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-500" />
                Debug Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-slate-500">Bot ID:</span>
                  <span className="ml-2 font-mono">{bot.id}</span>
                </div>
                <div>
                  <span className="text-slate-500">Platform:</span>
                  <span className="ml-2">{bot.platform}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <span className="ml-2 capitalize">{bot.status}</span>
                </div>
                <div>
                  <span className="text-slate-500">Last Activity:</span>
                  <span className="ml-2">{bot.lastActivity}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "What are your business hours?",
                "I need help with my order",
                "How do I reset my password?",
                "Can you tell me about pricing?",
                "I want to cancel my subscription"
              ].map((testMessage, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start text-xs"
                  onClick={() => setMessage(testMessage)}
                >
                  {testMessage}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}