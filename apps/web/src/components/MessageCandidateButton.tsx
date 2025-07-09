'use client'

import { useState } from 'react'
import { useAuthStore } from '@job-board/shared/client'
import { Button } from '@job-board/ui'
import { messageService } from '@job-board/database'
import { Card, CardContent, CardHeader, CardTitle } from '@job-board/ui'
import { Input } from '@job-board/ui'

interface MessageCandidateButtonProps {
  candidateId: string
  candidateName: string
  jobId?: string
  jobTitle?: string
  applicationId?: string
  className?: string
}

export default function MessageCandidateButton({
  candidateId,
  candidateName,
  jobId,
  jobTitle,
  applicationId,
  className = ''
}: MessageCandidateButtonProps) {
  const { user } = useAuthStore()
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const sendMessage = async () => {
    if (!user || !message.trim()) return

    setSending(true)
    setError('')

    try {
      await messageService.create({
        sender_id: user.id,
        recipient_id: candidateId,
        content: message.trim(),
        is_read: false
      })

      setSuccess(true)
      setMessage('')
      setTimeout(() => {
        setShowMessageForm(false)
        setSuccess(false)
      }, 2000)
    } catch (error: any) {
      setError(error.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (showMessageForm) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Message {candidateName}
          </CardTitle>
          {jobTitle && (
            <p className="text-sm text-gray-600">
              Regarding: {jobTitle}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Send a message to ${candidateName}...`}
                disabled={sending}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">Message sent successfully!</p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={sendMessage}
                disabled={sending || !message.trim()}
                className="flex-1"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMessageForm(false)
                  setMessage('')
                  setError('')
                }}
                disabled={sending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowMessageForm(true)}
      className={className}
    >
      💬 Message
    </Button>
  )
}

// Quick message templates
export const messageTemplates = {
  interviewInvitation: (candidateName: string, jobTitle: string) => 
    `Hi ${candidateName},\n\nThank you for your application for the ${jobTitle} position. We'd like to invite you for an interview.\n\nPlease let us know your availability for the next week.\n\nBest regards`,
  
  applicationUpdate: (candidateName: string, status: string) => 
    `Hi ${candidateName},\n\nI wanted to update you on the status of your application. We've moved your application to the ${status} stage.\n\nPlease let me know if you have any questions.\n\nBest regards`,
  
  requestMoreInfo: (candidateName: string) => 
    `Hi ${candidateName},\n\nThank you for your application. We'd like to learn more about your experience with specific technologies mentioned in your resume.\n\nCould you please provide more details about your background?\n\nBest regards`,
  
  rejection: (candidateName: string, jobTitle: string) => 
    `Hi ${candidateName},\n\nThank you for your interest in the ${jobTitle} position. After careful consideration, we've decided to move forward with other candidates.\n\nWe encourage you to apply for future opportunities that match your skills.\n\nBest regards`
}

// Quick message component with templates
export function QuickMessageButton({
  candidateId,
  candidateName,
  jobTitle,
  template,
  className = ''
}: MessageCandidateButtonProps & { template: keyof typeof messageTemplates }) {
  const { user } = useAuthStore()
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const sendQuickMessage = async () => {
    if (!user) return

    setSending(true)
    try {
      const messageContent = messageTemplates[template](candidateName, jobTitle || '')
      
      await messageService.create({
        sender_id: user.id,
        recipient_id: candidateId,
        content: messageContent,
        is_read: false
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to send quick message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={sendQuickMessage}
      disabled={sending}
      className={`${className} ${success ? 'text-green-600' : ''}`}
    >
      {sending ? 'Sending...' : success ? '✓ Sent' : '📧 Quick Message'}
    </Button>
  )
}