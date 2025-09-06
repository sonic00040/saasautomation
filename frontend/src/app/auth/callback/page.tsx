'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code')
        
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            setError(error.message)
            setLoading(false)
            return
          }

          if (data.user) {
            setSuccess('Email verified successfully! Redirecting to dashboard...')
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
        } else {
          setError('No verification code found')
        }
      } catch (err) {
        setError('An unexpected error occurred during verification')
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            {success && <CheckCircle className="h-5 w-5 text-green-600" />}
            {error && <XCircle className="h-5 w-5 text-red-600" />}
            Email Verification
          </CardTitle>
          <CardDescription>
            {loading && 'Verifying your email...'}
            {success && 'Email verified successfully!'}
            {error && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center">
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </div>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}