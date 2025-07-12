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
          opacity: backgroundOpacity || 0.6,
          nodeCount: 80,
          connectionDistance: 180,
          pulseSpeed: 0.03
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
          opacity: backgroundOpacity || 0.5,
          nodeCount: 50,
          connectionDistance: 150,
          pulseSpeed: 0.02
        }
    }
  }

  const config = getBackgroundConfig()

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Neuronic Background */}
      <NeuronicBackground {...config} />
      
      {/* Background gradient overlay with higher contrast */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/40 via-gray-900/30 to-emerald-900/40 pointer-events-none z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}