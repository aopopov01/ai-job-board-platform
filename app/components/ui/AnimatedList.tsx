'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedListProps {
  className?: string
  children: React.ReactNode
  delay?: number
  stagger?: number
  variant?: 'default' | 'neural' | 'slide' | 'fade' | 'scale'
  enableConnections?: boolean
}

interface AnimatedListItemProps {
  children: React.ReactNode
  index?: number
  delay?: number
  variant?: 'default' | 'neural' | 'slide' | 'fade' | 'scale'
  isVisible?: boolean
}

const AnimatedListItem: React.FC<AnimatedListItemProps> = ({ 
  children, 
  index = 0, 
  delay = 0,
  variant = 'default',
  isVisible = false 
}) => {
  const [mounted, setMounted] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(isVisible)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, isVisible])

  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out'
    
    switch (variant) {
      case 'neural':
        return {
          hidden: `${baseClasses} opacity-0 translate-y-8 scale-95 blur-sm`,
          visible: `${baseClasses} opacity-100 translate-y-0 scale-100 blur-0`
        }
      case 'slide':
        return {
          hidden: `${baseClasses} opacity-0 -translate-x-8`,
          visible: `${baseClasses} opacity-100 translate-x-0`
        }
      case 'fade':
        return {
          hidden: `${baseClasses} opacity-0`,
          visible: `${baseClasses} opacity-100`
        }
      case 'scale':
        return {
          hidden: `${baseClasses} opacity-0 scale-75`,
          visible: `${baseClasses} opacity-100 scale-100`
        }
      default:
        return {
          hidden: `${baseClasses} opacity-0 translate-y-4`,
          visible: `${baseClasses} opacity-100 translate-y-0`
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <div
      ref={itemRef}
      className={cn(
        'relative',
        mounted ? classes.visible : classes.hidden
      )}
      style={{
        animationDelay: `${delay}ms`
      }}
    >

      {/* Glow effect for neural variant */}
      {variant === 'neural' && mounted && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/5 via-blue-400/10 to-cyan-400/5 blur-sm opacity-0 animate-pulse group-hover:opacity-100 transition-opacity duration-500" />
      )}

      {/* Content with neural border effect */}
      <div className={cn(
        'relative',
        variant === 'neural' && 'group hover:shadow-[0_0_20px_rgba(0,200,255,0.2)] transition-shadow duration-300'
      )}>
        {children}
      </div>

      {/* Particle trail effect */}
      {variant === 'neural' && mounted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 bg-cyan-400 rounded-full opacity-0 animate-ping"
              style={{
                left: `${20 + i * 30}%`,
                top: `${50}%`,
                animationDelay: `${i * 0.5 + delay / 1000}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const AnimatedList = React.forwardRef<HTMLDivElement, AnimatedListProps>(
  ({ 
    className, 
    children, 
    delay = 1000, 
    stagger = 150,
    variant = 'neural',
    enableConnections = true 
  }, ref) => {
    const [visibleItems, setVisibleItems] = useState<number[]>([])
    const [allRevealed, setAllRevealed] = useState(false)
    const childrenArray = React.Children.toArray(children)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (childrenArray.length === 0) return

      const timer = setTimeout(() => {
        const revealNext = () => {
          setVisibleItems(prev => {
            if (prev.length < childrenArray.length) {
              const newItems = [...prev, prev.length]
              if (newItems.length === childrenArray.length) {
                setAllRevealed(true)
              }
              return newItems
            }
            return prev
          })
        }

        revealNext()
        
        if (childrenArray.length > 1) {
          const interval = setInterval(() => {
            setVisibleItems(prev => {
              if (prev.length < childrenArray.length) {
                const newItems = [...prev, prev.length]
                if (newItems.length === childrenArray.length) {
                  setAllRevealed(true)
                  clearInterval(interval)
                }
                return newItems
              }
              clearInterval(interval)
              return prev
            })
          }, stagger)

          return () => clearInterval(interval)
        }
      }, delay)

      return () => clearTimeout(timer)
    }, [childrenArray.length, delay, stagger])

    return (
      <div 
        ref={ref || containerRef} 
        className={cn(
          'relative flex flex-col gap-4',
          variant === 'neural' && 'space-y-2',
          className
        )}
      >
        {/* Background neural network pattern */}
        {variant === 'neural' && enableConnections && allRevealed && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0,200,255,0.3)" />
                  <stop offset="50%" stopColor="rgba(100,150,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(0,200,255,0.3)" />
                </linearGradient>
              </defs>
              
              {childrenArray.map((_, index) => {
                if (index === childrenArray.length - 1) return null
                const y1 = ((index + 0.5) / childrenArray.length) * 100
                const y2 = ((index + 1.5) / childrenArray.length) * 100
                
                return (
                  <path
                    key={index}
                    d={`M 20 ${y1} Q 50 ${(y1 + y2) / 2} 80 ${y2}`}
                    stroke="url(#connection-gradient)"
                    strokeWidth="0.5"
                    fill="none"
                    className="animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                )
              })}
            </svg>
          </div>
        )}

        {/* Animated items */}
        {childrenArray.map((item, index) => (
          <AnimatedListItem
            key={index}
            index={index}
            delay={index * stagger}
            variant={variant}
            isVisible={visibleItems.includes(index)}
          >
            {item}
          </AnimatedListItem>
        ))}

      </div>
    )
  }
)

AnimatedList.displayName = 'AnimatedList'

export { AnimatedList, AnimatedListItem }
export default AnimatedList