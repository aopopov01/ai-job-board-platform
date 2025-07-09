'use client'

import { useState, useEffect } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@job-board/ui'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Zap,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  Settings,
  Users,
  Clock,
  Calendar,
  Briefcase,
  Award,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Search,
  Filter,
  Bell,
  Globe,
  MapPin,
  Building,
  GraduationCap,
  Lightbulb,
  Rocket,
  Shield,
  LineChart,
  Gauge,
  Calculator,
  Compass,
  Network,
  BookOpen,
  FlashOff,
  Flame,
  ThermometerSun,
  TrendingFlat
} from 'lucide-react'
import {
  MarketIntelligenceProfile,
  SalaryForecast,
  MarketAlert,
  OptimizationOpportunity,
  marketIntelligenceEngine,
  MarketIntelligenceUtils
} from '@job-board/ai/market-intelligence'

export default function MarketIntelligencePage() {
  // Main state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'salary' | 'trends' | 'forecasts' | 'alerts' | 'optimization'>('dashboard')
  const [userProfile, setUserProfile] = useState<MarketIntelligenceProfile | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Market data state
  const [salaryForecasts, setSalaryForecasts] = useState<SalaryForecast[]>([])
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([])
  const [optimizationOpportunities, setOptimizationOpportunities] = useState<OptimizationOpportunity[]>([])
  
  // User input state
  const [profileData, setProfileData] = useState({
    role: 'Software Engineer',
    industry: 'Technology',
    location: 'San Francisco, CA',
    experience: 5,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS']
  })
  
  // Filters and settings
  const [selectedTimeframe, setSelectedTimeframe] = useState<'quarterly' | 'annual' | '2_year' | '5_year'>('annual')
  const [selectedLocation, setSelectedLocation] = useState('San Francisco, CA')
  const [alertFilters, setAlertFilters] = useState({
    severity: 'all',
    type: 'all',
    status: 'active'
  })

  // Initialize with demo data
  useEffect(() => {
    initializeMarketData()
  }, [])

  const initializeMarketData = async () => {
    try {
      // Generate initial market intelligence profile
      const profile = await marketIntelligenceEngine.analyzeMarketPosition({
        profile: {
          userId: 'current_user',
          userType: 'candidate',
          role: profileData.role,
          industry: profileData.industry,
          location: {
            city: profileData.location.split(', ')[0],
            country: 'United States'
          },
          experience: {
            years_total: profileData.experience,
            seniority_level: profileData.experience < 3 ? 'junior' : profileData.experience < 7 ? 'mid' : 'senior'
          },
          skills: profileData.skills.map(skill => ({ name: skill }))
        },
        analysisDepth: 'comprehensive',
        dataReferences: [
          {
            source: 'market_data',
            date: new Date(),
            reliability: 90,
            content: 'Real-time market intelligence data'
          }
        ]
      })
      
      setUserProfile(profile)
      
      // Generate alerts and opportunities
      const alerts = await marketIntelligenceEngine.generateSalaryAlerts(profile)
      setMarketAlerts(alerts)
      
      const opportunities = await marketIntelligenceEngine.optimizeCompensation(profile)
      setOptimizationOpportunities(opportunities)
      
      // Generate forecasts
      const forecast = await marketIntelligenceEngine.generateMarketForecast(
        profileData.industry,
        selectedTimeframe
      )
      setSalaryForecasts([forecast])
      
    } catch (error) {
      console.error('Error initializing market data:', error)
    }
  }

  // Analyze custom profile
  const analyzeProfile = async () => {
    setIsAnalyzing(true)
    try {
      const profile = await marketIntelligenceEngine.analyzeMarketPosition({
        profile: {
          userId: 'current_user',
          userType: 'candidate',
          role: profileData.role,
          industry: profileData.industry,
          location: {
            city: profileData.location.split(', ')[0],
            country: 'United States'
          },
          experience: {
            years_total: profileData.experience,
            seniority_level: profileData.experience < 3 ? 'junior' : profileData.experience < 7 ? 'mid' : 'senior'
          },
          skills: profileData.skills.map(skill => ({ name: skill }))
        },
        analysisDepth: 'comprehensive',
        dataReferences: [
          {
            source: 'user_input',
            date: new Date(),
            reliability: 85,
            content: 'User-provided profile data'
          }
        ]
      })
      
      setUserProfile(profile)
      
      // Regenerate dependent data
      const alerts = await marketIntelligenceEngine.generateSalaryAlerts(profile)
      setMarketAlerts(alerts)
      
      const opportunities = await marketIntelligenceEngine.optimizeCompensation(profile)
      setOptimizationOpportunities(opportunities)
      
    } catch (error) {
      console.error('Error analyzing profile:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get trend icon
  const getTrendIcon = (direction: string, size: string = 'h-4 w-4') => {
    const icons = {
      declining: <TrendingDown className={`${size} text-red-500`} />,
      stable: <TrendingFlat className={`${size} text-gray-500`} />,
      rising: <TrendingUp className={`${size} text-green-500`} />,
      hot: <Flame className={`${size} text-orange-500`} />
    }
    return icons[direction as keyof typeof icons] || <Minus className={`${size} text-gray-500`} />
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Market Intelligence Engine
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Live salary data, market trends, and AI-powered compensation optimization
          </p>
        </div>

        {/* Profile Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Profile Configuration
            </CardTitle>
            <CardDescription>
              Configure your profile to get personalized market intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <Input
                  value={profileData.role}
                  onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                  placeholder="Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={profileData.industry}
                  onChange={(e) => setProfileData({...profileData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  placeholder="San Francisco, CA"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <Input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: parseInt(e.target.value)})}
                  placeholder="5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top Skills
                </label>
                <Input
                  value={profileData.skills.join(', ')}
                  onChange={(e) => setProfileData({...profileData, skills: e.target.value.split(', ')})}
                  placeholder="JavaScript, React, Python"
                />
              </div>
            </div>
            
            <Button onClick={analyzeProfile} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  Analyzing Market Position...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze Market Position
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Gauge className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="salary" className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Salary Intel
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              Market Trends
            </TabsTrigger>
            <TabsTrigger value="forecasts" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              Forecasts
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Alerts ({marketAlerts.filter(a => a.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Optimization
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {userProfile ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Market Position</p>
                          <p className="text-2xl font-bold">
                            {userProfile.benchmarks.market_position.overall_percentile}th
                          </p>
                          <p className="text-xs text-gray-500">percentile</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Salary Range</p>
                          <p className="text-2xl font-bold">
                            {MarketIntelligenceUtils.formatSalaryRange(userProfile.salaryData.current_market_value.base_salary)}
                          </p>
                          <p className="text-xs text-gray-500">market rate</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Negotiation Score</p>
                          <p className="text-2xl font-bold">
                            {userProfile.salaryData.negotiation_leverage.leverage_score}
                          </p>
                          <p className="text-xs text-gray-500">out of 100</p>
                        </div>
                        <Zap className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Growth Rate</p>
                          <p className="text-2xl font-bold">
                            {userProfile.marketTrends.salary_trends.annual_growth_rate}%
                          </p>
                          <p className="text-xs text-gray-500">annual</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Insight */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-5 w-5" />
                      AI Market Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <p className="text-blue-900 font-medium">
                            {MarketIntelligenceUtils.generateMarketInsight(userProfile)}
                          </p>
                          <p className="text-blue-700 text-sm mt-1">
                            Based on your skills, experience, and current market conditions, you have strong positioning for salary negotiation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Skills Market Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProfile.skills.slice(0, 5).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {getTrendIcon(skill.trending.direction)}
                            <div className="ml-3">
                              <p className="font-medium">{skill.name}</p>
                              <p className="text-sm text-gray-600">
                                {skill.proficiency} • {skill.years_experience} years
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              +{skill.salary_impact.base_increase}%
                            </p>
                            <p className="text-sm text-gray-600">salary impact</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Brain className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Market Intelligence Ready</h3>
                  <p className="text-gray-500 mb-4">
                    Configure your profile and click "Analyze Market Position" to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Salary Intelligence */}
          <TabsContent value="salary" className="space-y-6">
            {userProfile ? (
              <>
                {/* Salary Benchmarks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Market Salary Range
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">90th Percentile</span>
                          <span className="text-sm font-bold text-green-600">
                            {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p90)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">75th Percentile</span>
                          <span className="text-sm font-bold">
                            {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p75)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Median (50th)</span>
                          <span className="text-sm font-bold">
                            {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p50)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">25th Percentile</span>
                          <span className="text-sm">
                            {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p25)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">10th Percentile</span>
                          <span className="text-sm text-gray-500">
                            {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p10)}
                          </span>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            Sample size: {userProfile.salaryData.current_market_value.base_salary.sample_size} professionals
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="mr-2 h-5 w-5" />
                        Personalized Range
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.personalized_range.base_salary.p50)}
                          </p>
                          <p className="text-sm text-gray-600">Your market value</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Range</span>
                            <span className="text-sm font-medium">
                              {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.personalized_range.base_salary.p25)} - {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.personalized_range.base_salary.p75)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Confidence</span>
                            <span className="text-sm font-medium">
                              {userProfile.salaryData.personalized_range.confidence_interval}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800 font-medium">
                            {userProfile.salaryData.peer_comparison.above_market > 0 ? 
                              `You're ${MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.peer_comparison.above_market)} above market` :
                              `You're ${MarketIntelligenceUtils.formatCurrency(Math.abs(userProfile.salaryData.peer_comparison.above_market))} below market`
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Total Compensation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      Total Compensation Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p50)}
                        </p>
                        <p className="text-sm text-gray-600">Base Salary</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.base_salary.p50 * (userProfile.salaryData.current_market_value.bonus.typical_percentage / 100))}
                        </p>
                        <p className="text-sm text-gray-600">Annual Bonus</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.equity.valuation_range.p50)}
                        </p>
                        <p className="text-sm text-gray-600">Equity Value</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {MarketIntelligenceUtils.formatCurrency(userProfile.salaryData.current_market_value.benefits_value)}
                        </p>
                        <p className="text-sm text-gray-600">Benefits</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="mr-2 h-5 w-5" />
                      Geographic Salary Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.salaryData.geographic_adjustments.relocation_recommendations.map((rec, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{rec.city}</h4>
                              <Badge className={rec.salary_increase > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {rec.salary_increase > 0 ? '+' : ''}{rec.salary_increase}%
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>Cost-adjusted gain: {rec.cost_adjusted_gain > 0 ? '+' : ''}{rec.cost_adjusted_gain}%</p>
                              <p>Quality of life: {rec.quality_of_life_score}/100</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {userProfile.salaryData.geographic_adjustments.arbitrage_opportunities.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-medium mb-3">Remote Work Arbitrage</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userProfile.salaryData.geographic_adjustments.arbitrage_opportunities.map((opp, index) => (
                              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">{opp.remote_location}</h5>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {opp.salary_retention}% salary
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-blue-700">
                                  <p>Cost savings: {MarketIntelligenceUtils.formatCurrency(opp.cost_savings)}</p>
                                  <p>Net benefit: {MarketIntelligenceUtils.formatCurrency(opp.net_benefit)}</p>
                                  <p>Feasibility: {opp.feasibility_score}/100</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <DollarSign className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Salary Intelligence</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your profile to view detailed salary intelligence
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Market Trends */}
          <TabsContent value="trends" className="space-y-6">
            {userProfile ? (
              <>
                {/* Hiring Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Hiring Market Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Hiring Velocity</span>
                          <span className="text-sm font-bold text-green-600">
                            {userProfile.marketTrends.hiring_trends.velocity} jobs/month
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Time to Fill</span>
                          <span className="text-sm">
                            {userProfile.marketTrends.hiring_trends.time_to_fill} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Competition Ratio</span>
                          <span className="text-sm">
                            {userProfile.marketTrends.hiring_trends.competition_ratio}:1
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Remote Available</span>
                          <span className="text-sm font-bold text-blue-600">
                            {userProfile.marketTrends.hiring_trends.remote_percentage}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Salary Growth Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">
                            {userProfile.marketTrends.salary_trends.annual_growth_rate}%
                          </p>
                          <p className="text-sm text-gray-600">Annual growth rate</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Real wage growth</span>
                            <span className="text-sm font-medium text-green-600">
                              {userProfile.marketTrends.salary_trends.real_wage_growth}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Inflation adjustment</span>
                            <span className="text-sm">
                              {userProfile.marketTrends.salary_trends.inflation_adjustment}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Compression risk</span>
                            <span className="text-sm text-orange-600">
                              {userProfile.marketTrends.salary_trends.compression_risk}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Skill Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Skill Market Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Emerging Skills */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Rocket className="mr-2 h-4 w-4 text-green-500" />
                          Emerging High-Value Skills
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userProfile.marketTrends.skill_trends.emerging_skills.map((skill, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{skill.name}</h5>
                                <Badge className="bg-green-100 text-green-800">
                                  +{skill.growth_rate}%
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Salary premium: +{skill.salary_premium}%</p>
                                <p>Learning time: {skill.time_to_proficiency} months</p>
                                <p>Difficulty: {skill.learning_difficulty}/10</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Declining Skills */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <FlashOff className="mr-2 h-4 w-4 text-red-500" />
                          Declining Skills
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userProfile.marketTrends.skill_trends.declining_skills.map((skill, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{skill.name}</h5>
                                <Badge className="bg-red-100 text-red-800">
                                  {skill.decline_rate}%
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Transition time: {skill.transition_timeline} months</p>
                                <p>Sunset probability: {skill.sunset_probability}%</p>
                                <p>Replacements: {skill.replacement_skills.join(', ')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Industry Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="mr-2 h-5 w-5" />
                      Industry Growth Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProfile.marketTrends.industry_trends.growth_industries.map((industry, index) => (
                          <div key={index} className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{industry.name}</h5>
                              <Badge className="bg-green-100 text-green-800">
                                +{industry.growth_rate}%
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-green-700">
                              <p>Hiring momentum: {industry.hiring_momentum}/100</p>
                              <p>Salary trajectory: +{industry.salary_trajectory}%</p>
                              <p>Skill transferability: {industry.skill_transferability}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Market Trends</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your profile to view market trends
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Forecasts */}
          <TabsContent value="forecasts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Market Forecasts</h2>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="2_year">2-Year</option>
                <option value="5_year">5-Year</option>
              </select>
            </div>

            {salaryForecasts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Salary Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="mr-2 h-5 w-5" />
                      Salary Growth Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                          {salaryForecasts[0].predicted_growth}%
                        </p>
                        <p className="text-sm text-gray-600">Predicted growth ({selectedTimeframe})</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Confidence interval</span>
                          <span className="text-sm font-medium">
                            {salaryForecasts[0].confidence_interval.lower_bound}% - {salaryForecasts[0].confidence_interval.upper_bound}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Confidence level</span>
                          <span className="text-sm font-medium">
                            {salaryForecasts[0].confidence_interval.confidence_level}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Key Factors</h4>
                        <div className="space-y-2">
                          {salaryForecasts[0].factors.map((factor, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{factor.factor}</span>
                              <div className="flex items-center">
                                {factor.direction === 'positive' ? 
                                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" /> :
                                  factor.direction === 'negative' ?
                                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" /> :
                                  <Minus className="h-3 w-3 text-gray-500 mr-1" />
                                }
                                <span>{Math.round(factor.impact_weight * 100)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="mr-2 h-5 w-5" />
                      Scenario Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {salaryForecasts[0].scenarios.map((scenario, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium capitalize">{scenario.scenario}</h5>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-2">{scenario.probability}%</span>
                              <Badge className={
                                scenario.scenario === 'optimistic' ? 'bg-green-100 text-green-800' :
                                scenario.scenario === 'pessimistic' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {scenario.outcome > 0 ? '+' : ''}{scenario.outcome}%
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p className="font-medium">Key assumptions:</p>
                            <ul className="list-disc list-inside mt-1">
                              {scenario.key_assumptions.map((assumption, idx) => (
                                <li key={idx}>{assumption}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <LineChart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Market Forecasts</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your profile to view market forecasts
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Market Alerts</h2>
              <div className="flex space-x-2">
                <select
                  value={alertFilters.severity}
                  onChange={(e) => setAlertFilters({...alertFilters, severity: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severity</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={alertFilters.status}
                  onChange={(e) => setAlertFilters({...alertFilters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="all">All Status</option>
                </select>
              </div>
            </div>

            {marketAlerts.length > 0 ? (
              <div className="space-y-4">
                {marketAlerts
                  .filter(alert => 
                    (alertFilters.severity === 'all' || alert.severity === alertFilters.severity) &&
                    (alertFilters.status === 'all' || alert.status === alertFilters.status)
                  )
                  .map((alert) => (
                    <Card key={alert.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <Bell className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                            <div>
                              <h4 className="font-medium text-lg">{alert.title}</h4>
                              <p className="text-gray-600 mt-1">{alert.description}</p>
                            </div>
                          </div>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                              {MarketIntelligenceUtils.formatCurrency(alert.impact_assessment.financial_impact)}
                            </p>
                            <p className="text-sm text-green-700">Potential Impact</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                              {alert.impact_assessment.urgency_score}
                            </p>
                            <p className="text-sm text-blue-700">Urgency Score</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">
                              {alert.timeline}
                            </p>
                            <p className="text-sm text-purple-700">Timeline</p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-2">Recommended Actions</h5>
                          <div className="flex flex-wrap gap-2">
                            {alert.recommended_actions.map((action, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
                  <p className="text-gray-500 mb-4">
                    All market conditions are stable for your profile
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Optimization */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Compensation Optimization</h2>
              <p className="text-gray-600">
                AI-powered recommendations to maximize your market value
              </p>
            </div>

            {optimizationOpportunities.length > 0 ? (
              <div className="space-y-6">
                {optimizationOpportunities.map((opportunity, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="mr-2 h-5 w-5" />
                        {opportunity.type.replace('_', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-600">{opportunity.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                              +{opportunity.expected_increase}%
                            </p>
                            <p className="text-sm text-green-700">Expected Increase</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                              {opportunity.timeline_months}
                            </p>
                            <p className="text-sm text-blue-700">Months</p>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">
                              {opportunity.effort_required}/10
                            </p>
                            <p className="text-sm text-purple-700">Effort Required</p>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">
                              {opportunity.success_probability}%
                            </p>
                            <p className="text-sm text-yellow-700">Success Rate</p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <h5 className="font-medium mb-2">ROI Analysis</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Investment Cost</span>
                                <span className="text-sm font-medium">
                                  {MarketIntelligenceUtils.formatCurrency(opportunity.roi_calculation.investment_cost)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Time Investment</span>
                                <span className="text-sm font-medium">
                                  {opportunity.roi_calculation.time_investment_hours} hours
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Expected Return</span>
                                <span className="text-sm font-medium text-green-600">
                                  {MarketIntelligenceUtils.formatCurrency(opportunity.roi_calculation.expected_return)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Break-even</span>
                                <span className="text-sm font-medium">
                                  {opportunity.roi_calculation.break_even_months} months
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Optimization Opportunities</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your profile to discover optimization opportunities
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}