'use client'

import React, { useState } from 'react'
import { X, Upload, User, Mail, Phone, FileText, CheckCircle, AlertCircle, Send, Clock } from 'lucide-react'
import { EmailService } from '../services/emailService'

interface JobApplicationFormProps {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
  companyName: string
}

interface FormData {
  fullName: string
  email: string
  phone: string
  cv: File | null
}

export default function JobApplicationForm({ isOpen, onClose, jobTitle, companyName }: JobApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    cv: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [emailStatus, setEmailStatus] = useState({
    adminEmail: { success: false, message: '' },
    confirmationEmail: { success: false, message: '' }
  })

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    if (!formData.cv) {
      newErrors.cv = 'CV upload is required' as any
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Process application and send emails
      const emailResults = await EmailService.processApplication({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cv: formData.cv,
        jobTitle,
        companyName
      })
      
      setEmailStatus({
        adminEmail: emailResults.adminEmail,
        confirmationEmail: emailResults.confirmationEmail
      })
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after 5 seconds to show email status
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ fullName: '', email: '', phone: '', cv: null })
        setErrors({})
        setEmailStatus({
          adminEmail: { success: false, message: '' },
          confirmationEmail: { success: false, message: '' }
        })
        onClose()
      }, 5000)
      
    } catch (error) {
      console.error('Application submission failed:', error)
      setEmailStatus({
        adminEmail: { success: false, message: 'Failed to send application' },
        confirmationEmail: { success: false, message: 'Failed to send confirmation' }
      })
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after 5 seconds even on error
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ fullName: '', email: '', phone: '', cv: null })
        setErrors({})
        setEmailStatus({
          adminEmail: { success: false, message: '' },
          confirmationEmail: { success: false, message: '' }
        })
        onClose()
      }, 5000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, cv: 'Please upload a PDF or Word document' as any }))
        return
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, cv: 'File size must be less than 5MB' as any }))
        return
      }
      
      setFormData(prev => ({ ...prev, cv: file }))
      setErrors(prev => ({ ...prev, cv: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-lg p-8 my-8 text-left align-middle transition-all transform bg-black/80 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">Apply for Position</h3>
              <p className="text-white/70 font-medium">{jobTitle}</p>
              <p className="text-white/60 text-sm">{companyName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {isSubmitted && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-white font-bold text-2xl mb-4">Application Submitted Successfully!</h4>
              <p className="text-white/80 text-lg mb-6">Thank you for applying to {jobTitle} at {companyName}.</p>
              
              {/* Email Status */}
              <div className="space-y-4 max-w-md mx-auto">
                {/* Admin Email Status */}
                <div className="flex items-center gap-3 p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    emailStatus.adminEmail.success 
                      ? 'bg-green-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    {emailStatus.adminEmail.success ? (
                      <Send className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-sm">Application Details</p>
                    <p className={`text-xs ${
                      emailStatus.adminEmail.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {emailStatus.adminEmail.success ? 'Sent to hiring team' : 'Failed to send'}
                    </p>
                  </div>
                </div>

                {/* Confirmation Email Status */}
                <div className="flex items-center gap-3 p-4 bg-black/40 border-2 border-white/20 rounded-xl backdrop-blur-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    emailStatus.confirmationEmail.success 
                      ? 'bg-green-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    {emailStatus.confirmationEmail.success ? (
                      <Mail className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium text-sm">Confirmation Email</p>
                    <p className={`text-xs ${
                      emailStatus.confirmationEmail.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {emailStatus.confirmationEmail.success ? `Sent to ${formData.email}` : 'Failed to send'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border-2 border-blue-400/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Clock className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-300 font-medium text-sm">Next Steps</span>
                </div>
                <p className="text-white/80 text-sm">
                  Our hiring team will review your application and contact you within 5-7 business days if your profile matches our requirements.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          {!isSubmitted && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full h-12 px-4 bg-black/40 backdrop-blur-md border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-white font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Upload CV *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-blue-400 transition-all bg-black/20 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-white/60 mx-auto mb-2" />
                      <p className="text-white/70 text-sm">
                        {formData.cv ? formData.cv.name : 'Click to upload your CV'}
                      </p>
                      <p className="text-white/50 text-xs mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                  </label>
                </div>
                {errors.cv && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {String(errors.cv)}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 px-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 rounded-xl font-bold transition-all backdrop-blur-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-bold transition-all shadow-lg disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}