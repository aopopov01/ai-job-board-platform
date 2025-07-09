'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAuthStore } from '@job-board/shared/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { cvDocumentService, supabase } from '@job-board/database'

interface CVDocument {
  id: string
  user_id: string
  file_name: string
  file_path: string
  file_size: number
  is_primary: boolean
  parsed_content: any
  created_at: string
}

export default function CVManagementPage() {
  const { profile, user } = useAuthStore()
  const [cvDocuments, setCvDocuments] = useState<CVDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadCVDocuments = async () => {
      if (!user) return

      try {
        const { data, error } = await cvDocumentService.getByUser(user.id)
        if (error) throw error
        setCvDocuments(data || [])
      } catch (error: any) {
        setError(error.message || 'Failed to load CV documents')
      } finally {
        setLoading(false)
      }
    }

    loadCVDocuments()
  }, [user])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user || acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document (.pdf, .doc, .docx)')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-documents')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('cv-documents')
        .getPublicUrl(fileName)

      // Create database record
      const { data, error } = await cvDocumentService.create({
        user_id: user.id,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        is_primary: cvDocuments.length === 0, // First CV is primary by default
        parsed_content: null
      })

      if (error) throw error

      setCvDocuments(prev => [data, ...prev])
      setSuccess('CV uploaded successfully!')

      // TODO: Parse CV content using AI service
      // This would typically call an AI service to extract structured data
      
    } catch (error: any) {
      setError(error.message || 'Failed to upload CV')
    } finally {
      setUploading(false)
    }
  }, [user, cvDocuments])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const handleSetPrimary = async (cvId: string) => {
    if (!user) return

    try {
      await cvDocumentService.setAsPrimary(user.id, cvId)
      setCvDocuments(prev => 
        prev.map(cv => ({
          ...cv,
          is_primary: cv.id === cvId
        }))
      )
      setSuccess('Primary CV updated successfully!')
    } catch (error: any) {
      setError(error.message || 'Failed to update primary CV')
    }
  }

  const handleDelete = async (cvId: string) => {
    if (!user || !confirm('Are you sure you want to delete this CV?')) return

    try {
      await cvDocumentService.delete(cvId)
      setCvDocuments(prev => prev.filter(cv => cv.id !== cvId))
      setSuccess('CV deleted successfully!')
    } catch (error: any) {
      setError(error.message || 'Failed to delete CV')
    }
  }

  const handleDownload = async (cv: CVDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('cv-documents')
        .download(cv.file_path)

      if (error) throw error

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = cv.file_name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error: any) {
      setError(error.message || 'Failed to download CV')
    }
  }

  if (profile?.user_type !== 'individual') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">CV management is only available for job seekers.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">CV Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload and manage your CV documents. AI-powered parsing helps extract your skills and experience.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New CV</CardTitle>
          <CardDescription>
            Upload your CV in PDF or Word format (max 5MB). We'll automatically parse your skills and experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : uploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                📄
              </div>
              {uploading ? (
                <div>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Uploading and parsing your CV...</p>
                </div>
              ) : isDragActive ? (
                <p className="text-blue-600 font-medium">Drop your CV here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium">
                    Drag & drop your CV here, or click to select
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supports PDF, DOC, and DOCX files up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CV Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Your CV Documents</CardTitle>
          <CardDescription>
            Manage your uploaded CV documents. Set one as primary for job applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cvDocuments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No CV documents yet</h3>
              <p className="text-gray-500">
                Upload your first CV to get started with AI-powered job matching.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cvDocuments.map((cv) => (
                <div
                  key={cv.id}
                  className={`border rounded-lg p-4 ${
                    cv.is_primary ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                          <span>{cv.file_name}</span>
                          {cv.is_primary && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Primary
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {(cv.file_size / 1024 / 1024).toFixed(2)} MB • 
                          Uploaded {new Date(cv.created_at).toLocaleDateString()}
                        </p>
                        {cv.parsed_content && (
                          <p className="text-sm text-green-600">
                            ✅ Parsed and analyzed
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(cv)}
                      >
                        Download
                      </Button>
                      {!cv.is_primary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetPrimary(cv.id)}
                        >
                          Set as Primary
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cv.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {cv.parsed_content && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">
                        Extracted Information
                      </h5>
                      <div className="text-sm text-gray-600">
                        <p>AI analysis results would appear here...</p>
                        {/* TODO: Display parsed skills, experience, etc. */}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tips for Better CV Parsing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Use a standard CV format with clear section headings</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Include specific skills, technologies, and tools you've used</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>List your work experience with job titles and companies</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Include education, certifications, and achievements</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Use PDF format for best parsing results</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}