'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { paymentService, type Subscription } from '@job-board/shared'
import { subscriptionPlans } from '@job-board/shared/src/services/paymentService'
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface UsageStats {
  current_usage: Record<string, number>
  limits: Record<string, number>
  usage_percentage: Record<string, number>
}

export default function BillingPage() {
  const { profile, user } = useAuthStore()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [managingSubscription, setManagingSubscription] = useState(false)

  // Check for payment success/cancellation
  const paymentSuccess = searchParams.get('success')
  const paymentCanceled = searchParams.get('canceled')

  useEffect(() => {
    const loadBillingData = async () => {
      if (!user) return

      try {
        setLoading(true)
        
        // Load subscription and usage stats in parallel
        const [subscriptionData, usageData] = await Promise.all([
          paymentService.getCurrentSubscription().catch(() => null),
          paymentService.getUsageStats().catch(() => null)
        ])

        setSubscription(subscriptionData)
        setUsageStats(usageData)
      } catch (error: any) {
        setError(error.message || 'Failed to load billing data')
      } finally {
        setLoading(false)
      }
    }

    loadBillingData()
  }, [user])

  const handleManageSubscription = async () => {
    setManagingSubscription(true)
    try {
      const { url } = await paymentService.createPortalSession()
      window.location.href = url
    } catch (error: any) {
      setError(error.message || 'Failed to open billing portal')
    } finally {
      setManagingSubscription(false)
    }
  }

  const handleUpgrade = async (planId: string, billingCycle: 'monthly' | 'yearly') => {
    try {
      const session = await paymentService.createCheckoutSession(planId, billingCycle)
      await paymentService.redirectToCheckout(session.sessionId)
    } catch (error: any) {
      setError(error.message || 'Failed to start upgrade process')
    }
  }

  const currentPlan = subscriptionPlans.find(plan => plan.id === (profile as any)?.subscription_plan)
  const availablePlans = subscriptionPlans.filter(plan => 
    plan.user_type === profile?.user_type && plan.id !== (profile as any)?.subscription_plan
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'past_due': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'canceled': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'past_due': return 'bg-yellow-100 text-yellow-800'
      case 'canceled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
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
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your subscription and view usage statistics
        </p>
      </div>

      {/* Payment Status Messages */}
      {paymentSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800">Payment successful! Your subscription has been activated.</p>
          </div>
        </div>
      )}

      {paymentCanceled && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">Payment was canceled. Your subscription remains unchanged.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Current Subscription */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Subscription</span>
            {subscription && (
              <div className="flex items-center space-x-2">
                {getStatusIcon(subscription.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPlan ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentPlan?.name || 'Free Plan'}</h3>
                  <p className="text-sm text-gray-600">
                    {paymentService.formatPrice(currentPlan?.price_monthly || 0)} / month
                  </p>
                </div>
                <div className="text-right">
                  {subscription && (
                    <div className="text-sm text-gray-600">
                      <p>Current period ends: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
                      <p>Billing cycle: {subscription.billing_cycle}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Features included:</h4>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {subscription && subscription.status === 'active' && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleManageSubscription}
                    disabled={managingSubscription}
                    variant="outline"
                  >
                    {managingSubscription ? 'Opening...' : 'Manage Subscription'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No active subscription</p>
              <p className="text-sm text-gray-400 mt-2">Upgrade to unlock premium features</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {usageStats && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Usage Statistics</CardTitle>
            <CardDescription>Your current usage for this billing period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(usageStats.current_usage).map(([key, value]) => {
                const limit = usageStats.limits[key]
                const percentage = usageStats.usage_percentage[key]
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">
                        {value} / {limit === -1 ? '∞' : limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUsageColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {limit === -1 ? 'Unlimited' : `${percentage}% used`}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      {availablePlans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {paymentService.formatPrice(plan.price_monthly)}
                      </span>
                      <span className="text-gray-600"> / month</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {paymentService.formatPrice(plan.price_yearly)} / year 
                      <span className="text-green-600 ml-1">
                        (Save {paymentService.formatPrice(paymentService.calculateYearlySavings(plan))})
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'monthly')}
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Upgrade - Monthly
                      </Button>
                      <Button
                        onClick={() => handleUpgrade(plan.id, 'yearly')}
                        className="w-full"
                        variant="outline"
                      >
                        Upgrade - Yearly
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}