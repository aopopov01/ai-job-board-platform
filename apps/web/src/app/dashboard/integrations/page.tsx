'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@job-board/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { CheckCircle, XCircle, RefreshCw, ExternalLink, AlertCircle, Settings } from 'lucide-react'
import type { IntegrationStatus } from '@job-board/integrations'

export default function IntegrationsPage() {
  const { user } = useAuthStore()
  const searchParams = useSearchParams()
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Check for callback success/error
  useEffect(() => {
    const successParam = searchParams.get('success')
    const errorParam = searchParams.get('error')
    
    if (successParam) {
      setSuccess(getSuccessMessage(successParam))
    }
    if (errorParam) {
      setError(getErrorMessage(errorParam))
    }
  }, [searchParams])

  useEffect(() => {
    const loadIntegrations = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch('/api/integrations/sync')
        
        if (!response.ok) {
          throw new Error('Failed to load integrations')
        }

        const data = await response.json()
        setIntegrations(data.integrations)
      } catch (error: any) {
        setError(error.message || 'Failed to load integrations')
      } finally {
        setLoading(false)
      }
    }

    loadIntegrations()
  }, [user])

  const getSuccessMessage = (type: string): string => {
    switch (type) {
      case 'linkedin_connected':
        return 'LinkedIn integration connected successfully!'
      case 'github_connected':
        return 'GitHub integration connected successfully!'
      default:
        return 'Integration connected successfully!'
    }
  }

  const getErrorMessage = (type: string): string => {
    switch (type) {
      case 'missing_parameters':
        return 'Authentication failed: Missing required parameters'
      case 'connection_failed':
        return 'Failed to connect integration. Please try again.'
      default:
        return 'Integration connection failed'
    }
  }

  const handleConnect = async (integrationType: string) => {
    try {
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ integrationType })
      })

      if (!response.ok) {
        throw new Error('Failed to get OAuth URL')
      }

      const data = await response.json()
      window.location.href = data.oauthUrl
    } catch (error: any) {
      setError(error.message || 'Failed to connect integration')
    }
  }

  const handleDisconnect = async (integrationType: string) => {
    try {
      const response = await fetch(`/api/integrations/connect?type=${integrationType}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect integration')
      }

      // Refresh integrations
      const refreshResponse = await fetch('/api/integrations/sync')
      const refreshData = await refreshResponse.json()
      setIntegrations(refreshData.integrations)
      
      setSuccess('Integration disconnected successfully')
    } catch (error: any) {
      setError(error.message || 'Failed to disconnect integration')
    }
  }

  const handleSync = async (integrationType: string) => {
    try {
      setSyncing(integrationType)
      const response = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ integrationType })
      })

      if (!response.ok) {
        throw new Error('Failed to sync integration')
      }

      // Refresh integrations
      const refreshResponse = await fetch('/api/integrations/sync')
      const refreshData = await refreshResponse.json()
      setIntegrations(refreshData.integrations)
      
      setSuccess('Integration synced successfully')
    } catch (error: any) {
      setError(error.message || 'Failed to sync integration')
    } finally {
      setSyncing(null)
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'linkedin':
        return (
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">in</span>
          </div>
        )
      case 'github':
        return (
          <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">GH</span>
          </div>
        )
      case 'ats':
        return (
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">?</span>
          </div>
        )
    }
  }

  const getIntegrationTitle = (type: string) => {
    switch (type) {
      case 'linkedin':
        return 'LinkedIn'
      case 'github':
        return 'GitHub'
      case 'ats':
        return 'ATS Systems'
      default:
        return type
    }
  }

  const getIntegrationDescription = (type: string) => {
    switch (type) {
      case 'linkedin':
        return 'Import your LinkedIn profile, experience, and skills. Share job posts to your LinkedIn network.'
      case 'github':
        return 'Showcase your GitHub repositories, contribution history, and programming skills.'
      case 'ats':
        return 'Connect with popular ATS systems like Greenhouse, Workday, and Lever for seamless job management.'
      default:
        return 'External integration'
    }
  }

  const getStatusBadge = (integration: IntegrationStatus) => {
    if (!integration.connected) {
      return <Badge variant="secondary">Not Connected</Badge>
    }

    if (integration.sync_status === 'syncing') {
      return <Badge variant="outline" className="text-blue-600">Syncing...</Badge>
    }

    if (integration.sync_status === 'failed') {
      return <Badge variant="destructive">Sync Failed</Badge>
    }

    return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="mt-1 text-sm text-gray-600">
          Connect your external accounts to enhance your profile and streamline your workflow
        </p>
      </div>

      {/* Status Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.type} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIntegrationIcon(integration.type)}
                  <div>
                    <CardTitle className="text-lg">{getIntegrationTitle(integration.type)}</CardTitle>
                    <CardDescription className="text-sm">
                      {getIntegrationDescription(integration.type)}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(integration)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integration.connected && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {integration.last_sync && (
                      <div>
                        <strong>Last sync:</strong> {new Date(integration.last_sync).toLocaleString()}
                      </div>
                    )}
                    {integration.sync_status && (
                      <div>
                        <strong>Status:</strong> {integration.sync_status}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  {integration.connected ? (
                    <>
                      <Button
                        onClick={() => handleSync(integration.type)}
                        disabled={syncing === integration.type}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <RefreshCw className={`h-4 w-4 ${syncing === integration.type ? 'animate-spin' : ''}`} />
                        <span>Sync</span>
                      </Button>
                      <Button
                        onClick={() => handleDisconnect(integration.type)}
                        variant="destructive"
                        size="sm"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(integration.type)}
                      className="flex items-center space-x-1"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Connect</span>
                    </Button>
                  )}
                </div>

                {integration.error_message && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    <strong>Error:</strong> {integration.error_message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Benefits */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Why Connect Your Accounts?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enhanced Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Automatically import your professional experience, skills, and achievements from LinkedIn and GitHub
                to create a comprehensive profile that stands out to employers.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Streamlined Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Connect your ATS systems to sync job postings and candidate applications automatically,
                reducing manual work and keeping everything up to date.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Better Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our AI uses data from your connected accounts to provide better job recommendations
                and help employers find the perfect match for their open positions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Increased Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Share job opportunities to your LinkedIn network and showcase your GitHub contributions
                to demonstrate your technical skills and expertise.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}