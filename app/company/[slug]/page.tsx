'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, MapPin, Users, Calendar, Globe, ExternalLink, Building2, Star, Award, Briefcase, Rocket, Heart } from 'lucide-react'
import { premiumCompanies } from '../../data/premium-companies'
import { verifiedCompanies } from '../../data/verified-companies'
import { ShimmerButton, MagicCard, SimpleNeural } from '../../components/ui'
import JobApplicationForm from '../../components/JobApplicationForm'
import CompanyLogo from '../../components/CompanyLogo'

export default function CompanyProfile() {
  const params = useParams()
  const slug = params.slug as string
  
  // Find company in premium or verified companies
  const premiumCompany = premiumCompanies.find(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  const verifiedCompany = verifiedCompanies.find(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
  
  const company = premiumCompany || verifiedCompany
  const isPremium = !!premiumCompany
  
  const [applicationForm, setApplicationForm] = useState({ isOpen: false, jobTitle: '', companyName: '' })

  if (!company) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <SimpleNeural />
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-black text-white mb-4">Company Not Found</h1>
          <p className="text-white/80 mb-8">The company profile you're looking for doesn't exist.</p>
          <Link href="/companies">
            <ShimmerButton variant="electric">Back to Companies</ShimmerButton>
          </Link>
        </div>
      </div>
    )
  }

  const openApplicationForm = (jobTitle: string, companyName: string) => {
    setApplicationForm({ isOpen: true, jobTitle, companyName })
  }

  const closeApplicationForm = () => {
    setApplicationForm({ isOpen: false, jobTitle: '', companyName: '' })
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <SimpleNeural />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"></div>
      
      {/* Navigation */}
      <header className="relative z-50 backdrop-blur-2xl bg-black/50 border-b-2 border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">TalentAIze</span>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-16">
              <Link href="/jobs" className="text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                Jobs
              </Link>
              <Link href="/companies" className="text-white hover:text-white transition-colors font-bold text-[16px] border-b-2 border-blue-400">
                Companies
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <button className="h-12 px-6 text-white/80 hover:text-white transition-colors font-bold text-[16px]">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="h-12 px-8 bg-white text-black rounded-xl font-black text-[16px] hover:bg-gray-100 transition-all shadow-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Back Button */}
        <section className="pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <Link href="/companies" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Companies
            </Link>
          </div>
        </section>

        {/* Company Header */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <MagicCard variant="neural" className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-6 mb-6">
                    <CompanyLogo companyName={company.name} size="xl" className="shadow-blue-500/30" />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-white">{company.name}</h1>
                        {isPremium ? (
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <Award className="w-6 h-6 text-blue-400 fill-blue-400" />
                        )}
                      </div>
                      <p className="text-xl text-slate-300 mb-4">{company.industry}</p>
                      <div className="flex items-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {company.headquarters}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {company.employees}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Founded {company.founded}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">{company.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {company.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 text-sm font-semibold">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 lg:min-w-[200px]">
                  <Link href={company.website} target="_blank" rel="noopener noreferrer">
                    <button className="w-full h-12 px-4 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-sm relative overflow-hidden group flex items-center justify-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span className="relative z-10">Visit Website</span>
                      <ExternalLink className="w-4 h-4 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
                    </button>
                  </Link>
                  
                  <div className="text-center py-2">
                    <div className="text-2xl font-black text-white">{company.totalOpenRoles}</div>
                    <div className="text-white/60 text-sm">Open Positions</div>
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>
        </section>

        {/* Company Stats */}
        {'companyStats' in company && (
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MagicCard variant="holographic" className="p-6 text-center">
                  <div className="text-2xl font-black text-blue-400 mb-2">{company.companyStats.totalEmployees}</div>
                  <div className="text-white/80 font-medium">Employees</div>
                </MagicCard>
                <MagicCard variant="holographic" className="p-6 text-center">
                  <div className="text-2xl font-black text-emerald-400 mb-2">{company.companyStats.globalOffices}</div>
                  <div className="text-white/80 font-medium">Global Offices</div>
                </MagicCard>
                <MagicCard variant="holographic" className="p-6 text-center">
                  <div className="text-2xl font-black text-purple-400 mb-2">{company.companyStats.foundedYear}</div>
                  <div className="text-white/80 font-medium">Founded</div>
                </MagicCard>
                <MagicCard variant="holographic" className="p-6 text-center">
                  <div className="text-2xl font-black text-yellow-400 mb-2">{company.totalOpenRoles}</div>
                  <div className="text-white/80 font-medium">Open Roles</div>
                </MagicCard>
              </div>
            </div>
          </section>
        )}

        {/* Job Openings */}
        {company.jobOpenings.length > 0 && (
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-3xl font-black text-white mb-8">Open Positions</h2>
              <div className="grid gap-6">
                {company.jobOpenings.map((job, index) => (
                  <MagicCard key={index} variant="holographic" className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-white mb-2">{job.jobTitle}</h3>
                        <div className="flex flex-wrap gap-4 mb-3 text-white/70 text-sm">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.experienceLevel}</span>
                          <span>•</span>
                          <span>{job.workArrangement}</span>
                          {job.salaryRange && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-300">{job.salaryRange}</span>
                            </>
                          )}
                        </div>
                        <p className="text-white/80 text-sm mb-3">{job.jobDescriptionSummary}</p>
                        <div className="flex flex-wrap gap-2">
                          {job.keyRequirements.map((req, reqIndex) => (
                            <span key={reqIndex} className="px-2 py-1 bg-blue-500/20 border border-blue-400/40 rounded text-blue-300 text-xs">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 lg:min-w-[200px]">
                        <button
                          onClick={() => openApplicationForm(job.jobTitle, company.name)}
                          className="flex-1 h-12 px-4 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-sm relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <Rocket className="w-4 h-4" />
                            Apply Now
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
                        </button>
                      </div>
                    </div>
                  </MagicCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section (if available) */}
        {'benefits' in company && company.benefits && (
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <h2 className="text-3xl font-black text-white mb-8">Benefits & Culture</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MagicCard variant="neural" className="p-6">
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    Work-Life Balance
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    {company.benefits.workLifeBalance.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </MagicCard>
                
                <MagicCard variant="neural" className="p-6">
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Compensation
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    {company.benefits.compensation.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </MagicCard>
                
                <MagicCard variant="neural" className="p-6">
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    Development
                  </h3>
                  <ul className="text-slate-300 space-y-2">
                    {company.benefits.development.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </MagicCard>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Job Application Form Modal */}
      <JobApplicationForm
        isOpen={applicationForm.isOpen}
        onClose={closeApplicationForm}
        jobTitle={applicationForm.jobTitle}
        companyName={applicationForm.companyName}
      />
    </div>
  )
}