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

interface Connection {
  from: number
  to: number
  strength: number
}

export default function NeuronicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize nodes
    const nodeCount = 60
    const nodes: Node[] = []
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
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

    // Create connections
    const connections: Connection[] = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          connections.push({
            from: i,
            to: j,
            strength: 1 - distance / 150
          })
          nodes[i].connections.push(j)
          nodes[j].connections.push(i)
        }
      }
    }

    nodesRef.current = nodes
    connectionsRef.current = connections

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02 * node.pulseDirection
        node.lightningCharge += 0.01
        node.energy = Math.sin(node.lightningCharge) * 0.3 + 0.4

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Keep nodes in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))
      })

      // Draw connections
      connections.forEach(conn => {
        const from = nodes[conn.from]
        const to = nodes[conn.to]
        
        const connectionAlpha = conn.strength * 0.3
        const electricIntensity = Math.sin(Date.now() * 0.005) * 0.2 + 0.8
        const lightningEnergy = (from.energy + to.energy) / 2

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        
        // Add slight curve to connections
        const midX = (from.x + to.x) / 2 + Math.sin(Date.now() * 0.001) * 10
        const midY = (from.y + to.y) / 2 + Math.cos(Date.now() * 0.001) * 10
        ctx.quadraticCurveTo(midX, midY, to.x, to.y)
        
        const electricColor = lightningEnergy > 0.8 
          ? `rgba(200, 230, 255, ${connectionAlpha * electricIntensity})`
          : `rgba(120, 180, 255, ${connectionAlpha})`
        
        ctx.strokeStyle = electricColor
        ctx.lineWidth = conn.strength * 1.5
        ctx.stroke()
      })

      // Draw nodes
      nodes.forEach(node => {
        const pulseSize = 2 + Math.sin(node.pulse) * 1
        const energyGlow = node.energy * 8
        
        // Node glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, energyGlow, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${node.energy * 0.1})`
        ctx.fill()
        
        // Main node
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${0.8 + node.energy * 0.2})`
        ctx.fill()
        
        // Core highlight
        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(147, 197, 253, ${node.energy})`
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)' }}
    />
  )
}