import { loadStripe, Stripe } from '@stripe/stripe-js'

// Load Stripe
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export interface PlanDetails {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  features: string[]
  limits: {
    messages: number
    bots: number
    storage: string
  }
  stripeProductId: string
  stripePriceId: string
}

export const SUBSCRIPTION_PLANS: PlanDetails[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: 'month',
    features: [
      '1,000 messages/month',
      '1 chatbot',
      'Basic knowledge base',
      'Email support',
      'Web integration'
    ],
    limits: {
      messages: 1000,
      bots: 1,
      storage: '1 GB'
    },
    stripeProductId: 'prod_starter',
    stripePriceId: 'price_starter_monthly'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    period: 'month',
    features: [
      '10,000 messages/month',
      '5 chatbots',
      'Advanced knowledge base',
      'Priority email support',
      'Custom branding',
      'Web & mobile integration',
      'Advanced analytics',
      'API access'
    ],
    limits: {
      messages: 10000,
      bots: 5,
      storage: '10 GB'
    },
    stripeProductId: 'prod_professional',
    stripePriceId: 'price_professional_monthly'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    period: 'month',
    features: [
      '50,000 messages/month',
      'Unlimited chatbots',
      'Enterprise knowledge base',
      '24/7 phone & email support',
      'Full white-label solution',
      'All platform integrations',
      'Advanced analytics & reporting',
      'Full API access',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee'
    ],
    limits: {
      messages: 50000,
      bots: -1, // unlimited
      storage: '100 GB'
    },
    stripeProductId: 'prod_enterprise',
    stripePriceId: 'price_enterprise_monthly'
  }
]

export interface CreateCheckoutSessionParams {
  priceId: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
}

export interface SubscriptionStatus {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  plan: PlanDetails
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url?: string; error?: string }> {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Failed to create checkout session' }
    }

    return { url: data.url }
  } catch (error) {
    return { error: 'Network error. Please try again.' }
  }
}

/**
 * Create a Stripe customer portal session
 */
export async function createPortalSession(customerId: string, returnUrl: string): Promise<{ url?: string; error?: string }> {
  try {
    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId, returnUrl }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Failed to create portal session' }
    }

    return { url: data.url }
  } catch (error) {
    return { error: 'Network error. Please try again.' }
  }
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(userId: string): Promise<{ subscription?: SubscriptionStatus; error?: string }> {
  try {
    const response = await fetch(`/api/stripe/subscription?userId=${userId}`)
    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Failed to get subscription status' }
    }

    return { subscription: data.subscription }
  } catch (error) {
    return { error: 'Network error. Please try again.' }
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const response = await fetch('/api/stripe/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Failed to cancel subscription' }
    }

    return { success: true }
  } catch (error) {
    return { error: 'Network error. Please try again.' }
  }
}

/**
 * Update subscription plan
 */
export async function updateSubscription(subscriptionId: string, newPriceId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const response = await fetch('/api/stripe/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId, newPriceId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Failed to update subscription' }
    }

    return { success: true }
  } catch (error) {
    return { error: 'Network error. Please try again.' }
  }
}

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): PlanDetails | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId)
}

/**
 * Get plan by Stripe price ID
 */
export function getPlanByPriceId(priceId: string): PlanDetails | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.stripePriceId === priceId)
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate usage percentage
 */
export function calculateUsagePercentage(used: number, limit: number): number {
  if (limit === -1) return 0 // unlimited
  return Math.min((used / limit) * 100, 100)
}

/**
 * Check if user has exceeded limits
 */
export function checkLimits(usage: { messages: number; bots: number; storage: number }, plan: PlanDetails): { 
  messages: { exceeded: boolean; percentage: number }
  bots: { exceeded: boolean; percentage: number }
  storage: { exceeded: boolean; percentage: number }
} {
  const messagePercentage = calculateUsagePercentage(usage.messages, plan.limits.messages)
  const botPercentage = calculateUsagePercentage(usage.bots, plan.limits.bots)
  
  // Convert storage limit from string to bytes
  const storageInGB = parseInt(plan.limits.storage)
  const storageLimitBytes = storageInGB * 1024 * 1024 * 1024
  const storagePercentage = calculateUsagePercentage(usage.storage, storageLimitBytes)

  return {
    messages: {
      exceeded: messagePercentage >= 100,
      percentage: messagePercentage
    },
    bots: {
      exceeded: plan.limits.bots !== -1 && botPercentage >= 100,
      percentage: botPercentage
    },
    storage: {
      exceeded: storagePercentage >= 100,
      percentage: storagePercentage
    }
  }
}