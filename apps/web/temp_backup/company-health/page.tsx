'use client'

import { useState, useEffect } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@job-board/ui'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Brain,
  Search,
  Eye,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Heart,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Star,
  Award,
  Briefcase,
  Calendar
} from 'lucide-react'
import {
  CompanyHealthProfile,
  HealthAlert,
  LayoffRiskPrediction,
  companyHealthMonitor,
  CompanyHealthUtils
} from '@job-board/ai/company-health'

export default function CompanyHealthPage() {
  // Main state
  const [activeTab, setActiveTab] = useState<'search' | 'dashboard' | 'alerts' | 'trends'>('search')
  const [selectedCompany, setSelectedCompany] = useState<CompanyHealthProfile | null>(null)
  const [healthProfiles, setHealthProfiles] = useState<CompanyHealthProfile[]>([])
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Analysis state
  const [analysisDepth, setAnalysisDepth] = useState<'basic' | 'standard' | 'comprehensive'>('standard')

  // Search for companies
  const searchCompanies = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      // Mock search results - in real app would call API
      const mockResults = [
        { id: '1', name: searchQuery, industry: 'Technology', size: '1000-5000', location: 'San Francisco' },
        { id: '2', name: `${searchQuery} Inc`, industry: 'Technology', size: '100-500', location: 'Austin' },
        { id: '3', name: `${searchQuery} Corp`, industry: 'Finance', size: '5000+', location: 'New York' }
      ]
      setSearchResults(mockResults)
    } catch (error) {
      console.error('Error searching companies:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Analyze company health
  const analyzeCompany = async (company: any) => {
    setIsAnalyzing(true)
    try {
      const healthProfile = await companyHealthMonitor.analyzeCompanyHealth({
        companyId: company.id,
        companyName: company.name,
        industry: company.industry,
        analysisDepth,
        dataReferences: [
          {
            source: 'financial_reports',
            date: new Date(),
            reliability: 85,
            content: 'Recent financial performance data'
          },
          {
            source: 'employee_reviews',
            date: new Date(),
            reliability: 80,
            content: 'Employee satisfaction and culture data'
          }
        ]
      })
      
      setSelectedCompany(healthProfile)
      setHealthProfiles(prev => {
        const existing = prev.find(p => p.companyId === company.id)
        if (existing) {
          return prev.map(p => p.companyId === company.id ? healthProfile : p)
        }
        return [...prev, healthProfile]
      })
      
      // Generate alerts
      const companyAlerts = await companyHealthMonitor.generateHealthAlerts(healthProfile)
      setAlerts(prev => [...prev, ...companyAlerts])
      
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Error analyzing company:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get risk level badge
  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      'very_low': 'bg-green-100 text-green-800',
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'very_high': 'bg-red-100 text-red-800'
    }
    return colors[riskLevel as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Predictive Company Health Monitor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered insights into company financial health, culture, and layoff risk prediction
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Health Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Alerts ({alerts.filter(a => a.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trends
            </TabsTrigger>
          </TabsList>

          {/* Company Search */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Company Health Analysis
                </CardTitle>
                <CardDescription>
                  Search for companies to analyze their financial health, culture, and layoff risk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Input */}
                <div className="flex space-x-4">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter company name (e.g., Google, Microsoft, Airbnb)"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && searchCompanies()}
                  />
                  <Button onClick={searchCompanies} disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? (
                      <>
                        <Brain className="mr-2 h-4 w-4 animate-pulse" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Analysis Depth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Analysis Depth
                  </label>
                  <select
                    value={analysisDepth}
                    onChange={(e) => setAnalysisDepth(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic Analysis - Quick overview</option>
                    <option value="standard">Standard Analysis - Comprehensive insights</option>
                    <option value="comprehensive">Deep Analysis - All metrics + predictions</option>
                  </select>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Search Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((company) => (
                        <Card key={company.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{company.name}</h4>
                                <p className="text-sm text-gray-600">{company.industry}</p>
                              </div>
                              <Badge variant="outline">{company.size} employees</Badge>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">{company.location}</span>
                              <Button
                                size="sm"
                                onClick={() => analyzeCompany(company)}
                                disabled={isAnalyzing}
                              >
                                {isAnalyzing ? (
                                  <>
                                    <Brain className="mr-1 h-3 w-3 animate-pulse" />
                                    Analyzing...
                                  </>
                                ) : (
                                  <>
                                    <Eye className="mr-1 h-3 w-3" />
                                    Analyze
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recently Analyzed */}
                {healthProfiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recently Analyzed Companies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {healthProfiles.slice(0, 4).map((profile) => (
                        <Card 
                          key={profile.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedCompany(profile)
                            setActiveTab('dashboard')
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium">{profile.companyName}</h4>
                                <p className="text-sm text-gray-600">{profile.industry}</p>
                              </div>
                              <Badge className={getRiskBadge(profile.riskLevel)}>
                                {profile.riskLevel.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`text-2xl font-bold ${CompanyHealthUtils.getHealthScoreColor(profile.healthScore)}`}>
                                  {profile.healthScore}
                                </div>
                                <div className="ml-2 text-sm text-gray-500">Health Score</div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(profile.lastUpdated).toLocaleDateString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {selectedCompany ? (
              <>
                {/* Company Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Building className="mr-2 h-5 w-5" />
                        {selectedCompany.companyName}
                      </span>
                      <Badge className={getRiskBadge(selectedCompany.riskLevel)}>
                        {selectedCompany.riskLevel.replace('_', ' ')} Risk
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {selectedCompany.industry} • Last updated {new Date(selectedCompany.lastUpdated).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Overall Health Score */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${CompanyHealthUtils.getHealthScoreColor(selectedCompany.healthScore)}`}>
                          {selectedCompany.healthScore}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Overall Health</div>
                        <div className="text-xs text-gray-400">
                          {CompanyHealthUtils.formatHealthScore(selectedCompany.healthScore)}
                        </div>
                      </div>

                      {/* Layoff Risk */}
                      <div className="text-center">
                        <div className={`text-4xl font-bold ${selectedCompany.predictions.layoffRisk.probability > 50 ? 'text-red-600' : selectedCompany.predictions.layoffRisk.probability > 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {selectedCompany.predictions.layoffRisk.probability}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Layoff Risk</div>
                        <div className="text-xs text-gray-400">
                          {CompanyHealthUtils.formatLayoffRisk(selectedCompany.predictions.layoffRisk.probability)}
                        </div>
                      </div>

                      {/* Financial Stability */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">
                          {selectedCompany.predictions.financialStability.stabilityScore}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Financial Stability</div>
                        <div className="text-xs text-gray-400">
                          {selectedCompany.predictions.financialStability.cashRunway} months runway
                        </div>
                      </div>

                      {/* Data Confidence */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600">
                          {selectedCompany.dataConfidence}%
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Data Confidence</div>
                        <div className="text-xs text-gray-400">Analysis reliability</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Financial Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Financial Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Revenue Growth</span>
                          <span className="text-sm font-bold text-green-600">
                            +{selectedCompany.financialHealth.revenue.revenueGrowthRate}%
                          </span>
                        </div>
                        <Progress value={selectedCompany.financialHealth.revenue.revenueGrowthRate} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Profitability</span>
                          <span className="text-sm font-bold">
                            {selectedCompany.financialHealth.profitability.operatingMargin}% margin
                          </span>
                        </div>
                        <Progress value={selectedCompany.financialHealth.profitability.operatingMargin} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Cash Position</span>
                          <span className="text-sm font-bold text-blue-600">
                            {CompanyHealthUtils.formatCurrency(selectedCompany.financialHealth.cashFlow.cashPosition)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-1">Funding Status</div>
                        <div className="text-xs text-blue-700">
                          {selectedCompany.financialHealth.funding.fundingStage} • 
                          Last round: {CompanyHealthUtils.formatCurrency(selectedCompany.financialHealth.funding.lastFundingAmount)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Culture Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="mr-2 h-5 w-5" />
                        Culture Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Employee Satisfaction</span>
                          <span className="text-sm font-bold">
                            {selectedCompany.cultureHealth.employeeSatisfaction.overallSatisfaction}/100
                          </span>
                        </div>
                        <Progress value={selectedCompany.cultureHealth.employeeSatisfaction.overallSatisfaction} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Work-Life Balance</span>
                          <span className="text-sm font-bold">
                            {selectedCompany.cultureHealth.workLifeBalance.balanceScore}/100
                          </span>
                        </div>
                        <Progress value={selectedCompany.cultureHealth.workLifeBalance.balanceScore} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Leadership Effectiveness</span>
                          <span className="text-sm font-bold">
                            {selectedCompany.cultureHealth.leadership.leadershipEffectiveness}/100
                          </span>
                        </div>
                        <Progress value={selectedCompany.cultureHealth.leadership.leadershipEffectiveness} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Retention Rate</span>
                          <span className="text-sm font-bold text-green-600">
                            {selectedCompany.cultureHealth.retention.overallRetention}%
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-green-800 mb-1">Glassdoor Rating</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-green-700">
                            {selectedCompany.employeeInsights.glassdoorRating}/5.0 
                            ({selectedCompany.employeeInsights.glassdoorReviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Layoff Risk Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Layoff Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Risk Assessment</h4>
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${selectedCompany.predictions.layoffRisk.probability > 50 ? 'text-red-600' : selectedCompany.predictions.layoffRisk.probability > 25 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {selectedCompany.predictions.layoffRisk.probability}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {selectedCompany.predictions.layoffRisk.severity} severity
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            Potential impact: {selectedCompany.predictions.layoffRisk.potentialImpact}% of workforce
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-red-600">Risk Factors</h4>
                        <ul className="space-y-2">
                          {selectedCompany.predictions.layoffRisk.riskFactors.map((factor, index) => (
                            <li key={index} className="flex items-start">
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-green-600">Mitigating Factors</h4>
                        <ul className="space-y-2">
                          {selectedCompany.predictions.layoffRisk.mitigatingFactors.map((factor, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{factor}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                        <div>
                          <div className="font-medium text-yellow-800">Timeline Prediction</div>
                          <div className="text-sm text-yellow-700 mt-1">
                            Risk timeframe: {selectedCompany.predictions.layoffRisk.timeframe}
                          </div>
                          <div className="text-xs text-yellow-600 mt-1">
                            Confidence: {selectedCompany.predictions.layoffRisk.confidence}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Selected</h3>
                  <p className="text-gray-500 mb-4">
                    Search for and analyze a company to view its health dashboard
                  </p>
                  <Button onClick={() => setActiveTab('search')}>
                    <Search className="mr-2 h-4 w-4" />
                    Search Companies
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Alert Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Alert Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['critical', 'high', 'medium', 'low'].map((severity) => {
                    const count = alerts.filter(a => a.severity === severity && a.status === 'active').length
                    return (
                      <div key={severity} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{severity}</span>
                        <Badge 
                          variant={severity === 'critical' || severity === 'high' ? 'destructive' : 'secondary'}
                          className="ml-2"
                        >
                          {count}
                        </Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Active Alerts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Active Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {alerts.filter(a => a.status === 'active').length > 0 ? (
                    <div className="space-y-4">
                      {alerts.filter(a => a.status === 'active').map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-4 rounded-lg border-l-4 ${
                            alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                            alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                            alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                            'bg-blue-50 border-blue-500'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge className={CompanyHealthUtils.getAlertSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                          
                          <div className="space-y-2">
                            <div className="text-xs text-gray-500">
                              Impact: {alert.estimatedImpact}% • Urgency: {alert.urgency} • {alert.timeframe}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {alert.recommendations.slice(0, 2).map((rec, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {rec}
                                </Badge>
                              ))}
                              {alert.recommendations.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{alert.recommendations.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <p className="text-gray-500">No active alerts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Industry Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Industry Health Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { industry: 'Technology', trend: 'up', change: '+5%', health: 78 },
                      { industry: 'Finance', trend: 'down', change: '-3%', health: 72 },
                      { industry: 'Healthcare', trend: 'up', change: '+8%', health: 82 },
                      { industry: 'Retail', trend: 'down', change: '-7%', health: 65 }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          {item.trend === 'up' ? 
                            <TrendingUp className="h-4 w-4 text-green-500 mr-2" /> :
                            <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                          }
                          <span className="text-sm font-medium">{item.industry}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change}
                          </span>
                          <span className="text-sm text-gray-500">{item.health}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Economic Outlook</div>
                      <div className="text-xs text-blue-700 mt-1">
                        Moderate recession risk with increased layoff probability across tech sector
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800">Funding Environment</div>
                      <div className="text-xs text-yellow-700 mt-1">
                        35% decrease in Series A funding, affecting growth-stage companies
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Hiring Trends</div>
                      <div className="text-xs text-green-700 mt-1">
                        AI and healthcare sectors showing continued strong demand
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}