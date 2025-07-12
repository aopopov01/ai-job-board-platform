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
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          pulse: Math.random() * Math.PI * 2,
          pulseDirection: Math.random() > 0.5 ? 1 : -1,
          connections: []
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

        // Update pulse
        node.pulse += pulseSpeed * node.pulseDirection
        if (node.pulse > Math.PI * 2) node.pulse = 0
        if (node.pulse < 0) node.pulse = Math.PI * 2
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

            // Pulsing effect on connections with higher contrast
            const pulseIntensity = (Math.sin(node.pulse) + Math.sin(otherNode.pulse)) / 2
            const connectionAlpha = alpha * (0.6 + pulseIntensity * 0.4)

            ctx.strokeStyle = `rgba(64, 224, 208, ${connectionAlpha})`
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })
      })

      // Draw nodes with higher contrast
      nodesRef.current.forEach(node => {
        const pulseIntensity = Math.sin(node.pulse) * 0.5 + 0.5
        const nodeOpacity = opacity * (0.7 + pulseIntensity * 0.3)
        const nodeSize = 3 + pulseIntensity * 3

        // Main node with higher contrast
        ctx.fillStyle = `rgba(64, 224, 208, ${nodeOpacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Pulsing glow with enhanced visibility
        const glowRadius = nodeSize + pulseIntensity * 12
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        )
        gradient.addColorStop(0, `rgba(64, 224, 208, ${nodeOpacity * 0.9})`)
        gradient.addColorStop(0.3, `rgba(32, 178, 170, ${nodeOpacity * 0.5})`)
        gradient.addColorStop(0.7, `rgba(45, 212, 191, ${nodeOpacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(45, 212, 191, 0)')
        
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