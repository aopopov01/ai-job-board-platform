'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '@job-board/shared'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@job-board/ui'
import { Button } from '@job-board/ui'
import { Input } from '@job-board/ui'
import { messageService } from '@job-board/database'

interface Message {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  created_at: string
  is_read: boolean
  job_id?: string
  application_id?: string
  sender?: {
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
  recipient?: {
    first_name: string
    last_name: string
    profile_picture_url?: string
  }
}

interface Conversation {
  user_id: string
  user_name: string
  profile_picture_url?: string
  last_message: string
  last_message_time: string
  unread_count: number
  job_title?: string
  application_id?: string
}

export default function MessagesPage() {
  const { user, profile } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      try {
        const { data, error } = await messageService.getConversations(user.id)
        if (error) throw error

        // Group messages by conversation
        const conversationMap = new Map<string, Conversation>()
        
        data?.forEach((message: any) => {
          const otherUserId = message.sender_id === user.id ? message.recipient_id : message.sender_id
          const otherUser = message.sender_id === user.id ? message.recipient : message.sender
          
          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              user_id: otherUserId,
              user_name: `${otherUser.first_name} ${otherUser.last_name}`,
              profile_picture_url: otherUser.profile_picture_url,
              last_message: message.content,
              last_message_time: message.created_at,
              unread_count: 0,
              job_title: message.jobs?.title,
              application_id: message.applications?.id
            })
          }
          
          // Count unread messages
          if (message.recipient_id === user.id && !message.is_read) {
            conversationMap.get(otherUserId)!.unread_count++
          }
        })

        setConversations(Array.from(conversationMap.values()))
      } catch (error: any) {
        setError(error.message || 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    loadConversations()

    // Subscribe to new messages
    const subscription = messageService.subscribeToMessages(user.id, (payload) => {
      loadConversations() // Refresh conversations when new message arrives
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const loadMessages = async (otherUserId: string) => {
    if (!user) return

    try {
      const { data, error } = await messageService.getConversation(user.id, otherUserId)
      if (error) throw error

      setMessages(data || [])
      
      // Mark messages as read
      await messageService.markConversationAsRead(user.id, otherUserId)
      
      // Update conversation unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.user_id === otherUserId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      )
    } catch (error: any) {
      setError(error.message || 'Failed to load messages')
    }
  }

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return

    setSending(true)
    try {
      const { data, error } = await messageService.create({
        sender_id: user.id,
        recipient_id: selectedConversation,
        content: newMessage.trim(),
        conversation_id: `${[user.id, selectedConversation].sort().join('-')}`,
        is_read: false
      })

      if (error) throw error

      setMessages(prev => [...prev, data])
      setNewMessage('')
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

  const selectedConversationData = conversations.find(conv => conv.user_id === selectedConversation)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-600">
          Communicate with {profile?.user_type === 'company' ? 'candidates' : 'recruiters'} about job opportunities
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-500">
                    Messages will appear here when you start communicating with {profile?.user_type === 'company' ? 'candidates' : 'recruiters'}.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.user_id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                        selectedConversation === conversation.user_id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => {
                        setSelectedConversation(conversation.user_id)
                        loadMessages(conversation.user_id)
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {conversation.profile_picture_url ? (
                            <img
                              src={conversation.profile_picture_url}
                              alt={conversation.user_name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {conversation.user_name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.user_name}
                            </p>
                            {conversation.unread_count > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                          {conversation.job_title && (
                            <p className="text-xs text-gray-500 truncate">
                              Re: {conversation.job_title}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.last_message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(conversation.last_message_time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader>
                <CardTitle>{selectedConversationData?.user_name}</CardTitle>
                {selectedConversationData?.job_title && (
                  <CardDescription>
                    Regarding: {selectedConversationData.job_title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col h-[500px]">
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📨</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}