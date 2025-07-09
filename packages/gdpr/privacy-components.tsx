import React, { useState, useEffect } from 'react'
import { gdprManager, type GDPRConsent, type PrivacySettings } from './index'

interface CookieBannerProps {
  onAcceptAll: () => void
  onRejectAll: () => void
  onCustomize: () => void
  className?: string
}

export function CookieBanner({ onAcceptAll, onRejectAll, onCustomize, className = '' }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('gdpr-consent-recorded')
    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    onAcceptAll()
    setIsVisible(false)
    localStorage.setItem('gdpr-consent-recorded', 'true')
  }

  const handleRejectAll = () => {
    onRejectAll()
    setIsVisible(false)
    localStorage.setItem('gdpr-consent-recorded', 'true')
  }

  const handleCustomize = () => {
    onCustomize()
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 ${className}`}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              We value your privacy
            </h3>
            <p className="text-sm text-gray-600">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and provide personalized content. You can customize your preferences or accept all cookies.
              <a href="/privacy-policy" className="text-blue-600 hover:underline ml-1">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 
                       rounded-md transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleCustomize}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 
                       rounded-md transition-colors"
            >
              Customize
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                       rounded-md transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (consents: Map<string, boolean>) => void
  initialConsents?: Map<string, boolean>
}

export function ConsentModal({ isOpen, onClose, onSave, initialConsents }: ConsentModalProps) {
  const [consents, setConsents] = useState<Map<string, boolean>>(
    initialConsents || new Map([
      ['essential', true],
      ['functional', false],
      ['analytics', false],
      ['marketing', false],
      ['third_party', false]
    ])
  )

  const consentDescriptions = {
    essential: {
      title: 'Essential Cookies',
      description: 'Required for basic website functionality, security, and user authentication. These cannot be disabled.',
      examples: 'Session management, security features, basic functionality'
    },
    functional: {
      title: 'Functional Cookies',
      description: 'Enable enhanced features and personalization to improve your experience.',
      examples: 'Language preferences, UI customizations, accessibility features'
    },
    analytics: {
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website to improve performance.',
      examples: 'Page views, user behavior, performance metrics'
    },
    marketing: {
      title: 'Marketing Cookies',
      description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
      examples: 'Ad targeting, conversion tracking, retargeting'
    },
    third_party: {
      title: 'Third-Party Cookies',
      description: 'Cookies from external services integrated into our platform.',
      examples: 'Social media widgets, external analytics, embedded content'
    }
  }

  const handleConsentChange = (type: string, granted: boolean) => {
    if (type === 'essential') return // Cannot change essential cookies
    
    const newConsents = new Map(consents)
    newConsents.set(type, granted)
    setConsents(newConsents)
  }

  const handleSave = () => {
    onSave(consents)
    onClose()
  }

  const handleAcceptAll = () => {
    const allConsents = new Map([
      ['essential', true],
      ['functional', true],
      ['analytics', true],
      ['marketing', true],
      ['third_party', true]
    ])
    setConsents(allConsents)
    onSave(allConsents)
    onClose()
  }

  const handleRejectAll = () => {
    const minimalConsents = new Map([
      ['essential', true],
      ['functional', false],
      ['analytics', false],
      ['marketing', false],
      ['third_party', false]
    ])
    setConsents(minimalConsents)
    onSave(minimalConsents)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            We use different types of cookies to enhance your experience. You can choose which 
            categories you'd like to allow. Essential cookies are always enabled as they're 
            necessary for the website to function properly.
          </p>

          <div className="space-y-4">
            {Object.entries(consentDescriptions).map(([type, info]) => (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{info.title}</h3>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`consent-${type}`}
                      checked={consents.get(type) || false}
                      onChange={(e) => handleConsentChange(type, e.target.checked)}
                      disabled={type === 'essential'}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                               focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    />
                    <label htmlFor={`consent-${type}`} className="ml-2 text-sm text-gray-700">
                      {type === 'essential' ? 'Always Active' : 'Enable'}
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                <p className="text-xs text-gray-500">
                  <strong>Examples:</strong> {info.examples}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleRejectAll}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                       hover:bg-gray-200 rounded-md transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 
                       hover:bg-blue-100 rounded-md transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-700 rounded-md transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface PrivacySettingsProps {
  userId: string
  className?: string
}

export function PrivacySettings({ userId, className = '' }: PrivacySettingsProps) {
  const [settings, setSettings] = useState<PrivacySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [consents, setConsents] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    loadSettings()
    loadConsents()
  }, [userId])

  const loadSettings = async () => {
    try {
      const userSettings = await gdprManager.getPrivacySettings(userId)
      setSettings(userSettings || getDefaultSettings())
    } catch (error) {
      console.error('Failed to load privacy settings:', error)
      setSettings(getDefaultSettings())
    } finally {
      setLoading(false)
    }
  }

  const loadConsents = async () => {
    try {
      const userConsents = await gdprManager.getLatestConsents(userId)
      setConsents(userConsents)
    } catch (error) {
      console.error('Failed to load consents:', error)
    }
  }

  const getDefaultSettings = (): PrivacySettings => ({
    userId,
    dataMinimization: true,
    marketingOptOut: false,
    profileVisibility: 'public',
    searchIndexing: true,
    dataSharing: false,
    analyticsOptOut: false,
    communicationPreferences: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    dataRetention: {
      applications: 1095, // 3 years
      messages: 1095, // 3 years
      analytics: 730 // 2 years
    },
    lastUpdated: new Date().toISOString()
  })

  const handleSettingChange = (key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [key]: value
    })
  }

  const handleCommunicationChange = (key: string, value: boolean) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      communicationPreferences: {
        ...settings.communicationPreferences,
        [key]: value
      }
    })
  }

  const handleRetentionChange = (key: string, value: number) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      dataRetention: {
        ...settings.dataRetention,
        [key]: value
      }
    })
  }

  const handleSave = async () => {
    if (!settings) return
    
    setSaving(true)
    try {
      await gdprManager.updatePrivacySettings(userId, settings)
      alert('Privacy settings saved successfully!')
    } catch (error) {
      console.error('Failed to save privacy settings:', error)
      alert('Failed to save privacy settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleConsentUpdate = async (consentType: GDPRConsent['consentType'], granted: boolean) => {
    try {
      await gdprManager.recordConsent(
        userId,
        consentType,
        granted,
        'settings_page',
        '', // IP address would be captured server-side
        navigator.userAgent
      )
      
      const newConsents = new Map(consents)
      newConsents.set(consentType, granted)
      setConsents(newConsents)
    } catch (error) {
      console.error('Failed to update consent:', error)
      alert('Failed to update consent. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Data Collection & Usage */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Collection & Usage</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Data Minimization</label>
              <p className="text-xs text-gray-500">Only collect and process necessary data</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dataMinimization}
              onChange={(e) => handleSettingChange('dataMinimization', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Analytics Opt-out</label>
              <p className="text-xs text-gray-500">Exclude your data from analytics</p>
            </div>
            <input
              type="checkbox"
              checked={settings.analyticsOptOut}
              onChange={(e) => handleSettingChange('analyticsOptOut', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Data Sharing</label>
              <p className="text-xs text-gray-500">Allow sharing data with trusted partners</p>
            </div>
            <input
              type="checkbox"
              checked={settings.dataSharing}
              onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Profile & Visibility */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile & Visibility</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Profile Visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public - Visible to everyone</option>
              <option value="limited">Limited - Visible to registered users only</option>
              <option value="private">Private - Not visible in searches</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Search Engine Indexing</label>
              <p className="text-xs text-gray-500">Allow search engines to index your profile</p>
            </div>
            <input
              type="checkbox"
              checked={settings.searchIndexing}
              onChange={(e) => handleSettingChange('searchIndexing', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Marketing Opt-out</label>
              <p className="text-xs text-gray-500">Stop receiving marketing communications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketingOptOut}
              onChange={(e) => handleSettingChange('marketingOptOut', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(settings.communicationPreferences).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">{key}</label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleCommunicationChange(key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cookie Consents */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cookie Preferences</h3>
        
        <div className="space-y-4">
          {[
            { key: 'functional', label: 'Functional Cookies', description: 'Enhanced features and personalization' },
            { key: 'analytics', label: 'Analytics Cookies', description: 'Usage analytics and performance monitoring' },
            { key: 'marketing', label: 'Marketing Cookies', description: 'Advertising and marketing communications' },
            { key: 'third_party', label: 'Third-party Cookies', description: 'External services and integrations' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              <input
                type="checkbox"
                checked={consents.get(key) || false}
                onChange={(e) => handleConsentUpdate(key as GDPRConsent['consentType'], e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Data Retention */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention Preferences</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.dataRetention).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 block mb-2 capitalize">
                {key} Data (days)
              </label>
              <select
                value={value}
                onChange={(e) => handleRetentionChange(key, parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={365}>1 Year</option>
                <option value={730}>2 Years</option>
                <option value={1095}>3 Years</option>
                <option value={1825}>5 Years</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}

interface DataRequestFormProps {
  userId: string
  onSubmit: (requestId: string) => void
  className?: string
}

export function DataRequestForm({ userId, onSubmit, className = '' }: DataRequestFormProps) {
  const [requestType, setRequestType] = useState<'access' | 'rectification' | 'erasure' | 'restriction' | 'portability' | 'objection'>('access')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const requestTypes = {
    access: {
      title: 'Access My Data',
      description: 'Request a copy of all personal data we hold about you'
    },
    rectification: {
      title: 'Correct My Data',
      description: 'Request correction of inaccurate or incomplete personal data'
    },
    erasure: {
      title: 'Delete My Data',
      description: 'Request deletion of your personal data (right to be forgotten)'
    },
    restriction: {
      title: 'Restrict Processing',
      description: 'Request restriction of processing of your personal data'
    },
    portability: {
      title: 'Data Portability',
      description: 'Request your data in a structured, machine-readable format'
    },
    objection: {
      title: 'Object to Processing',
      description: 'Object to processing of your personal data for specific purposes'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setSubmitting(true)
    try {
      const requestId = await gdprManager.submitDataSubjectRequest(
        userId,
        requestType,
        description
      )
      onSubmit(requestId)
    } catch (error) {
      console.error('Failed to submit data request:', error)
      alert('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Data Subject Request</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Request Type</label>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(requestTypes).map(([key, info]) => (
              <option key={key} value={key}>{info.title}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {requestTypes[requestType].description}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide any additional details about your request..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800">Important Information</h4>
              <p className="text-sm text-yellow-700 mt-1">
                We will respond to your request within 30 days. You may be asked to verify your identity 
                before we process your request. Some requests may take longer if they are complex or numerous.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CookieBanner