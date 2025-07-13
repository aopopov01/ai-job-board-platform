'use client'

import { ReactNode } from 'react'
import NeuronicBackground from '../ui/NeuronicBackground'

interface NeuronicLayoutProps {
  children: ReactNode
  className?: string
  backgroundOpacity?: number
  variant?: 'default' | 'intense' | 'subtle'
}

export default function NeuronicLayout({
  children,
  className = '',
  backgroundOpacity,
  variant = 'default'
}: NeuronicLayoutProps) {
  // Configure background based on variant with higher contrast
  const getBackgroundConfig = () => {
    switch (variant) {
      case 'intense':
        return {
          opacity: backgroundOpacity || 1.0,
          nodeCount: 100,
          connectionDistance: 200,
          pulseSpeed: 0.04
        }
      case 'subtle':
        return {
          opacity: backgroundOpacity || 0.4,
          nodeCount: 30,
          connectionDistance: 120,
          pulseSpeed: 0.015
        }
      default:
        return {
          opacity: backgroundOpacity || 0.9,
          nodeCount: 60,
          connectionDistance: 160,
          pulseSpeed: 0.03
        }
    }
  }

  const config = getBackgroundConfig()

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Neuronic Background */}
      <NeuronicBackground {...config} />
      
      {/* Dark lightning-inspired background for maximum contrast */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950/90 via-gray-950/80 to-blue-950/70 pointer-events-none z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}