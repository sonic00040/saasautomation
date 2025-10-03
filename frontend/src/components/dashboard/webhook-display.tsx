'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle, ExternalLink } from 'lucide-react'

interface WebhookDisplayProps {
  platform: 'telegram' | 'whatsapp'
  botToken?: string
  businessPhone?: string
  environment?: 'development' | 'production'
}

export function WebhookDisplay({ platform, botToken, businessPhone, environment = 'development' }: WebhookDisplayProps) {
  const [copied, setCopied] = useState(false)

  const backendUrl = environment === 'production'
    ? process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend.railway.app'
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

  const webhookUrl = platform === 'telegram'
    ? `${backendUrl}/webhook/${botToken}`
    : `${backendUrl}/webhook/whatsapp/${businessPhone}`

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const setupInstructions = {
    telegram: {
      title: 'Telegram Webhook Setup',
      steps: [
        'Copy the webhook URL above',
        'Send this command to @BotFather: /setwebhook',
        'Paste your webhook URL when prompted',
        'BotFather will confirm the webhook is set'
      ],
      docs: 'https://core.telegram.org/bots/api#setwebhook'
    },
    whatsapp: {
      title: 'WhatsApp Webhook Setup',
      steps: [
        'Go to Meta for Developers dashboard',
        'Select your WhatsApp Business app',
        'Navigate to Webhooks configuration',
        'Paste the webhook URL and verify token',
        'Subscribe to message events'
      ],
      docs: 'https://developers.facebook.com/docs/whatsapp/webhooks'
    }
  }

  const config = setupInstructions[platform]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
        {environment === 'development' && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            Development
          </span>
        )}
        {environment === 'production' && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            Production
          </span>
        )}
      </div>

      {/* Webhook URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={webhookUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm text-gray-700"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Setup Instructions (Development) */}
      {environment === 'development' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">Manual Setup Required</h4>
              <p className="text-sm text-yellow-700 mb-3">
                In development, you need to manually configure your webhook:
              </p>
              <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                {config.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Automatic Setup (Production) */}
      {environment === 'production' && platform === 'telegram' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-2">Automatic Setup</h4>
              <p className="text-sm text-green-700">
                Your webhook has been automatically configured for production. No manual setup required!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Production Note */}
      {environment === 'production' && platform === 'whatsapp' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">WhatsApp Setup</h4>
              <p className="text-sm text-blue-700 mb-3">
                WhatsApp webhooks must be configured in Meta Business Suite:
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                {config.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Link */}
      <a
        href={config.docs}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        <ExternalLink className="w-4 h-4" />
        View {platform === 'telegram' ? 'Telegram' : 'WhatsApp'} Documentation
      </a>
    </div>
  )
}
