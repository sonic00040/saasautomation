'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Bot,
  MessageSquare,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Upload,
  Settings,
  Users,
  Clock,
  CheckCircle,
  Star,
  PlayCircle,
  Code,
  Database,
  Lock,
  Smartphone,
  Globe,
  Lightbulb
} from "lucide-react"

export default function FeaturesPage() {
  const [activeDemo, setActiveDemo] = useState('chat')
  const [typingText, setTypingText] = useState('')
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  // Demo messages for interactive chat simulation
  const demoMessages = [
    { type: 'user', text: 'What are your pricing plans?' },
    { type: 'bot', text: 'We offer three flexible pricing plans: Starter ($29/month), Professional ($99/month), and Enterprise (custom pricing). Each plan includes different message limits and features to match your business needs.' },
    { type: 'user', text: 'How does the knowledge base work?' },
    { type: 'bot', text: 'Our AI learns from your uploaded documents, FAQs, and training materials. Simply upload PDFs, text files, or enter information manually, and your bot will use this knowledge to provide accurate, contextual responses to customer inquiries.' }
  ]

  // Typing animation effect
  useEffect(() => {
    if (activeDemo === 'chat' && currentMessageIndex < demoMessages.length) {
      const message = demoMessages[currentMessageIndex]
      if (message.type === 'bot') {
        let i = 0
        const timer = setInterval(() => {
          setTypingText(message.text.slice(0, i))
          i++
          if (i > message.text.length) {
            clearInterval(timer)
            setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 1000)
          }
        }, 50)
        return () => clearInterval(timer)
      } else {
        setTypingText(message.text)
        setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 1500)
      }
    }
  }, [activeDemo, currentMessageIndex])

  const features = [
    {
      id: 'ai-powered',
      title: 'AI-Powered Conversations',
      description: 'Advanced natural language processing for human-like interactions',
      icon: Brain,
      color: 'bg-blue-500',
      benefits: [
        'Understands context and intent',
        'Learns from your knowledge base',
        'Maintains conversation history',
        'Supports multiple languages'
      ],
      demo: 'chat'
    },
    {
      id: 'instant-setup',
      title: 'Instant Setup & Integration',
      description: 'Get your chatbot running in minutes with simple webhook integration',
      icon: Zap,
      color: 'bg-green-500',
      benefits: [
        'One-click platform integration',
        'No coding required',
        'Real-time connection testing',
        'Automated webhook configuration'
      ],
      demo: 'setup'
    },
    {
      id: 'knowledge-management',
      title: 'Smart Knowledge Management',
      description: 'Upload documents and let AI learn from your content automatically',
      icon: Upload,
      color: 'bg-purple-500',
      benefits: [
        'PDF, DOC, TXT file support',
        'Automatic content indexing',
        'Semantic search capabilities',
        'Version control and updates'
      ],
      demo: 'knowledge'
    },
    {
      id: 'analytics',
      title: 'Comprehensive Analytics',
      description: 'Track performance with detailed insights and reporting',
      icon: BarChart3,
      color: 'bg-orange-500',
      benefits: [
        'Real-time conversation metrics',
        'User satisfaction tracking',
        'Response time analysis',
        'Export capabilities (CSV/PDF)'
      ],
      demo: 'analytics'
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Bank-grade security with data encryption and compliance',
      icon: Shield,
      color: 'bg-red-500',
      benefits: [
        'End-to-end encryption',
        'GDPR compliance',
        'SOC 2 Type II certified',
        'Multi-tenant data isolation'
      ],
      demo: 'security'
    },
    {
      id: 'customization',
      title: 'Advanced Customization',
      description: 'Tailor bot behavior with advanced settings and configurations',
      icon: Settings,
      color: 'bg-teal-500',
      benefits: [
        'Custom response templates',
        'Rate limiting controls',
        'Timeout configurations',
        'Personality settings'
      ],
      demo: 'settings'
    }
  ]

  const integrations = [
    { name: 'Slack', icon: MessageSquare, status: 'Available' },
    { name: 'Discord', icon: MessageSquare, status: 'Available' },
    { name: 'WhatsApp', icon: Smartphone, status: 'Coming Soon' },
    { name: 'Microsoft Teams', icon: Users, status: 'Available' },
    { name: 'Telegram', icon: MessageSquare, status: 'Available' },
    { name: 'Custom API', icon: Code, status: 'Available' }
  ]

  const renderDemo = () => {
    switch (activeDemo) {
      case 'chat':
        return (
          <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {demoMessages.slice(0, currentMessageIndex + 1).map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border shadow-sm'
                  }`}>
                    {index === currentMessageIndex && message.type === 'bot' ? typingText : message.text}
                    {index === currentMessageIndex && message.type === 'bot' && typingText.length < message.text.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="bg-gray-50 rounded-lg p-4 h-80">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900">Messages Today</h4>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900">Response Time</h4>
                <p className="text-2xl font-bold text-green-600">1.2s</p>
                <p className="text-sm text-green-600">-0.3s improvement</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
              <Progress value={94} className="mb-2" />
              <p className="text-sm text-gray-600">94% of conversations successfully resolved</p>
            </div>
          </div>
        )

      case 'knowledge':
        return (
          <div className="bg-gray-50 rounded-lg p-4 h-80">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Upload Knowledge Base</h4>
              <p className="text-sm text-gray-600 mb-4">Drag and drop files or click to browse</p>
              <Button size="sm">Choose Files</Button>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="text-sm">product-guide.pdf</span>
                <Badge variant="success">Processed</Badge>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded border">
                <span className="text-sm">faq-document.txt</span>
                <Badge variant="info">Processing</Badge>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-gray-50 rounded-lg p-4 h-80 flex items-center justify-center">
            <div className="text-center">
              <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive demo will appear here</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" size="lg" className="mb-6">
            <Star className="h-4 w-4 mr-2" />
            Advanced AI Features
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Smart Automation</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how our AI-powered chatbot platform transforms customer support with intelligent automation, seamless integrations, and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              <PlayCircle className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience It Live</h2>
            <p className="text-lg text-gray-600">Try our interactive demos to see features in action</p>
          </div>

          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="chat">Chat Demo</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="bg-gray-100 rounded-xl p-8">
              {renderDemo()}
            </div>
          </Tabs>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600">Comprehensive features designed for modern businesses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setActiveDemo(feature.demo)}
                  >
                    Try Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-600">Connect with your favorite platforms in minutes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <integration.icon className="h-8 w-8 mx-auto mb-3 text-gray-700" />
                <h4 className="font-semibold text-gray-900 mb-2">{integration.name}</h4>
                <Badge variant={integration.status === 'Available' ? 'success' : 'info'} size="sm">
                  {integration.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Excellence</h2>
            <p className="text-lg text-gray-600">Built with cutting-edge technology for reliability and scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">99.9% Uptime</h4>
              <p className="text-gray-600">Guaranteed reliability with global infrastructure</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">&lt;100ms Response</h4>
              <p className="text-gray-600">Lightning-fast AI responses for better UX</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Scalable Architecture</h4>
              <p className="text-gray-600">Handle millions of conversations seamlessly</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Enterprise Security</h4>
              <p className="text-gray-600">SOC 2, GDPR compliant with encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Customer Support?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using our AI chatbot platform to deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">No credit card required • 14-day free trial</p>
        </div>
      </section>
    </div>
  )
}