'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  placeholder?: string
  priority?: boolean
}

export function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  priority = false 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (priority) return
    
    // Add SSR check for IntersectionObserver
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsInView(true) // Fallback for SSR - show image immediately
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [priority])
  
  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          placeholder="blur"
          blurDataURL={placeholder}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          priority={priority}
        />
      )}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
    </div>
  )
}