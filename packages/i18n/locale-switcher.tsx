import React from 'react'
import { useTranslation, SupportedLocale } from './index'

interface LocaleSwitcherProps {
  className?: string
  variant?: 'dropdown' | 'buttons' | 'flags'
  showLabels?: boolean
  showFlags?: boolean
}

const localeConfig = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    shortCode: 'EN'
  },
  el: {
    name: 'Greek',
    nativeName: 'Ελληνικά',
    flag: '🇬🇷',
    shortCode: 'ΕΛ'
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    shortCode: 'РУ'
  }
} as const

export function LocaleSwitcher({ 
  className = '', 
  variant = 'dropdown',
  showLabels = true,
  showFlags = true 
}: LocaleSwitcherProps) {
  const { locale, setLocale, t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)

  const supportedLocales: SupportedLocale[] = ['en', 'el', 'ru']

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {supportedLocales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${locale === loc 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }
            `}
            title={localeConfig[loc].name}
          >
            {showFlags && (
              <span className="mr-1">{localeConfig[loc].flag}</span>
            )}
            {showLabels && localeConfig[loc].shortCode}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'flags') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {supportedLocales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`
              p-2 text-lg rounded-md transition-all transform hover:scale-110
              ${locale === loc 
                ? 'ring-2 ring-blue-500 ring-offset-2' 
                : 'hover:bg-gray-100'
              }
            `}
            title={localeConfig[loc].nativeName}
          >
            {localeConfig[loc].flag}
          </button>
        ))}
      </div>
    )
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md
          bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {showFlags && (
          <span>{localeConfig[locale].flag}</span>
        )}
        {showLabels && (
          <span>{localeConfig[locale].shortCode}</span>
        )}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1" role="menu">
              {supportedLocales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2 text-sm text-left
                    transition-colors
                    ${locale === loc 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  role="menuitem"
                >
                  {showFlags && (
                    <span className="text-lg">{localeConfig[loc].flag}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{localeConfig[loc].nativeName}</div>
                    {showLabels && (
                      <div className="text-xs text-gray-500">{localeConfig[loc].name}</div>
                    )}
                  </div>
                  {locale === loc && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Compact version for mobile
export function MobileLocaleSwitcher({ className = '' }: { className?: string }) {
  return (
    <LocaleSwitcher
      className={className}
      variant="flags"
      showLabels={false}
      showFlags={true}
    />
  )
}

// Inline version for settings
export function InlineLocaleSwitcher({ className = '' }: { className?: string }) {
  return (
    <LocaleSwitcher
      className={className}
      variant="buttons"
      showLabels={true}
      showFlags={false}
    />
  )
}

// RTL support component
export function RTLProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation()
  
  React.useEffect(() => {
    const isRTL = false // None of our supported languages are RTL
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale])

  return <>{children}</>
}

// Language detection component
export function LanguageDetector() {
  const { setLocale } = useTranslation()

  React.useEffect(() => {
    // Detect language from various sources
    const detectLanguage = () => {
      // 1. Check URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const urlLang = urlParams.get('lang') as SupportedLocale
      if (urlLang && ['en', 'el', 'ru'].includes(urlLang)) {
        setLocale(urlLang)
        return
      }

      // 2. Check subdomain
      const subdomain = window.location.hostname.split('.')[0]
      if (['en', 'el', 'ru'].includes(subdomain)) {
        setLocale(subdomain as SupportedLocale)
        return
      }

      // 3. Check browser language (already handled in i18n manager)
      // This is handled automatically by the I18nManager
    }

    detectLanguage()
  }, [setLocale])

  return null
}

// Browser locale detection hook
export function useBrowserLocale(): SupportedLocale {
  const [browserLocale, setBrowserLocale] = React.useState<SupportedLocale>('en')

  React.useEffect(() => {
    const detectBrowserLocale = () => {
      const language = navigator.language.split('-')[0] as SupportedLocale
      if (['en', 'el', 'ru'].includes(language)) {
        setBrowserLocale(language)
      }
    }

    detectBrowserLocale()
  }, [])

  return browserLocale
}

// Pluralization helper component
interface PluralTextProps {
  count: number
  one: string
  other: string
  zero?: string
  className?: string
}

export function PluralText({ count, one, other, zero, className }: PluralTextProps) {
  const { locale } = useTranslation()
  
  const getText = () => {
    if (count === 0 && zero) return zero
    if (count === 1) return one
    return other
  }

  return (
    <span className={className}>
      {getText().replace('{count}', count.toString())}
    </span>
  )
}

// Translation missing indicator (development only)
export function TranslationMissing({ translationKey }: { translationKey: string }) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <span 
      className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded border border-red-300"
      title={`Missing translation: ${translationKey}`}
    >
      Missing: {translationKey}
    </span>
  )
}

// Locale-aware date formatting component
interface LocaleDateProps {
  date: Date | string
  format?: 'short' | 'medium' | 'long' | 'full'
  className?: string
}

export function LocaleDate({ date, format = 'medium', className }: LocaleDateProps) {
  const { formatDate, locale } = useTranslation()
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const localeString = locale === 'el' ? 'el-GR' : locale === 'ru' ? 'ru-RU' : 'en-US'
  
  const formatted = new Intl.DateTimeFormat(localeString, {
    dateStyle: format
  }).format(dateObj)

  return <span className={className}>{formatted}</span>
}

// Locale-aware currency formatting component
interface LocaleCurrencyProps {
  amount: number
  currency?: string
  className?: string
}

export function LocaleCurrency({ amount, currency = 'USD', className }: LocaleCurrencyProps) {
  const { formatCurrency } = useTranslation()
  
  return <span className={className}>{formatCurrency(amount, currency)}</span>
}

// Locale-aware number formatting component
interface LocaleNumberProps {
  number: number
  className?: string
}

export function LocaleNumber({ number, className }: LocaleNumberProps) {
  const { formatNumber } = useTranslation()
  
  return <span className={className}>{formatNumber(number)}</span>
}

export default LocaleSwitcher