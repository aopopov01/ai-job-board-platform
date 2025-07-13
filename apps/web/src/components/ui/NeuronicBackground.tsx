'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  pulse: number
  pulseDirection: number
  connections: number[]
  energy: number
  lightningCharge: number
}

interface NeuronicBackgroundProps {
  className?: string
  opacity?: number
  nodeCount?: number
  connectionDistance?: number
  pulseSpeed?: number
}

export default function NeuronicBackground({
  className = '',
  opacity = 0.3,
  nodeCount = 50,
  connectionDistance = 150,
  pulseSpeed = 0.02
}: NeuronicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize nodes
    const initializeNodes = () => {
      nodesRef.current = []
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          pulse: Math.random() * Math.PI * 2,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          connections: [],
          energy: Math.random(),
          lightningCharge: Math.random() * Math.PI * 2
        })
      }
    }

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeNodes()
    }

    // Calculate connections
    const calculateConnections = () => {
      nodesRef.current.forEach((node, i) => {
        node.connections = []
        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < connectionDistance) {
              node.connections.push(j)
            }
          }
        })
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update nodes
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1

        // Keep nodes in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Update pulse and lightning energy
        node.pulse += pulseSpeed * node.pulseDirection
        if (node.pulse > Math.PI * 2) node.pulse = 0
        if (node.pulse < 0) node.pulse = Math.PI * 2
        
        // Update lightning charge for electric effects (reduced intensity)
        node.lightningCharge += pulseSpeed * 1.5
        node.energy = Math.sin(node.lightningCharge) * 0.3 + 0.4
      })

      // Recalculate connections
      calculateConnections()

      // Draw connections
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const otherNode = nodesRef.current[connectionIndex]
          if (otherNode) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const alpha = (1 - distance / connectionDistance) * opacity * 0.5

            // Lightning-inspired electric connections (reduced sparkling)
            const pulseIntensity = (Math.sin(node.pulse) + Math.sin(otherNode.pulse)) / 2
            const lightningEnergy = (node.energy + otherNode.energy) / 2
            const electricIntensity = Math.sin(Date.now() * 0.005 + distance * 0.05) * 0.2 + 0.8
            const connectionAlpha = alpha * (0.7 + pulseIntensity * 0.3 + lightningEnergy * 0.2)

            // Electric lightning colors - more controlled brightness
            const electricColor = lightningEnergy > 0.8 
              ? `rgba(200, 230, 255, ${connectionAlpha * electricIntensity})` 
              : `rgba(120, 180, 255, ${connectionAlpha})`
            
            ctx.strokeStyle = electricColor
            ctx.lineWidth = 1.5 + lightningEnergy * 1.5
            
            // Add subtle electric glow to connections
            ctx.shadowColor = electricColor
            ctx.shadowBlur = 4 + lightningEnergy * 6
            
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            
            // Add subtle lightning-style jagged connections for very high energy only
            if (lightningEnergy > 0.9) {
              const midX = (node.x + otherNode.x) / 2 + (Math.random() - 0.5) * 10
              const midY = (node.y + otherNode.y) / 2 + (Math.random() - 0.5) * 10
              ctx.lineTo(midX, midY)
              ctx.lineTo(otherNode.x, otherNode.y)
            } else {
              ctx.lineTo(otherNode.x, otherNode.y)
            }
            
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        })
      })

      // Draw lightning-charged nodes with electric energy
      nodesRef.current.forEach(node => {
        const pulseIntensity = Math.sin(node.pulse) * 0.5 + 0.5
        const electricCharge = node.energy
        const nodeOpacity = opacity * (0.8 + pulseIntensity * 0.3 + electricCharge * 0.2)
        const nodeSize = 4 + pulseIntensity * 4 + electricCharge * 2
        const isHighEnergy = electricCharge > 0.8

        // Lightning-charged node with controlled electric colors
        const nodeColor = isHighEnergy 
          ? `rgba(220, 240, 255, ${nodeOpacity})` // Bright but not pure white
          : `rgba(120, 180, 255, ${nodeOpacity})` // Electric blue
          
        // Add subtle electric glow to high energy nodes
        if (isHighEnergy) {
          ctx.shadowColor = 'rgba(200, 230, 255, 0.6)'
          ctx.shadowBlur = 8 + electricCharge * 6
        }
        
        ctx.fillStyle = nodeColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Electric core - bright but controlled for lightning nodes
        const coreColor = isHighEnergy 
          ? `rgba(240, 250, 255, ${nodeOpacity})` 
          : `rgba(180, 220, 255, ${nodeOpacity * 0.9})`
          
        ctx.fillStyle = coreColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize * 0.5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 0

        // Electric lightning glow with controlled inspirational energy
        const glowRadius = nodeSize + pulseIntensity * 15 + electricCharge * 8
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        )
        
        if (isHighEnergy) {
          // Bright but controlled glow for high energy nodes
          gradient.addColorStop(0, `rgba(220, 240, 255, ${nodeOpacity * 1.2})`)
          gradient.addColorStop(0.1, `rgba(180, 220, 255, ${nodeOpacity * 1.0})`)
          gradient.addColorStop(0.3, `rgba(140, 190, 255, ${nodeOpacity * 0.7})`)
          gradient.addColorStop(0.6, `rgba(100, 150, 255, ${nodeOpacity * 0.4})`)
          gradient.addColorStop(1, 'rgba(60, 120, 200, 0)')
        } else {
          // Electric blue glow for regular nodes
          gradient.addColorStop(0, `rgba(180, 220, 255, ${nodeOpacity * 1.1})`)
          gradient.addColorStop(0.2, `rgba(140, 190, 255, ${nodeOpacity * 0.8})`)
          gradient.addColorStop(0.5, `rgba(100, 160, 255, ${nodeOpacity * 0.5})`)
          gradient.addColorStop(0.8, `rgba(80, 130, 220, ${nodeOpacity * 0.3})`)
          gradient.addColorStop(1, 'rgba(60, 110, 200, 0)')
        }
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [opacity, nodeCount, connectionDistance, pulseSpeed])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    />
  )
}