interface TourStep {
  id: string
  title: string
  content: string
  target: string // CSS selector
  placement?: 'top' | 'bottom' | 'left' | 'right'
  showNext?: boolean
  showPrev?: boolean
  showSkip?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export const dashboardTour: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to BotAI Dashboard!',
    content: 'Let me show you around your AI customer support platform. This tour will help you understand the key features and how to get started.',
    target: '[data-tour="dashboard-header"]',
    placement: 'bottom',
    showPrev: false
  },
  {
    id: 'stats',
    title: 'Key Metrics',
    content: 'Here you can see your most important metrics at a glance: total messages, active bots, success rate, and response time. These update in real-time.',
    target: '[data-tour="stats-cards"]',
    placement: 'bottom'
  },
  {
    id: 'real-time-status',
    title: 'Real-time Updates',
    content: 'This indicator shows when your dashboard is receiving live updates. The green dot means everything is connected and updating automatically.',
    target: '[data-tour="realtime-status"]',
    placement: 'left'
  },
  {
    id: 'usage-monitoring',
    title: 'Usage Monitoring',
    content: 'Track your monthly usage and see how much of your plan you\'ve used. This helps you manage costs and plan for scaling.',
    target: '[data-tour="usage-card"]',
    placement: 'right'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    content: 'Access the most common tasks quickly. Create new bots, upload knowledge base content, view analytics, or adjust settings.',
    target: '[data-tour="quick-actions"]',
    placement: 'left'
  },
  {
    id: 'activity-feed',
    title: 'Live Activity Feed',
    content: 'See what\'s happening with your bots in real-time. New messages, responses, and system events appear here automatically.',
    target: '[data-tour="activity-feed"]',
    placement: 'top'
  },
  {
    id: 'navigation',
    title: 'Navigation',
    content: 'Use the sidebar to access different sections: manage bots, view conversations, update your knowledge base, check analytics, and more.',
    target: '[data-tour="sidebar"]',
    placement: 'right',
    action: {
      label: 'Take me to Bot Management',
      onClick: () => window.location.href = '/dashboard/bots'
    }
  }
]

export const settingsTour: TourStep[] = [
  {
    id: 'security-overview',
    title: 'Security Settings',
    content: 'Manage your account security settings including two-factor authentication and password changes.',
    target: '[data-tour="security-tab"]',
    placement: 'bottom',
    showPrev: false
  },
  {
    id: '2fa-setup',
    title: 'Two-Factor Authentication',
    content: 'Add an extra layer of security to your account with 2FA. We recommend enabling this for all accounts.',
    target: '[data-tour="2fa-section"]',
    placement: 'top'
  },
  {
    id: 'session-management',
    title: 'Active Sessions',
    content: 'View and manage all your active login sessions across different devices and browsers.',
    target: '[data-tour="sessions-tab"]',
    placement: 'bottom',
    showNext: false
  }
]

export const botsTour: TourStep[] = [
  {
    id: 'bots-overview',
    title: 'Bot Management',
    content: 'This is where you create and manage all your AI chatbots. Each bot can have different configurations and knowledge bases.',
    target: '[data-tour="bots-header"]',
    placement: 'bottom',
    showPrev: false
  },
  {
    id: 'create-bot',
    title: 'Create New Bot',
    content: 'Click here to create a new chatbot. You can customize its behavior, connect it to different platforms, and train it with your content.',
    target: '[data-tour="create-bot-button"]',
    placement: 'left'
  },
  {
    id: 'bot-configuration',
    title: 'Bot Configuration',
    content: 'Each bot has settings for API tokens, webhook URLs, and behavioral parameters. You can also test your bots here.',
    target: '[data-tour="bot-list"]',
    placement: 'top',
    showNext: false
  }
]

// Function to get appropriate tour based on current route
export function getTourForRoute(pathname: string): TourStep[] | null {
  if (pathname === '/dashboard') return dashboardTour
  if (pathname === '/dashboard/settings') return settingsTour
  if (pathname.startsWith('/dashboard/bots')) return botsTour
  return null
}