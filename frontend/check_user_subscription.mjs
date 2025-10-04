// Check subscription for specific user
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUserSubscription() {
  const email = 'akindunbisulaiman00040@gmail.com'

  console.log(`🔍 Checking subscription for: ${email}\n`)
  console.log('═'.repeat(80))

  // First, find the user
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()

  if (userError) {
    console.error('❌ Cannot list users (need service role key for this)')
    console.log('\n💡 Checking by company email instead...\n')
  }

  // Get company by email
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('email', email)
    .single()

  if (companyError) {
    console.error('❌ Company not found by email, trying user_id lookup...')

    // Try to get all companies to find the user
    const { data: allCompanies } = await supabase
      .from('companies')
      .select('*')

    console.log('\n📋 ALL COMPANIES IN DATABASE:')
    allCompanies?.forEach((c, i) => {
      console.log(`\n${i + 1}. ${c.name}`)
      console.log(`   Email: ${c.email}`)
      console.log(`   User ID: ${c.user_id}`)
      console.log(`   Platform: ${c.platform}`)
    })
    return
  }

  console.log('✅ COMPANY FOUND:')
  console.log(`   Name: ${company.name}`)
  console.log(`   Email: ${company.email}`)
  console.log(`   Platform: ${company.platform}`)
  console.log(`   Company ID: ${company.id}`)
  console.log(`   User ID: ${company.user_id}`)
  console.log()

  // Get ALL subscriptions for this company (active and inactive)
  const { data: subs, error: subError } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  if (subError) {
    console.error('❌ Error fetching subscriptions:', subError.message)
    return
  }

  console.log('═'.repeat(80))
  console.log(`\n📊 SUBSCRIPTIONS FOR ${company.name}:\n`)

  if (subs.length === 0) {
    console.log('❌ NO SUBSCRIPTIONS FOUND!\n')
    return
  }

  subs.forEach((sub, index) => {
    const status = sub.is_active ? '✅ ACTIVE' : '❌ INACTIVE'
    console.log(`${index + 1}. ${status} - ${sub.plan?.name || 'Unknown Plan'}`)
    console.log(`   Price: $${sub.plan?.price || 0}`)
    console.log(`   Token Limit: ${sub.plan?.token_limit?.toLocaleString() || 'Unknown'} tokens`)
    console.log(`   Start: ${sub.start_date}`)
    console.log(`   End: ${sub.end_date || 'N/A'}`)
    console.log(`   Created: ${sub.created_at}`)
    console.log()
  })

  const activeSub = subs.find(s => s.is_active)

  console.log('═'.repeat(80))
  console.log('\n🎯 CURRENT ACTIVE SUBSCRIPTION:')
  if (activeSub) {
    console.log(`   Plan: ${activeSub.plan?.name}`)
    console.log(`   Price: $${activeSub.plan?.price}/month`)
    console.log(`   Token Limit: ${activeSub.plan?.token_limit?.toLocaleString()} tokens`)
    console.log(`   Status: ✅ ACTIVE`)
  } else {
    console.log('   ❌ NO ACTIVE SUBSCRIPTION!')
  }
  console.log()
}

checkUserSubscription().then(() => process.exit(0))
