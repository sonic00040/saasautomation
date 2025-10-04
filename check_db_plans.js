// Query actual Supabase database to check plans
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPlans() {
  console.log('🔍 Querying actual Supabase database...\n')

  const { data: plans, error } = await supabase
    .from('plans')
    .select('*')
    .order('price', { ascending: true })

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log('✅ ACTUAL PLANS IN DATABASE:\n')
  console.log('═'.repeat(80))

  plans.forEach((plan, index) => {
    console.log(`\n${index + 1}. ${plan.name}`)
    console.log(`   Price: $${plan.price}`)
    console.log(`   Token Limit: ${plan.token_limit.toLocaleString()} tokens`)
    console.log(`   Features: ${JSON.stringify(plan.features, null, 2)}`)
    console.log(`   Is Active: ${plan.is_active}`)
    console.log(`   ID: ${plan.id}`)
  })

  console.log('\n' + '═'.repeat(80))
  console.log(`\nTotal Plans: ${plans.length}`)
}

checkPlans().then(() => process.exit(0))
