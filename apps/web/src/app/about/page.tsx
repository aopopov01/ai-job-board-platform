import React from 'react'
import Link from 'next/link'
import { 
  Brain,
  Zap as Lightning,
  Users,
  Globe,
  Award,
  Target,
  Rocket,
  Heart,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// About Hero Section
function AboutHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-10 backdrop-blur-sm shadow-lg">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">⚡ OUR MISSION</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8">
            <span className="text-white block leading-tight drop-shadow-2xl">Electrifying careers</span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block leading-tight drop-shadow-2xl py-2">
              with AI power
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-16 font-medium">
            ⚡ At TalentAIze, we believe every professional deserves lightning-fast access to their dream career. 
            Our cutting-edge AI technology transforms how talent connects with opportunity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/solutions">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl">
                Explore Solutions
              </button>
            </Link>
            <Link href="#team">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                Meet Our Team
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Mission & Vision Section
function MissionVision() {
  return (
    <section className="py-32 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Mission */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full backdrop-blur-sm">
              <Target className="w-5 h-5 text-white" />
              <span className="text-sm text-white font-bold tracking-wide">OUR MISSION</span>
            </div>
            
            <h2 className="text-5xl font-black text-white leading-tight drop-shadow-2xl">
              Democratizing career success through AI
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              We're on a mission to level the playing field in career advancement. Our AI-powered platform 
              ensures that talent is recognized regardless of background, location, or network size. Every 
              professional deserves equal access to extraordinary opportunities.
            </p>
            
            <div className="space-y-4">
              {[
                "Break down barriers to career advancement",
                "Eliminate bias in talent discovery",
                "Accelerate professional growth worldwide",
                "Create meaningful connections at lightning speed"
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-white/80 font-medium text-lg">{point}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Vision */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full backdrop-blur-sm">
              <Rocket className="w-5 h-5 text-white" />
              <span className="text-sm text-white font-bold tracking-wide">OUR VISION</span>
            </div>
            
            <h2 className="text-5xl font-black text-white leading-tight drop-shadow-2xl">
              A world where talent meets opportunity instantly
            </h2>
            
            <p className="text-xl text-white/80 leading-relaxed font-medium">
              We envision a future where geographical boundaries, network limitations, and unconscious 
              biases no longer determine career trajectories. Through lightning-fast AI matching, 
              we're creating a global ecosystem of unlimited professional potential.
            </p>
            
            <div className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-black text-white mb-4">Our Impact Goals</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">1M+</div>
                  <div className="text-white/80 font-medium text-sm">Careers Transformed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">50+</div>
                  <div className="text-white/80 font-medium text-sm">Countries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">99.2%</div>
                  <div className="text-white/80 font-medium text-sm">Match Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">24/7</div>
                  <div className="text-white/80 font-medium text-sm">AI Matching</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Core Values Section
function CoreValues() {
  const values = [
    {
      icon: Lightning,
      title: "Lightning Speed",
      description: "We believe speed is essential in today's fast-paced world. Our AI delivers results in seconds, not weeks."
    },
    {
      icon: Brain,
      title: "AI Excellence",
      description: "We push the boundaries of artificial intelligence to create the most accurate and intelligent matching algorithms."
    },
    {
      icon: Heart,
      title: "Human-Centric",
      description: "Technology serves people, not the other way around. Every feature is designed with human needs at the center."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is sacred. We implement bank-grade security and give you complete control over your information."
    },
    {
      icon: Globe,
      title: "Global Inclusion",
      description: "Opportunity should have no borders. We're building a truly global platform that works for everyone, everywhere."
    },
    {
      icon: TrendingUp,
      title: "Continuous Innovation",
      description: "We never stop improving. Our team constantly evolves our technology to stay ahead of industry needs."
    }
  ]

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">CORE VALUES</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            What drives us every day
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Our values guide every decision, every feature, and every interaction. 
            They're not just words on a wall—they're the foundation of everything we build.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/30">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-white font-black mb-4 text-xl">{value.title}</h3>
              <p className="text-white/80 text-base leading-relaxed font-medium">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}// Team Section
function TeamSection() {
  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-Founder",
      bio: "Former VP of Engineering at Google, passionate about democratizing career opportunities through AI.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Sarah Rodriguez",
      role: "CTO & Co-Founder", 
      bio: "AI research veteran from Stanford, leading our breakthrough matching algorithms.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Marcus Johnson",
      role: "Head of Product",
      bio: "Previously led product at LinkedIn, focused on creating lightning-fast user experiences.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Emily Zhang",
      role: "Head of AI Research",
      bio: "PhD in Machine Learning from MIT, pioneering the future of career intelligence.",
      image: "/api/placeholder/150/150"
    }
  ]

  return (
    <section id="team" className="py-32 bg-black/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 border-2 border-white/30 rounded-full mb-8 backdrop-blur-sm">
            <Users className="w-5 h-5 text-white" />
            <span className="text-sm text-white font-bold tracking-wide">OUR TEAM</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Meet the lightning builders
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Our diverse team of AI experts, product innovators, and career specialists 
            work tirelessly to electrify the future of work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="text-center">
              <div className="p-8 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl mx-auto mb-6 shadow-xl shadow-blue-500/30 flex items-center justify-center">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-white font-black mb-2 text-xl">{member.name}</h3>
                <p className="text-blue-400 font-bold mb-4 text-sm">{member.role}</p>
                <p className="text-white/70 text-sm leading-relaxed font-medium">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Company Stats Section
function CompanyStats() {
  const stats = [
    { number: "2019", label: "Founded" },
    { number: "500K+", label: "Active Users" },
    { number: "10K+", label: "Companies" },
    { number: "50+", label: "Countries" },
    { number: "99.2%", label: "Match Accuracy" },
    { number: "< 2s", label: "Average Match Time" }
  ]

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Lightning in numbers
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed max-w-4xl mx-auto font-medium">
            Our impact grows every day as we help more professionals 
            and companies achieve their goals faster than ever before.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-6 bg-black/50 backdrop-blur-md border-2 border-white/20 rounded-2xl shadow-xl">
              <div className="text-4xl lg:text-5xl font-black text-blue-400 mb-2">{stat.number}</div>
              <div className="text-white/80 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About CTA Section
function AboutCTA() {
  return (
    <section className="py-32 bg-black/20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-20 shadow-2xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 border-2 border-blue-400/50 rounded-full mb-10 backdrop-blur-sm shadow-lg">
              <Rocket className="w-5 h-5 text-blue-300" />
              <span className="text-sm text-blue-100 font-bold tracking-wide">JOIN THE REVOLUTION</span>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
              Ready to join
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent block">
                the lightning?
              </span>
            </h2>
            
            <p className="text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              Whether you're looking to advance your career or find exceptional talent, 
              TalentAIze is here to electrify your journey.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
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
                <Link href="/pricing" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Pricing
                </Link>
                <Link href="/about" className="text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                  About
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
          <AboutHero />
          <MissionVision />
          <CoreValues />
          <TeamSection />
          <CompanyStats />
          <AboutCTA />
        </main>
      </div>
    </NeuronicLayout>
  )
}