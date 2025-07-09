'use client'

import { useState, useEffect } from 'react'
import { Button } from '@job-board/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Badge } from '@job-board/ui'
import { Progress } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@job-board/ui'
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Brain, 
  MessageSquare, 
  FileText,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calculator,
  Lightbulb,
  Clock
} from 'lucide-react'
import {
  SalaryNegotiationSession,
  JobOffer,
  MarketSalaryData,
  NegotiationStrategy,
  CounterOffer,
  RealTimeCoaching,
  salaryNegotiator,
  SalaryNegotiationUtils
} from '@job-board/ai/salary-negotiation'

export default function SalaryNegotiationPage() {
  // Main state
  const [session, setSession] = useState<SalaryNegotiationSession | null>(null)
  const [currentStep, setCurrentStep] = useState<'setup' | 'analysis' | 'strategy' | 'negotiation' | 'results'>('setup')
  
  // Setup state
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('technology')
  const [location, setLocation] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('mid')
  const [currentSalary, setCurrentSalary] = useState<number>(0)
  const [targetSalary, setTargetSalary] = useState<number>(0)
  
  // Offer state
  const [currentOffer, setCurrentOffer] = useState<JobOffer | null>(null)
  const [hasOffer, setHasOffer] = useState(false)
  
  // Analysis results
  const [marketData, setMarketData] = useState<MarketSalaryData | null>(null)
  const [strategy, setStrategy] = useState<NegotiationStrategy | null>(null)
  const [counterOffers, setCounterOffers] = useState<CounterOffer[]>([])
  const [realTimeCoaching, setRealTimeCoaching] = useState<RealTimeCoaching | null>(null)
  
  // Loading states
  const [analyzingMarket, setAnalyzingMarket] = useState(false)
  const [generatingStrategy, setGeneratingStrategy] = useState(false)
  const [generatingCounterOffer, setGeneratingCounterOffer] = useState(false)

  // Start market analysis
  const analyzeMarket = async () => {
    setAnalyzingMarket(true)
    try {
      const data = await salaryNegotiator.analyzeMarketData({
        role: jobTitle,
        industry,
        location,
        experienceLevel,
        companySize: 'medium'
      })
      
      setMarketData(data)
      setCurrentStep('analysis')
      
      // Auto-suggest target salary based on market data
      if (!targetSalary) {
        setTargetSalary(Math.round(data.percentiles.p75))
      }
    } catch (error) {
      console.error('Error analyzing market:', error)
    } finally {
      setAnalyzingMarket(false)
    }
  }

  // Generate negotiation strategy
  const generateStrategy = async () => {
    if (!marketData) return
    
    setGeneratingStrategy(true)
    try {
      const strategyData = await salaryNegotiator.generateNegotiationStrategy({
        currentOffer,
        targetSalary,
        marketData,
        candidateProfile: {
          experience: experienceLevel,
          skills: ['JavaScript', 'React', 'Node.js'], // Would come from user profile
          achievements: ['Led team of 5', 'Increased revenue by 20%'],
          uniqueValue: ['Full-stack expertise', 'Leadership experience']
        },
        companyContext: {
          size: 'medium',
          culture: 'innovative',
          industry,
          growthStage: 'growth'
        }
      })
      
      setStrategy(strategyData)
      setCurrentStep('strategy')
    } catch (error) {
      console.error('Error generating strategy:', error)
    } finally {
      setGeneratingStrategy(false)
    }
  }

  // Generate counter offer
  const generateCounterOffer = async () => {
    if (!currentOffer || !marketData) return
    
    setGeneratingCounterOffer(true)
    try {
      const counterOffer = await salaryNegotiator.generateCounterOffer({
        originalOffer: currentOffer,
        marketData,
        targetSalary,
        priorities: ['salary', 'equity', 'vacation'],
        riskTolerance: 'medium',
        uniqueValue: ['Technical leadership', 'Cross-functional collaboration']
      })
      
      setCounterOffers(prev => [...prev, counterOffer])
    } catch (error) {
      console.error('Error generating counter offer:', error)
    } finally {
      setGeneratingCounterOffer(false)
    }
  }

  // Get real-time coaching
  const getCoaching = async (situation: string) => {
    try {
      const coaching = await salaryNegotiator.generateRealTimeCoaching({
        phase: 'negotiation',
        situation,
        stressLevel: 'medium',
        timePressure: false,
        currentOffer,
        targetSalary
      })
      
      setRealTimeCoaching(coaching)
    } catch (error) {
      console.error('Error getting coaching:', error)
    }
  }

  if (currentStep === 'setup') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Salary Negotiation Assistant
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get personalized negotiation strategies and maximize your earning potential
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Setup Your Negotiation
              </CardTitle>
              <CardDescription>
                Tell us about your role and situation to get personalized advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <Input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google, Startup Inc"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="consulting">Consulting</option>
                    <option value="marketing">Marketing</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-7 years)</option>
                  <option value="senior">Senior Level (8-15 years)</option>
                  <option value="executive">Executive Level (15+ years)</option>
                </select>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Do you have a current offer?</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={hasOffer ? "default" : "outline"}
                      onClick={() => setHasOffer(true)}
                      size="sm"
                    >
                      Yes
                    </Button>
                    <Button
                      variant={!hasOffer ? "default" : "outline"}
                      onClick={() => setHasOffer(false)}
                      size="sm"
                    >
                      No
                    </Button>
                  </div>
                </div>

                {hasOffer && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Salary Offered ($)
                        </label>
                        <Input
                          type="number"
                          value={currentOffer?.baseSalary || ''}
                          onChange={(e) => setCurrentOffer(prev => ({
                            ...prev,
                            id: 'current',
                            baseSalary: Number(e.target.value),
                            currency: 'USD',
                            benefits: {
                              healthInsurance: true,
                              dentalInsurance: true,
                              visionInsurance: true,
                              retirement401k: true,
                              retirementMatch: 4,
                              lifeInsurance: true,
                              disabilityInsurance: true,
                              professionalDevelopment: 2000,
                              gymMembership: false,
                              commuteBenefit: 0,
                              flexibleSpending: 0,
                              estimatedValue: 15000
                            },
                            vacationDays: 20,
                            workArrangement: 'hybrid',
                            startDate: new Date(),
                            totalCompensation: Number(e.target.value) + 15000
                          } as JobOffer))}
                          placeholder="120000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Bonus ($)
                        </label>
                        <Input
                          type="number"
                          value={currentOffer?.bonus || ''}
                          onChange={(e) => setCurrentOffer(prev => prev ? {
                            ...prev,
                            bonus: Number(e.target.value)
                          } : null)}
                          placeholder="15000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Salary ($)
                  </label>
                  <Input
                    type="number"
                    value={targetSalary || ''}
                    onChange={(e) => setTargetSalary(Number(e.target.value))}
                    placeholder="140000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll help you determine if this is realistic based on market data
                  </p>
                </div>
              </div>

              <Button
                onClick={analyzeMarket}
                disabled={!jobTitle || !location || analyzingMarket}
                className="w-full py-3 text-lg"
                size="lg"
              >
                {analyzingMarket ? (
                  <>
                    <Brain className="mr-2 h-5 w-5 animate-pulse" />
                    Analyzing Market Data...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Analyze Market & Generate Strategy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 'analysis' && marketData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Market Analysis Results
            </h1>
            <p className="text-gray-600">
              Based on {marketData.sampleSize.toLocaleString()} data points for {jobTitle} in {location}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Market Position */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Your Market Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                {targetSalary && (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {SalaryNegotiationUtils.getMarketPositioning(targetSalary, marketData)}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Target: {SalaryNegotiationUtils.formatCurrency(targetSalary)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Market median</span>
                        <span>{SalaryNegotiationUtils.formatCurrency(marketData.percentiles.p50)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Your target</span>
                        <span className="font-medium">{SalaryNegotiationUtils.formatCurrency(targetSalary)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Salary Percentiles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Salary Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: '90th percentile', value: marketData.percentiles.p90, color: 'bg-green-500' },
                  { label: '75th percentile', value: marketData.percentiles.p75, color: 'bg-blue-500' },
                  { label: '50th percentile (median)', value: marketData.percentiles.p50, color: 'bg-gray-500' },
                  { label: '25th percentile', value: marketData.percentiles.p25, color: 'bg-yellow-500' },
                  { label: '10th percentile', value: marketData.percentiles.p10, color: 'bg-red-500' }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="font-medium">
                      {SalaryNegotiationUtils.formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Demand Level</span>
                  <Badge variant={marketData.demandLevel === 'very_high' ? 'default' : 'secondary'}>
                    {marketData.demandLevel.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Total Comp</span>
                  <span className="font-medium">
                    {SalaryNegotiationUtils.formatCurrency(marketData.averageTotalComp)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Data includes base salary, bonuses, and equity compensation
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Target Analysis */}
          {targetSalary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Target Salary Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {targetSalary >= marketData.percentiles.p50 ? '✓' : '⚠️'}
                    </div>
                    <div className="text-sm font-medium mt-2">Market Viability</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {targetSalary >= marketData.percentiles.p75 ? 'Aggressive but achievable' :
                       targetSalary >= marketData.percentiles.p50 ? 'Reasonable target' :
                       'Below market median'}
                    </div>
                  </div>
                  
                  {currentOffer && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {SalaryNegotiationUtils.calculatePayIncreasePercentage(currentOffer.baseSalary, targetSalary)}%
                      </div>
                      <div className="text-sm font-medium mt-2">Increase from Offer</div>
                      <div className="text-xs text-gray-600 mt-1">
                        From {SalaryNegotiationUtils.formatCurrency(currentOffer.baseSalary)} to{' '}
                        {SalaryNegotiationUtils.formatCurrency(targetSalary)}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(((targetSalary - marketData.percentiles.p50) / marketData.percentiles.p50) * 100)}%
                    </div>
                    <div className="text-sm font-medium mt-2">Above Market Median</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Market median: {SalaryNegotiationUtils.formatCurrency(marketData.percentiles.p50)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Button
              onClick={generateStrategy}
              disabled={generatingStrategy}
              size="lg"
              className="px-8 py-3"
            >
              {generatingStrategy ? (
                <>
                  <Brain className="mr-2 h-5 w-5 animate-pulse" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Generate Negotiation Strategy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Personalized Negotiation Strategy
          </h1>
          <p className="text-gray-600">
            AI-powered strategy tailored to your situation and market conditions
          </p>
        </div>

        {strategy && (
          <Tabs defaultValue="strategy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="arguments">Key Arguments</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="coaching">Real-time Coach</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="mr-2 h-5 w-5" />
                      Recommended Approach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {strategy.approach.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          {strategy.approach === 'value_based' && 
                            'Focus on the unique value you bring to the organization and how it justifies your salary request.'}
                          {strategy.approach === 'collaborative' && 
                            'Work together with the employer to find a mutually beneficial compensation package.'}
                          {strategy.approach === 'competitive' && 
                            'Leverage market data and competing offers to negotiate from a position of strength.'}
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Success Probability</span>
                          <span className={`font-bold ${SalaryNegotiationUtils.getSuccessProbabilityColor(strategy.successProbability)}`}>
                            {strategy.successProbability}%
                          </span>
                        </div>
                        <Progress value={strategy.successProbability} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Risk Level</span>
                          <Badge variant={strategy.riskAssessment === 'low' ? 'default' : 'secondary'}>
                            {strategy.riskAssessment.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Recommended Tactics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {strategy.recommendedTactics.map((tactic, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm">{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {currentOffer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Generate Counter Offer
                      </span>
                      <Button
                        onClick={generateCounterOffer}
                        disabled={generatingCounterOffer}
                        size="sm"
                      >
                        {generatingCounterOffer ? 'Generating...' : 'Create Counter Offer'}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {counterOffers.length > 0 ? (
                      <div className="space-y-4">
                        {counterOffers.map((offer, index) => (
                          <div key={offer.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium">Counter Offer #{index + 1}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {offer.probability}% success
                                </Badge>
                                <Badge variant={offer.riskLevel === 'low' ? 'default' : 'secondary'}>
                                  {offer.riskLevel} risk
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <div className="text-sm text-gray-500">Base Salary</div>
                                <div className="font-medium">
                                  {SalaryNegotiationUtils.formatCurrency(offer.baseSalary)}
                                </div>
                              </div>
                              {offer.bonus && (
                                <div>
                                  <div className="text-sm text-gray-500">Bonus</div>
                                  <div className="font-medium">
                                    {SalaryNegotiationUtils.formatCurrency(offer.bonus)}
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="text-sm text-gray-500">Total Value</div>
                                <div className="font-medium text-green-600">
                                  {SalaryNegotiationUtils.formatCurrency(offer.totalValue)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Increase</div>
                                <div className="font-medium text-blue-600">
                                  +{SalaryNegotiationUtils.calculatePayIncreasePercentage(
                                    currentOffer.baseSalary, 
                                    offer.baseSalary
                                  )}%
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              <strong>Justification:</strong> {offer.justification}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Click "Create Counter Offer" to generate a personalized counter-offer based on your market analysis and negotiation strategy.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="arguments" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {strategy.keyArguments.map((argument, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <MessageSquare className="mr-2 h-5 w-5" />
                          {argument.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <Badge variant={
                          argument.strength === 'strong' ? 'default' :
                          argument.strength === 'moderate' ? 'secondary' : 'outline'
                        }>
                          {argument.strength}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{argument.argument}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Best used:</strong> {argument.timing} stage of negotiation
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="space-y-4">
                {strategy.timeline.map((phase, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        Phase {index + 1}: {phase.phase}
                      </CardTitle>
                      <CardDescription>
                        Duration: {phase.duration}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-2">Actions to take:</h4>
                          <ul className="space-y-1">
                            {phase.actions.map((action, actionIndex) => (
                              <li key={actionIndex} className="flex items-start">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-sm">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded">
                          <h4 className="font-medium text-blue-800 mb-1">Expected Response:</h4>
                          <p className="text-sm text-blue-700">{phase.expectedResponse}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="coaching" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Real-time Negotiation Coach
                  </CardTitle>
                  <CardDescription>
                    Get instant advice during your negotiation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your current situation:
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="e.g., They just countered with a lower salary than expected..."
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          getCoaching(e.target.value)
                        }
                      }}
                    />
                  </div>

                  {realTimeCoaching && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Lightbulb className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-green-800 mb-2">AI Coach Advice:</h4>
                          <p className="text-sm text-green-700">{realTimeCoaching.coaching}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => getCoaching("They rejected my counter offer")}
                      className="justify-start"
                    >
                      They rejected my counter offer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => getCoaching("They want to think about it")}
                      className="justify-start"
                    >
                      They want to think about it
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => getCoaching("They countered with benefits instead")}
                      className="justify-start"
                    >
                      They countered with benefits
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => getCoaching("I'm feeling nervous about pushing")}
                      className="justify-start"
                    >
                      I'm feeling nervous
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}