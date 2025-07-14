'use client'

import { useEffect, useRef } from 'react'

interface NeuralNode {
  x: number
  y: number
  vx: number
  vy: number
  energy: number
  pulsePhase: number
  connections: number[]
  type: 'core' | 'synapse' | 'spark'
}

export default function SimpleNeural() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<NeuralNode[]>([])
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeNodes()
    }

    const initializeNodes = () => {
      nodesRef.current = []
      const nodeCount = 60
      
      for (let i = 0; i < nodeCount; i++) {
        const nodeType = i < 15 ? 'core' : i < 45 ? 'synapse' : 'spark'
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          energy: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
          type: nodeType
        })
      }
    }

    const calculateConnections = () => {
      nodesRef.current.forEach((node, i) => {
        node.connections = []
        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const maxDistance = node.type === 'core' ? 200 : 150
            if (distance < maxDistance) {
              node.connections.push(j)
            }
          }
        })
      })
    }

    const animate = () => {
      frameRef.current++
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const time = frameRef.current * 0.01
      
      // Update nodes
      nodesRef.current.forEach(node => {
        // Smooth movement
        node.x += node.vx
        node.y += node.vy
        
        // Bounce off edges with dampening
        if (node.x <= 0 || node.x >= canvas.width) {
          node.vx *= -0.8
          node.x = Math.max(0, Math.min(canvas.width, node.x))
        }
        if (node.y <= 0 || node.y >= canvas.height) {
          node.vy *= -0.8
          node.y = Math.max(0, Math.min(canvas.height, node.y))
        }
        
        // Update energy waves
        node.pulsePhase += 0.02
        node.energy = Math.sin(node.pulsePhase) * 0.3 + 0.7
      })

      calculateConnections()

      // Draw connections with stunning effects
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(connectionIndex => {
          const otherNode = nodesRef.current[connectionIndex]
          if (!otherNode) return

          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const energy = (node.energy + otherNode.energy) / 2
          const pulse = Math.sin(time * 3 + distance * 0.01) * 0.3 + 0.7
          
          // Create gradient for connection
          const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y)
          
          if (node.type === 'core' || otherNode.type === 'core') {
            // Core connections - electric blue to cyan
            gradient.addColorStop(0, `rgba(0, 150, 255, ${energy * pulse * 0.8})`)
            gradient.addColorStop(0.5, `rgba(100, 200, 255, ${energy * pulse})`)
            gradient.addColorStop(1, `rgba(0, 255, 200, ${energy * pulse * 0.8})`)
            ctx.lineWidth = 1.5 + energy * 2
          } else if (node.type === 'spark' || otherNode.type === 'spark') {
            // Spark connections - golden electric
            gradient.addColorStop(0, `rgba(255, 200, 0, ${energy * pulse * 0.6})`)
            gradient.addColorStop(0.5, `rgba(255, 150, 50, ${energy * pulse * 0.8})`)
            gradient.addColorStop(1, `rgba(255, 100, 100, ${energy * pulse * 0.6})`)
            ctx.lineWidth = 0.8 + energy * 1.5
          } else {
            // Synapse connections - cool blue
            gradient.addColorStop(0, `rgba(50, 150, 255, ${energy * pulse * 0.5})`)
            gradient.addColorStop(1, `rgba(100, 200, 255, ${energy * pulse * 0.7})`)
            ctx.lineWidth = 1 + energy * 1.5
          }

          ctx.strokeStyle = gradient
          ctx.shadowColor = gradient.addColorStop ? 'rgba(100, 200, 255, 0.5)' : 'rgba(100, 200, 255, 0.5)'
          ctx.shadowBlur = 3 + energy * 8
          
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          
          // Add subtle curve for organic feel
          const midX = (node.x + otherNode.x) / 2 + Math.sin(time + distance * 0.01) * 10
          const midY = (node.y + otherNode.y) / 2 + Math.cos(time + distance * 0.01) * 10
          ctx.quadraticCurveTo(midX, midY, otherNode.x, otherNode.y)
          ctx.stroke()
          ctx.shadowBlur = 0
        })
      })

      // Draw nodes with beautiful glowing effects
      nodesRef.current.forEach(node => {
        const pulse = Math.sin(node.pulsePhase) * 0.4 + 0.8
        const baseSize = node.type === 'core' ? 6 : node.type === 'synapse' ? 4 : 2
        const size = baseSize + pulse * 3
        
        // Node colors and effects
        let nodeColor, coreColor, glowColor
        
        if (node.type === 'core') {
          nodeColor = `rgba(0, 200, 255, ${pulse})`
          coreColor = `rgba(200, 240, 255, ${pulse * 0.9})`
          glowColor = 'rgba(0, 200, 255, 0.6)'
        } else if (node.type === 'spark') {
          nodeColor = `rgba(255, 180, 0, ${pulse * 0.9})`
          coreColor = `rgba(255, 220, 150, ${pulse * 0.8})`
          glowColor = 'rgba(255, 180, 0, 0.4)'
        } else {
          nodeColor = `rgba(100, 180, 255, ${pulse * 0.8})`
          coreColor = `rgba(180, 220, 255, ${pulse * 0.7})`
          glowColor = 'rgba(100, 180, 255, 0.3)'
        }

        // Outer glow
        const glowRadius = size + 8 + pulse * 6
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        )
        glowGradient.addColorStop(0, glowColor)
        glowGradient.addColorStop(0.3, glowColor.replace(/[^,]+(?=\))/, '0.2'))
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Main node
        ctx.fillStyle = nodeColor
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 8 + pulse * 4
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Inner core
        ctx.fillStyle = coreColor
        ctx.shadowBlur = 0
        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}