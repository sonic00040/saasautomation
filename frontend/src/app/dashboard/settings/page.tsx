'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MFAEnrollmentModal } from '@/components/security/mfa-enrollment-modal'
import { PasswordChangeModal } from '@/components/security/password-change-modal'
import { use2FA } from '@/hooks/use-2fa'
import { useSessionManagement } from '@/hooks/use-session-management'
import {
  Shield,
  User,
  Bell,
  Key,
  Smartphone,
  Monitor,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings as SettingsIcon,
  Trash2
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security')
  const [showMFAModal, setShowMFAModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [mfaFactors, setMfaFactors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { getMFAFactors, unenroll2FA } = use2FA()
  const { sessions, loading: sessionsLoading, revokeSession, revokeAllOtherSessions } = useSessionManagement()

  // Load MFA factors on mount
  useEffect(() => {
    loadMFAFactors()
  }, [])

  const loadMFAFactors = async () => {
    setLoading(true)
    try {
      const factors = await getMFAFactors()
      setMfaFactors(factors)
    } catch (error) {
      console.error('Failed to load MFA factors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMFASuccess = () => {
    loadMFAFactors() // Reload factors after successful enrollment
  }

  const handleRemoveMFA = async (factorId: string) => {
    const success = await unenroll2FA(factorId)
    if (success) {
      loadMFAFactors() // Reload factors after removal
    }
  }

  const hasMFA = mfaFactors.some(factor => factor.status === 'verified')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage your account settings, security preferences, and notifications
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>Sessions</span>
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
                {loading ? (
                  <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-gray-200">
                    Loading...
                  </Badge>
                ) : hasMFA ? (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {!loading && mfaFactors.length > 0 ? (
                  mfaFactors.map((factor) => (
                    <div key={factor.id} className="flex items-center space-x-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{factor.friendly_name || 'Authenticator App'}</h4>
                        <p className="text-sm text-gray-600">
                          {factor.status === 'verified' ? 'Active and protecting your account' : 'Setup in progress'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(factor.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMFA(factor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))
                ) : !loading && (
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Authenticator App</h4>
                      <p className="text-sm text-gray-600">
                        Use an authenticator app to generate time-based codes
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMFAModal(true)}
                    >
                      Set up
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Password Security</h3>
                  <p className="text-gray-600 mt-1">
                    Manage your password and security settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-600">
                        Last changed 3 months ago
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">API Security</h3>
                  <p className="text-gray-600 mt-1">
                    Manage API keys and access tokens
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">API Keys</h4>
                      <p className="text-sm text-gray-600">
                        Manage your bot API keys and webhooks
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
            <div className="text-gray-600">
              Profile management features coming soon...
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="text-gray-600">
              Notification settings coming soon...
            </div>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                <p className="text-gray-600 mt-1">
                  Manage your active login sessions across devices
                </p>
              </div>
              {sessions.filter(s => !s.is_current).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => revokeAllOtherSessions()}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign out all devices
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {sessionsLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active sessions found
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      session.is_current
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Monitor className={`h-5 w-5 ${
                        session.is_current ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {session.is_current ? 'Current Session' : 'Session'}
                          </h4>
                          <Badge variant="secondary" className={
                            session.is_current
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }>
                            {session.is_current ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              'Active'
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {session.device} • {session.browser} • {session.os}
                        </p>
                        {session.location && (
                          <p className="text-sm text-gray-600">
                            {session.location}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Last active: {session.is_current ? 'Just now' : new Date(session.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {session.is_current ? (
                        <Badge variant="outline" className="text-gray-500">
                          This device
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeSession(session.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Sign out
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {!sessionsLoading && sessions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Security Tip</h4>
                      <p className="text-sm text-blue-800">
                        If you see any sessions you don't recognize, sign them out immediately and consider changing your password.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* MFA Enrollment Modal */}
      <MFAEnrollmentModal
        open={showMFAModal}
        onOpenChange={setShowMFAModal}
        onSuccess={handleMFASuccess}
      />

      {/* Password Change Modal */}
      <PasswordChangeModal
        open={showPasswordModal}
        onOpenChange={setShowPasswordModal}
        onSuccess={() => {
          // Handle success if needed
        }}
      />
    </div>
  )
}