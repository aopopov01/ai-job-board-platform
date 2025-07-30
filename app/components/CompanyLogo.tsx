'use client'

import React, { useState } from 'react'
import { getLogoDisplay } from '../data/company-logos'

interface CompanyLogoProps {
  companyName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl'
}

export default function CompanyLogo({ companyName, size = 'md', className = '' }: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false)
  const logoDisplay = getLogoDisplay(companyName)
  
  const baseClasses = `${sizeClasses[size]} rounded-xl flex items-center justify-center shadow-lg ${className}`
  
  // If image type and no error, show image
  if (logoDisplay.type === 'image' && !imageError) {
    return (
      <div className={`${baseClasses} bg-white/10 backdrop-blur-sm overflow-hidden`}>
        <img
          src={logoDisplay.url}
          alt={logoDisplay.alt}
          className="w-full h-full object-contain p-1"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    )
  }
  
  // Fallback to text/initial display
  return (
    <div 
      className={`${baseClasses} font-black backdrop-blur-sm border border-white/20`}
      style={{ 
        backgroundColor: logoDisplay.backgroundColor,
        color: logoDisplay.textColor 
      }}
    >
      {logoDisplay.text}
    </div>
  )
}