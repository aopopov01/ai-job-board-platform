'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@job-board/shared/client'
import { messageService } from '@job-board/database'
import { Card, CardContent } from '@job-board/ui'
import { Button } from '@job-board/ui'
import Link from 'next/link'
import { logComponentError, toError } from '@/lib/logger'

interface NotificationMessage {
  id: string
  content: string
  sender_id: string
  created_at: string
  sender?: {
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
  jobs?: {
    title: string
  }
}

export default function MessageNotifications() {
  const { user } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentMessages, setRecentMessages] = useState<NotificationMessage[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    if (!user) return

    const loadUnreadMessages = async () => {
      try {
        const count = await messageService.getUnreadCount(user.id)
        setUnreadCount(count)

        // Get recent unread messages for notification display
        const { data } = await messageService.getConversations(user.id)
        const unreadMessages = data?.filter(msg => 
          msg.recipient_id === user.id && !msg.is_read
        ).slice(0, 5) || []
        
        setRecentMessages(unreadMessages.map((msg: any) => ({
          ...msg,
          sender: msg.sender || { first_name: 'Unknown', last_name: 'User' },
          recipient: msg.recipient || { first_name: 'Unknown', last_name: 'User' }
        })))
      } catch (error) {
        logComponentError('MessageNotifications', toError(error), { action: 'loadUnreadMessages' })
      }
    }

    loadUnreadMessages()

    // Subscribe to new messages
    let subscription: any = null
    messageService.subscribeToMessages(user.id, (payload) => {
      loadUnreadMessages()
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        const message = payload.new
        new Notification('New Message', {
          body: `${message.sender?.first_name} ${message.sender?.last_name}: ${message.content}`,
          icon: '/favicon.ico'
        })
      }
    }).then(sub => {
      subscription = sub
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [user])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (unreadCount === 0) return null

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Messages</h3>
            <p className="text-sm text-gray-600">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {recentMessages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No unread messages
              </div>
            ) : (
              <div className="space-y-1">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {message.sender?.profile_picture_url ? (
                          <img
                            src={message.sender.profile_picture_url}
                            alt={`${message.sender.first_name} ${message.sender.last_name}`}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">
                              {message.sender?.first_name?.[0]}{message.sender?.last_name?.[0]}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {message.sender?.first_name} {message.sender?.last_name}
                        </p>
                        {message.jobs?.title && (
                          <p className="text-xs text-gray-500">
                            Re: {message.jobs.title}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 truncate">
                          {message.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Link href="/dashboard/messages">
              <Button className="w-full" onClick={() => setShowNotifications(false)}>
                View All Messages
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for message notifications
export function useMessageNotifications() {
  const { user } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    const loadUnreadCount = async () => {
      try {
        const count = await messageService.getUnreadCount(user.id)
        setUnreadCount(count)
      } catch (error) {
        logComponentError('MessageNotifications', toError(error), { action: 'loadUnreadCount' })
      }
    }

    loadUnreadCount()

    // Subscribe to new messages
    let subscription: any = null
    messageService.subscribeToMessages(user.id, () => {
      loadUnreadCount()
    }).then(sub => {
      subscription = sub
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [user])

  return unreadCount
}