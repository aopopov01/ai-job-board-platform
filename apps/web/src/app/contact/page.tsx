import React from 'react'
import Link from 'next/link'
import { 
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Brain,
  Zap as Lightning,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
  Users,
  Briefcase,
  HelpCircle
} from 'lucide-react'
import NeuronicLayout from '../../components/layout/NeuronicLayout'

// Contact Hero Section
function ContactHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/20 border-2 border-blue-400/40 rounded-full mb-10 backdrop-blur-sm shadow-lg">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-sm text-blue-100 font-bold tracking-wide">⚡ GET IN TOUCH</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-8">
            <span className="text-white block leading-none drop-shadow-2xl">Lightning-fast</span>
            <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent block leading-none drop-shadow-2xl">
              support & sales
            </span>
          </h1>
          
          <p className="text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-16 font-medium">
            ⚡ Have questions? Need enterprise solutions? Our team is here to help you electrify 
            your career or hiring process. Get lightning-fast responses from our experts.
          </p>
        </div>
      </div>
    </section>
  )
}

// Contact Form Section
function ContactForm() {
  const [inquiryType, setInquiryType] = React.useState('general')

  return (
    <section className="py-32 bg-black/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div>
            <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white mb-4">Send us a message</h2>
                <p className="text-white/80 font-medium">We'll get back to you within 24 hours</p>
              </div>

              <form className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3">What can we help you with?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInquiryType('general')}
                      className={`h-12 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                        inquiryType === 'general'
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-black/40 text-white/80 border-white/30 hover:border-white/50'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                      General
                    </button>
                    <button
                      type="button"
                      onClick={() => setInquiryType('sales')}
                      className={`h-12 px-4 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 ${
                        inquiryType === 'sales'
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-black/40 text-white/80 border-white/30 hover:border-white/50'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                      Sales
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      className="w-full h-14 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      className="w-full h-14 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-14 pl-12 pr-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Company</label>
                  <input
                    type="text"
                    placeholder="Enter your company name"
                    className="w-full h-14 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-black/60 transition-all font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full h-14 rounded-xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                    inquiryType === 'sales'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-6">Get in touch instantly</h2>
              <p className="text-white/80 text-lg font-medium leading-relaxed mb-8">
                Whether you're a candidate looking for your dream role or a company seeking top talent, 
                our team is here to help you succeed.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Email Support</h3>
                  <p className="text-white/70 text-sm mb-2">Get help within 24 hours</p>
                  <a href="mailto:support@talentaize.com" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    support@talentaize.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Sales Team</h3>
                  <p className="text-white/70 text-sm mb-2">Speak with our enterprise specialists</p>
                  <a href="tel:+1-555-TALENT" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                    +1 (555) TALENT-1
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Global Headquarters</h3>
                  <p className="text-white/70 text-sm">
                    123 Innovation Drive<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="p-6 bg-black/50 backdrop-blur-md border-2 border-green-400/40 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-bold">Lightning-Fast Response</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 text-sm font-medium">General inquiries: < 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 text-sm font-medium">Sales inquiries: < 4 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-white/80 text-sm font-medium">Technical support: < 2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}// FAQ Section
function ContactFAQ() {
  const faqs = [
    {
      question: "How quickly can I get started with TalentAIze?",
      answer: "You can sign up and start using TalentAIze immediately. Our AI begins matching you with opportunities within minutes of profile completion."
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "Yes! We provide comprehensive enterprise solutions with custom integrations, dedicated support, and advanced analytics. Contact our sales team for details."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use bank-grade encryption, are SOC 2 compliant, and follow strict GDPR guidelines. Your privacy and security are our top priorities."
    },
    {
      question: "Can I integrate TalentAIze with my existing systems?",
      answer: "Yes, we offer APIs and integrations with popular ATS systems, HRIS platforms, and other HR tools. Our team can help with custom integrations."
    }
  ]

  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Quick answers
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed font-medium">
            Common questions about TalentAIze and our lightning-powered platform
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

        <div className="text-center mt-12">
          <p className="text-white/80 font-medium mb-6">
            Still have questions? Our team is here to help.
          </p>
          <Link href="/help">
            <button className="h-14 px-8 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-lg transition-all backdrop-blur-md">
              Visit Help Center
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Contact CTA Section
function ContactCTA() {
  return (
    <section className="py-32 bg-black/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="bg-black/70 backdrop-blur-md border-2 border-white/30 rounded-3xl p-20 shadow-2xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600/30 border-2 border-blue-400/50 rounded-full mb-10 backdrop-blur-sm shadow-lg">
              <Lightning className="w-5 h-5 text-blue-300" />
              <span className="text-sm text-blue-100 font-bold tracking-wide">START TODAY</span>
            </div>
            
            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 tracking-tight leading-tight drop-shadow-2xl">
              Ready to get
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent block">
                lightning fast?
              </span>
            </h2>
            
            <p className="text-2xl text-white/85 leading-relaxed max-w-3xl mx-auto mb-16 font-medium">
              Don't wait for opportunity to find you. Join TalentAIze today and 
              experience the future of career matching.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <button className="h-16 px-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xl transition-all shadow-2xl flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </button>
            </Link>
            <Link href="/solutions">
              <button className="h-16 px-12 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-black text-xl transition-all backdrop-blur-md">
                Explore Solutions
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ContactPage() {
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
                <Link href="/about" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  About
                </Link>
                <Link href="/contact" className="text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                  Contact
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
          <ContactHero />
          <ContactForm />
          <ContactFAQ />
          <ContactCTA />
        </main>
      </div>
    </NeuronicLayout>
  )
}