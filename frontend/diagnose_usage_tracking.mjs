// Comprehensive diagnostic script for usage tracking issues
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjvvkfecdrdxmnxwiuto.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdnZrZmVjZHJkeG1ueHdpdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTUzNzgsImV4cCI6MjA3MjQzMTM3OH0.ibTmovGAgl_LUztNVvu2mRhdiAeVxIzYLSMWXbc4PCI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnoseUsageTracking() {
  const email = 'akindunbisulaiman00040@gmail.com'

  console.log('\n' + '='.repeat(80))
  console.log('🔍 USAGE TRACKING DIAGNOSTIC REPORT')
  console.log('='.repeat(80))
  console.log(`User Email: ${email}`)
  console.log(`Date: ${new Date().toISOString()}`)
  console.log('='.repeat(80) + '\n')

  // ========== STEP 1: Find Company ==========
  console.log('📋 STEP 1: Finding Company by Email\n')

  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('email', email)
    .single()

  if (companyError || !company) {
    console.error('❌ ERROR: Company not found!')
    console.error('Error details:', companyError?.message || 'No data returned')

    // Try to find all companies
    const { data: allCompanies } = await supabase
      .from('companies')
      .select('*')

    console.log('\n📋 All companies in database:')
    allCompanies?.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} (${c.email}) - Platform: ${c.platform}`)
    })
    return
  }

  console.log('✅ Company Found:')
  console.log(`   ID: ${company.id}`)
  console.log(`   Name: ${company.name}`)
  console.log(`   Email: ${company.email}`)
  console.log(`   Platform: ${company.platform}`)
  console.log(`   User ID: ${company.user_id}`)
  console.log(`   Telegram Bot Token: ${company.telegram_bot_token ? 'SET (' + company.telegram_bot_token.substring(0, 10) + '...)' : 'NOT SET'}`)
  console.log(`   Created: ${company.created_at}`)

  // ========== STEP 2: Check Active Subscription ==========
  console.log('\n📊 STEP 2: Checking Active Subscription\n')

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('company_id', company.id)
    .eq('is_active', true)
    .single()

  if (subError || !subscription) {
    console.error('❌ ERROR: No active subscription found!')
    console.error('Error details:', subError?.message || 'No data returned')

    // Check all subscriptions (including inactive)
    const { data: allSubs } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('company_id', company.id)

    console.log('\n📋 All subscriptions for this company:')
    allSubs?.forEach((s, i) => {
      console.log(`  ${i + 1}. Plan: ${s.plan?.name}, Active: ${s.is_active}, Created: ${s.created_at}`)
    })
    return
  }

  console.log('✅ Active Subscription Found:')
  console.log(`   Subscription ID: ${subscription.id}`)
  console.log(`   Plan: ${subscription.plan?.name}`)
  console.log(`   Price: $${subscription.plan?.price}`)
  console.log(`   Token Limit: ${subscription.plan?.token_limit?.toLocaleString()} tokens`)
  console.log(`   Is Active: ${subscription.is_active}`)
  console.log(`   Start Date: ${subscription.start_date}`)
  console.log(`   End Date: ${subscription.end_date || 'No end date (ongoing)'}`)
  console.log(`   Created: ${subscription.created_at}`)

  // ========== STEP 3: Check Bot Configuration ==========
  console.log('\n🤖 STEP 3: Checking Bot Configuration\n')

  const { data: bots, error: botsError } = await supabase
    .from('bots')
    .select('*')
    .eq('company_id', company.id)

  if (botsError) {
    console.error('❌ ERROR fetching bots:', botsError.message)
  } else if (!bots || bots.length === 0) {
    console.log('⚠️  WARNING: No bots found in bots table!')
    console.log('   The system may be using telegram_bot_token from companies table instead')
  } else {
    console.log(`✅ Found ${bots.length} bot(s):`)
    bots.forEach((bot, i) => {
      console.log(`   ${i + 1}. ${bot.name}`)
      console.log(`      Platform: ${bot.platform}`)
      console.log(`      Active: ${bot.is_active}`)
      console.log(`      Token: ${bot.token ? bot.token.substring(0, 10) + '...' : 'NOT SET'}`)
      console.log(`      Webhook: ${bot.webhook_url || 'NOT SET'}`)
      console.log(`      Last Activity: ${bot.last_activity || 'Never'}`)
    })
  }

  // ========== STEP 4: Check Knowledge Base ==========
  console.log('\n📚 STEP 4: Checking Knowledge Base\n')

  const { data: knowledgeBase, error: kbError } = await supabase
    .from('knowledge_bases')
    .select('*')
    .eq('company_id', company.id)

  if (kbError) {
    console.error('❌ ERROR fetching knowledge base:', kbError.message)
  } else if (!knowledgeBase || knowledgeBase.length === 0) {
    console.log('⚠️  WARNING: No knowledge base entries found!')
    console.log('   The bot cannot provide AI responses without knowledge base content')
  } else {
    console.log(`✅ Found ${knowledgeBase.length} knowledge base entry/entries:`)
    knowledgeBase.forEach((kb, i) => {
      const contentPreview = kb.content.substring(0, 100) + (kb.content.length > 100 ? '...' : '')
      console.log(`   ${i + 1}. Title: ${kb.title || 'Untitled'}`)
      console.log(`      File: ${kb.file_name || 'N/A'}`)
      console.log(`      Size: ${kb.file_size ? (kb.file_size / 1024).toFixed(2) + ' KB' : 'N/A'}`)
      console.log(`      Content Length: ${kb.content.length} characters`)
      console.log(`      Preview: ${contentPreview}`)
      console.log(`      Created: ${kb.created_at}`)
    })
  }

  // ========== STEP 5: Check Usage Logs (CRITICAL!) ==========
  console.log('\n💰 STEP 5: Checking Usage Logs (CRITICAL!)\n')

  const { data: usageLogs, error: usageError } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('subscription_id', subscription.id)
    .order('created_at', { ascending: false })

  if (usageError) {
    console.error('❌ ERROR fetching usage logs:', usageError.message)
  } else if (!usageLogs || usageLogs.length === 0) {
    console.log('❌ CRITICAL: NO USAGE LOGS FOUND!')
    console.log('   This explains why the dashboard shows 0 usage!')
    console.log('\n   Possible causes:')
    console.log('   1. Backend record_usage() function is not being called')
    console.log('   2. Backend record_usage() is failing silently')
    console.log('   3. Subscription ID mismatch between backend and database')
    console.log('   4. Database permissions preventing inserts into usage_logs')
  } else {
    console.log(`✅ Found ${usageLogs.length} usage log entry/entries:`)

    let totalTokens = 0
    usageLogs.forEach((log, i) => {
      totalTokens += log.tokens_used
      if (i < 10) { // Show first 10 entries
        console.log(`   ${i + 1}. Tokens: ${log.tokens_used.toLocaleString()}`)
        console.log(`      Type: ${log.operation_type || 'N/A'}`)
        console.log(`      Created: ${log.created_at}`)
      }
    })

    if (usageLogs.length > 10) {
      console.log(`   ... and ${usageLogs.length - 10} more entries`)
    }

    console.log(`\n   📊 Total Tokens Used: ${totalTokens.toLocaleString()} tokens`)
    console.log(`   📊 Remaining: ${(subscription.plan?.token_limit - totalTokens).toLocaleString()} tokens`)
    console.log(`   📊 Percentage Used: ${((totalTokens / subscription.plan?.token_limit) * 100).toFixed(2)}%`)
  }

  // ========== STEP 6: Test get_total_usage Function ==========
  console.log('\n🧪 STEP 6: Testing get_total_usage Database Function\n')

  try {
    const { data: totalUsage, error: rpcError } = await supabase.rpc('get_total_usage', {
      p_subscription_id: subscription.id,
      p_start_date: subscription.start_date,
      p_end_date: subscription.end_date || new Date().toISOString()
    })

    if (rpcError) {
      console.error('❌ ERROR calling get_total_usage:', rpcError.message)
      console.log('   This function may not exist in the database!')
    } else {
      console.log(`✅ get_total_usage returned: ${totalUsage} tokens`)

      if (totalUsage === 0 && usageLogs && usageLogs.length > 0) {
        console.log('⚠️  WARNING: Function returned 0 but usage_logs has entries!')
        console.log('   This indicates a bug in the get_total_usage function')
      }
    }
  } catch (e) {
    console.error('❌ EXCEPTION calling get_total_usage:', e.message)
  }

  // ========== STEP 7: Check Activities Log ==========
  console.log('\n📜 STEP 7: Checking Activities Log\n')

  const { data: activities, error: actError } = await supabase
    .from('activities')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (actError) {
    console.error('❌ ERROR fetching activities:', actError.message)
  } else if (!activities || activities.length === 0) {
    console.log('⚠️  No activities logged for this company')
  } else {
    console.log(`✅ Found ${activities.length} recent activities:`)
    activities.forEach((act, i) => {
      console.log(`   ${i + 1}. ${act.type}: ${act.description}`)
      console.log(`      Created: ${act.created_at}`)
    })
  }

  // ========== SUMMARY ==========
  console.log('\n' + '='.repeat(80))
  console.log('📋 DIAGNOSTIC SUMMARY')
  console.log('='.repeat(80))

  const issues = []

  if (!company) issues.push('❌ Company not found')
  if (!subscription) issues.push('❌ No active subscription')
  if (!bots || bots.length === 0) {
    if (!company.telegram_bot_token) {
      issues.push('⚠️  No bot configuration (neither in bots table nor companies.telegram_bot_token)')
    }
  }
  if (!knowledgeBase || knowledgeBase.length === 0) issues.push('⚠️  No knowledge base')
  if (!usageLogs || usageLogs.length === 0) issues.push('❌ CRITICAL: No usage logs (explains 0 usage in dashboard)')

  if (issues.length === 0) {
    console.log('✅ All systems operational!')
  } else {
    console.log('Issues found:')
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`)
    })
  }

  console.log('='.repeat(80) + '\n')

  // ========== NEXT STEPS ==========
  if (!usageLogs || usageLogs.length === 0) {
    console.log('🔧 RECOMMENDED ACTIONS:')
    console.log('\n1. Check backend logs to see if record_usage() is being called')
    console.log('   - Look for "Recorded {N} tokens for subscription {ID}" messages')
    console.log('\n2. Verify the subscription ID being passed to record_usage()')
    console.log(`   - Expected subscription_id: ${subscription.id}`)
    console.log('\n3. Test the insert manually:')
    console.log(`   - Try: INSERT INTO usage_logs (subscription_id, tokens_used) VALUES ('${subscription.id}', 100);`)
    console.log('\n4. Check database permissions for the service role')
    console.log('   - Ensure INSERT permission on usage_logs table')
    console.log('\n5. Check if backend is catching and hiding errors')
    console.log('   - Look for try/except blocks that might be suppressing errors\n')
  }
}

diagnoseUsageTracking().then(() => process.exit(0))
