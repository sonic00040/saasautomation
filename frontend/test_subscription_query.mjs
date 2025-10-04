// Test the EXACT query the hook uses
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testQuery() {
  const companyId = '0400e028-6d9f-4158-8953-c75272513e5f' // Tech Nova Electronics

  console.log('🔍 Testing EXACT query from useSubscription hook...\n')
  console.log(`Company ID: ${companyId}\n`)
  console.log('═'.repeat(80))

  // This is the EXACT query from the hook (BEFORE my changes)
  console.log('\n📝 Query 1: WITHOUT .order() and .limit() (OLD CODE):')
  const { data: subData1, error: subError1 } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .single()

  if (subError1) {
    console.error('❌ Error:', subError1.message, subError1.code)
  } else {
    console.log(`✅ Result: ${subData1?.plan?.name} - $${subData1?.plan?.price} - ${subData1?.plan?.token_limit?.toLocaleString()} tokens`)
  }

  // This is the query AFTER my changes
  console.log('\n📝 Query 2: WITH .order() and .limit() (NEW CODE):')
  const { data: subData2, error: subError2 } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (subError2) {
    console.error('❌ Error:', subError2.message, subError2.code)
  } else {
    console.log(`✅ Result: ${subData2?.plan?.name} - $${subData2?.plan?.price} - ${subData2?.plan?.token_limit?.toLocaleString()} tokens`)
  }

  // Let's also try without .single() to see ALL active subscriptions
  console.log('\n📝 Query 3: ALL active subscriptions (debugging):')
  const { data: allActive, error: allError } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (allError) {
    console.error('❌ Error:', allError.message)
  } else {
    console.log(`✅ Found ${allActive?.length || 0} active subscription(s):`)
    allActive?.forEach((sub, i) => {
      console.log(`   ${i + 1}. ${sub.plan?.name} - Created: ${sub.created_at}`)
    })
  }

  console.log('\n' + '═'.repeat(80))
}

testQuery().then(() => process.exit(0))
