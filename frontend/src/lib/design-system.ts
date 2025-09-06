// BotAI Unified Design System
// This file contains all design tokens, colors, and patterns used throughout the application

export const designSystem = {
  // Core Brand Colors
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // Main blue
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd', 
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Purple accent
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    }
  },

  // Gradients (Beautiful Blue-Indigo Theme - Consistent across all pages)
  gradients: {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    primaryHover: 'hover:from-blue-700 hover:to-indigo-700',
    secondary: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    secondaryHover: 'hover:from-blue-600 hover:to-indigo-600',
    accent: 'bg-gradient-to-r from-indigo-500 to-blue-500',
    accentHover: 'hover:from-indigo-600 hover:to-blue-600',
    success: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    successHover: 'hover:from-blue-600 hover:to-indigo-600',
    background: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    cardGradient: 'bg-gradient-to-br from-white to-blue-50/30',
    sidebarGradient: 'bg-gradient-to-b from-white to-blue-50/50',
    heroGradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-white',
  },

  // Background Decorations (Beautiful Blue-Indigo floating orbs)
  backgroundDecorations: {
    orb1: 'absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl',
    orb2: 'absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full opacity-10 blur-3xl',
    orb3: 'absolute top-1/2 right-1/4 w-60 h-60 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-10 blur-3xl',
  },

  // Glass Morphism
  glass: {
    card: 'bg-white/80 backdrop-blur-md border-0 shadow-xl',
    header: 'bg-white/90 backdrop-blur-md',
    sidebar: 'bg-white/95 backdrop-blur-md',
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-lg hover:shadow-xl',
    lg: 'shadow-xl',
    button: 'shadow-lg hover:shadow-xl',
  },

  // Borders
  borders: {
    light: 'border-gray-200/50',
    medium: 'border-gray-200',
    focus: 'focus:border-blue-500 focus:ring-blue-500',
  },

  // Transitions
  transitions: {
    default: 'transition-all duration-200',
    slow: 'transition-all duration-300',
    button: 'transition-all duration-200 active:scale-95',
  },

  // Typography
  typography: {
    heading: 'font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent',
    subheading: 'text-gray-600',
    body: 'text-gray-700',
    muted: 'text-gray-500',
  },

  // Animations
  animations: {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    float: 'animate-pulse delay-1000',
  }
}

// Utility functions for consistent styling
export const getConsistentAuthBackground = () => `
  min-h-screen flex items-center justify-center ${designSystem.gradients.background} p-4
`

export const getConsistentAuthCard = () => `
  w-full max-w-md relative z-10 ${designSystem.glass.card}
`

export const getConsistentButton = (variant: 'primary' | 'secondary' | 'success' = 'primary') => {
  const variants = {
    primary: `${designSystem.gradients.primary} ${designSystem.gradients.primaryHover}`,
    secondary: `${designSystem.gradients.secondary} ${designSystem.gradients.secondaryHover}`,
    success: `${designSystem.gradients.success} ${designSystem.gradients.successHover}`,
  }
  
  return `w-full h-11 ${variants[variant]} text-white font-medium ${designSystem.shadows.button} ${designSystem.transitions.button}`
}

export const getConsistentInput = () => `
  pl-10 h-11 border-gray-200 ${designSystem.borders.focus} bg-white/50
`

export const getBackgroundDecorations = () => `
  <div className="absolute inset-0 overflow-hidden">
    <div className="${designSystem.backgroundDecorations.orb1}"></div>
    <div className="${designSystem.backgroundDecorations.orb2}"></div>
  </div>
`