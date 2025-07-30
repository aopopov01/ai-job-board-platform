'use client'

import React, { useState } from 'react'
import { X, MapPin, Clock, Briefcase, Building2, DollarSign, Users, Globe, Heart, Brain, Zap, Star, CheckCircle, ArrowRight, Rocket } from 'lucide-react'
import JobApplicationForm from './JobApplicationForm'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: string
  workStyle: string
  description: string
  companyDescription?: string
  responsibilities?: string
  requirements: string[]
  posted: string
  department: string
  experience_level: string
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

  const getWorkStyleIcon = () => {
    switch (job.workStyle.toLowerCase()) {
      case 'remote':
        return <Globe className="w-4 h-4 text-emerald-300" />
      case 'on-site':
        return <Building2 className="w-4 h-4 text-emerald-300" />
      case 'hybrid':
        return <Zap className="w-4 h-4 text-emerald-300" />
      default:
        return <Globe className="w-4 h-4 text-emerald-300" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with Neural Effect */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 1000 800">
              <defs>
                <radialGradient id="neural-backdrop" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                  <stop offset="50%" stopColor="rgba(0,200,255,0.2)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <linearGradient id="connection-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(59,130,246,0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              
              {/* Neural Network Background */}
              {Array.from({ length: 20 }).map((_, i) => (
                <g key={i}>
                  <circle
                    cx={Math.random() * 1000}
                    cy={Math.random() * 800}
                    r="2"
                    fill="url(#neural-backdrop)"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s`, animationDuration: '3s' }}
                  />
                </g>
              ))}
              
              {/* Connection Lines */}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={i}
                  x1={Math.random() * 1000}
                  y1={Math.random() * 800}
                  x2={Math.random() * 1000}
                  y2={Math.random() * 800}
                  stroke="url(#connection-line)"
                  strokeWidth="1"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.5}s`, animationDuration: '4s' }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-4xl p-0 my-8 text-left align-middle transition-all transform bg-slate-900/95 backdrop-blur-md border-2 border-slate-600/40 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex-shrink-0 bg-slate-800/90 backdrop-blur-md border-b-2 border-slate-600/30 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-black text-white">{job.title}</h2>
                  </div>
                  <p className="text-slate-300 font-medium text-xl mb-3">{job.company}</p>
                  
                  {/* Job Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-sm font-bold">
                      {job.type}
                    </span>
                    <span className="px-4 py-2 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 text-sm font-bold">
                      {job.department}
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/40 rounded-full text-purple-300 text-sm font-bold">
                      {job.experience_level}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {job.posted}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
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
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 space-y-8 pb-6">

              {/* Company Description */}
              {job.companyDescription && (
                <div className="mb-8">
                  <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-blue-400" />
                    About {job.company}
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">{job.companyDescription}</p>
                </div>
              )}

              {/* Job Description */}
              <div className="mb-8">
                <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                  Job Overview
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed">{job.description}</p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="mb-8">
                  <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-400" />
                    Key Responsibilities
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">{job.responsibilities}</p>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-white font-black text-2xl mb-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                  Requirements
                </h3>
                <div className="flex flex-wrap gap-3">
                  {job.requirements.map((req, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 text-xs font-semibold"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-shrink-0 bg-slate-800/90 backdrop-blur-md border-t-2 border-slate-600/30 p-6">
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 h-12 px-4 bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:via-blue-400/40 hover:to-blue-500/40 text-white border-2 border-blue-400/50 hover:border-blue-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30 font-bold text-sm relative overflow-hidden group"
                onMouseEnter={(e) => {
                  const heart = e.currentTarget.querySelector('.heart-icon');
                  if (heart) {
                    heart.classList.add('fill-red-500', 'text-red-500');
                  }
                }}
                onMouseLeave={(e) => {
                  const heart = e.currentTarget.querySelector('.heart-icon');
                  if (heart) {
                    heart.classList.remove('fill-red-500', 'text-red-500');
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Heart className="heart-icon w-4 h-4 transition-all duration-300" />
                  Save Job
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
              </button>
              <button
                onClick={handleApplyNow}
                className="flex-1 h-12 px-4 bg-gradient-to-r from-emerald-600/30 via-teal-500/30 to-emerald-600/30 hover:from-emerald-500/40 hover:via-teal-400/40 hover:to-emerald-500/40 text-white border-2 border-emerald-400/50 hover:border-teal-400/60 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-teal-400/30 font-bold text-sm relative overflow-hidden group"
                onMouseEnter={(e) => {
                  const rocket = e.currentTarget.querySelector('.rocket-icon');
                  if (rocket) {
                    rocket.classList.add('fill-orange-500', 'text-orange-500');
                  }
                }}
                onMouseLeave={(e) => {
                  const rocket = e.currentTarget.querySelector('.rocket-icon');
                  if (rocket) {
                    rocket.classList.remove('fill-orange-500', 'text-orange-500');
                  }
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Rocket className="rocket-icon w-4 h-4 transition-all duration-300" />
                  Apply Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 transform -translate-x-full"></div>
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