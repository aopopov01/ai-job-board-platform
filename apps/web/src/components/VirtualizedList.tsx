'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { throttle } from '../app/performance/cache'

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan])
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  const handleScroll = throttle((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, 16) // ~60fps
  
  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, visibleRange.startIndex + index)
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for calculating optimal item height
export function useVirtualizedItemHeight(sampleText: string) {
  const [itemHeight, setItemHeight] = useState(120) // Default height
  
  useEffect(() => {
    // Add SSR check - only run on client side
    if (typeof document === 'undefined') return
    
    // Create a temporary element to measure text height
    const temp = document.createElement('div')
    temp.style.visibility = 'hidden'
    temp.style.position = 'absolute'
    temp.style.width = '100%'
    temp.style.padding = '1rem'
    temp.style.fontFamily = 'inherit'
    temp.style.fontSize = 'inherit'
    temp.textContent = sampleText
    
    document.body.appendChild(temp)
    const height = temp.offsetHeight
    document.body.removeChild(temp)
    
    // Add some padding for buttons and spacing
    setItemHeight(Math.max(120, height + 60))
  }, [sampleText])
  
  return itemHeight
}