'use client'

import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'neural' | 'electric'
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, variant = 'neural', ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const getVariantStyles = () => {
      switch (variant) {
        case 'electric':
          return {
            base: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white border-cyan-400/30',
            shimmer: 'bg-gradient-to-r from-transparent via-white/40 to-transparent',
            glow: 'shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]'
          }
        case 'neural':
          return {
            base: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white border-blue-400/30',
            shimmer: 'bg-gradient-to-r from-transparent via-white/30 to-transparent',
            glow: 'shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]'
          }
        default:
          return {
            base: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-600/30',
            shimmer: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
            glow: 'shadow-[0_0_15px_rgba(100,100,100,0.2)] hover:shadow-[0_0_25px_rgba(100,100,100,0.4)]'
          }
      }
    }

    const styles = getVariantStyles()

    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex items-center justify-center overflow-hidden rounded-lg border px-6 py-3 font-medium transition-all duration-300 hover:scale-105 active:scale-95',
          styles.base,
          styles.glow,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Background pulse effect */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* Shimmer effect */}
        <div 
          className={cn(
            'absolute inset-0 -skew-x-12 translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[200%]',
            styles.shimmer
          )} 
        />

        {/* Neural network lines effect */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50">
            <defs>
              <linearGradient id="neural-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(100,200,255,0.6)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M0,25 Q25,10 50,25 T100,25"
              stroke="url(#neural-line)"
              strokeWidth="0.5"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M0,20 Q30,35 60,20 T100,20"
              stroke="url(#neural-line)"
              strokeWidth="0.3"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </svg>
        </div>

        {/* Particle effects */}
        {isHovered && (
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-cyan-400 opacity-70 animate-ping"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 10}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Glow border effect */}
        <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
        </div>
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'

export default ShimmerButton