'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { ChevronLeft, ChevronRight, X, Play, Target } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

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

interface TourContextType {
  isActive: boolean
  currentStep: number
  steps: TourStep[]
  startTour: (steps: TourStep[]) => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  endTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<TourStep[]>([])

  const startTour = (tourSteps: TourStep[]) => {
    setSteps(tourSteps)
    setCurrentStep(0)
    setIsActive(true)
    // Disable body scroll when tour is active
    document.body.style.overflow = 'hidden'
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      endTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTour = () => {
    endTour()
  }

  const endTour = () => {
    setIsActive(false)
    setCurrentStep(0)
    setSteps([])
    // Re-enable body scroll
    document.body.style.overflow = 'unset'
  }

  // Handle escape key to close tour
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        skipTour()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const value = {
    isActive,
    currentStep,
    steps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    endTour
  }

  return (
    <TourContext.Provider value={value}>
      {children}
      {isActive && <TourOverlay />}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

function TourOverlay() {
  const { steps, currentStep, nextStep, prevStep, skipTour } = useTour()
  const [targetPosition, setTargetPosition] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const step = steps[currentStep]

  useEffect(() => {
    if (!step) return

    const targetElement = document.querySelector(step.target) as HTMLElement
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setTargetPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      })

      // Scroll target into view
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [step])

  if (!step || !targetPosition) return null

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Highlight spotlight */}
      <div
        className="fixed bg-transparent border-4 border-blue-500 rounded-lg shadow-xl z-50 pointer-events-none"
        style={{
          top: targetPosition.top - 4,
          left: targetPosition.left - 4,
          width: targetPosition.width + 8,
          height: targetPosition.height + 8
        }}
      />

      {/* Tour tooltip */}
      <TourTooltip
        step={step}
        currentStep={currentStep}
        totalSteps={steps.length}
        targetPosition={targetPosition}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTour}
      />
    </>
  )
}

interface TourTooltipProps {
  step: TourStep
  currentStep: number
  totalSteps: number
  targetPosition: { top: number; left: number; width: number; height: number }
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

function TourTooltip({
  step,
  currentStep,
  totalSteps,
  targetPosition,
  onNext,
  onPrev,
  onSkip
}: TourTooltipProps) {
  const getTooltipPosition = () => {
    const padding = 16
    const tooltipWidth = 320

    let top = targetPosition.top
    let left = targetPosition.left

    switch (step.placement || 'bottom') {
      case 'top':
        top = targetPosition.top - 200 - padding
        left = targetPosition.left + targetPosition.width / 2 - tooltipWidth / 2
        break
      case 'bottom':
        top = targetPosition.top + targetPosition.height + padding
        left = targetPosition.left + targetPosition.width / 2 - tooltipWidth / 2
        break
      case 'left':
        top = targetPosition.top + targetPosition.height / 2 - 100
        left = targetPosition.left - tooltipWidth - padding
        break
      case 'right':
        top = targetPosition.top + targetPosition.height / 2 - 100
        left = targetPosition.left + targetPosition.width + padding
        break
    }

    // Keep within viewport
    const maxLeft = window.innerWidth - tooltipWidth - 16
    const maxTop = window.innerHeight - 200 - 16

    left = Math.max(16, Math.min(left, maxLeft))
    top = Math.max(16, Math.min(top, maxTop))

    return { top, left }
  }

  const position = getTooltipPosition()

  return (
    <div
      className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{step.title}</h3>
        </div>
        <button
          onClick={onSkip}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-700 leading-relaxed">{step.content}</p>

        {step.action && (
          <div className="mt-4">
            <Button
              onClick={step.action.onClick}
              size="sm"
              className="w-full"
            >
              {step.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <div className="flex items-center space-x-2">
          {(step.showSkip !== false) && (
            <Button
              onClick={onSkip}
              variant="ghost"
              size="sm"
            >
              Skip Tour
            </Button>
          )}

          {(step.showPrev !== false) && currentStep > 0 && (
            <Button
              onClick={onPrev}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}

          {(step.showNext !== false) && (
            <Button
              onClick={onNext}
              size="sm"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
              {currentStep < totalSteps - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Progress indicator component
export function TourProgress() {
  const { isActive, currentStep, steps } = useTour()

  if (!isActive || steps.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-gray-600">
          {currentStep + 1}/{steps.length}
        </span>
      </div>
    </div>
  )
}