'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { use2FA } from '@/hooks/use-2fa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Smartphone,
  Copy,
  CheckCircle,
  AlertCircle,
  Shield,
  ArrowRight,
  Download
} from 'lucide-react'

interface MFAEnrollmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function MFAEnrollmentModal({ open, onOpenChange, onSuccess }: MFAEnrollmentModalProps) {
  const [step, setStep] = useState<'start' | 'setup' | 'verify'>('start')
  const [verificationCode, setVerificationCode] = useState('')
  const [secretCopied, setSecretCopied] = useState(false)

  const {
    loading,
    error,
    enrollmentData,
    enroll2FA,
    verify2FAEnrollment,
    clearError,
    clearEnrollmentData
  } = use2FA()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep('start')
      setVerificationCode('')
      setSecretCopied(false)
      clearError()
      clearEnrollmentData()
    }
  }, [open, clearError, clearEnrollmentData])

  const handleStartEnrollment = async () => {
    const result = await enroll2FA()
    if (result) {
      setStep('setup')
    }
  }

  const handleVerifyCode = async () => {
    if (!enrollmentData || !verificationCode.trim()) {
      return
    }

    const success = await verify2FAEnrollment(enrollmentData.id, verificationCode.trim())
    if (success) {
      setStep('verify')
      // Wait a moment then close modal and trigger success callback
      setTimeout(() => {
        onOpenChange(false)
        onSuccess()
      }, 2000)
    }
  }

  const copySecret = async () => {
    if (enrollmentData?.totp.secret) {
      await navigator.clipboard.writeText(enrollmentData.totp.secret)
      setSecretCopied(true)
      setTimeout(() => setSecretCopied(false), 3000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {step === 'start' && (
          <>
            <DialogHeader>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                  <DialogDescription>
                    Add an extra layer of security to your account
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What you&apos;ll need:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>An authenticator app (Google Authenticator, Authy, etc.)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Access to your phone to scan a QR code</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Important</h4>
                    <p className="text-sm text-amber-800">
                      Once enabled, you&apos;ll need your authenticator app to sign in. Make sure to save your backup codes.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </Alert>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartEnrollment}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Setting up...' : 'Get Started'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'setup' && enrollmentData && (
          <>
            <DialogHeader>
              <DialogTitle>Set up your authenticator app</DialogTitle>
              <DialogDescription>
                Scan the QR code below with your authenticator app
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <Image
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(enrollmentData.totp.qr_code)}`}
                    alt="2FA QR Code"
                    width={200}
                    height={200}
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Can&apos;t scan? Enter this code manually:
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {enrollmentData.totp.secret}
                    </code>
                    <Button
                      onClick={copySecret}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      {secretCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {secretCopied && (
                    <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
                  )}
                </div>
              </div>

              {/* Verification */}
              <div className="space-y-3">
                <Label htmlFor="verification-code">
                  Enter the 6-digit code from your authenticator app
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </Alert>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setStep('start')}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <DialogHeader>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <DialogTitle>Two-Factor Authentication Enabled!</DialogTitle>
                <DialogDescription>
                  Your account is now protected with 2FA
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Next time you sign in, you&apos;ll be asked for a code from your authenticator app.
                </p>
              </div>

              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="h-3 w-3 mr-1" />
                Account Secured
              </Badge>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}