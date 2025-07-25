'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  variant?: 'default' | 'neural' | 'electric' | 'holographic'
  enableParticles?: boolean
}

const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientSize = 200,
  gradientColor = '#262626',
  gradientOpacity = 0.8,
  variant = 'neural',
  enableParticles = true
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<any[]>([])
  const frameRef = useRef<number>()

  const getVariantStyles = () => {
    switch (variant) {
      case 'electric':
        return {
          base: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40',
          glow: 'shadow-[0_0_30px_rgba(0,200,255,0.2)] hover:shadow-[0_0_50px_rgba(0,200,255,0.4)]',
          gradient: '#0080ff'
        }
      case 'holographic':
        return {
          base: 'bg-gradient-to-br from-slate-900/40 via-blue-900/40 to-cyan-900/40',
          glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]',
          gradient: '#3b82f6'
        }
      case 'neural':
        return {
          base: 'bg-gradient-to-br from-blue-900/40 to-cyan-900/40',
          glow: 'shadow-[0_0_30px_rgba(0,200,255,0.2)] hover:shadow-[0_0_50px_rgba(0,200,255,0.4)]',
          gradient: '#0080ff'
        }
      default:
        return {
          base: 'bg-gradient-to-br from-gray-900/90 to-gray-800/90',
          glow: 'shadow-[0_0_20px_rgba(100,100,100,0.1)] hover:shadow-[0_0_40px_rgba(100,100,100,0.3)]',
          gradient: '#374151'
        }
    }
  }

  const styles = getVariantStyles()

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const initParticles = useCallback(() => {
    if (!enableParticles) return
    
    particlesRef.current = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2
    }))
  }, [enableParticles])

  const animateParticles = useCallback(() => {
    if (!enableParticles || !isHovering) return

    particlesRef.current.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.phase += 0.02
      particle.opacity = Math.sin(particle.phase) * 0.3 + 0.4

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= 400) particle.vx *= -1
      if (particle.y <= 0 || particle.y >= 300) particle.vy *= -1
      
      // Keep in bounds
      particle.x = Math.max(0, Math.min(400, particle.x))
      particle.y = Math.max(0, Math.min(300, particle.y))
    })

    frameRef.current = requestAnimationFrame(animateParticles)
  }, [enableParticles, isHovering])

  useEffect(() => {
    initParticles()
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [initParticles])

  useEffect(() => {
    if (isHovering) {
      animateParticles()
    } else {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [isHovering, animateParticles])

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative overflow-hidden rounded-xl backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02]',
        styles.base,
        styles.glow,
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: isHovering
            ? `radial-gradient(${gradientSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${styles.gradient}40, transparent 70%)`
            : 'none',
        }}
      />

      {/* Neural network pattern overlay */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30">
        <svg className="h-full w-full" viewBox="0 0 400 300">
          <defs>
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={styles.gradient} stopOpacity="0.8" />
              <stop offset="100%" stopColor={styles.gradient} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          
          {/* Neural nodes */}
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <circle
                cx={50 + (i % 4) * 100}
                cy={75 + Math.floor(i / 4) * 150}
                r="3"
                fill="url(#node-gradient)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              
              {/* Connections */}
              {i < 4 && (
                <line
                  x1={50 + (i % 4) * 100}
                  y1={75}
                  x2={50 + ((i + 1) % 4) * 100}
                  y2={225}
                  stroke={styles.gradient}
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Floating particles */}
      {enableParticles && isHovering && (
        <div className="absolute inset-0">
          {particlesRef.current.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-cyan-400"
              style={{
                left: `${(particle.x / 400) * 100}%`,
                top: `${(particle.y / 300) * 100}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                boxShadow: `0 0 ${particle.size * 2}px ${styles.gradient}`,
                transition: 'opacity 0.3s ease'
              }}
            />
          ))}
        </div>
      )}


      {/* Content */}
      <div className="relative z-10">{children}</div>

    </div>
  )
}

export default MagicCard