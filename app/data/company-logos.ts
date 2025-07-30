export interface CompanyLogo {
  name: string
  logoUrl?: string
  fallbackText: string
  backgroundColor?: string
  textColor?: string
}

export const companyLogos: CompanyLogo[] = [
  // Featured Partners (Premium)
  {
    name: 'Mastercard',
    logoUrl: 'https://1000logos.net/wp-content/uploads/2016/10/Mastercard-Logo.png',
    fallbackText: 'MC',
    backgroundColor: '#EB001B',
    textColor: '#FFFFFF'
  },
  {
    name: 'JetBrains',
    logoUrl: 'https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.png',
    fallbackText: 'JB',
    backgroundColor: '#000000',
    textColor: '#FFFFFF'
  },
  {
    name: 'MY.GAMES',
    fallbackText: 'MG',
    backgroundColor: '#FF6B00',
    textColor: '#FFFFFF'
  },
  {
    name: 'Iron Mountain',
    logoUrl: 'https://1000logos.net/wp-content/uploads/2020/09/Iron-Mountain-Logo.png',
    fallbackText: 'IM',
    backgroundColor: '#003366',
    textColor: '#FFFFFF'
  },
  {
    name: 'Depositphotos',
    logoUrl: 'https://1000logos.net/wp-content/uploads/2020/08/Depositphotos-Logo.png',
    fallbackText: 'DP',
    backgroundColor: '#FF6B35',
    textColor: '#FFFFFF'
  },
  
  // Verified Companies (Professional)
  {
    name: 'CPM',
    fallbackText: 'CPM',
    backgroundColor: '#2563EB',
    textColor: '#FFFFFF'
  },
  {
    name: 'JCC Payment Systems Ltd',
    fallbackText: 'JCC',
    backgroundColor: '#1E40AF',
    textColor: '#FFFFFF'
  },
  {
    name: 'Cyta',
    logoUrl: 'https://cdn.brandfetch.io/idE_nEu3qm/w/507/h/197/theme/dark/logo.png',
    fallbackText: 'CYTA',
    backgroundColor: '#317625',
    textColor: '#FFFFFF'
  },
  {
    name: 'ECOMMPAY',
    fallbackText: 'EP',
    backgroundColor: '#7C3AED',
    textColor: '#FFFFFF'
  },
  {
    name: 'INKTECH',
    fallbackText: 'IT',
    backgroundColor: '#059669',
    textColor: '#FFFFFF'
  },
  {
    name: 'H.S Data Ltd',
    fallbackText: 'HSD',
    backgroundColor: '#DC2626',
    textColor: '#FFFFFF'
  },
  {
    name: 'DC Sport Soft',
    fallbackText: 'DSS',
    backgroundColor: '#EA580C',
    textColor: '#FFFFFF'
  },
  {
    name: 'Quadcode',
    logoUrl: 'https://cdn.brandfetch.io/idezFm44gh/w/354/h/112/theme/dark/logo.png',
    fallbackText: 'QC',
    backgroundColor: '#29a13d',
    textColor: '#FFFFFF'
  },
  {
    name: 'easyMarkets',
    fallbackText: 'EM',
    backgroundColor: '#0EA5E9',
    textColor: '#FFFFFF'
  },
  {
    name: 'DECTA',
    logoUrl: 'https://cdn.brandfetch.io/idY0vAaBmu/w/820/h/173/theme/dark/logo.png',
    fallbackText: 'DECTA',
    backgroundColor: '#1F2937',
    textColor: '#FFFFFF'
  }
]

// Helper function to get logo by company name
export const getCompanyLogo = (companyName: string): CompanyLogo | null => {
  return companyLogos.find(logo => logo.name === companyName) || null
}

// Helper function to get logo URL or fallback
export const getLogoDisplay = (companyName: string) => {
  const logo = getCompanyLogo(companyName)
  if (!logo) {
    return {
      type: 'fallback',
      text: companyName.substring(0, 2).toUpperCase(),
      backgroundColor: '#64748B',
      textColor: '#FFFFFF'
    }
  }
  
  if (logo.logoUrl) {
    return {
      type: 'image',
      url: logo.logoUrl,
      alt: `${companyName} logo`
    }
  }
  
  return {
    type: 'fallback',
    text: logo.fallbackText,
    backgroundColor: logo.backgroundColor || '#64748B',
    textColor: logo.textColor || '#FFFFFF'
  }
}