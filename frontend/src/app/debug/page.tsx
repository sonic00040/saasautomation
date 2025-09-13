'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const testSupabase = async () => {
      const tests = []

      // Test 1: Check environment variables
      tests.push({
        test: 'Environment Variables',
        result: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
        }
      })

      // Test 2: Basic connection
      try {
        const { data, error } = await supabase.rpc('now')
        tests.push({
          test: 'Basic Connection',
          result: { success: !error, error: error?.message, time: data }
        })
      } catch (err) {
        tests.push({
          test: 'Basic Connection',
          result: { success: false, error: (err as Error).message }
        })
      }

      // Test 3: Companies table
      try {
        const { data, error } = await supabase.from('companies').select('*').limit(1)
        tests.push({
          test: 'Companies Table',
          result: { exists: !error, count: data?.length || 0, error: error?.message }
        })
      } catch (err) {
        tests.push({
          test: 'Companies Table',
          result: { exists: false, error: (err as Error).message }
        })
      }

      // Test 4: Bots table
      try {
        const { data, error } = await supabase.from('bots').select('*').limit(1)
        tests.push({
          test: 'Bots Table',
          result: { exists: !error, count: data?.length || 0, error: error?.message }
        })
      } catch (err) {
        tests.push({
          test: 'Bots Table',
          result: { exists: false, error: (err as Error).message }
        })
      }

      // Test 5: Activities table
      try {
        const { data, error } = await supabase.from('activities').select('*').limit(1)
        tests.push({
          test: 'Activities Table',
          result: { exists: !error, count: data?.length || 0, error: error?.message }
        })
      } catch (err) {
        tests.push({
          test: 'Activities Table',
          result: { exists: false, error: (err as Error).message }
        })
      }

      // Test 6: Knowledge bases table
      try {
        const { data, error } = await supabase.from('knowledge_bases').select('*').limit(1)
        tests.push({
          test: 'Knowledge Bases Table',
          result: { exists: !error, count: data?.length || 0, error: error?.message }
        })
      } catch (err) {
        tests.push({
          test: 'Knowledge Bases Table',
          result: { exists: false, error: (err as Error).message }
        })
      }

      // Test 7: Auth status
      try {
        const { data, error } = await supabase.auth.getUser()
        tests.push({
          test: 'Authentication',
          result: {
            authenticated: !!data.user,
            user: data.user?.email || 'none',
            error: error?.message
          }
        })
      } catch (err) {
        tests.push({
          test: 'Authentication',
          result: { authenticated: false, error: (err as Error).message }
        })
      }

      setResults(tests)
    }

    testSupabase()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supabase Debug Information</h1>

      <div className="space-y-4">
        {results.map((test, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{test.test}</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(test.result, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Running tests...</p>
        </div>
      )}
    </div>
  )
}