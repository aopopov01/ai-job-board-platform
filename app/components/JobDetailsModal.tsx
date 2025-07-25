'use client'

import React, { useState } from 'react'
import { X, MapPin, Clock, Briefcase, Building2, DollarSign, Users, Globe, Heart, Brain, Zap, Star, CheckCircle, ArrowRight } from 'lucide-react'
import JobApplicationForm from './JobApplicationForm'

interface Job {
  id: string
  title: string
  description: string
  company: string
  location: string
  salary: string
  type: string
  workStyle: string
  posted: string
  applicants?: number
  featured?: boolean
  matchScore?: number
}

interface JobDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  job: Job | null
  onApplyNow?: (jobTitle: string, companyName: string) => void
}

export default function JobDetailsModal({ isOpen, onClose, job, onApplyNow }: JobDetailsModalProps) {
  const [applicationForm, setApplicationForm] = useState({
    isOpen: false,
    jobTitle: '',
    companyName: ''
  })
  
  if (!isOpen || !job) return null

  const handleApplyNow = () => {
    setApplicationForm({
      isOpen: true,
      jobTitle: job.title,
      companyName: job.company
    })
  }

  // Extended job details for the modal
  const jobRequirements = [
    'Bachelor\'s degree in Computer Science or related field',
    '3+ years of experience in software development',
    'Proficiency in modern programming languages',
    'Experience with cloud technologies and databases',
    'Strong problem-solving and communication skills',
    'Experience with agile development methodologies'
  ]

  const jobBenefits = [
    'Competitive salary and equity package',
    'Comprehensive health insurance',
    'Flexible working hours and remote options',
    'Professional development budget',
    'Modern office with latest technology',
    'Team building events and company retreats'
  ]

  const companyInfo = {
    size: '50-200 employees',
    industry: 'Technology / SaaS',
    founded: '2018',
    website: 'www.company.com'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-4xl p-0 my-8 text-left align-middle transition-all transform bg-black/80 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b-2 border-white/20 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-white">{job.title}</h2>
                    {job.featured && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full text-xs font-bold text-white shadow-lg">
                        <Zap className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    {job.matchScore && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold">
                        <Brain className="w-3 h-3" />
                        {job.matchScore}% Match
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 font-medium text-xl mb-2">{job.company}</p>
                  <div className="flex items-center gap-6 text-white/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {job.applicants || 0} applicants
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-8 space-y-8">
              
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-blue-300" />
                    </div>
                    <span className="text-white/60 text-sm">Type</span>
                  </div>
                  <p className="text-white font-bold">{job.type}</p>
                </div>

                <div className="p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-emerald-300" />
                    </div>
                    <span className="text-white/60 text-sm">Work Style</span>
                  </div>
                  <p className="text-white font-bold">{job.workStyle}</p>
                </div>

                <div className="p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-yellow-300" />
                    </div>
                    <span className="text-white/60 text-sm">Salary</span>
                  </div>
                  <p className="text-white font-bold">{job.salary}</p>
                </div>

                <div className="p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-white/60 text-sm">Applicants</span>
                  </div>
                  <p className="text-white font-bold">{job.applicants || 0}</p>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-white font-black text-2xl mb-4">Job Description</h3>
                <div className="p-6 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <p className="text-white/80 text-lg leading-relaxed mb-4">
                    {job.description}
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed">
                    We are looking for a talented professional to join our growing team. This role offers excellent opportunities for career growth and the chance to work with cutting-edge technologies in a collaborative environment. You'll be working on exciting projects that impact thousands of users worldwide.
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-white font-black text-2xl mb-4">Requirements</h3>
                <div className="p-6 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <ul className="space-y-3">
                    {jobRequirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/80">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-white font-black text-2xl mb-4">Benefits & Perks</h3>
                <div className="p-6 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <ul className="space-y-3">
                    {jobBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/80">
                        <Star className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-white font-black text-2xl mb-4">About {job.company}</h3>
                <div className="p-6 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Company Size</p>
                      <p className="text-white font-bold">{companyInfo.size}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Industry</p>
                      <p className="text-white font-bold">{companyInfo.industry}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Founded</p>
                      <p className="text-white font-bold">{companyInfo.founded}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Website</p>
                      <p className="text-blue-300 font-bold">{companyInfo.website}</p>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    {job.company} is a rapidly growing technology company focused on innovation and excellence. We're building the future of digital solutions and are looking for passionate individuals to join our mission. Our culture values creativity, collaboration, and continuous learning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t-2 border-white/20 p-6">
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 h-14 px-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md"
              >
                Close
              </button>
              <button
                onClick={handleApplyNow}
                className="flex-1 h-14 px-6 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Job Application Form */}
        <JobApplicationForm
          isOpen={applicationForm.isOpen}
          onClose={() => setApplicationForm({ isOpen: false, jobTitle: '', companyName: '' })}
          jobTitle={applicationForm.jobTitle}
          companyName={applicationForm.companyName}
        />
      </div>
    </div>
  )
}