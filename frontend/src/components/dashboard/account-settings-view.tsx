'use client'

import { useState } from 'react'
import { Save, Lock, Mail, Building2, MessageSquare, Bot as BotIcon, Loader2, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface AccountSettingsViewProps {
  user: {
    email: string
  }
  company: {
    id: string
    name: string
    email: string
    platform: 'telegram' | 'whatsapp'
  }
  nextBillingDate?: string
}

export function AccountSettingsView({ user, company, nextBillingDate }: AccountSettingsViewProps) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: company.name,
    businessEmail: company.email
  })

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('companies')
        .update({
          name: formData.companyName,
          email: formData.businessEmail
        })
        .eq('id', company.id)

      if (updateError) throw updateError

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (resetError) throw resetError

      alert('Password reset email sent! Check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will delete all your bots, knowledge bases, and data.'
    )

    if (!confirmed) return

    const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:')

    if (doubleConfirm !== 'DELETE') {
      alert('Account deletion cancelled.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Delete company (cascade will delete bots, knowledge bases, etc.)
      const { error: deleteError } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id)

      if (deleteError) throw deleteError

      // Sign out
      await supabase.auth.signOut()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  const platformConfig = {
    telegram: {
      icon: MessageSquare,
      name: 'Telegram',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    whatsapp: {
      icon: BotIcon,
      name: 'WhatsApp',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    }
  }

  const config = platformConfig[company.platform]
  const PlatformIcon = config.icon

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your account and company information</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Login Email (Read-Only) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Authentication</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login Email
            </label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is your login email and cannot be changed
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Company Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email
            </label>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This can be different from your login email
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

      {/* Platform Lock */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Platform</h2>

        <div className={`p-4 ${config.bgColor} rounded-lg flex items-center gap-3`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <PlatformIcon className={`w-5 h-5 ${config.textColor}`} />
              <Lock className={`w-4 h-4 ${config.textColor}`} />
              <span className={`font-bold ${config.textColor}`}>{config.name}</span>
            </div>
            <p className={`text-sm ${config.textColor}`}>
              Your platform is locked to {config.name} until {nextBillingDate || 'your next billing cycle'}.
              To switch platforms, wait until the billing cycle ends or contact support.
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border-2 border-red-200 p-6">
        <h2 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Once you delete your account, there is no going back. All your bots, conversations, and data will be permanently deleted.
          </p>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
