'use client'

import { useState, useEffect } from 'react'
import { Save, FileText, Loader2, Check } from 'lucide-react'

interface KnowledgeBaseEditorProps {
  botId: string
  initialContent?: string
  onSave: (content: string) => Promise<void>
  onClose: () => void
}

export function KnowledgeBaseEditor({ botId, initialContent = '', onSave, onClose }: KnowledgeBaseEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      await onSave(content)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save knowledge base'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Knowledge Base Editor</h2>
              <p className="text-sm text-gray-600">
                {wordCount} words • {charCount} characters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Knowledge Base Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Enter information about your products, services, FAQs, company policies, etc.

Example:
Q: What are your business hours?
A: We're open Monday-Friday, 9 AM - 6 PM EST.

Q: What products do you offer?
A: We offer premium footwear including sneakers, boots, and sandals.

Q: What's your return policy?
A: We accept returns within 30 days of purchase with original packaging."
            />
          </div>

          <div className="text-xs text-gray-500">
            Tip: Add frequently asked questions, product details, company policies, or any information you want your bot to reference.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {saved && (
              <span className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                Changes saved successfully
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
