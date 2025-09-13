'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CreditCard, 
  DollarSign, 
  Calendar,
  Download,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings,
  Receipt,
  Wallet
} from "lucide-react"

interface BillingData {
  currentPlan: {
    name: string
    price: number
    period: string
    features: string[]
    limits: {
      messages: number
      bots: number
      storage: string
    }
  }
  usage: {
    messages: {
      used: number
      limit: number
      resetDate: string
    }
    bots: {
      used: number
      limit: number
    }
    storage: {
      used: number // in bytes
      limit: number // in bytes
    }
  }
  paymentMethod: {
    type: 'card' | 'paypal'
    last4?: string
    brand?: string
    expiryMonth?: number
    expiryYear?: number
    email?: string
  }
  nextBilling: {
    date: string
    amount: number
  }
  invoices: Array<{
    id: string
    date: string
    amount: number
    status: 'paid' | 'pending' | 'failed'
    description: string
    downloadUrl?: string
  }>
}

export default function BillingPage() {
  const [showUpgrade, setShowUpgrade] = useState(false)

  // Mock billing data - in real app this would come from API
  const billingData: BillingData = {
    currentPlan: {
      name: 'Professional',
      price: 99,
      period: 'month',
      features: [
        '10,000 messages/month',
        '5 chatbots',
        'Advanced knowledge base',
        'Priority email support',
        'Custom branding',
        'API access'
      ],
      limits: {
        messages: 10000,
        bots: 5,
        storage: '10 GB'
      }
    },
    usage: {
      messages: {
        used: 7234,
        limit: 10000,
        resetDate: '2025-02-01'
      },
      bots: {
        used: 2,
        limit: 5
      },
      storage: {
        used: 3221225472, // 3 GB in bytes
        limit: 10737418240 // 10 GB in bytes
      }
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027
    },
    nextBilling: {
      date: '2025-02-01',
      amount: 99
    },
    invoices: [
      {
        id: 'inv_2025_01_001',
        date: '2025-01-01',
        amount: 99,
        status: 'paid',
        description: 'Professional Plan - January 2025',
        downloadUrl: '/invoices/inv_2025_01_001.pdf'
      },
      {
        id: 'inv_2024_12_001',
        date: '2024-12-01',
        amount: 99,
        status: 'paid',
        description: 'Professional Plan - December 2024',
        downloadUrl: '/invoices/inv_2024_12_001.pdf'
      },
      {
        id: 'inv_2024_11_001',
        date: '2024-11-01',
        amount: 99,
        status: 'paid',
        description: 'Professional Plan - November 2024',
        downloadUrl: '/invoices/inv_2024_11_001.pdf'
      }
    ]
  }

  const messageUsagePercent = (billingData.usage.messages.used / billingData.usage.messages.limit) * 100
  const storageUsagePercent = (billingData.usage.storage.used / billingData.usage.storage.limit) * 100
  const botUsagePercent = (billingData.usage.bots.used / billingData.usage.bots.limit) * 100

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'danger'
    if (percentage >= 75) return 'warning'
    return 'success'
  }

  const downloadInvoice = (invoice: any) => {
    // In real app, this would download the actual invoice
    console.log('Downloading invoice:', invoice.id)
  }

  const plans = [
    {
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for small businesses',
      features: ['1,000 messages/month', '1 chatbot', 'Basic support'],
      current: false
    },
    {
      name: 'Professional',
      price: 99,
      period: 'month',
      description: 'Advanced features for growing businesses',
      features: ['10,000 messages/month', '5 chatbots', 'Priority support', 'API access'],
      current: true
    },
    {
      name: 'Enterprise',
      price: 299,
      period: 'month',
      description: 'Full-featured solution for large organizations',
      features: ['50,000 messages/month', 'Unlimited chatbots', '24/7 support', 'Custom integrations'],
      current: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with dark theme matching screenshot */}
      <div className="bg-slate-900 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wallet className="h-7 w-7 text-yellow-400" />
              Billing & Usage
            </h1>
            <p className="mt-2 text-slate-300">
              Manage your subscription, usage, and billing information
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold">
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Current Plan
                </CardTitle>
                <CardDescription>
                  Your active subscription and usage details
                </CardDescription>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                {billingData.currentPlan.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Details */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-slate-900 text-lg">
                  ${billingData.currentPlan.price}/{billingData.currentPlan.period}
                </h3>
                <p className="text-sm text-slate-600">
                  Billed monthly • Next billing: {new Date(billingData.nextBilling.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Next payment</p>
                <p className="font-semibold text-slate-900">
                  ${billingData.nextBilling.amount}
                </p>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Usage This Month</h4>
              
              {/* Messages Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Messages</span>
                  <span className="font-medium">
                    {billingData.usage.messages.used.toLocaleString()} / {billingData.usage.messages.limit.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={messageUsagePercent} 
                  variant={getUsageColor(messageUsagePercent) as any}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{messageUsagePercent.toFixed(1)}% used</span>
                  <span>Resets on {new Date(billingData.usage.messages.resetDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Storage Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Storage</span>
                  <span className="font-medium">
                    {formatBytes(billingData.usage.storage.used)} / {formatBytes(billingData.usage.storage.limit)}
                  </span>
                </div>
                <Progress 
                  value={storageUsagePercent} 
                  variant={getUsageColor(storageUsagePercent) as any}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{storageUsagePercent.toFixed(1)}% used</span>
                  <span>{formatBytes(billingData.usage.storage.limit - billingData.usage.storage.used)} remaining</span>
                </div>
              </div>

              {/* Bots Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Active Bots</span>
                  <span className="font-medium">
                    {billingData.usage.bots.used} / {billingData.usage.bots.limit}
                  </span>
                </div>
                <Progress 
                  value={botUsagePercent} 
                  variant={getUsageColor(botUsagePercent) as any}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{billingData.usage.bots.limit - billingData.usage.bots.used} slots available</span>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Plan Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {billingData.currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method & Quick Actions */}
        <div className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
                <div className="w-10 h-6 bg-slate-900 rounded text-white text-xs flex items-center justify-center font-bold">
                  {billingData.paymentMethod.brand?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    •••• •••• •••• {billingData.paymentMethod.last4}
                  </p>
                  <p className="text-xs text-slate-500">
                    Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                  </p>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  ${billingData.currentPlan.price}
                </div>
                <div className="text-sm text-slate-600">Current charges</div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan cost:</span>
                  <span className="font-medium">${billingData.currentPlan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Overages:</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Credits:</span>
                  <span className="font-medium text-green-600">-$0</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${billingData.currentPlan.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                Billing History
              </CardTitle>
              <CardDescription>
                Your recent invoices and payment history
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingData.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{invoice.description}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${invoice.amount}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'destructive'}
                  >
                    {invoice.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {invoice.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {invoice.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {invoice.status}
                  </Badge>
                  
                  {invoice.downloadUrl && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadInvoice(invoice)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-600" />
            Available Plans
          </CardTitle>
          <CardDescription>
            Upgrade or downgrade your plan at any time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`p-4 border rounded-lg ${plan.current ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200'}`}
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-slate-900">{plan.name}</h3>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    ${plan.price}<span className="text-sm font-normal text-slate-600">/{plan.period}</span>
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{plan.description}</p>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.current ? "secondary" : "outline"} 
                  className="w-full"
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : plan.price > billingData.currentPlan.price ? 'Upgrade' : 'Downgrade'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}