'use client'

import { ReactNode } from 'react'
import SimpleNeural from '../ui/SimpleNeural'

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
  // Configure background for clear visibility
  const getBackgroundConfig = () => {
    switch (variant) {
      case 'intense':
        return {
          opacity: backgroundOpacity || 0.8,  // High visibility
          nodeCount: 60,       // Dense network
          connectionDistance: 180,
          pulseSpeed: 0.025    // Active animation
        }
      case 'subtle':
        return {
          opacity: backgroundOpacity || 0.5,  // Still visible
          nodeCount: 30,       // Moderate density
          connectionDistance: 140,
          pulseSpeed: 0.015    // Gentle but visible
        }
      default:
        return {
          opacity: backgroundOpacity || 0.7,  // Clear visibility
          nodeCount: 45,       // Good density
          connectionDistance: 160,
          pulseSpeed: 0.02     // Smooth movement
        }
    }
  }

  const config = getBackgroundConfig()

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Simple Neural Test */}
      <SimpleNeural />
      
      {/* Claude-inspired dark background with professional depth */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(13, 13, 13, 0.95) 0%,    /* Deep charcoal base */
              rgba(26, 26, 26, 0.90) 25%,   /* Claude interface bg */
              rgba(31, 31, 31, 0.85) 50%,   /* Mid-tone panel color */
              rgba(42, 42, 42, 0.80) 75%,   /* Medium gray panels */
              rgba(51, 51, 51, 0.75) 100%   /* Input field gray */
            )
          `
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}