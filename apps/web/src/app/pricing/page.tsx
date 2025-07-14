import React from 'react'
import Link from 'next/link'
import { 
  CheckCircle, 
  X,
  Zap as Lightning,
  Brain,
  Shield,
  Globe,
  Bot,
  BarChart3,
  Users,
  Briefcase,
  Target,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Pricing Hero Section
function PricingHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-10 backdrop-blur-sm shadow-lg">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">⚡ LIGHTNING PRICING</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8">
            <span className="text-white block leading-tight drop-shadow-2xl">Plans that</span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block leading-tight drop-shadow-2xl py-2">
              electrify success
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-16 font-medium">
            ⚡ Choose the perfect plan to ignite your career or supercharge your hiring. 
            All plans include our lightning-fast AI matching and 24/7 support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl">
              Start Free Trial
            </button>
            <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Candidate Pricing Plans
function CandidatePlans() {
  const candidatePlans = [
    {
      name: "Spark",
      price: "Free",
      period: "Forever",
      description: "Perfect for getting started with AI-powered job matching",
      popular: false,
      features: [
        "Basic AI job matching",
        "Profile optimization tips",
        "5 job applications per month",
        "Basic career insights",
        "Email support"
      ],
      notIncluded: [
        "Priority matching",
        "Interview coaching",
        "Advanced analytics",
        "Lightning alerts"
      ]
    },
    {
      name: "Lightning",
      price: "$29",
      period: "per month",
      description: "Accelerate your career with advanced AI features",
      popular: true,
      features: [
        "Advanced AI matching (99.2% accuracy)",
        "Unlimited job applications",
        "AI interview coaching",
        "Lightning-fast job alerts",
        "Career analytics dashboard",
        "Profile boost features",
        "Priority support",
        "Salary negotiation tools"
      ],
      notIncluded: [
        "White-glove service",
        "Personal career advisor"
      ]
    },
    {
      name: "Thunder",
      price: "$99",
      period: "per month",
      description: "Premium career acceleration with personalized guidance",
      popular: false,
      features: [
        "Everything in Lightning",
        "Personal career advisor",
        "Executive job board access",
        "White-glove application service",
        "Advanced networking tools",
        "Industry insider insights",
        "VIP customer support",
        "Custom career strategy"
      ],
      notIncluded: []
    }
  ]

  return (
    <section className="py-32 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Users className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">FOR CANDIDATES</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Candidate pricing plans
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            From free career exploration to premium executive search, 
            find the perfect plan to ignite your professional journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {candidatePlans.map((plan, idx) => (
            <div key={idx} className={`relative p-8 bg-black/50 backdrop-blur-md border-2 rounded-3xl shadow-2xl ${
              plan.popular 
                ? 'border-blue-400/60 ring-2 ring-blue-400/30' 
                : 'border-white/20'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/60 ml-2">/{plan.period}</span>}
                </div>
                <p className="text-white/80 font-medium">{plan.description}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 font-medium">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/50 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/auth/signup">
                <button className={`w-full h-14 rounded-xl font-black text-lg transition-all shadow-xl ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md'
                }`}>
                  {plan.price === "Free" ? "Get Started" : "Start Free Trial"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Recruiter Pricing Plans
function RecruiterPlans() {
  const recruiterPlans = [
    {
      name: "Startup",
      price: "$99",
      period: "per month",
      description: "Perfect for small teams and growing companies",
      popular: false,
      features: [
        "AI candidate matching",
        "5 active job postings",
        "Basic screening tools",
        "Standard analytics",
        "Email support",
        "Up to 3 team members"
      ],
      notIncluded: [
        "Advanced automation",
        "Custom integrations",
        "Dedicated support"
      ]
    },
    {
      name: "Scale",
      price: "$299",
      period: "per month",
      description: "Advanced features for scaling recruitment teams",
      popular: true,
      features: [
        "Everything in Startup",
        "Unlimited job postings",
        "Advanced AI screening",
        "Recruitment automation",
        "Comprehensive analytics",
        "Up to 10 team members",
        "Phone & chat support",
        "Custom workflows"
      ],
      notIncluded: [
        "White-label solution",
        "Dedicated success manager"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Complete solution for large organizations",
      popular: false,
      features: [
        "Everything in Scale",
        "Unlimited team members",
        "White-label solution",
        "Custom integrations",
        "Dedicated success manager",
        "Advanced security features",
        "SLA guarantees",
        "Custom training sessions"
      ],
      notIncluded: []
    }
  ]

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Briefcase className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">FOR RECRUITERS</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Recruiter pricing plans
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Scale your hiring with AI-powered recruitment tools. 
            From startup-friendly plans to enterprise solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recruiterPlans.map((plan, idx) => (
            <div key={idx} className={`relative p-8 bg-black/50 backdrop-blur-md border-2 rounded-3xl shadow-2xl ${
              plan.popular 
                ? 'border-purple-400/60 ring-2 ring-purple-400/30' 
                : 'border-white/20'
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-white/60 ml-2">/{plan.period}</span>}
                </div>
                <p className="text-white/80 font-medium">{plan.description}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 font-medium">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/50 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href={plan.price === "Custom" ? "/contact" : "/auth/signup"}>
                <button className={`w-full h-14 rounded-xl font-black text-lg transition-all shadow-xl ${
                  plan.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md'
                }`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// FAQ Section
function PricingFAQ() {
  const faqs = [
    {
      question: "How does the free trial work?",
      answer: "All paid plans include a 14-day free trial. No credit card required. You can cancel anytime during the trial period."
    },
    {
      question: "Can I change plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can pay via invoice."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Absolutely! Our Enterprise plan is fully customizable. Contact our sales team to discuss your specific requirements."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use bank-grade encryption and are SOC 2 compliant. Your data is always protected and never shared with third parties."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period."
    }
  ]

  return (
    <section className="py-32 bg-black/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Frequently asked questions
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed font-medium">
            Got questions? We've got answers. Can't find what you're looking for? 
            Contact our support team.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-xl font-black text-white mb-4">{faq.question}</h3>
              <p className="text-white/80 leading-relaxed font-medium">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Pricing CTA Section
function PricingCTA() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-20 shadow-2xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 border-2 border-blue-400/50 rounded-full mb-10 backdrop-blur-sm shadow-lg">
              <Rocket className="w-5 h-5 text-blue-300" />
              <span className="text-sm text-blue-100 font-bold tracking-wide">START TODAY</span>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
              Ready to get
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent block">
                lightning fast?
              </span>
            </h2>
            
            <p className="text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              Join thousands of professionals and companies already experiencing 
              the power of AI-driven career and recruitment solutions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3">
                Start Free Trial
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    <NeuronicLayout variant="intense" className="overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
              <Link href="/" className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-black text-white tracking-tight">TalentAIze</span>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-16">
                <Link href="/platform" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Platform
                </Link>
                <Link href="/solutions" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Solutions
                </Link>
                <Link href="/pricing" className="text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                  Pricing
                </Link>
              </nav>
              
              <div className="flex items-center gap-4">
                <Link href="/auth/login" className="h-12 px-6 flex items-center text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Sign in
                </Link>
                <Link href="/auth/signup">
                  <button className="h-12 px-8 bg-white text-black rounded-xl font-black text-[16px] hover:bg-gray-100 transition-all shadow-lg">
                    Get started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <PricingHero />
          <CandidatePlans />
          <RecruiterPlans />
          <PricingFAQ />
          <PricingCTA />
        </main>
      </div>
    </NeuronicLayout>
  )
}