'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { useAuthStore } from '../lib/auth'
import { Upload, FileText, X, Download, Eye, Star } from 'lucide-react'

interface CVDocument {
  id: string
  title: string
  file_url: string
  file_name: string
  is_primary: boolean
  is_active: boolean
  created_at: string
  version_number: number
}

interface CVUploadProps {
  onUploadSuccess?: (cv: CVDocument) => void
}

export default function CVUpload({ onUploadSuccess }: CVUploadProps) {
  const { profile } = useAuthStore()
  const [cvs, setCvs] = useState<CVDocument[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadAsPrimary, setUploadAsPrimary] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!profile) return
    
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', profile.id)
      formData.append('title', uploadTitle || file.name)
      formData.append('isPrimary', uploadAsPrimary.toString())

      const response = await fetch('/api/upload/cv', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setCvs(prev => [data.cv, ...prev])
      setUploadTitle('')
      setUploadAsPrimary(false)
      onUploadSuccess?.(data.cv)
    } catch (error: any) {
      setError(error.message || 'Failed to upload CV')
    } finally {
      setUploading(false)
    }
  }, [profile, uploadTitle, uploadAsPrimary, onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading
  })

  useEffect(() => {
    const fetchCVs = async () => {
      if (!profile) return

      try {
        const response = await fetch(`/api/upload/cv?userId=${profile.id}`)
        const data = await response.json()

        if (response.ok) {
          setCvs(data.cvs || [])
        }
      } catch (error) {
        console.error('Failed to fetch CVs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCVs()
  }, [profile])

  const handleSetPrimary = async (cvId: string) => {
    try {
      const response = await fetch(`/api/upload/cv/${cvId}/primary`, {
        method: 'PUT'
      })

      if (response.ok) {
        setCvs(prev => prev.map(cv => ({
          ...cv,
          is_primary: cv.id === cvId
        })))
      }
    } catch (error) {
      console.error('Failed to set primary CV:', error)
    }
  }

  const handleDelete = async (cvId: string) => {
    try {
      const response = await fetch(`/api/upload/cv/${cvId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCvs(prev => prev.filter(cv => cv.id !== cvId))
      }
    } catch (error) {
      console.error('Failed to delete CV:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    return <FileText className="w-5 h-5 text-blue-500" />
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CV/Resume Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title
              </label>
              <Input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., Software Engineer Resume 2024"
                disabled={uploading}
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="primary"
                checked={uploadAsPrimary}
                onChange={(e) => setUploadAsPrimary(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={uploading}
              />
              <label htmlFor="primary" className="text-sm text-gray-700">
                Set as primary CV
              </label>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {uploading ? (
              <div className="space-y-2">
                <div className="text-lg font-medium text-gray-900">Uploading...</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2"></div>
                </div>
              </div>
            ) : isDragActive ? (
              <div className="text-lg font-medium text-blue-600">
                Drop your CV here...
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-lg font-medium text-gray-900">
                  Click to upload or drag and drop
                </div>
                <div className="text-sm text-gray-500">
                  PDF, DOC, DOCX up to 5MB
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* CV List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your CVs</h3>
          {cvs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No CVs uploaded yet. Upload your first CV to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className={`p-4 border rounded-lg ${
                    cv.is_primary ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(cv.file_name)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{cv.title}</h4>
                          {cv.is_primary && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {cv.file_name} • {new Date(cv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cv.file_url, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const a = document.createElement('a')
                          a.href = cv.file_url
                          a.download = cv.file_name
                          a.click()
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      {!cv.is_primary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetPrimary(cv.id)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Set Primary
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cv.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}