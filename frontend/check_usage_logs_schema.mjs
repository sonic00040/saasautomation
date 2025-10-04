// Check the actual schema of usage_logs table
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsageLogsSchema() {
  console.log('🔍 Checking usage_logs table...\n')

  const subscriptionId = '2c336dd3-c888-4278-ab72-11e2877fa84c'

  // Try to select all columns without ordering
  const { data: allLogs, error: allError } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('subscription_id', subscriptionId)

  if (allError) {
    console.error('❌ ERROR fetching all usage_logs:', allError.message)
  } else {
    console.log(`✅ Found ${allLogs?.length || 0} usage log entries`)

    if (allLogs && allLogs.length > 0) {
      console.log('\n📋 Sample entry (first record):')
      console.log(JSON.stringify(allLogs[0], null, 2))

      console.log('\n📋 Column names in usage_logs:')
      Object.keys(allLogs[0]).forEach(key => {
        console.log(`   - ${key}: ${typeof allLogs[0][key]}`)
      })
    } else {
      console.log('\n⚠️  Table is empty, trying to fetch schema from any record...')

      // Try to get any record from usage_logs
      const { data: anyLog, error: anyError } = await supabase
        .from('usage_logs')
        .select('*')
        .limit(1)

      if (anyError) {
        console.error('❌ ERROR:', anyError.message)
      } else if (anyLog && anyLog.length > 0) {
        console.log('\n📋 Column names in usage_logs:')
        Object.keys(anyLog[0]).forEach(key => {
          console.log(`   - ${key}: ${typeof anyLog[0][key]}`)
        })
      } else {
        console.log('❌ No records in usage_logs table at all')
      }
    }
  }

  // Try simple query without any filters
  console.log('\n🧪 Testing simple query (no filters)...')
  const { data: simpleData, error: simpleError } = await supabase
    .from('usage_logs')
    .select('*')
    .limit(5)

  if (simpleError) {
    console.error('❌ ERROR:', simpleError.message)
  } else {
    console.log(`✅ Found ${simpleData?.length || 0} total records in usage_logs`)

    if (simpleData && simpleData.length > 0) {
      console.log('\n📊 Sample records:')
      simpleData.forEach((log, i) => {
        console.log(`\n${i + 1}. Subscription ID: ${log.subscription_id}`)
        console.log(`   Tokens Used: ${log.tokens_used}`)
        console.log(`   All fields:`, Object.keys(log))
      })
    }
  }
}

checkUsageLogsSchema().then(() => process.exit(0))
