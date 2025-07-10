'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Label } from '@job-board/ui'
import { Alert, AlertDescription } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Separator } from '@job-board/ui'
import { 
  Shield, 
  Smartphone, 
  Key, 
  Copy, 
  Check, 
  AlertTriangle,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { logComponentError, toError } from '@/lib/logger'

interface MFAStatus {
  enabled: boolean
  backupCodesRemaining: number
  lastUsed?: string
  canSetup: boolean
}

interface MFASetup {
  userId: string
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
  isEnabled: boolean
}

export default function MFASetup() {
  const [status, setStatus] = useState<MFAStatus | null>(null)
  const [setup, setSetup] = useState<MFASetup | null>(null)
  const [loading, setLoading] = useState(true)
  const [setupStep, setSetupStep] = useState<'start' | 'scan' | 'verify' | 'backup' | 'complete'>('start')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [copiedCodes, setCopiedCodes] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch MFA status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/auth/mfa/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      logComponentError('MFASetup', toError(error), { action: 'fetchStatus' })
    } finally {
      setLoading(false)
    }
  }

  // Start MFA setup
  const startSetup = async () => {
    try {
      setError('')
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setSetup(data)
        setSetupStep('scan')
      } else {
        const error = await response.json()
        setError(error.message || 'Failed to start MFA setup')
      }
    } catch (error) {
      setError('Failed to start MFA setup')
    }
  }

  // Verify and enable MFA
  const verifyAndEnable = async () => {
    try {
      setError('')
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: verificationCode
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setBackupCodes(setup?.backupCodes || [])
          setSetupStep('backup')
          setSuccess('MFA has been successfully enabled!')
        } else {
          setError('Invalid verification code. Please try again.')
        }
      } else {
        const error = await response.json()
        setError(error.message || 'Verification failed')
      }
    } catch (error) {
      setError('Verification failed')
    }
  }

  // Disable MFA
  const disableMFA = async () => {
    try {
      setError('')
      const token = prompt('Enter your current MFA code to disable:')
      if (!token) return
      
      const response = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      
      if (response.ok) {
        setSuccess('MFA has been disabled')
        await fetchStatus()
      } else {
        const error = await response.json()
        setError(error.message || 'Failed to disable MFA')
      }
    } catch (error) {
      setError('Failed to disable MFA')
    }
  }

  // Regenerate backup codes
  const regenerateBackupCodes = async () => {
    try {
      setError('')
      const token = prompt('Enter your current MFA code to regenerate backup codes:')
      if (!token) return
      
      const response = await fetch('/api/auth/mfa/regenerate-backup-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })
      
      if (response.ok) {
        const data = await response.json()
        setBackupCodes(data.backupCodes)
        setShowBackupCodes(true)
        setSuccess('New backup codes generated')
        await fetchStatus()
      } else {
        const error = await response.json()
        setError(error.message || 'Failed to regenerate backup codes')
      }
    } catch (error) {
      setError('Failed to regenerate backup codes')
    }
  }

  // Copy backup codes to clipboard
  const copyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'))
      setCopiedCodes(true)
      setTimeout(() => setCopiedCodes(false), 2000)
    } catch (error) {
      logComponentError('MFASetup', toError(error), { action: 'copyBackupCodes' })
    }
  }

  // Download backup codes
  const downloadBackupCodes = () => {
    const content = `JobBoard Pro - MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nIMPORTANT: Store these codes in a secure location. Each code can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jobboard-pro-backup-codes-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Complete setup
  const completeSetup = () => {
    setSetupStep('complete')
    fetchStatus()
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!status) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load MFA status. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Multi-Factor Authentication</h2>
        <p className="text-muted-foreground">
          Secure your account with an additional layer of protection
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* MFA Status */}
      {status.enabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>MFA Enabled</span>
            </CardTitle>
            <CardDescription>
              Your account is protected with multi-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Backup Codes Remaining</p>
                <p className="font-medium">{status.backupCodesRemaining}</p>
              </div>
              {status.lastUsed && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Used</p>
                  <p className="font-medium">{new Date(status.lastUsed).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={regenerateBackupCodes}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Backup Codes
              </Button>
              <Button
                variant="destructive"
                onClick={disableMFA}
              >
                Disable MFA
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Flow */}
      {!status.enabled && status.canSetup && (
        <div className="space-y-6">
          {setupStep === 'start' && (
            <Card>
              <CardHeader>
                <CardTitle>Enable Multi-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account using your mobile device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Install an authenticator app</p>
                      <p className="text-sm text-muted-foreground">
                        Download Google Authenticator, Authy, or any TOTP app
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Scan QR code</p>
                      <p className="text-sm text-muted-foreground">
                        Use your authenticator app to scan the QR code
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Verify and enable</p>
                      <p className="text-sm text-muted-foreground">
                        Enter the code from your app to complete setup
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button onClick={startSetup} className="w-full">
                  Start Setup
                </Button>
              </CardContent>
            </Card>
          )}

          {setupStep === 'scan' && setup && (
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Use your authenticator app to scan this QR code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG value={setup.qrCodeUrl} size={200} />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Can't scan? Enter this code manually:
                  </p>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {setup.secret}
                  </code>
                </div>
                
                <Button onClick={() => setSetupStep('verify')} className="w-full">
                  I've Added the Account
                </Button>
              </CardContent>
            </Card>
          )}

          {setupStep === 'verify' && (
            <Card>
              <CardHeader>
                <CardTitle>Verify Setup</CardTitle>
                <CardDescription>
                  Enter the 6-digit code from your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                
                <Button 
                  onClick={verifyAndEnable} 
                  className="w-full"
                  disabled={verificationCode.length !== 6}
                >
                  Verify and Enable MFA
                </Button>
              </CardContent>
            </Card>
          )}

          {setupStep === 'backup' && (
            <Card>
              <CardHeader>
                <CardTitle>Save Backup Codes</CardTitle>
                <CardDescription>
                  Store these codes in a secure location. Each code can only be used once.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    These backup codes are your only way to access your account if you lose your device. 
                    Store them securely and never share them.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-white p-2 rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={copyBackupCodes}
                    className="flex-1"
                  >
                    {copiedCodes ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Codes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadBackupCodes}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <Button onClick={completeSetup} className="w-full">
                  I've Saved My Backup Codes
                </Button>
              </CardContent>
            </Card>
          )}

          {setupStep === 'complete' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>MFA Setup Complete</span>
                </CardTitle>
                <CardDescription>
                  Your account is now protected with multi-factor authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Enhanced Security</p>
                      <p className="text-sm text-muted-foreground">
                        Your account is now protected with MFA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Key className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Backup Codes Saved</p>
                      <p className="text-sm text-muted-foreground">
                        Keep your backup codes in a secure location
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Show Backup Codes */}
      {showBackupCodes && backupCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Backup Codes</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBackupCodes(false)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="bg-white p-2 rounded border">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={copyBackupCodes}
                className="flex-1"
              >
                {copiedCodes ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Codes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={downloadBackupCodes}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}