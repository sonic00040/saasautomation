import { supabase } from './lib/supabase'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')

  try {
    // Test basic connection
    const { data, error } = await supabase.from('_supabase_test').select('*').limit(1)
    console.log('✅ Basic connection test:', { data, error: error?.message || 'none' })

    // Check if companies table exists
    console.log('📋 Testing companies table...')
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1)

    console.log('Companies table result:', {
      exists: !companiesError,
      data: companies?.length || 0,
      error: companiesError?.message || 'none'
    })

    // Check if bots table exists
    console.log('🤖 Testing bots table...')
    const { data: bots, error: botsError } = await supabase
      .from('bots')
      .select('*')
      .limit(1)

    console.log('Bots table result:', {
      exists: !botsError,
      data: bots?.length || 0,
      error: botsError?.message || 'none'
    })

    // Check if activities table exists
    console.log('📊 Testing activities table...')
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*')
      .limit(1)

    console.log('Activities table result:', {
      exists: !activitiesError,
      data: activities?.length || 0,
      error: activitiesError?.message || 'none'
    })

    // Test auth
    console.log('🔐 Testing auth...')
    const { data: authData, error: authError } = await supabase.auth.getUser()
    console.log('Auth result:', {
      user: authData.user?.email || 'not authenticated',
      error: authError?.message || 'none'
    })

  } catch (error) {
    console.error('❌ Connection test failed:', error)
  }
}

// Run the test
testSupabaseConnection()