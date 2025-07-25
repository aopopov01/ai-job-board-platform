'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  as?: keyof JSX.IntrinsicElements
  variant?: 'default' | 'neural' | 'glitch' | 'wave' | 'typewriter'
  speed?: 'slow' | 'normal' | 'fast'
  trigger?: 'auto' | 'hover' | 'click'
  enableParticles?: boolean
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  as: Component = 'div',
  variant = 'neural',
  speed = 'normal',
  trigger = 'auto',
  enableParticles = true
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [visibleChars, setVisibleChars] = useState(0)
  const [isTriggered, setIsTriggered] = useState(false)
  const targetRef = useRef<HTMLElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const getSpeedDuration = () => {
    switch (speed) {
      case 'slow': return 150
      case 'fast': return 50
      default: return 80
    }
  }

  const words = text.split(' ')
  const chars = text.split('')

  // Intersection Observer for auto trigger
  useEffect(() => {
    if (trigger !== 'auto') return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setIsTriggered(true)
        }
      },
      { threshold: 0.1 }
    )

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [trigger])

  // Character reveal animation
  useEffect(() => {
    if (!isTriggered) return

    if (variant === 'typewriter') {
      const timer = setInterval(() => {
        setVisibleChars(prev => {
          if (prev < chars.length) {
            return prev + 1
          }
          clearInterval(timer)
          return prev
        })
      }, getSpeedDuration())

      return () => clearInterval(timer)
    } else {
      // For other variants, reveal words with stagger
      let wordIndex = 0
      const timer = setInterval(() => {
        if (wordIndex < words.length) {
          wordIndex++
          setVisibleChars(words.slice(0, wordIndex).join(' ').length)
        } else {
          clearInterval(timer)
        }
      }, getSpeedDuration() * 2)

      return () => clearInterval(timer)
    }
  }, [isTriggered, variant, chars.length, words.length, getSpeedDuration])

  const handleTrigger = () => {
    if (trigger === 'hover' || trigger === 'click') {
      setIsTriggered(true)
      setIsVisible(true)
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'glitch':
        return 'font-mono tracking-wider'
      case 'wave':
        return 'font-bold'
      case 'typewriter':
        return 'font-mono'
      case 'neural':
        return 'font-medium tracking-wide'
      default:
        return 'font-medium'
    }
  }

  const renderDefault = () => {
    const elementProps: any = {
      ref: targetRef,
      className: cn('relative', getVariantClasses(), className),
    }
    
    if (trigger === 'hover') elementProps.onMouseEnter = handleTrigger
    if (trigger === 'click') elementProps.onClick = handleTrigger
    
    return (
    <Component {...elementProps}>
      <div className="flex flex-wrap">
        {words.map((word, wordIndex) => {
          const wordStart = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)
          const wordEnd = wordStart + word.length
          const isWordVisible = visibleChars >= wordEnd

          return (
            <span
              key={wordIndex}
              className={cn(
                'mr-2 inline-block transition-all duration-300 ease-out',
                isWordVisible
                  ? 'opacity-100 translate-y-0 blur-0'
                  : 'opacity-0 translate-y-2 blur-sm'
              )}
              style={{
                transitionDelay: `${wordIndex * 50}ms`
              }}
            >
              {word}
            </span>
          )
        })}
      </div>
    </Component>
    )
  }

  const renderNeural = () => {
    const elementProps: any = {
      ref: targetRef,
      className: cn('relative', getVariantClasses(), className),
    }
    
    if (trigger === 'hover') elementProps.onMouseEnter = handleTrigger
    if (trigger === 'click') elementProps.onClick = handleTrigger
    
    return (
    <Component {...elementProps}>
      {/* Neural network background */}
      {isTriggered && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 200 50">
            <defs>
              <linearGradient id="neural-text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,200,255,0.6)" />
                <stop offset="50%" stopColor="rgba(100,150,255,0.8)" />
                <stop offset="100%" stopColor="rgba(0,200,255,0.6)" />
              </linearGradient>
            </defs>
            
            {/* Neural nodes */}
            {words.map((_, index) => (
              <circle
                key={index}
                cx={20 + (index * 160) / words.length}
                cy="25"
                r="1.5"
                fill="url(#neural-text-gradient)"
                className="animate-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
            
            {/* Connections */}
            {words.length > 1 && (
              <path
                d={`M 20 25 ${words.map((_, i) => `L ${20 + (i * 160) / words.length} 25`).join(' ')}`}
                stroke="url(#neural-text-gradient)"
                strokeWidth="0.5"
                fill="none"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      )}

      <div className="relative z-10 flex flex-wrap">
        {words.map((word, wordIndex) => {
          const wordStart = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)
          const wordEnd = wordStart + word.length
          const isWordVisible = visibleChars >= wordEnd

          return (
            <span
              key={wordIndex}
              className={cn(
                'mr-2 inline-block transition-all duration-500 ease-out relative',
                isWordVisible
                  ? 'opacity-100 translate-y-0 blur-0'
                  : 'opacity-0 translate-y-4 blur-md'
              )}
              style={{
                transitionDelay: `${wordIndex * 100}ms`
              }}
            >
              {/* Glow effect */}
              {isWordVisible && (
                <span className="absolute inset-0 text-cyan-400 blur-sm opacity-50 animate-pulse">
                  {word}
                </span>
              )}
              
              {/* Main text */}
              <span className="relative z-10 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                {word}
              </span>

              {/* Particle effect */}
              {enableParticles && isWordVisible && (
                <div className="absolute inset-0">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-0.5 w-0.5 bg-cyan-400 rounded-full opacity-70 animate-ping"
                      style={{
                        left: `${20 + i * 60}%`,
                        top: `${30}%`,
                        animationDelay: `${wordIndex * 0.2 + i * 0.3}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
              )}
            </span>
          )
        })}
      </div>
    </Component>
    )
  }

  const renderTypewriter = () => {
    const elementProps: any = {
      ref: targetRef,
      className: cn('relative', getVariantClasses(), className),
    }
    
    if (trigger === 'hover') elementProps.onMouseEnter = handleTrigger
    if (trigger === 'click') elementProps.onClick = handleTrigger
    
    return (
    <Component {...elementProps}>
      <div className="relative">
        {chars.map((char, index) => (
          <span
            key={index}
            className={cn(
              'transition-all duration-100',
              index < visibleChars ? 'opacity-100' : 'opacity-0'
            )}
          >
            {char}
          </span>
        ))}
        
        {/* Typewriter cursor */}
        {isTriggered && visibleChars < chars.length && (
          <span className="animate-pulse text-cyan-400 ml-0.5">|</span>
        )}
      </div>
    </Component>
    )
  }

  const renderGlitch = () => {
    const elementProps: any = {
      ref: targetRef,
      className: cn('relative', getVariantClasses(), className),
    }
    
    if (trigger === 'hover') elementProps.onMouseEnter = handleTrigger
    if (trigger === 'click') elementProps.onClick = handleTrigger
    
    return (
    <Component {...elementProps}>
      <div className="relative">
        {words.map((word, wordIndex) => {
          const wordStart = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)
          const wordEnd = wordStart + word.length
          const isWordVisible = visibleChars >= wordEnd

          return (
            <span
              key={wordIndex}
              className={cn(
                'mr-2 inline-block relative',
                isWordVisible ? 'animate-none' : 'opacity-0'
              )}
            >
              {/* Glitch layers */}
              {isWordVisible && (
                <>
                  <span className="absolute inset-0 text-red-500 opacity-70 animate-pulse" style={{ clipPath: 'inset(0 0 70% 0)', animationDelay: `${wordIndex * 0.1}s` }}>
                    {word}
                  </span>
                  <span className="absolute inset-0 text-cyan-500 opacity-70 animate-pulse" style={{ clipPath: 'inset(70% 0 0 0)', animationDelay: `${wordIndex * 0.1 + 0.05}s` }}>
                    {word}
                  </span>
                </>
              )}
              
              {/* Main text */}
              <span className="relative z-10 text-white">
                {word}
              </span>
            </span>
          )
        })}
      </div>
    </Component>
    )
  }

  const renderWave = () => {
    const elementProps: any = {
      ref: targetRef,
      className: cn('relative', getVariantClasses(), className),
    }
    
    if (trigger === 'hover') elementProps.onMouseEnter = handleTrigger
    if (trigger === 'click') elementProps.onClick = handleTrigger
    
    return (
    <Component {...elementProps}>
      <div className="flex flex-wrap">
        {words.map((word, wordIndex) => {
          const wordStart = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)
          const wordEnd = wordStart + word.length
          const isWordVisible = visibleChars >= wordEnd

          return (
            <span
              key={wordIndex}
              className={cn(
                'mr-2 inline-block transition-all duration-700 ease-out',
                isWordVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              )}
              style={{
                transitionDelay: `${wordIndex * 100}ms`,
                transform: isWordVisible ? `translateY(${Math.sin(wordIndex * 0.5) * 2}px)` : 'translateY(32px)'
              }}
            >
              {word.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="inline-block transition-transform duration-300"
                  style={{
                    transform: isWordVisible
                      ? `translateY(${Math.sin((wordIndex + charIndex) * 0.3 + Date.now() * 0.003) * 3}px)`
                      : 'translateY(0)',
                    animationDelay: `${charIndex * 50}ms`
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          )
        })}
      </div>
    </Component>
    )
  }

  switch (variant) {
    case 'neural':
      return renderNeural()
    case 'typewriter':
      return renderTypewriter()
    case 'glitch':
      return renderGlitch()
    case 'wave':
      return renderWave()
    default:
      return renderDefault()
  }
}

export default TextReveal