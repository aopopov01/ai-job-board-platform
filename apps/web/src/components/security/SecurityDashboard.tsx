'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Users, 
  Eye, 
  EyeOff,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface SecurityMetrics {
  currentThreats: {
    failedLogins: number
    rateLimitHits: number
    suspiciousActivity: number
    blockedIPs: string[]
    mfaFailures: number
  }
  dailyStats: {
    totalLogins: number
    successfulLogins: number
    failedLoginRate: number
    newUserRegistrations: number
    securityEvents: number
    mfaAdoptionRate: number
  }
  alerts: SecurityAlert[]
  systemHealth: {
    status: 'healthy' | 'warning' | 'critical'
    responseTime: number
    errorRate: number
    activeUsers: number
  }
}

interface SecurityAlert {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: string
  message: string
  timestamp: string
  affectedUser?: string
  ipAddress?: string
  actionRequired: boolean
  autoResolved: boolean
}

interface ThreatAnalysis {
  riskScore: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
  activeThreats: string[]
  recommendations: string[]
  trending: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [threatAnalysis, setThreatAnalysis] = useState<ThreatAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch security metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/security/dashboard')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Failed to fetch security metrics:', error)
    }
  }

  // Fetch threat analysis
  const fetchThreatAnalysis = async () => {
    try {
      const response = await fetch('/api/security/threat-analysis')
      if (response.ok) {
        const data = await response.json()
        setThreatAnalysis(data)
      }
    } catch (error) {
      console.error('Failed to fetch threat analysis:', error)
    }
  }

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([fetchMetrics(), fetchThreatAnalysis()])
    setRefreshing(false)
  }

  // Initial load
  useEffect(() => {
    const initialLoad = async () => {
      await refreshData()
      setLoading(false)
    }
    initialLoad()
  }, [])

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Resolve alert
  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/security/alerts/${alertId}/resolve`, {
        method: 'POST'
      })
      if (response.ok) {
        await refreshData()
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!metrics || !threatAnalysis) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load security dashboard data. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendingIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security threats and system health in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Auto Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Threat Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Threat Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{threatAnalysis.riskScore}/100</div>
                <Badge className={getSeverityColor(threatAnalysis.threatLevel)}>
                  {threatAnalysis.threatLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Trending</p>
              <div className="flex items-center space-x-2">
                {getTrendingIcon(threatAnalysis.trending.direction)}
                <span className="text-sm">{threatAnalysis.trending.percentage}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Threats</p>
              <div className="text-2xl font-bold">{threatAnalysis.activeThreats.length}</div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">System Status</p>
              <Badge className={getStatusColor(metrics.systemHealth.status)}>
                {metrics.systemHealth.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Threats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current Threats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Failed Logins</span>
              <span className="font-medium">{metrics.currentThreats.failedLogins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Rate Limit Hits</span>
              <span className="font-medium">{metrics.currentThreats.rateLimitHits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Suspicious Activity</span>
              <span className="font-medium">{metrics.currentThreats.suspiciousActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">MFA Failures</span>
              <span className="font-medium">{metrics.currentThreats.mfaFailures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Blocked IPs</span>
              <span className="font-medium">{metrics.currentThreats.blockedIPs.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Daily Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Logins</span>
              <span className="font-medium">{metrics.dailyStats.totalLogins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Successful Logins</span>
              <span className="font-medium">{metrics.dailyStats.successfulLogins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Failed Login Rate</span>
              <span className="font-medium">{metrics.dailyStats.failedLoginRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">New Users</span>
              <span className="font-medium">{metrics.dailyStats.newUserRegistrations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">MFA Adoption</span>
              <span className="font-medium">{metrics.dailyStats.mfaAdoptionRate.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={getStatusColor(metrics.systemHealth.status)}>
                {metrics.systemHealth.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="font-medium">{metrics.systemHealth.responseTime}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Error Rate</span>
              <span className="font-medium">{metrics.systemHealth.errorRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="font-medium">{metrics.systemHealth.activeUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Security Alerts</span>
            <Badge variant="outline">{metrics.alerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.alerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No active security alerts
            </p>
          ) : (
            <div className="space-y-3">
              {metrics.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{alert.type}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        {alert.affectedUser && <span>User: {alert.affectedUser}</span>}
                        {alert.ipAddress && <span>IP: {alert.ipAddress}</span>}
                      </div>
                    </div>
                    {alert.actionRequired && !alert.autoResolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Threats Details */}
      {threatAnalysis.activeThreats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {threatAnalysis.activeThreats.map((threat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">{threat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {threatAnalysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {threatAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}