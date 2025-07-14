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
  opacity = 0.7,   // More visible
  nodeCount = 45,  // More nodes for better visibility
  connectionDistance = 160, // Good connection density
  pulseSpeed = 0.02  // Smooth but visible animation
}: NeuronicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('NeuronicBackground: Canvas ref is null')
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('NeuronicBackground: Cannot get 2D context')
      return
    }
    
    console.log('NeuronicBackground: Starting animation with', { opacity, nodeCount, connectionDistance, pulseSpeed })

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
      
      // Debug: Draw test rectangle to verify animation is running
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'
      ctx.fillRect(10, 10, 100, 50)
      ctx.fillStyle = 'black'
      ctx.font = '12px Arial'
      ctx.fillText(`Nodes: ${nodesRef.current.length}`, 15, 30)
      
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
        
        // Gentle energy waves for comfort
        node.lightningCharge += pulseSpeed * 0.8
        node.energy = Math.sin(node.lightningCharge) * 0.2 + 0.3
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
            const alpha = (1 - distance / connectionDistance) * opacity * 0.8

            // Visible neural connections
            const pulseIntensity = (Math.sin(node.pulse) + Math.sin(otherNode.pulse)) / 2
            const neuralEnergy = (node.energy + otherNode.energy) / 2
            const flowIntensity = Math.sin(Date.now() * 0.005 + distance * 0.03) * 0.3 + 0.7
            const connectionAlpha = alpha * (0.6 + pulseIntensity * 0.3 + neuralEnergy * 0.2)

            // MAXIMUM VISIBILITY neural colors
            const neuralColor = neuralEnergy > 0.5 
              ? `rgba(0, 150, 255, 1)` // BRIGHT BLUE - FULL OPACITY
              : `rgba(0, 120, 255, 0.8)` // MEDIUM BLUE - HIGH OPACITY
            
            ctx.strokeStyle = neuralColor
            ctx.lineWidth = 1.2 + neuralEnergy * 1.8  // Visible lines
            
            // Clear glow for visibility
            ctx.shadowColor = neuralColor
            ctx.shadowBlur = 3 + neuralEnergy * 6
            
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            
            // Smooth, organic connections
            ctx.lineTo(otherNode.x, otherNode.y)
            
            ctx.stroke()
            ctx.shadowBlur = 0
          }
        })
      })

      // Draw visible neural nodes
      nodesRef.current.forEach(node => {
        const pulseIntensity = Math.sin(node.pulse) * 0.4 + 0.5
        const neuralEnergy = node.energy
        const nodeOpacity = opacity * (0.7 + pulseIntensity * 0.3 + neuralEnergy * 0.2)
        const nodeSize = 3 + pulseIntensity * 3 + neuralEnergy * 2  // Visible nodes
        const isActive = neuralEnergy > 0.5

        // MAXIMUM VISIBILITY node colors
        const nodeColor = isActive 
          ? `rgba(0, 200, 255, 1)` // BRIGHT CYAN - FULL OPACITY
          : `rgba(0, 150, 255, 0.9)` // BRIGHT BLUE - HIGH OPACITY
          
        // Strong glow for active nodes
        if (isActive) {
          ctx.shadowColor = 'rgba(120, 200, 255, 0.6)'
          ctx.shadowBlur = 8 + neuralEnergy * 8
        }
        
        ctx.fillStyle = nodeColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Bright inner core for visibility
        const coreColor = isActive 
          ? `rgba(200, 230, 255, ${nodeOpacity * 0.9})` 
          : `rgba(150, 200, 245, ${nodeOpacity * 0.8})`
          
        ctx.fillStyle = coreColor
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize * 0.5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 0

        // Visible ambient glow
        const glowRadius = nodeSize + pulseIntensity * 12 + neuralEnergy * 10
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        )
        
        if (isActive) {
          // Bright visible glow for active nodes
          gradient.addColorStop(0, `rgba(150, 210, 255, ${nodeOpacity * 0.8})`)
          gradient.addColorStop(0.2, `rgba(120, 190, 245, ${nodeOpacity * 0.6})`)
          gradient.addColorStop(0.4, `rgba(100, 170, 235, ${nodeOpacity * 0.4})`)
          gradient.addColorStop(0.7, `rgba(80, 150, 225, ${nodeOpacity * 0.2})`)
          gradient.addColorStop(1, 'rgba(60, 130, 215, 0)')
        } else {
          // Clear glow for regular nodes
          gradient.addColorStop(0, `rgba(120, 180, 240, ${nodeOpacity * 0.7})`)
          gradient.addColorStop(0.3, `rgba(100, 160, 230, ${nodeOpacity * 0.5})`)
          gradient.addColorStop(0.6, `rgba(80, 140, 220, ${nodeOpacity * 0.3})`)
          gradient.addColorStop(1, 'rgba(60, 120, 210, 0)')
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
      style={{ opacity: 1 }} // Force full visibility
    />
  )
}