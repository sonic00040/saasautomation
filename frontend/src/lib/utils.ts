'use client'

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useEffect, useState } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date with consistent options to avoid hydration issues
export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Format time only with consistent options to avoid hydration issues
export function formatTimeOnly(date: Date | string | number): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

// Format date for charts with consistent options to avoid hydration issues
export function formatChartDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Format numbers with consistent locale to avoid hydration issues
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

// Hook to ensure client-side rendering for dynamic content
export function useClientSide() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
