// Check total usage calculation
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTotalUsage() {
  const subscriptionId = '2c336dd3-c888-4278-ab72-11e2877fa84c'

  console.log('🔍 Calculating total usage...\n')

  // Get all usage logs for this subscription
  const { data: logs, error } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('subscription_id', subscriptionId)

  if (error) {
    console.error('❌ ERROR:', error.message)
    return
  }

  console.log(`✅ Found ${logs.length} usage log entries\n`)

  let totalTokens = 0
  logs.forEach((log, i) => {
    console.log(`${i + 1}. ID: ${log.id}`)
    console.log(`   Subscription ID: ${log.subscription_id}`)
    console.log(`   Total Tokens: ${log.total_tokens}`)
    console.log(`   Timestamp: ${log.timestamp}`)
    totalTokens += log.total_tokens
  })

  console.log('\n' + '='.repeat(60))
  console.log(`📊 TOTAL TOKENS USED: ${totalTokens.toLocaleString()}`)
  console.log(`📊 PLAN LIMIT: 30,000,000`)
  console.log(`📊 REMAINING: ${(30000000 - totalTokens).toLocaleString()}`)
  console.log(`📊 PERCENTAGE USED: ${((totalTokens / 30000000) * 100).toFixed(4)}%`)
  console.log('='.repeat(60))

  // Test the RPC function
  console.log('\n🧪 Testing get_total_usage RPC function...')

  const { data: rpcResult, error: rpcError } = await supabase.rpc('get_total_usage', {
    p_subscription_id: subscriptionId,
    p_start_date: '2025-10-03T23:08:45.859+00:00',
    p_end_date: '2025-11-02T23:08:45.859+00:00'
  })

  if (rpcError) {
    console.error('❌ RPC ERROR:', rpcError.message)
  } else {
    console.log(`✅ RPC returned: ${rpcResult} tokens`)

    if (rpcResult !== totalTokens) {
      console.log(`⚠️  WARNING: RPC result (${rpcResult}) doesn't match calculated total (${totalTokens})`)
    }
  }
}

checkTotalUsage().then(() => process.exit(0))
