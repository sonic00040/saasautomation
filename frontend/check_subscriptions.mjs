// Check actual subscriptions in database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSubscriptions() {
  console.log('🔍 Checking subscriptions in database...\n')

  // Get all subscriptions with plan details
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*),
      company:companies(name, email, user_id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log('✅ SUBSCRIPTIONS IN DATABASE:\n')
  console.log('═'.repeat(80))

  if (subs.length === 0) {
    console.log('\n❌ NO SUBSCRIPTIONS FOUND')
    console.log('This means no user has completed onboarding yet.\n')
    return
  }

  subs.forEach((sub, index) => {
    console.log(`\n${index + 1}. Subscription ID: ${sub.id}`)
    console.log(`   Company: ${sub.company?.name || 'Unknown'}`)
    console.log(`   Plan: ${sub.plan?.name || 'Unknown'}`)
    console.log(`   Price: $${sub.plan?.price || 0}`)
    console.log(`   Token Limit: ${sub.plan?.token_limit?.toLocaleString() || 'Unknown'} tokens`)
    console.log(`   Is Active: ${sub.is_active ? '✅ YES' : '❌ NO'}`)
    console.log(`   Start Date: ${sub.start_date}`)
    console.log(`   End Date: ${sub.end_date || 'N/A'}`)
    console.log(`   Created: ${sub.created_at}`)
  })

  console.log('\n' + '═'.repeat(80))
  console.log(`\nTotal Subscriptions: ${subs.length}`)
  console.log(`Active Subscriptions: ${subs.filter(s => s.is_active).length}`)
}

checkSubscriptions().then(() => process.exit(0))
